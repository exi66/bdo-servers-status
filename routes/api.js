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
  dates.sort(function(x, y) {
    let date1 = new Date(x).getTime();
    let date2 = new Date(y).getTime();
    if (date1 < date2) return -1;
    if (date1 > date2) return 1;
    return 0;
  });
  return res.json(dates);
});

module.exports = router;
