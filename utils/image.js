const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const fs = require('fs-extra');
const path = require('path');
const mergeImages = require('merge-images');
const { Canvas, Image } = require('canvas');

const width = 600;
const height = 300;
const backgroundColour = '#212529';
const chartJSNodeCanvas = new ChartJSNodeCanvas({
  width, height, backgroundColour, plugins: {
    globalVariableLegacy: ['chartjs-adapter-moment']
  }, chartCallback: (ChartJS) => {
    ChartJS.defaults.font.family = 'Arial';
  }
});
chartJSNodeCanvas.registerFont(path.join(__dirname, '..', 'public', 'fonts', 'arial.ttf'), { family: 'Arial' });

const render = async function render(jsonPath, imgPath, day = true) {
  if (!fs.existsSync(jsonPath)) return console.log(`[${new Date().toLocaleString()}] file ${jsonPath} not exists. Try another.`);
  var file = fs.readFileSync(jsonPath);
  var json = JSON.parse(file).filter(e => e);
  var chartData = [
    { data: json.map(e => ({ x: new Date(e.time), y: e.maintenance ? null : e.auth == -1 ? -10 : e.auth })), label: 'Авторизация' },
    { data: json.map(e => ({ x: new Date(e.time), y: e.maintenance ? null : e.market == -1 ? -10 : e.market })), label: 'Аукцион' },
    { data: json.map(e => ({ x: new Date(e.time), y: e.maintenance ? null : e.k1 == -1 ? -10 : e.k1 })), label: 'Кальфеон-1' },
    { data: json.map(e => ({ x: new Date(e.time), y: e.maintenance ? null : e.v1 == -1 ? -10 : e.v1 })), label: 'Валенсия-1' },
    { data: json.map(e => ({ x: new Date(e.time), y: e.maintenance ? null : e.m1 == -1 ? -10 : e.m1 })), label: 'Медия-1' },
    { data: json.map(e => ({ x: new Date(e.time), y: e.maintenance ? null : e.kam1 == -1 ? -10 : e.kam1 })), label: 'Камасильвия-1' },
  ];
  var images = [], y_offset = 0;
  for (let __data of chartData) {
    const configuration = day ? day_config(__data.data, __data.label) : month_config(__data.chartData, __data.label);
    const buffer = await chartJSNodeCanvas.renderToBuffer(configuration);
    const base64 = buffer.toString('base64');
    const image = { src: 'data:image/png;base64,'+base64, x: 0, y: y_offset }
    images.push(image);
    y_offset += height;
  }
  mergeImages(images, {
    Canvas: Canvas,
    Image: Image,
    width: width,
    height: height*images.length
  }).then(b64 => {
    const buffer = Buffer.from(b64.replace('data:image/png;base64,', ''), 'base64');
    fs.ensureFileSync(imgPath);
    fs.writeFileSync(imgPath, buffer);
    console.log(`[${new Date().toLocaleString()}] ${imgPath} updated by file ${jsonPath}.`);
  });
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
