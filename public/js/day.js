document.addEventListener('DOMContentLoaded', function (event) {
  let localPath = window.location.pathname.toString().split('/');
  var path = `/chart/${localPath[2]}/${localPath[3]}/${localPath[4]}.json`;
  var chart = createDayChart('chart');
  updateChart(path, $('#select_data').find(':selected').val(), chart);

  $('#select_data').on('change', function (e) {
    updateChart(path, this.value, chart);
  });
});
