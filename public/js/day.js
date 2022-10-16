document.addEventListener('DOMContentLoaded', function (event) {
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
  var path = `/chart/${localPath[2]}/${localPath[3]}/${localPath[4]}.json`;
  var current_date = `${localPath[2]}-${('0' + localPath[3]).slice(-2)}-${('0' + localPath[4]).slice(-2)}`;
  var chart = createDayChart('chart');

  $('#pick_date').attr('min', dates[0]);
  $('#pick_date').attr('max', dates.slice(-1));
  $('#pick_date').attr('value', current_date);

  updateChart(path, $('#select_data').find(':selected').val(), chart);
  $('#navigate_to_date').click(function() {
    let date = $('#pick_date').val();
    if (date) {
      let __date = new Date(date);
      if (confirm(`Вы хотите посмотреть подробную статистику от ${__date.toLocaleDateString('ru-RU')}?`))
        window.location.href = `/stats/${__date.getFullYear()}/${__date.getMonth() + 1}/${__date.getDate()}`;
    }
  });
  $('#select_data').on('change', function() {
    updateChart(path, this.value, chart);
  });
});
