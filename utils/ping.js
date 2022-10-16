/*
*	123.253.172.x proxy
*	211.188.28.x server
*
*   .134 8889 game k1
*   .143 8889 game k2
*   .144 8889 game k3
*   .132 8889 game b1
*   .137 8889 game b2
*   .138 8889 game b3
*   .133 8889 game s1
*   .140 8889 game s2
*   .140 8889 game s3
*   .136 8889 game v1
*	.136 8889 game v1		
*   .149 8889 game v2
*   .150 8889 game v3
*   .160 8889 game m1
*	.160 8889 game m1
*   .146 8889 game m2
*   .147 8889 game m3
*   .152 8889 game kam1
*	.152 8889 game kam1
*   .151 8889 game kam2
*   .148 8889 game kam3
*   .156 8889 game arshi
*	.168 8889 game marni1
*   .167 8889 game marni2
*
*   .128:8888  	auth
*   45.223.25.187:443     	central market
*	.130:8884  	chat
*   .130:8883  	chat
* 	.168:8885  	solare matchmaking	
*
*   you can edit servers <ip:port> in ./storage/servers.json
*/

const path = require('path');
const tcpp = require('tcp-ping');
const util = require('util');
const fs = require('fs-extra');
const tcpPing = util.promisify(tcpp.ping);

const hosts = require(path.join(__dirname, '..', 'storage', 'servers.json'));
const savePath = path.join(__dirname, '..', 'public', 'chart');

const default_timeout = 5*60*1000;
const down_detect_timeout = 60*1000;

const tcp_attempts = 3;
const tcp_timeout = 500;

var timeout = default_timeout;

module.exports = (client) => {
  return start(client);
}

async function start(client) {
  var start_timer = new Date();
  timeout = default_timeout;
  if (client.maintenance) {
    let maintenanceStatus = { time: new Date().getTime(), maintenance: true };
    saveData(maintenanceStatus);
  } else {
    let r = await pingGameServices(hosts);
    console.log(`[${new Date().toLocaleString()}][ping] someDown: ${r.someDown}`);

    saveData(r.localStatus);

    client.status = r.localStatus;
    client.someDown = r.someDown;

    if (client.someDown) timeout = down_detect_timeout;
  }
  var run_timer = new Date().getTime() - start_timer.getTime();
  return setTimeout(start, client.debug ? (timeout - run_timer) / 30 : (timeout - run_timer), client);
}

function saveData(data) {
  try {
    let localDate = new Date();

    let jsonPath = path.join(savePath, localDate.getFullYear().toString(), (localDate.getMonth() + 1).toString(), `${localDate.getDate()}.json`);
    fs.ensureFileSync(jsonPath);
    let file = fs.readFileSync(jsonPath);
    let json = JSON.parse(file.length === 0 ? '[]' : file);

    json.push(data);
    fs.writeFileSync(jsonPath, JSON.stringify(json));
  } catch (e) {
    console.error(`[${new Date().toLocaleString()}] ${e}`);
  }
}

async function pingGameServices(hosts) {

  let localStatus = { time: new Date().getTime() }
  let someDown = false;

  for (let server of hosts) {
    let data = {}, proxyData = {};
    try {
      data = await tcpPing({ address: server.address, port: server.port, attempts: tcp_attempts, timeout: tcp_timeout });
      if (server.proxy) proxyData = await tcpPing({ address: server.proxy, port: server.port, attempts: tcp_attempts, timeout: tcp_timeout });
    } catch (e) {
      console.error(`[${new Date().toLocaleString()}] ${e}`);
    }
    localStatus[server.name] = proxyData.avg || data.avg || -1;
    if (!localStatus[server.name] || localStatus[server.name] == -1) someDown = true;
  }
  return { someDown: someDown, localStatus: localStatus };
}
