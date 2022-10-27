document.addEventListener('DOMContentLoaded', async function() {
  let localPath = this.getElementById('chart').getAttribute('data-params');
  var path = '/chart/'+localPath;
  var current_date = `${localPath.split('/')[0]}-${('0' + localPath.split('/')[1]).slice(-2)}-${('0' + localPath.split('/')[2]).slice(-2)}`;
  var chart = createDayChart('chart');
  var datasets = await getDatasets(path);
  var dates = await getData('/api/stats');
  var selected = this.getElementById('select_data').value;
  if (!dates || !datasets) return;

  let date_picker = this.getElementById('pick_date');
  date_picker.setAttribute('min', dates[0]);
  date_picker.setAttribute('max', dates.slice(-1));
  date_picker.setAttribute('value', current_date);

  updateChart();

  date_picker.addEventListener('change', function() {
    let __date = new Date(this.value);
    if (confirm(`Вы хотите посмотреть подробную статистику от ${__date.toLocaleDateString('ru-RU')}?`))
      window.location.href = `/stats/${__date.getFullYear()}/${__date.getMonth() + 1}/${__date.getDate()}`;
  });
  this.getElementById('select_data')
    .addEventListener('change', function() {
      selected = this.value;
      updateChart();
    });
  function updateChart() {
    if (!datasets || !chart) return;
    let conf = datasets.find(e => e.name == selected);
    if (!conf) return console.error('This type of datasets not allowed!');
    return updateData(chart, conf);
  }
});
