const timeout = 10000;
document.addEventListener('DOMContentLoaded', function (event) {
  var chart = createDayChart('chart');
  updChart(chart, $('#select_data').find(':selected').val());
  updateStatus();
  updateNews();
  $('#select_data').on('change', function () {
    updChart(chart, this.value);
  });
  var checkStatus = setInterval(function () {
    updateStatus();
    updChart(chart, $('#select_data').find(':selected').val());
  }, timeout);
});
function updChart(chart, data) {
  let localDate = new Date();
  updateChart(`/chart/${localDate.getFullYear()}/${localDate.getMonth() + 1}/${localDate.getDate()}.json`, data, chart);
}
function updateNews() {
  var json = getData('/api/news');
  if (json.error) return console.error(json.error);
  $('#news').empty();
  for (let i = 0; i < Math.min(3, json.length); i++) {
    let text = json[i].text.split(' ').slice(1, -1).join(' ');
    let date = json[i].text.split(' ').slice(-1).toString();
    $('#news').append(
      $('<a/>')
        .addClass('row link-unstyled mx-3')
        .attr('href', json[i].url)
        .append(
          $('<div/>')
            .addClass('col-2 my-auto p-0')
            .append(
              $('<img/>')
                .attr('src', json[i].img)
                .addClass('img-fluid')
            )
        ).append(
          $('<div/>')
            .addClass('col mx-auto my-auto')
            .html(text)
        ).append(
          $('<div/>')
            .addClass('col-2 text-end my-auto d-none d-lg-block')
            .text(date.split('\/').join('.'))
        )
    ).append(
      $('<hr>')
        .addClass('text-muted')
    );
  }
}
function updateStatus() {
  var indicators = [{ name: 'market', elem: $('#market_status')  }, { name: 'auth', elem: $('#auth_status') },
    { name: 'k1', elem: $('#k1_status')  }, { name: 'v1', elem: $('#v1_status') },
    { name: 'm1', elem: $('#m1_status')  }, { name: 'kam1', elem: $('#kam1_status') }],
    time = $('#update_time'),
    json = getData('/api/status');

  if (json.error === 'maintenance') {
    for (let e of indicators) {
      e.elem.removeClass('bg-secondary bg-danger bg-success bg-warning').addClass('bg-secondary');
      e.elem.html('тех. работы');
    }
  }
  if (json.error) return console.error(json.error);
  if (!json.market || !json.auth || !json.k1 || !json.v1 || !json.m1 || !json.kam1 || !json.time) return;
  time.html(new Date(json.time).toLocaleString());
  for (let e of indicators) {
    e.elem.removeClass('bg-secondary bg-danger bg-success bg-warning').addClass(
      json[e.name] === -1 ? 'bg-danger' : json[e.name] > 100 ? 'bg-warning' : 'bg-success'
    );
    e.elem.html(json[e.name] === -1 ? 'down' : json[e.name].toFixed(2) + 'ms');
  }
}
