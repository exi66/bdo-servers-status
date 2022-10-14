const path = require('path');
const fs = require('fs-extra');

var directory = path.join(__dirname, '..', 'public', 'chart');
var imageDirectory = path.join(__dirname, '..', 'public', 'img');
var ChartToImage = require(path.join(__dirname, '..', 'utils', 'image'));

fs.readdirSync(directory).filter(file => !file === '.gitignore').forEach(year => {
  fs.readdirSync(path.join(directory, year)).forEach(month => {
    const files = fs.readdirSync(path.join(directory, year, month)).filter(file => file.endsWith('.json'));
    for (let file of files) {
      ChartToImage(
        path.join(directory, year, month, file),
        path.join(imageDirectory, year, month, file.replace('.json', '.png')),
        !(file === 'index.json')
      );
    }
  });
});



