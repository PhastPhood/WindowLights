"use strict";
const express = require("express");
const router = express.Router();
router.post('/postmessage', (req, res) => {
    console.log(req.body);
    res.sendStatus(200);
});
module.exports = router;
//# sourceMappingURL=routes.js.map