import * as express from 'express';
const router = express.Router();

router.post('/postmessage', (req: express.Request, res: express.Response) => {
  console.log(req.body);
  res.sendStatus(200);
});

export = router;
