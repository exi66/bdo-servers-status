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
