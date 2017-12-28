import { Request, Response } from 'express';
import { parse, endOfDay, startOfDay } from 'date-fns';
import * as google from 'googleapis';

import { default as CalendarDay, CalendarDayModel } from '../model/CalendarDay';
import { parseTextEffects } from '../model/Message';

let googlePrivateKey = require('../../googleapi.json');
// configure a JWT auth client
export let googleJwtClient = new google.auth.JWT(
    googlePrivateKey.client_email,
    null,
    googlePrivateKey.private_key,
    ['https://www.googleapis.com/auth/calendar']);

//authenticate request
googleJwtClient.authorize(function (err, tokens) {
  if (err) {
    console.log(err);
    return;
  } else {
    console.log("Successfully connected to Google.");
  }
});

export let updateCalendarEvents = function(date: Date) {
  let fetchCalendarEventsPromise = new Promise((resolve, reject) => {
    let calendar = google.calendar('v3');
    calendar.events.list({
      auth: googleJwtClient,
      calendarId: process.env.EMAIL,
      timeMin: startOfDay(date).toISOString(),
      timeMax: endOfDay(date).toISOString()
    }, function(err, response) {
      if (err) {
        reject(err);
        return;
      }
      resolve(response.items);
    });
  });

  return fetchCalendarEventsPromise
      .then(calendarEvents => {
        const start = startOfDay(date);
        const end = endOfDay(date);

        const events = (calendarEvents as Array<any>).map(event => {
          const parsedMessage = parseTextEffects(event.summary);
          const eventStartTime = event.start.date ? start : parse(event.start.dateTime).valueOf();
          const eventEndTime = event.end.date ? end : parse(event.end.dateTime).valueOf();
          return {
            unparsedMessage: event.summary,
            message: parsedMessage.body.trim(),
            color: parsedMessage.color,
            effect: parsedMessage.effect,
          
            lastDisplayed: null,
            startTime: eventStartTime,
            endTime: eventEndTime
          };
        });
        return CalendarDay.findOneAndUpdate(
            { date: start },
            { date: start, events: events},
            { upsert: true }).exec();
      });
}
