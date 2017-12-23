const request = require('request');
import * as dotenv from 'dotenv';

export default function sendTextMessage(to: string, body: string) {
  const form = {
    From: process.env.TWILIO_NUMBER,
    To: to,
    Body: body
  };
  request.post('https://api.twilio.com/2010-04-01/Accounts/' + process.env.TWILIO_ACCOUNT_SID + '/Messages.json')
      .form(form)
      .auth(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN, true);
}
