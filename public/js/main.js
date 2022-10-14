Chart.defaults.font.family = 'Arial';

const updateChart = function updateChart(url, data, chart) {
  var json = getData(url);

  if (json.error) return console.error(json.error);

  json = json.filter(e => e);

  var marketData = json.map(e => ({ x: new Date(e.time), y: e.maintenance ? null : e.market == -1 ? -10 : e.market })),
    authData = json.map(e => ({ x: new Date(e.time), y: e.maintenance ? null : e.auth == -1 ? -10 : e.auth })),
    k1Data = json.map(e => ({ x: new Date(e.time), y: e.maintenance ? null : e.k1 == -1 ? -10 : e.k1 })),
    v1Data = json.map(e => ({ x: new Date(e.time), y: e.maintenance ? null : e.v1 == -1 ? -10 : e.v1 })),
    m1Data = json.map(e => ({ x: new Date(e.time), y: e.maintenance ? null : e.m1 == -1 ? -10 : e.m1 })),
    kam1Data = json.map(e => ({ x: new Date(e.time), y: e.maintenance ? null : e.kam1 == -1 ? -10 : e.kam1 }));

  switch (data) {
    case 'market':
      updateData(chart, marketData, 'Аукцион');
      break;
    case 'auth':
      updateData(chart, authData, 'Авторизация');
      break;
    case 'k1':
      updateData(chart, k1Data, 'Кальфеон-1');
      break;
    case 'v1':
      updateData(chart, v1Data, 'Валенсия-1');
      break;
    case 'm1':
      updateData(chart, m1Data, 'Медия-1');
      break;
    case 'kam1':
      updateData(chart, kam1Data, 'Камасильвия-1');
      break;
    default:
      console.error('This data option not supported!');
      break;
  }
}
const getData = function getData(url) {
  var res = $.ajax({
    type: 'GET',
    url: url,
    async: false,
    cache: false,
  });
  if (res.status === 200) return JSON.parse(res.responseText);
  return { error: res.status };
}
const createMonthChart = function createMonthChart(id) {
  var chart = new Chart(document.getElementById(id), {
    type: 'bar',
    plugins: [{
      afterDraw: chart => {
        const ctx = chart.ctx;
        ctx.save();
        const xAxis = chart.scales['x'];
        const yAxis = chart.scales['y'];
        const y = yAxis.getPixelForValue(0);
        ctx.beginPath();
        ctx.moveTo(xAxis.left, y);
        ctx.lineTo(xAxis.right, y);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.stroke();
        ctx.restore();
      }
    }],
    data: {
      datasets: [{
        label: 'Авторизация',
        data: [{ x: 0, y: 0 }],
        backgroundColor: function (context) {
          const index = context.dataIndex;
          const value = context.dataset.data[index];
          return value.y < 0 ? 'rgba(220, 53, 69, 1)' : 'rgba(25, 135, 84, 1)';
        },
        borderColor: function (context, options) {
          const color = options.color;
          return Chart.helpers.color(color).lighten(0.2);
        },
        color: 'rgba(255, 255, 255, 0.5)'
      }],
    },
    options: {
      elements: {
        point: {
          radius: 0
        }
      },
      plugins: {
        legend: {
          labels: {
            color: 'rgba(255, 255, 255, 0.5)',
            boxWidth: 0
          }
        }
      },
      scales: {
        y: {
          grid: {
            color: 'rgba(255, 255, 255, 0.3)',
            borderColor: 'rgba(255, 255, 255, 0.3)'
          },
          color: 'rgba(255, 255, 255, 0.5)',
          min: -10,
          suggestedMax: 100,
          title: {
            color: 'rgba(255, 255, 255, 0.5)',
            display: true,
            text: 'Задержка, ms'
          },
          ticks: {
            color: 'rgba(255, 255, 255, 0.5)',
            callback: function (value, index) {
              return value >= 0 ? value : 'down';
            }
          }
        },
        x: {
          ticks: {
            color: 'rgba(255, 255, 255, 0.5)'
          },
          grid: {
            color: 'rgba(255, 255, 255, 0.3)'
          },
          type: 'time',
          time: {
            displayFormats: { hour: 'HH:mm' },
            tooltipFormat: 'dd.MM.yyyy',
            unit: 'day',
            round: 'day'
          },
        }
      }
    }
  });
  return chart;
}
const createDayChart = function createDayChart(id) {
  var chart = new Chart(document.getElementById(id), {
    type: 'line',
    plugins: [{
      afterDraw: chart => {
        const ctx = chart.ctx;
        ctx.save();
        const xAxis = chart.scales['x'];
        const yAxis = chart.scales['y'];
        const y = yAxis.getPixelForValue(0);
        ctx.beginPath();
        ctx.moveTo(xAxis.left, y);
        ctx.lineTo(xAxis.right, y);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.stroke();
        ctx.restore();
      }
    }],
    data: {
      datasets: [{
        spanGaps: false,
        label: 'Авторизация',
        data: [{ x: 0, y: 0 }],
        fill: {
          target: 'origin',
          below: 'rgba(220, 53, 69, 1)',
          above: 'rgba(25, 135, 84, 1)'
        },
        borderWidth: 0,
        backgroundColor: 'rgba(25, 135, 84, 1)',
        color: 'rgba(255, 255, 255, 0.5)'
      }],
    },
    options: {
      plugins: {
        legend: {
          labels: {
            color: 'rgba(255, 255, 255, 0.5)',
            boxWidth: 0
          }
        }
      },
      elements: {
        point: {
          radius: 0
        }
      },
      scales: {
        y: {
          grid: {
            color: 'rgba(255, 255, 255, 0.3)',
            borderColor: 'rgba(255, 255, 255, 0.3)'
          },
          color: 'rgba(255, 255, 255, 0.5)',
          stacked: true,
          min: -10,
          suggestedMax: 100,
          title: {
            color: 'rgba(255, 255, 255, 0.5)',
            display: true,
            text: 'Задержка, ms'
          },
          ticks: {
            color: 'rgba(255, 255, 255, 0.5)',
            callback: function (value, index) {
              return value >= 0 ? value : 'down';
            }
          }
        },
        x: {
          ticks: {
            color: 'rgba(255, 255, 255, 0.5)'
          },
          grid: {
            color: 'rgba(255, 255, 255, 0.3)'
          },
          stacked: true,
          type: 'time',
          time: {
            displayFormats: { hour: 'HH:mm' },
            tooltipFormat: 'dd.MM.yyyy, HH:mm',
            unit: 'hour',
            round: 'minute'
          },
        }
      }
    }
  });
  return chart;
}
const updateData = function updateData(chart, data, label) {
  chart.data.datasets[0].label = label;
  chart.data.datasets[0].data = data;
  chart.update();
}
const removeData = function removeData(chart) {
  chart.data.labels.pop();
  chart.data.datasets.forEach((dataset) => {
    dataset.data.pop();
  });
  chart.update();
}
const getUrlParameter = function getUrlParameter(sParam) {
  var sPageURL = window.location.search.substring(1),
    sURLVariables = sPageURL.split('&'),
    sParameterName,
    i;
  for (i = 0; i < sURLVariables.length; i++) {
    sParameterName = sURLVariables[i].split('=');

    if (sParameterName[0] === sParam) {
      return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
    }
  }
  return false;
}
