var express = require('express');
var router = express.Router();

router.get('/status', function (req, res, next) {
  let client = req.app.locals.client;
  if (client.maintenance) return res.json({ error: 'maintenance' });
  return res.json(client.status);
});

router.get('/news', function (req, res, next) {
  let client = req.app.locals.client;
  if (client.maintenance) return res.json({ error: 'maintenance' });
  return res.json(client.news);
});


module.exports = router;
