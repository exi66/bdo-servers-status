const fs = require('fs-extra');
const path = require('path');

const threshold = 10;

const hosts = require(path.join(__dirname, '..', 'storage', 'servers.json'));

const run = function run(jsonPath) {
  const directory = jsonPath;
  const files = fs.readdirSync(directory).filter(file => file.endsWith('.json') && file !== 'index.json');

  var month = [];

  for (let file of files) {
    let pull = require(path.join(directory, file)).filter(e => !e.maintenance);
    let dayNumber = parseInt(file.replace('.json', ''));

    if (pull.length > 0) {

      let avgLatency = {};
      for (let h of hosts) {
        avgLatency[h.name] = 0;
      }
      var localDate = new Date(pull[0].time);
      localDate.setHours(0, 0, 0, 1);
      localDate.setDate(dayNumber);
      avgLatency.time = localDate.getTime();

      for (let h of hosts) {
        let s = 0;
        let downCount = 0;
        for (let p of pull) {
          if (p[h.name] != -1) s += p[h.name];
          else downCount++;
        }
        if (downCount > threshold) avgLatency[h.name] = -1;
        else avgLatency[h.name] = s / (pull.length - downCount);
      }

      month[dayNumber - 1] = avgLatency;

    } else {
      continue;
    }
  }

  var jsonPath = path.join(directory, 'index.json');
  fs.ensureFileSync(jsonPath);
  fs.writeFileSync(jsonPath, JSON.stringify(month));
  console.log(`[${new Date().toLocaleString()}] file ${jsonPath} saved`);

}

module.exports = run;
