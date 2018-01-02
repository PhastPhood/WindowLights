import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as logger from 'morgan';
import * as mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import { addDays } from 'date-fns';
import * as cron from 'cron';
import * as google from 'googleapis';
import * as swearjar from 'swearjar';
import * as path from 'path';

import { getCurrentMessage,
  postIncomingText,
  postText,
  getTexts,
  postTexter,
  getTexters } from './controller/messageController';
import { updateCalendarEvents, googleJwtClient } from './controller/calendarController';
import { parseTextEffects } from './model/Message';

dotenv.config({ path: '.env' });

const app = express();

const mongoUri = process.env.MONGODB_URI || process.env.MONGOLAB_URI;
mongoose.connect(mongoUri);
mongoose.connection.on("error", () => {
  console.log("Error connecting to MongoDB at %s. Please make sure MongoDB is running.", mongoUri);
  process.exit();
});
mongoose.set('debug', true);
(<any>mongoose).Promise = global.Promise;

let fetchNextDayJob = new cron.CronJob({ cronTime: '00 55 23 * * *', onTick: () => {
  updateCalendarEvents(addDays(Date.now(), 1));
}, start: true, timeZone: 'America/Los_Angeles' });

let refreshCalendarEventsJob = new cron.CronJob({ cronTime: '00 */30 * * * *', onTick: () => {
  updateCalendarEvents(new Date());
}, start: true, timeZone: 'America/Los_Angeles', runOnInit: true });

swearjar.loadBadWords('./data/swearjarList.json');

app.set("port", process.env.PORT || 3000);

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use('/admin/', express.static(path.resolve(__dirname, '..', 'dist/admin/')));

app.get('/api/currentmessage', getCurrentMessage);
app.post('/api/incomingtext', postIncomingText);

app.post('/api/text/:textId', postText);
app.get('/api/texts', getTexts);

app.post('/api/texter/:texterId', postTexter);
app.get('/api/texters', getTexters);

app.get(['/admin', '/admin/*'], function (request, response) {
  response.sendFile(path.resolve(__dirname, '..', 'dist/admin/', 'index.html'));
});

module.exports = app;
