const request = require('request');

export default function notifyAdmin(body: string) {
  const form = {
    From: process.env.TWILIO_NUMBER,
    To: process.env.ADMIN_NUMBER,
    Body: body
  };
  request.post('https://api.twilio.com/2010-04-01/Accounts/' + process.env.TWILIO_ACCOUNT_SID + '/Messages.json')
      .form(form)
      .auth(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN, true);
}
