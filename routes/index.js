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

router.get('/stats/:year/:month/:day?', function (req, res, next) {
  const chartPath = path.join(__dirname, '..', 'public', 'chart');

  let year = req.params.year;
  let month = req.params.month;
  let day = req.params.day;

  let localPath = day ? path.join(chartPath, year, month, day + '.json') : path.join(chartPath, year, month, 'index.json');

  if (fs.existsSync(localPath))
    return res.render(day ? 'day' : 'month', {
      large_image: day ? `/img/${year}/${month}/${day}.png` : `/img/${year}/${month}/index.png`
    });

  let err = new Error('Not found');
  err.status = 404;
  return next(err);

});

module.exports = router;
