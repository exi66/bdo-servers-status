const timeout = 10000;
document.addEventListener('DOMContentLoaded', async function() {
  var chart = createDayChart('chart');
  var datasets = await __getDatasets();
  var status = await __getStatus();
  var selected = this.getElementById('select_data').value;
  var timer = setInterval(async function() {
    datasets = await __getDatasets();
    status = await __getStatus();

    updateStatus();
    updateChart();
  }, timeout);
  updateStatus();
  updateChart();
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
  async function __getDatasets() {
    let localDate = new Date(
      new Date().toLocaleString('en-US', { timeZone: 'Europe/Moscow' })
    );
    return await getDatasets(`/chart/${localDate.getFullYear()}/${localDate.getMonth() + 1}/${localDate.getDate()}/`);
  }
  async function __getStatus() {
    let json = await getData('/api/status/');
    if (!json) return;
    let status = datasets.map(e => ({ name: e.name }));
    for (let s of status) {
      s.value = json[s.name];
    }
    return { status: status, time: json.time };
  }
  function updateStatus() {
    if (!status.status && !status.time) return;
    document.getElementById('update_time').textContent = new Date(status.time).toLocaleString();
    for (let e of status.status) {
      let elem = document.getElementById(`${e.name}_status`);
      elem.classList.remove(['bg-secondary', 'bg-danger', 'bg-success', 'bg-warning']);
      elem.classList.add(e.value === -1 ? 'bg-danger' : e.value > 100 ? 'bg-warning' : 'bg-success');
      elem.textContent = e.value === -1 ? 'down' : e.value.toFixed(2) + 'ms';
    }
  }
});
