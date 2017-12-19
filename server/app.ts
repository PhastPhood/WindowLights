import * as express from "express";
import * as bodyParser from "body-parser";
import * as logger from "morgan";

const app = express();

app.set("port", process.env.PORT || 3000);

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.post('/postmessage', (req: express.Request, res: express.Response) => {
  console.log(req.body);
  res.sendStatus(200);
});

module.exports = app;
