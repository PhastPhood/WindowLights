import { Request, Response } from 'express';
import {default as Texter, Text, TexterModel, TextModel} from './Texter';
import sendTextMessage from './sendTextMessage';
import responses from './responses';
import { DEFAULT_MESSAGE_DISPLAY_TIME, DEFAULT_COLOR } from './constants'

export let postMessage = (req: Request, res: Response) => {
  console.log(req.body);
  const message = req.body.Body;
  const currentTime = Date.now();

  let text: TextModel = new Text({
    message: message,
    rejected: true,
    color: DEFAULT_COLOR,
    startTime: currentTime,
    endTime: currentTime,
    responseId: ''
  }) as TextModel;

  const phoneNumber = req.body.From.trim();

  Texter.findOne({ phoneNumber: phoneNumber }).exec()
      .catch((err) => {res.sendStatus(500); return;})
      .then(
        (texter: TexterModel) => {
          if (!texter) {  
            texter = new Texter({
              phoneNumber: phoneNumber,
              city: req.body.City || '',
              state: req.body.State || '',
              texts: []
            }) as TexterModel;
          }

          let responseId = '';
          let rejected = true;
          let replace = false;
          if (message.length >= 160) {
            // check length of message
            responseId = responses.tooLongId;
            rejected = true;
            replace = false;
          } else {
            // check for recent messages
            rejected = false;
            
            // choose a response that has been sent the least
            let responseCounts:any = {};
            Object.keys(responses.emailResponses).map((key) => responseCounts[key] = 0);

            // See how many times respones have been sent check if we need to replace text
            texter.texts.forEach(previousText => {
              responseCounts[previousText.responseId]++;
              if (previousText.endTime > currentTime) {
                previousText.endTime = currentTime;
                replace = true;
              }
            });

            let minResponse = Number.MAX_SAFE_INTEGER;
            const responseCountKeys = Object.keys(responseCounts);
            responseCountKeys.forEach(response => {
              if (responseCounts[response] < minResponse) {
                minResponse = responseCounts[response];
              }
            });

            let filteredResponses = responseCountKeys.filter(
                response => responseCounts[response] == minResponse);
            responseId = filteredResponses[Math.floor(filteredResponses.length * Math.random())];
          }

          sendTextMessage(phoneNumber, responses.getResponseFromId(responseId, replace));
          text.responseId = responseId;
          if (!rejected) {
            text.endTime = currentTime + DEFAULT_MESSAGE_DISPLAY_TIME * 1000;
          }
          text.rejected = rejected;

          texter.texts.push(text);
          texter.save((err, texter) => {
            if (err) {
              console.log(err);
              res.status(500).send(err);
            }
            res.status(200).send(texter);
          });
        }
      );
};
