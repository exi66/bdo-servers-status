var express = require('express');
var path = require('path');
var fs = require('fs-extra');

var router = express.Router();

router.get('/status', function (req, res, next) {
  let client = req.app.locals.client;
  if (!client.maintenance) return res.json(client.status);
  let err = new Error('Maintenance');
  err.status = 503;
  return next(err);
});

/* 
* disable because now site require recaptcha
*
router.get('/news', function (req, res, next) {
  let client = req.app.locals.client;
  if (!client.maintenance) return res.json(client.news);
  let err = new Error('Maintenance');
  err.status = 503;
  return next(err);
});
*/

router.get('/stats', function (req, res, next) {
  let directory = path.join(__dirname, '..', 'public', 'chart');
  let dates = [];
  fs.readdirSync(directory).filter(file => !(file === '.gitignore')).forEach(year => {
    fs.readdirSync(path.join(directory, year)).forEach(month => {
      const days = fs.readdirSync(path.join(directory, year, month))
        .filter(file => file.endsWith('.json') && file !== 'index.json');
      for (let day of days) {
        dates.push(`${year}-${('0' + month).slice(-2)}-${('0' + day.replace('.json', '')).slice(-2)}`);
      }
    });
  });
  return res.json(dates);
});

module.exports = router;
