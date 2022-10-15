var express = require('express');
var path = require('path');
var fs = require('fs-extra');

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

router.get('/stats', function (req, res, next) {
  let directory = path.join(__dirname, '..', 'public', 'chart');
  let __tree = [];
  fs.readdirSync(directory).filter(file => !(file === '.gitignore')).forEach(year => {
    let __year = {
      text: year,
      nodes: []
    }
    fs.readdirSync(path.join(directory, year)).forEach(month => {
      const days = fs.readdirSync(path.join(directory, year, month))
        .filter(file => file.endsWith('.json') && file !== 'index.json');
      let __month = {
        text: month,
        href: `/stats/${year}/${month}/`,
        nodes: []
      }
      for (let day of days) {
        let __day = {
          text: day.replace('.json', ''),
          href: `/stats/${year}/${month}/${day.replace('.json', '')}`,
          nodes: []
        }
        __month.nodes.push(__day);
      }
      __year.nodes.push(__month);
    });
    __tree.push(__year);
  });
  return res.json(__tree);
});

module.exports = router;
