/*
* .match(/<ul\s+class="thumb_nail_list".*?>[\S\s]*?<\/ul>/gi)[0];
* .match(/<li\.*?>[\S\s]*?<\/li>/gi);
* .match(/<a\s+(?:[^>]*?\s+)?href=(["'])(.*?)\1/)[2];                                                                           url
* .match(/<img\s+(?:[^>]*?\s+)?src=(["'])(.*?)\1/)[2];                                                                          image
* .match(/<li\.*?>[\S\s]*?<\/li>/gi)[0].replace(/(<([^>]+)>)/ig, '').replace(/(\r\n|\n|\r)/gm, "").replace(/\s+/g,' ').trim();  all string
* .match(/<li\.*?>[\S\s]*?<\/li>/gi)[0].match(/(?<=<em\s+class="cate_noti".*?>)(.*?)(?=<\/em>)/gi)                              type
* .match(/<li\.*?>[\S\s]*?<\/li>/gi)[0].match(/(?<=<span\s+class="date".*?>)(.*?)(?=<\/span>)/gi)                               date
*/
const axios = require('axios');

const default_timeout = 10 * 60 * 1000;

module.exports = (client) => {
  return start(client);
}

async function start(client) {

  var start_timer = new Date();
  if (!client.maintenance) {
  
    try {

      var res = await axios.get('https://www.ru.playblackdesert.com/News/Notice?boardType=1');
      var news = res.data.toString().match(/<ul\s+class="thumb_nail_list".*?>[\S\s]*?<\/ul>/gi)[0].match(/<li\.*?>[\S\s]*?<\/li>/gi);

      var local_news = news.map(e => ({
        text: e.replace(/(<([^>]+)>)/ig, '').replace(/(\r\n|\n|\r)/gm, '').replace(/\s+/g, ' ').trim(),
        url: e.match(/<a\s+(?:[^>]*?\s+)?href=(["'])(.*?)\1/)[2],
        img: e.match(/<img\s+(?:[^>]*?\s+)?src=(["'])(.*?)\1/)[2]
      })
      );

    } catch (e) {
      console.error(`[${new Date().toLocaleString()}][news] ${e}`);
    }

    client.news = local_news || [];

  }
  var run_timer = new Date().getTime() - start_timer.getTime();
  return setTimeout(start, client.debug ? (default_timeout - run_timer) / 30 : (default_timeout - run_timer), client);
}
