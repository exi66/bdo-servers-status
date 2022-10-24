Chart.defaults.font.family = 'Arial';

const getDatasets = function getDatasets(url) {
  let json = getData(url);
  if (json.error) return console.error(json.error);
  json = json.filter(e => e);
  let datasets = createDatasets();
  for (let dataset of datasets) {
    dataset.data = json.map(e => ({ x: new Date(e.time), y: e.maintenance ? null : e[dataset.name] == -1 ? -10 : e[dataset.name] }));
  }
  return datasets;
}
const createDatasets = function createDatasets() {
  return [
    { name: 'auth', label: 'Авторизация', data: [] }, { name: 'market', label: 'Аукцион', data: [] },
    { name: 'k1', label: 'Кальфеон-1', data: [] }, { name: 'v1', label: 'Валенсия-1', data: [] },
    { name: 'm1', label: 'Медия-1', data: [] }, { name: 'kam1', label: 'Камасильвия-1', data: [] },
  ]
}
const getData = function getData(url, method = 'GET', async = false, cache = false) {
  let res;
  $.ajax({
    type: method,
    url: url,
    async: async,
    cache: cache,
    success: function(result) {
      res = result;
    },
    error: function (error) {
      console.error({ error: error });
    }
  });
  return res;
}
const updateData = function updateData(chart, conf) {
  chart.data.datasets[0].label = conf.label;
  chart.data.datasets[0].data = conf.data;
  chart.update();
}
