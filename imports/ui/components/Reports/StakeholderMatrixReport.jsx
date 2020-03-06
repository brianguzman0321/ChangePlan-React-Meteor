import React, {useEffect, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Grid from "@material-ui/core/Grid/Grid";
import {withRouter} from "react-router";
import {withSnackbar} from "notistack";
import {withTracker} from "meteor/react-meteor-data";
import {Paper} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import {AdditionalStakeholderInfo} from "../../../api/additionalStakeholderInfo/additionalStakeholderInfo";
import {Bubble} from "react-chartjs-2";
import 'chartjs-plugin-datalabels';
import 'chartjs-plugin-annotation';
import {Meteor} from "meteor/meteor";
import 'chart.js';
import {getTotalStakeholders }from "../../../utils/utils";

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    margin: theme.spacing(3),
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  topHeading: {
    fontSize: '1.8rem',
    fontWeight: 500,
    lineHeight: 1.5,
    letterSpacing: '-0.015em',
    color: '#465563',
    marginLeft: 24,
    paddingTop: '10px',
  },
  gridTable: {
    padding: '0px 24px 20px 24px',
  },
}));

function StakeholderMatrixReport(props) {
  const classes = useStyles();
  const {match, allInfo, allStakeholders} = props;
  const projectId = match.params.projectId;
  const [matrixData, setMatrixData] = useState({labels: ['LOW', 'MEDIUM', 'HIGH'], datasets: []});

  useEffect(() => {
    setMatrixData({labels: ['LOW', 'MEDIUM', 'HIGH'], datasets: []});
  }, [projectId]);

  useEffect(() => {
    if (allStakeholders.length > 0 && allInfo.length > 0) {
      getDataMatrix();
    }
  }, [allStakeholders, allInfo]);

  const getDataMatrix = () => {
    let tempData = {labels: ['LOW', 'MEDIUM', 'HIGH'], datasets: []};
    const projectInfo = allInfo.filter(info => info.projectId === projectId);
    let datasets = {};
    if (projectInfo.length > 0) {
      for (let i = 1; i <= 5; i++) {
        for (let j = 1; j <= 5; j++) {
          const currentInfo = projectInfo.filter(info => info.levelOfSupport === i && info.levelOfInfluence === j);
          if (currentInfo.length > 0) {
            let arrayStakeholders = [];
            let arrayStakeholdersId = [];
            currentInfo.forEach(info => {
              const stakeholders = allStakeholders.find(stakeholder => stakeholder._id === info.stakeholderId);
              if (stakeholders) {
                arrayStakeholdersId.push(stakeholders._id);
                arrayStakeholders.push(stakeholders);
              }
            });
            datasets = {
              label: arrayStakeholders.length > 0 && arrayStakeholders,
              lengthStakeholders: getTotalStakeholders(allStakeholders, arrayStakeholdersId),
              backgroundColor: 'rgba(0,112,192, 0.7)',
              borderColor: 'rgba(0,112,192, 0.7)',
              lineTension: 20,
              borderCapStyle: 'butt',
              borderDash: [],
              borderJoinStyle: 'miter',
              pointBorderColor: 'rgba(0,112,192, 0.7)',
              pointBackgroundColor: '#fff',
              pointBorderWidth: 1,
              pointHoverRadius: 5,
              pointHoverBackgroundColor: 'rgba(0,112,192, 0.7)',
              pointHoverBorderColor: 'rgba(0,112,192, 0.7)',
              pointHoverBorderWidth: 2,
              pointRadius: 1,
              pointHitRadius: 10,
              data: [{x: i, y: j, r: getRadius(arrayStakeholdersId)}]
            };
            tempData.datasets.push(datasets);
            tempData.datasets = [...new Set(tempData.datasets)];
          }
        }
      }
      setMatrixData(tempData);
    }
  };

  const getRadius = (stakeholders) => {
    let countStakeholders = getTotalStakeholders(allStakeholders, stakeholders);
    let totalStakeholders = 0;
    allStakeholders.forEach(stakeholder => {
      if (stakeholder.numberOfPeople > 0) {
        totalStakeholders = totalStakeholders + stakeholder.numberOfPeople
      } else {
        totalStakeholders++
      }
    });
    let radius = Math.floor(10 + (100 * countStakeholders) / totalStakeholders);


    return (radius > 65) ? 65 : radius
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

  const options = {
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
          const title = labels.map(stakeholder => {
            return stakeholder.groupName ? `${stakeholder.groupName}`
              : `${stakeholder.firstName} ${stakeholder.lastName}`
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

  const datasetKeyProvider = () => {
    return Math.random();
  };

  return (
    <Grid className={classes.root}>
      <Paper className={classes.paper}>
        <Grid container direction="row" justify="center" alignItems="center">
          <Grid item xs={12}>
            <Typography color="textSecondary" variant="h4" className={classes.topHeading}>
              Stakeholder matrix
            </Typography>
          </Grid>
          <div>
            <Bubble data={matrixData} options={options} width={600} height={600} datasetKeyProvider={datasetKeyProvider}/>
          </div>
          </Grid>
      </Paper>
    </Grid>
  )
}

const StakeholderMatrixPage = withTracker(props => {
  let {match} = props;
  let {projectId} = match.params;
  Meteor.subscribe('additionalStakeholderInfo.findByProjectId', projectId);
  return {
    allInfo: AdditionalStakeholderInfo.find({projectId: projectId}).fetch(),
  };
})(withRouter(StakeholderMatrixReport));

export default withSnackbar(StakeholderMatrixPage);
