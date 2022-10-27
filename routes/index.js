var express = require('express');
var fs = require('fs-extra');
var path = require('path');

var router = express.Router();

router.use(express.static('public'));

router.get('/', function (req, res, next) {
  let client = req.app.locals.client;
  res.render('index', { servers: client.servers });
});

router.get('/day', function (req, res, next) {
  let now = new Date();
  return res.redirect(`/stats/${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()}`);
});

router.get('/month', function (req, res, next) {
  let now = new Date();
  return res.redirect(`/stats/${now.getFullYear()}/${now.getMonth() + 1}`);
});

router.get('/stats/:year/:month', function (req, res, next) {
  const chartPath = path.join(__dirname, '..', 'public', 'chart');
  let client = req.app.locals.client;
  let year = req.params.year;
  let month = req.params.month;
  let localPath = path.join(chartPath, year, month, 'index.json');
  if (fs.existsSync(localPath))
    return res.render('month', {
      params: req.params,
      servers: client.servers,
    });

  let err = new Error('Not found');
  err.status = 404;
  return next(err);
});

router.get('/stats/:year/:month/:day', function (req, res, next) {
  const chartPath = path.join(__dirname, '..', 'public', 'chart');
  let client = req.app.locals.client;
  let year = req.params.year;
  let month = req.params.month;
  let day = req.params.day;
  let localPath = path.join(chartPath, year, month, day + '.json');
  if (fs.existsSync(localPath))
    return res.render('day', {
      params: req.params,
      servers: client.servers,
    });

  let err = new Error('Not found');
  err.status = 404;
  return next(err);
});

module.exports = router;
