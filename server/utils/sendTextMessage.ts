const request = require('request-promise-native');

import { default as Texter, TexterModel } from '../model/Texter';

export default function sendTextMessage(to: string, body: string) {
  const form = {
    From: process.env.TWILIO_NUMBER,
    To: to,
    Body: body
  };

  const texterUpdate = { $push: { replyTexts: body } };
  return Texter.findOneAndUpdate({ phoneNumber: to }, texterUpdate).exec()
    .then(() => 
      request.post('https://api.twilio.com/2010-04-01/Accounts/' + process.env.TWILIO_ACCOUNT_SID + '/Messages.json')
        .form(form)
        .auth(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN, true));
}
