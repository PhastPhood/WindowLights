import { Request, Response } from 'express';

import { default as Text, TextModel } from '../model/Text';
import { default as Texter, TexterModel } from '../model/Texter';
import { default as textEffects, Message, parseTextEffects } from '../model/textEffects';
import sendTextMessage from '../utils/sendTextMessage';
import responses from '../model/responses';
import { DEFAULT_MESSAGE_DISPLAY_TIME } from '../utils/constants';

export let getMessage = (req: Request, res: Response) => {
  
  const currentTime = Date.now();
  Texter.find({ texts: { $elemMatch : { endTime: { $gt: currentTime } } } }).exec()
      .catch((err) => {res.sendStatus(500); return;})
      .then(texters => {
        let currentMessages: TextModel[] = [];

        if (texters) {
          for (let i = 0; i < texters.length; i++) {
            const texter = texters[i] as TexterModel;
            for (let j = 0; j < texter.texts.length; j++) {
              const text = texter.texts[j] as TextModel;
              if (text.endTime > currentTime && !text.rejected) {
                currentMessages.push(text);
              }
            }
          }

          currentMessages.sort((a, b) => {
            if (a.lastDisplayed === null && b.lastDisplayed === null) {
              return a.startTime < b.startTime ? -1 : 1;
            }
            if (a.lastDisplayed === null) {
              return -1;
            }
            if (b.lastDisplayed === null) {
              return 1;
            }
            if (a.lastDisplayed === b.lastDisplayed) {
              return 0;
            }
            return a.lastDisplayed < b.lastDisplayed ? -1 : 1;
          });

          const displayedMessage = currentMessages[0];

          for (let i = 0; i < texters.length; i++) {
            if (texters[i]._id == displayedMessage.texterId) {
              const texter = texters[i] as TexterModel;
              const index = texter.texts.indexOf(displayedMessage);
              if (index < 0) {
                res.sendStatus(500);
              }
              texter.texts[index].lastDisplayed = currentTime;

              texter.save((err, texter) => {
                if (err) {
                  console.log(err);
                  res.status(500).send(err);
                }
              });
            }
          }
          console.log(currentMessages);
          res.send(displayedMessage);
        } else {
          res.send({});
        }
      });
}

export let postMessage = (req: Request, res: Response) => {
  console.log(req.body);
  const currentTime = Date.now();

  const parsedMessage = parseTextEffects(req.body.Body);
  const message = parsedMessage.body.trim();

  let text: TextModel = new Text({
    unparsedMessage: req.body.Body,
    message: message,
    rejected: true,
    color: parsedMessage.color,
    effect: parsedMessage.effect,
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

          if (process.env.SEND_TEXTS === 'TRUE') {
          sendTextMessage(phoneNumber, responses.getResponseFromId(responseId, replace));
          }

          text.responseId = responseId;
          if (!rejected) {
            text.endTime = currentTime + DEFAULT_MESSAGE_DISPLAY_TIME * 1000;
          }
          text.rejected = rejected;
          text.texterId = texter.id;

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
