document.addEventListener('DOMContentLoaded', function (event) {
  let localPath = window.location.pathname.toString().split('/');
  var path = `/chart/${localPath[2]}/${localPath[3]}/index.json`;
  var chart = createMonthChart('chart');
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
