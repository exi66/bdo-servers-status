const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const fs = require('fs-extra');
const path = require('path');

const width = 800;
const height = 400;
const backgroundColour = '#212529';
const chartJSNodeCanvas = new ChartJSNodeCanvas({
  width, height, backgroundColour, plugins: {
    globalVariableLegacy: ['chartjs-adapter-moment']
  }, chartCallback: (ChartJS) => {
    ChartJS.defaults.font.family = 'Arial';
  }
});
chartJSNodeCanvas.registerFont(path.join(__dirname, '..', 'public', 'fonts', 'arial.ttf'), { family: 'Arial' });

const render = async function render(jsonPath, img, day = true, type = 'auth', label = 'Авторизация') {
  if (!fs.existsSync(jsonPath)) return console.log(`[${new Date().toLocaleString()}] file ${jsonPath} not exists. Try another.`);

  var file = fs.readFileSync(jsonPath);
  var json = JSON.parse(file).filter(e => e);
  var chartData = json.map(e => ({ x: new Date(e.time), y: e.maintenance ? null : e[type] == -1 ? -10 : e[type] }));

  const configuration = day ? day_config(chartData, label) : month_config(chartData, label);
  const image = await chartJSNodeCanvas.renderToBuffer(configuration);
  const buf = Buffer.from(image, 'base64');
  fs.ensureFileSync(img);
  fs.writeFileSync(img, buf);
  console.log(`[${new Date().toLocaleString()}] ${img} updated by file ${jsonPath}.`);
};

const day_config = (chartData, label) => {
  return {
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
        label: label,
        data: chartData,
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
            tooltipFormat: 'dd/MM/yyyy HH:mm',
            unit: 'hour',
            round: 'minute'
          },
        }
      }
    }
  }
}

const month_config = (chartData, label) => {
  return {
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
        label: label,
        data: chartData,
        backgroundColor: function (context) {
          const index = context.dataIndex;
          const value = context.dataset.data[index];
          return value.y < 0 ? 'rgba(220, 53, 69, 1)' : 'rgba(25, 135, 84, 1)';
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
            tooltipFormat: 'dd/MM/yyyy',
            unit: 'day',
            round: 'day'
          },
        }
      }
    }
  }
}

module.exports = render;
