var CronJob = require('node-cron');
var path = require('path');

var ChartToImage = require(path.join(__dirname, 'image'));
var MonthWorker = require(path.join(__dirname, 'month'));

exports.initScheduledJobs = (client) => {
  const maintenanceStart = CronJob.schedule("0 9 * * 3", () => {
    client.maintenance = true;
  });
  const maintenanceStop = CronJob.schedule("0 13 * * 3", () => {
    client.maintenance = false;
  });
  const secondaryJob = CronJob.schedule("*/20 * * * *", () => {
    let localDate = new Date();
    let jsonPath = path.join(__dirname, '..', 'public', 'chart', localDate.getFullYear().toString(), (localDate.getMonth() + 1).toString(), `${localDate.getDate()}.json`);
    let imgPath = path.join(__dirname, '..', 'public', 'img', 'today.png');
    ChartToImage(jsonPath, imgPath);
  });
  const imagesJob = CronJob.schedule("5 0 * * *", () => {
    let localDate = getPreviousDay();
    let dayJsonPath = path.join(__dirname, '..', 'public', 'chart', localDate.getFullYear().toString(), (localDate.getMonth() + 1).toString(), `${localDate.getDate()}.json`);
    let dayImgPath = path.join(__dirname, '..', 'public', 'img', localDate.getFullYear().toString(), (localDate.getMonth() + 1).toString(), `${localDate.getDate()}.png`);
    ChartToImage(dayJsonPath, dayImgPath);
    let monthJsonPath = path.join(__dirname, '..', 'public', 'chart', localDate.getFullYear().toString(), (localDate.getMonth() + 1).toString(), `index.json`);
    let monthImgPath = path.join(__dirname, '..', 'public', 'img', localDate.getFullYear().toString(), (localDate.getMonth() + 1).toString(), `index.png`);
    ChartToImage(monthJsonPath, monthImgPath, false);
  });
  const generalJob = CronJob.schedule("1 0 * * *", () => {
    let localDate = getPreviousDay();
    let directory = path.join(__dirname, '..', 'public', 'chart', localDate.getFullYear().toString(), (localDate.getMonth() + 1).toString());
    MonthWorker(directory);
  });

  maintenanceStart.start();
  maintenanceStop.start();
  secondaryJob.start();
  generalJob.start();
  imagesJob.start();
}

function getPreviousDay(date = new Date()) {
  const previous = new Date(date.getTime());
  previous.setDate(date.getDate() - 1);

  return previous;
}
