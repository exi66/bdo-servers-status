const path = require('path');
const fs = require('fs-extra');

var directory = path.join(__dirname, '..', 'public', 'chart');
var MonthWorker = require(path.join(__dirname, '..', 'utils', 'month'));

fs.readdirSync(directory).filter(file => !file === '.gitignore').forEach(year => {
  const months = fs.readdirSync(path.join(directory, year));
  for (let month of months) {
    MonthWorker(path.join(directory, year, month));
  }
});
