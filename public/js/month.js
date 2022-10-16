document.addEventListener('DOMContentLoaded', function(event) {
  var dates = getData('/api/stats');
  if (dates.error) return console.error(dates.error);
  dates.sort(function(x, y) {
    let date1 = new Date(x).getTime();
    let date2 = new Date(y).getTime();
    if (date1 < date2) return -1;
    if (date1 > date2) return 1;
    return 0;
  });
  let localPath = window.location.pathname.toString().split('/');
  var path = `/chart/${localPath[2]}/${localPath[3]}/index.json`;
  var current_month = `${localPath[2]}-${('0' + localPath[3]).slice(-2)}`;
  var chart = createMonthChart('chart');

  let min_date = dates[0].split('-');
  let max_date = dates.slice(-1).toString().split('-');
  $('#pick_date').attr('min', `${min_date[0]}-${min_date[1]}`);
  $('#pick_date').attr('max', `${max_date[0]}-${max_date[1]}`);
  $('#pick_date').attr('value', current_month);

  $('#navigate_to_date').click(function() {
    let date = $('#pick_date').val();
    if (date) {
      let __date = new Date(date+'-01');
      if (confirm(`Вы хотите посмотреть подробную статистику за ${date.split('-')[1]} месяц ${date.split('-')[0]} года?`))
        window.location.href = `/stats/${__date.getFullYear()}/${__date.getMonth() + 1}`;
    }
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
  updateChart(path, $('#select_data').find(':selected').val(), chart);
  $('#select_data').on('change', function (e) {
    updateChart(path, this.value, chart);
  });
});
