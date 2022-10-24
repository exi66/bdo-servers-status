const timeout = 10000;
document.addEventListener('DOMContentLoaded', function (event) {
  var chart = createDayChart('chart');
  var datasets = __getDatasets();
  var status = __getStatus();
  var selected = $('#select_data').find(':selected').val();
  var timer = setInterval(function () {
    datasets = __getDatasets();
    status = __getStatus();

    updateStatus();
    updateChart();
  }, timeout);
  updateStatus();
  updateChart();
  $('#select_data').on('change', function () {
    selected = this.value;
    updateChart();
  });
  function updateChart() {
    if (!datasets || !chart) return;
    let conf = datasets.find(e => e.name == selected);
    if (!conf) return console.error('This type of datasets not allowed!');
    return updateData(chart, conf);
  }
  function __getDatasets() {
    let localDate = new Date();
    return getDatasets(`/chart/${localDate.getFullYear()}/${localDate.getMonth() + 1}/${localDate.getDate()}.json`);
  }
  function __getStatus() {
    let json = getData('/api/status');
    if (!json) return;
    let status = datasets.map(e => ({ name: e.name }));
    for (let s of status) {
      s.value = json[s.name];
    }
    return { status: status, time: json.time };
  }
  function updateStatus() {
    if (!status) return;
    $('#update_time').html(new Date(status.time).toLocaleString());
    for (let e of status.status) {
      $(`#${e.name}_status`).removeClass('bg-secondary bg-danger bg-success bg-warning').addClass(
        e.value === -1 ? 'bg-danger' : e.value > 100 ? 'bg-warning' : 'bg-success'
      );
      $(`#${e.name}_status`).html(e.value === -1 ? 'down' : e.value.toFixed(2) + 'ms');
    }
  }
});
