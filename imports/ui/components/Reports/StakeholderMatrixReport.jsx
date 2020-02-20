import React, {useEffect, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Grid from "@material-ui/core/Grid/Grid";
import {withRouter} from "react-router";
import {withSnackbar} from "notistack";
import {withTracker} from "meteor/react-meteor-data";
import {Peoples} from "../../../api/peoples/peoples";
import {Paper} from "@material-ui/core";
import {Projects} from "../../../api/projects/projects";
import Typography from "@material-ui/core/Typography";
import {AdditionalStakeholderInfo} from "../../../api/additionalStakeholderInfo/additionalStakeholderInfo";
import {Bubble} from "react-chartjs-2";
import 'chartjs-plugin-datalabels';
import 'chartjs-plugin-annotation';
import * as chartjs from 'chart.js';
import getTotalStakeholders from "../../../utils/getTotalStakeholders";

const useStyles = makeStyles(theme => ({
  root: {
    width: '75%',
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
    padding: '10px 24px 20px 24px',
  },
}));

function StakeholderMatrixReport(props) {
  const classes = useStyles();
  const {match, allInfo, allStakeholders} = props;
  const projectId = match.params.projectId;
  const [matrixData, setMatrixData] = useState([]);

  useEffect(() => {
    if (allStakeholders.length > 0 && allInfo) {
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
                label: arrayStakeholders.length > 0 && arrayStakeholders.map(stakeholder => {
                  return stakeholder.groupName ? stakeholder.groupName
                    : `${stakeholder.firstName} ${stakeholder.lastName}`
                }).join(', '),
                fill: true,
                lengthStakeholders: getTotalStakeholders(allStakeholders, arrayStakeholdersId),
                backgroundColor: 'rgba(0,112,192)',
                borderColor: 'rgba(0,112,192)',
                lineTension: 20,
                borderCapStyle: 'butt',
                borderDash: [],
                borderJoinStyle: 'miter',
                pointBorderColor: 'rgba(0,112,192)',
                pointBackgroundColor: '#fff',
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: 'rgba(0,112,192)',
                pointHoverBorderColor: 'rgba(0,112,192)',
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: [{x: i - 1, y: j - 1, r: getRadius(arrayStakeholdersId)}]
              };
              tempData.datasets.push(datasets);
            }
          }
        }
        setMatrixData(tempData);
      }
    }
  }, [allStakeholders, allInfo, projectId]);

  const getRadius = (stakeholders) => {
    let radius = 0;
    let countStakeholders = getTotalStakeholders(allStakeholders, stakeholders);
    if (countStakeholders <= 5) {
      radius = 10
    } else if (countStakeholders >= 6 && countStakeholders <= 15) {
      radius = 15
    } else if (countStakeholders >= 16 && countStakeholders <= 25) {
      radius = 20
    } else if (countStakeholders >= 26 && countStakeholders <= 35) {
      radius = 25
    } else if (countStakeholders >= 36 && countStakeholders <= 45) {
      radius = 30
    } else if (countStakeholders >= 46 && countStakeholders <= 55) {
      radius = 35
    } else if (countStakeholders >= 56 && countStakeholders <= 65) {
      radius = 40
    } else if (countStakeholders >= 66 && countStakeholders <= 75) {
      radius = 45
    } else if (countStakeholders > 76) {
      radius = 50
    }
    return radius
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
    legend: {
      display: false,
    },
    scales: {
      xAxes: [{
        gridLines: {
          z: 1,
        },
        scaleLabel: {
          display: true,
          labelString: 'SUPPORT',
        },
        ticks: {
          autoSkip: false,
          min: 0,
          max: 4,
          callback: function (value) {
            switch (value) {
              case 0:
                return 'LOW';
              case 1:
                return '';
              case 2:
                return 'MEDIUM';
              case 3:
                return '';
              case 4:
                return 'HIGH';
              default:
                break;
            }
          }
        },
      }],
      yAxes: [{
        gridLines: {
          z: 1,
        },
        scaleLabel: {
          display: true,
          labelString: 'INFLUENCE',
        },
        ticks: {
          min: 0,
          max: 4,
          stepSize: 1,
          callback: function (value) {
            switch (value) {
              case 0:
                return 'LOW';
              case 1:
                return '';
              case 2:
                return 'MEDIUM';
              case 3:
                return '';
              case 4:
                return 'HIGH';
              default:
                break;
            }
          }
        },
      }],
    },
    annotation: {
      drawTime: 'beforeDatasetsDraw',
      annotations: [{
        type: 'box',
        id: 'a-box-1',
        xScaleID: 'x-axis-0',
        yScaleID: 'y-axis-0',
        xMin: 0,
        xMax: 2,
        yMin: 0,
        yMax: 2,
        backgroundColor: 'rgb(169,209,142)',
      }, {
        type: 'box',
        id: 'a-box-2',
        xScaleID: 'x-axis-0',
        yScaleID: 'y-axis-0',
        xMin: 2,
        xMax: 4,
        yMin: 0,
        yMax: 2,
        backgroundColor: 'rgb(255,242,204)',
      }, {
        type: 'box',
        id: 'a-box-3',
        xScaleID: 'x-axis-0',
        yScaleID: 'y-axis-0',
        xMin: 0,
        xMax: 2,
        yMin: 2,
        yMax: 4,
        backgroundColor: 'rgb(255,203,102)',
      }, {
        type: 'box',
        id: 'a-box-4',
        xScaleID: 'x-axis-0',
        yScaleID: 'y-axis-0',
        xMin: 2,
        xMax: 4,
        yMin: 2,
        yMax: 4,
        backgroundColor: 'rgb(255,124,128)',
      }],
    },
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
          <Grid item xs={12} className={classes.gridTable}>
            <Bubble data={matrixData} options={options} />
          </Grid>
        </Grid>
      </Paper>
    </Grid>
  )
}

const StakeholderMatrixPage = withTracker(props => {
  let {match} = props;
  let {projectId} = match.params;
  Meteor.subscribe('additionalStakeholderInfo.findAll');
  Meteor.subscribe('findAllPeoples');
  Meteor.subscribe('projects.notLoggedIn');
  const project = Projects.findOne({_id: projectId});
  return {
    allStakeholders: Peoples.find({
      _id: {
        $in: project && project.stakeHolders || []
      }
    }).fetch(),
    allInfo: AdditionalStakeholderInfo.find({}).fetch(),
  };
})(withRouter(StakeholderMatrixReport));

export default withSnackbar(StakeholderMatrixPage);
