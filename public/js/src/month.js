document.addEventListener('DOMContentLoaded', async function() {
  let localPath = this.getElementById('chart').getAttribute('data-params');
  var path = '/chart/'+localPath;
  var current_month = `${localPath.split('/')[0]}-${('0' + localPath.split('/')[1]).slice(-2)}`;
  var chart = createMonthChart('chart');
  var datasets = await getDatasets(path);
  var dates = await getData('/api/stats');
  var selected = this.getElementById('select_data').value;
  if (!dates || !datasets) return;

  let min_date = dates[0].split('-');
  let max_date = dates.slice(-1).toString().split('-');
  let date_picker = this.getElementById('pick_date');
  date_picker.setAttribute('min', `${min_date[0]}-${min_date[1]}`);
  date_picker.setAttribute('max', `${max_date[0]}-${max_date[1]}`);
  date_picker.setAttribute('value', current_month);

  updateChart();

  date_picker.addEventListener('change', function() {
    let __date = new Date(this.value+'-01');
    if (confirm(`Вы хотите посмотреть подробную статистику за ${this.value.split('-')[1]} месяц ${this.value.split('-')[0]} года?`))
        window.location.href = `/stats/${__date.getFullYear()}/${__date.getMonth() + 1}`;
  });
  this.getElementById('select_data')
    .addEventListener('change', function() {
      selected = this.value;
      updateChart();
    });
  chart.canvas.onclick = function (evt) {
    var points = chart.getElementsAtEventForMode(evt, 'nearest', { intersect: true }, true);
    if (points[0]) {
      const dataset = points[0].datasetIndex;
      const index = points[0].index;
      const value = chart.data.datasets[dataset].data[index];
      if (confirm(`Вы хотите посмотреть подробную статистику от ${value.x.toLocaleDateString('ru-RU')}?`))
        window.location.href = `/stats/${value.x.getFullYear()}/${value.x.getMonth() + 1}/${value.x.getDate()}`;
    }
  };
  function updateChart() {
    if (!datasets || !chart) return;
    let conf = datasets.find(e => e.name == selected);
    if (!conf) return console.error('This type of datasets not allowed!');
    return updateData(chart, conf);
  }
});
