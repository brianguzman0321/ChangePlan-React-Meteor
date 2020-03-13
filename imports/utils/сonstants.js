export const options = {
  plugins: {
    datalabels: {
      color: 'white',
      formatter: function (value, context) {
        return context.chart.data.datasets[context.datasetIndex].lengthStakeholders;
      },
    },
  },
  maintainAspectRatio: false,
  legend: {
    display: false,
  },
  layout: {
    padding: {
      left: 30,
      right: 70,
      top: 70,
      bottom: 70
    }
  },
  scales: {
    xAxes: [{
      gridLines: {
        color: 'gray'
      },
      scaleLabel: {
        display: true,
        labelString: 'SUPPORT',
      },
      ticks: {
        autoSkip: false,
        min: 1,
        max: 5,
        callback: (value) => getTicksLabel(value),
      },
    }],
    yAxes: [{
      gridLines: {
        color: 'gray'
      },
      scaleLabel: {
        display: true,
        labelString: 'INFLUENCE',
      },
      ticks: {
        min: 1,
        max: 5,
        stepSize: 1,
        callback: (value) => getTicksLabel(value),
      },
    }],
  },
  tooltips: {
    custom: function (tooltip) {
      if (!tooltip) return;
      tooltip.displayColors = false;
    },
    titleFontStyle: 400,
    callbacks: {
      title: function (tooltipItem, data) {
        const labels = data.datasets[tooltipItem[0].datasetIndex].label;
        const type = data.datasets[tooltipItem[0].datasetIndex].selectedTab;
        const title = labels.map(stakeholder => {
          const label = getStakeholderName(stakeholder, type);
          return label;
        }).join('\n');
        return title;
      },
      label: function () {
        return;
      }
    }
  },
  annotation: {
    drawTime: 'beforeDatasetsDraw',
    annotations: [{
      type: 'box',
      id: 'a-box-1',
      xScaleID: 'x-axis-0',
      yScaleID: 'y-axis-0',
      xMin: 1,
      xMax: 3,
      yMin: 1,
      yMax: 3,
      borderColor: 'rgba(169,209,142, 0.7)',
      backgroundColor: 'rgba(169,209,142, 0.7)',
    }, {
      type: 'box',
      id: 'a-box-2',
      xScaleID: 'x-axis-0',
      yScaleID: 'y-axis-0',
      xMin: 3,
      xMax: 5,
      yMin: 1,
      yMax: 3,
      borderColor: 'rgba(255,242,204, 0.7)',
      backgroundColor: 'rgba(255,242,204, 0.7)',
    }, {
      type: 'box',
      id: 'a-box-3',
      xScaleID: 'x-axis-0',
      yScaleID: 'y-axis-0',
      xMin: 1,
      xMax: 3,
      yMin: 3,
      yMax: 5,
      borderColor: 'rgba(255,203,102, 0.7)',
      backgroundColor: 'rgba(255,203,102, 0.7)',
    }, {
      type: 'box',
      id: 'a-box-4',
      xScaleID: 'x-axis-0',
      yScaleID: 'y-axis-0',
      xMin: 3,
      xMax: 5,
      yMin: 3,
      yMax: 5,
      borderColor: 'rgba(255,124,128, 0.7)',
      backgroundColor: 'rgba(255,124,128, 0.7)',
    }],
  },
};

const getStakeholderName = (stakeholder, type) => {
  switch (type) {
    case 'group':
      return `${stakeholder.groupName}`;
    case 'firstName':
      return `${stakeholder.firstName} ${stakeholder.lastName}`;
    default:
      return `${stakeholder[type]}`;
  }
};

const getTicksLabel = (value) => {
  switch (value) {
    case 1:
      return 'LOW';
    case 2:
      return '';
    case 3:
      return 'MEDIUM';
    case 4:
      return '';
    case 5:
      return 'HIGH';
    default:
      break;
  }
};

