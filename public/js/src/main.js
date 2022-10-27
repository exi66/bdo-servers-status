Chart.defaults.font.family = 'Arial';

const getDatasets = async function getDatasets(url) {
  let json = await getData(url);
  if (!json) return;
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
const getData = async function getData(url) {
  try {
    let response = await fetch(url);
    let data = await response.json();
    return data;
  } catch(e) {
    return console.error({ error: e });
  }
}
const updateData = function updateData(chart, conf) {
  chart.data.datasets[0].label = conf.label;
  chart.data.datasets[0].data = conf.data;
  chart.update();
}
