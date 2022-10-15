const path = require('path');

var ChartToImage = require(path.join(__dirname, '..', 'utils', 'image'));

let localDate = new Date();
let jsonPath = path.join(__dirname, '..', 'public', 'chart', localDate.getFullYear().toString(), (localDate.getMonth() + 1).toString(), `${localDate.getDate()}.json`);
let imgPath = path.join(__dirname, '..', 'public', 'img', 'today.png');
ChartToImage(jsonPath, imgPath);
