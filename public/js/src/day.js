document.addEventListener('DOMContentLoaded', function (event) {
  let localPath = window.location.pathname.toString().split('/');
  var path = `/chart/${localPath[2]}/${localPath[3]}/${localPath[4]}.json`;
  var current_date = `${localPath[2]}-${('0' + localPath[3]).slice(-2)}-${('0' + localPath[4]).slice(-2)}`;
  var chart = createDayChart('chart');
  var datasets = getDatasets(path);
  var dates = getData('/api/stats');
  var selected = $('#select_data').find(':selected').val();
  if (!dates || !datasets) return;
  dates.sort(function(x, y) {
    let date1 = new Date(x).getTime();
    let date2 = new Date(y).getTime();
    if (date1 < date2) return -1;
    if (date1 > date2) return 1;
    return 0;
  });

  $('#pick_date').attr('min', dates[0]);
  $('#pick_date').attr('max', dates.slice(-1));
  $('#pick_date').attr('value', current_date);

  updateChart();
  $('#navigate_to_date').click(function() {
    let date = $('#pick_date').val();
    if (date) {
      let __date = new Date(date);
      if (confirm(`Вы хотите посмотреть подробную статистику от ${__date.toLocaleDateString('ru-RU')}?`))
        window.location.href = `/stats/${__date.getFullYear()}/${__date.getMonth() + 1}/${__date.getDate()}`;
    }
  });
  $('#select_data').on('change', function() {
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
