"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const app = express();
app.set("port", process.env.PORT || 3000);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.post('/postmessage', (req, res) => {
    console.log(req.body);
    res.sendStatus(200);
});
module.exports = app;
//# sourceMappingURL=app.js.map