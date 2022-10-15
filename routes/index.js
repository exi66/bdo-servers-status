var express = require('express');
var fs = require('fs-extra');
var path = require('path');

var router = express.Router();

router.use(express.static('public'));

router.get('/', function (req, res, next) {
  res.render('index');
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
  let year = req.params.year;
  let month = req.params.month;
  let localPath = path.join(chartPath, year, month, 'index.json');
  if (fs.existsSync(localPath))
    return res.render('month', {
      large_image: `/img/${year}/${month}/index.png`
    });

  let err = new Error('Not found');
  err.status = 404;
  return next(err);
});

router.get('/stats/:year/:month/:day', function (req, res, next) {
  const chartPath = path.join(__dirname, '..', 'public', 'chart');
  let year = req.params.year;
  let month = req.params.month;
  let day = req.params.day;
  let today = (new Date().getFullYear == year && 
    (new Date().getMonth() + 1) == month && 
    new Date().getDate() == day);
  let localPath = path.join(chartPath, year, month, day + '.json');
  if (fs.existsSync(localPath))
    return res.render('day', {
      large_image: today ? 'img/today.png' : `/img/${year}/${month}/${day}.png`
    });

  let err = new Error('Not found');
  err.status = 404;
  return next(err);
});

module.exports = router;
