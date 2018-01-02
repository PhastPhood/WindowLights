import { Request, Response } from 'express';
import { startOfDay, addHours } from 'date-fns';
import * as swearjar from 'swearjar';
import * as twilio from 'twilio';
import { assign } from 'lodash';
import { Document, Types } from 'mongoose';

import { default as CalendarDay, CalendarDayModel } from '../model/CalendarDay';
import { default as Text, TextModel } from '../model/Text';
import { default as Texter, TexterModel } from '../model/Texter';
import { default as Message, textEffects, parseTextEffects } from '../model/Message';
import notifyAdmin from '../utils/notifyAdmin';
import sendTextMessage from '../utils/sendTextMessage';
import responses from '../model/responses';
import { DEFAULT_MESSAGE_DISPLAY_TIME, EMPTY_SPACE_MESSAGE, DEFAULT_COLOR, DEFAULT_EFFECT } from '../utils/constants';
import { CalendarEventModel } from '../model/CalendarEvent';
import { default as contacts, contactNumbers } from '../model/contacts';

export const getCurrentMessage = (req: Request, res: Response) => {
  
  const currentTime = new Date();
  let recentTexters = Texter.find({ texts: { $elemMatch : { endTime: { $gt: currentTime.valueOf() } } } }).exec();
  let calendarDay = CalendarDay.findOne({ date: startOfDay(currentTime).valueOf() }).exec();

  Promise.all([recentTexters, calendarDay])
    .then(results => {
      if (results) {
        let currentMessages: (TextModel | CalendarEventModel)[] = [];

        let texters: TexterModel[];
        if (results.length > 0 && results[0]) {
          texters = results[0] as TexterModel[];
          for (let i = 0; i < texters.length; i++) {
            const texter = texters[i];
            for (let j = 0; j < texter.texts.length; j++) {
              const text = texter.texts[j];
              if (currentTime.valueOf() <= text.endTime && currentTime.valueOf() >= text.startTime && !text.rejected) {
                currentMessages.push(text);
              }
            }
          }
        }

        let day: CalendarDayModel;
        if (results.length > 1 && results[1]) {
          day = results[1] as CalendarDayModel;
          for (let i = 0; i < day.events.length; i++) {
            const event = day.events[i];
            if (currentTime.valueOf() <= event.endTime && currentTime.valueOf() >= event.startTime) {
              currentMessages.push(event);
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

        let document: Document;
        if (currentMessages.length > 0) {
          const displayedMessage = currentMessages[0];

          if (texters && (displayedMessage as TextModel).texterId) {
            const text = displayedMessage as TextModel;
            for (let i = 0; i < texters.length; i++) {
              if (texters[i]._id.equals(text.texterId)) {
                const texter = texters[i] as TexterModel;
                const index = texter.texts.indexOf(text);
                if (index < 0) {
                  res.sendStatus(500);
                  return Promise.reject('Couldn\'t find text');
                }
                texter.texts[index].lastDisplayed = currentTime.valueOf();
  
                res.send({ body: text.message, color: text.color, effect: text.effect });
                document = texter;
              }
            }
          } else if (day) {
            const event = displayedMessage as CalendarEventModel;
            const index = day.events.indexOf(event);
            if (index < 0) {
              res.sendStatus(500);
              return Promise.reject('Couldn\'t find event');
            }

            day.events[index].lastDisplayed = currentTime.valueOf();

            res.send({ body: event.message, color: event.color, effect: event.effect });
            document = day;
          }
          return document.save();
        } else {
          res.send({ body: EMPTY_SPACE_MESSAGE, color: DEFAULT_COLOR, effect: DEFAULT_EFFECT });
        }
      } else {
        res.send({ body: EMPTY_SPACE_MESSAGE, color: DEFAULT_COLOR, effect: DEFAULT_EFFECT });
      }
    })
    .catch(err => res.sendStatus(500));
}

export const postIncomingText = (req: Request, res: Response) => {
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
    .then(
      (texter: TexterModel) => {
        if (!texter) {  
          texter = new Texter({
            phoneNumber: phoneNumber,
            city: req.body.City || '',
            state: req.body.State || '',
            texts: [],
            banned: false,
            tag: ''
          }) as TexterModel;
        }

        let responseId = '';
        let rejected = true;
        let replace = false;
        let firstName = '';
        let lastName = '';
        let personalizedMessage = '';
        if (texter.banned) {
          responseId = responses.bannedId;
          rejected = true;
          replace = false;
        } else if (message.length >= 160) {
          // check length of message
          responseId = responses.tooLongId;
          rejected = true;
          replace = false;
        } else if (swearjar.scorecard(message).discriminatory) {
          // check for discriminatory language
          responseId = responses.discriminatoryId;
          rejected = true;
          replace = false;
        } else if (swearjar.scorecard(message).starwars) {
          // check for discriminatory language
          responseId = responses.starWarsId;
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
          
          if ((!responseCounts[responses.personalMessageId] || responseCounts[responses.personalMessageId] === 0)
              && contactNumbers.indexOf(texter.phoneNumber) !== -1) {
            // send a personalized message if in contacts and a personalized message hasn't been sent already
            responseId = responses.personalMessageId;
            const contact = contacts.filter(contact => phoneNumber === contact.phoneNumber)[0];
            firstName = contact.firstName;
            lastName = contact.lastName;
            personalizedMessage = contact.personalizedMessage;
            texter.displayName = firstName + ' ' + lastName;
          } else {
            // else send a random message
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
        }

        text.responseId = responseId;
        if (!rejected) {
          text.endTime = currentTime + DEFAULT_MESSAGE_DISPLAY_TIME * 1000;
        }
        text.rejected = rejected;
        text.texterId = texter._id;

        texter.texts.push(text);
        return { ...texter.save((err, texter) => {
          if (err) {
            res.status(500).send(err);
            return Promise.reject('Couldn\'t find text');
          }
          res.set('Content-Type', 'text/xml');
          const response = new twilio.twiml.MessagingResponse();
          if (process.env.SEND_TEXTS === 'TRUE') {
            const message = response.message();
            message.body(responses.getResponseFromId(responseId, replace, firstName, personalizedMessage));
          }
          res.status(200).send(response.toString());
        }), incomingText: text, phoneNumber: texter.phoneNumber };
      }
    )
    .then(texter => {
      if (process.env.SEND_ADMIN_TEXTS === 'TRUE') {
        return notifyAdmin((<any>texter).phoneNumber + ': ' + (<any>texter).incomingText.message);
      }
    })
    .catch(err => res.sendStatus(500));
};

function getTextObject(text: TextModel, phoneNumber: string, displayName: string) {
  return {
    id: text.id,
    texterId: text.texterId,
    responseId: text.responseId,
    startTime: text.startTime,
    endTime: text.endTime,
    message: text.message,
    rejected: text.rejected,
    phoneNumber: phoneNumber,
    displayName: displayName,
    lastDisplayed: text.lastDisplayed,
    effect: text.effect,
    color: text.color
  };
}

export const getTexts = (req: Request, res: Response) => {
  Texter.find({}).exec()
    .then((texters: TexterModel[]) => {
      if (!texters) {
        return Promise.reject('Texts not found');
      }

      let texts = [];
      for (let i = 0; i < texters.length; i++) {
        let texterTexts = texters[i].texts;
        for (let j = 0; j < texterTexts.length; j++) {
          texts.push(getTextObject(texterTexts[j], texters[i].phoneNumber, texters[i].displayName));
        } 
      }
      return Promise.resolve(texts);
    })
    .then((texts: TextModel[]) => res.status(200).send(texts))
    .catch(err => res.sendStatus(500));
};

export const postText = (req: Request, res: Response) => {
  Texter.findOne({'texts._id': Types.ObjectId(req.params.textId)}).exec()
    .then((texter: TexterModel) => {
      if (!texter) {
        return Promise.reject('Text not found');
      }
      let modifiedText;
      console.log(req.params);
      for (let i = 0; i < texter.texts.length; i++) {
        if (texter.texts[i].id === req.params.textId) {
          modifiedText = texter.texts[i];
          let newEndTime = modifiedText.endTime;
          if (req.body.rejected && !modifiedText.rejected) {
            const currentTime = Date.now();
            if (currentTime < modifiedText.endTime) {
              newEndTime = currentTime;
            }
          } else if (!req.body.rejected && modifiedText.rejected) {
            const currentTime = new Date();
            const hourFromStartTime = addHours(modifiedText.startTime, 1);
            if (currentTime < hourFromStartTime) {
              const runningTexts = texter.texts.filter(text => text !== modifiedText && currentTime.valueOf() < text.endTime);
              const startTimes = runningTexts.map(text => text.startTime);
              const latestTime = startTimes.length !== 0 ? startTimes.reduce((a, b) => Math.max(a, b)) : 0;
              if (modifiedText.startTime > latestTime) {
                newEndTime = hourFromStartTime;
                for (let j = 0; j < runningTexts.length; j++) {
                  runningTexts[j].endTime = currentTime.valueOf();
                }
              }
            }
          }
          assign(modifiedText, req.body, { endTime: newEndTime });
        }
      }
      return {...texter.save(), modifiedText: getTextObject(modifiedText, texter.phoneNumber, texter.displayName)};
    })
    .then(texter => res.status(200).send((<any>texter).modifiedText))
    .catch(err => res.sendStatus(404));
};

function getTexterObject(texter: TexterModel) {
  return {
    id: texter.id,
    city: texter.city,
    banned: texter.banned,
    state: texter.state,
    displayName: texter.displayName,
    phoneNumber: texter.phoneNumber,
    textIds: texter.texts.map(text => text.id)
  };
}

export const postTexter = (req: Request, res: Response) => {
  Texter.findById(req.params.texterId).exec()
    .then((texter: TexterModel) => {
      if (!texter) {
        return Promise.reject('Texter not found');
      }
      if (req.body.banned && !texter.banned) {
        for (let i = 0; i < texter.texts.length; i++) {
          const currentTime = Date.now();
          if (currentTime < texter.texts[i].endTime) {
            texter.texts[i].endTime = currentTime;
            texter.texts[i].rejected = true;
          }
        }
      }
      assign(texter, req.body);
      return texter.save();
    })
    .then((texter) => res.status(200).send(getTexterObject(texter)))
    .catch(err => res.sendStatus(404));
};

export const getTexters = (req: Request, res: Response) => {
  Texter.find({}).exec()
    .then((texters: TexterModel[]) => {
      if (!texters) {
        return Promise.reject('Texters not found');
      }
      
      return Promise.resolve(texters.map(texter => getTexterObject(texter)));
    })
    .then(texters => res.status(200).send(texters))
    .catch(err => res.sendStatus(500));
};

export const postSendText = (req: Request, res: Response) => {
  sendTextMessage(req.body.phoneNumber, req.body.message + ' [This was an admin text. Please don\'t reply unless you want your reply to show up on the window.]')
    .then(() => res.sendStatus(200))
    .catch(err => res.sendStatus(500));
};
