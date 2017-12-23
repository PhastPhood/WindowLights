import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as logger from 'morgan';
import * as mongoose from 'mongoose';
import * as dotenv from 'dotenv';

import { postMessage } from './messageController';

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

app.set("port", process.env.PORT || 3000);

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.post('/postmessage', postMessage);

module.exports = app;
