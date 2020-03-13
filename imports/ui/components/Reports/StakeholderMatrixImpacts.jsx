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
import {calculationLevels, getTotalStakeholders} from "../../../utils/utils";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import {optionsImpact} from '../../../utils/сonstants';

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
  tab: {
    color: '#465563',
    fontWeight: 700,
    borderRight: '0.1em solid #eaecef',
    padding: 0,
    cursor: 'pointer',
    '&:selected': {
      color: '#1890ff',
      fontWeight: theme.typography.fontWeightMedium,
    },
    whiteSpace: 'nowrap',
    minWidth: '50px',
    minHeight: '10px'
  },
  tabs: {
    minHeight: '25px',
  },
}));

function StakeholderMatrixImpacts(props) {
  const classes = useStyles();
  const {match, allInfo, allStakeholders, allImpacts, measurement} = props;
  const projectId = match.params.projectId;
  const [matrixData, setMatrixData] = useState({labels: ['LOW', 'MEDIUM', 'HIGH'], datasets: []});
  const [selectedTab, setSelectedTab] = useState(0);

  useEffect(() => {
    setMatrixData({labels: ['LOW', 'MEDIUM', 'HIGH'], datasets: []});
  }, [projectId]);

  useEffect(() => {
    if (allStakeholders.length > 0 && allInfo.length > 0) {
      let currentStakeholders = [], type = 'group';
      switch (selectedTab) {
        case 0:
          currentStakeholders = allStakeholders.filter(stakeholder => !stakeholder.firstName);
          type = 'group';
          break;
        case 1:
          currentStakeholders = allStakeholders.filter(stakeholder => stakeholder.team);
          type = 'team';
          break;
        case 2:
          currentStakeholders = allStakeholders.filter(stakeholder => stakeholder.location);
          type = 'location';
          break;
        case 3:
          currentStakeholders = allStakeholders.filter(stakeholder => stakeholder.businessUnit);
          type = 'businessUnit';
          break;
        case 4:
          currentStakeholders = allStakeholders.filter(stakeholder => !stakeholder.groupName);
          type = 'firstName';
          break;
        default:
          break;
      }
      getDataMatrix(currentStakeholders, type);
    }
  }, [allStakeholders, allInfo, selectedTab]);

  const getDataMatrix = (currentStakeholders, type) => {
      let tempData = {labels: ['LOW', 'MEDIUM', 'HIGH'], datasets: []};
      const projectInfo = allInfo.filter(info => info.projectId === projectId);
      let datasets = {};
      if (projectInfo.length > 0) {
        for (let i = 1; i <= 5; i++) {
          for (let j = 1; j <= 5; j++) {
            const currentInfo = projectInfo.filter(info => info.levelOfInfluence === i);
            let arrayStakeholders = [];
            let arrayStakeholdersId = [];
            let impactLevel = 0;
            currentInfo.forEach(info => {
              const stakeholder = currentStakeholders.find(stakeholder => stakeholder._id === info.stakeholderId);
              if (stakeholder) {
                const currentImpacts = allImpacts.filter(impact => impact.stakeholders.includes(stakeholder._id) && impact.projectId === projectId);
                if (currentImpacts.length > 0) {
                  impactLevel = calculationLevels('stakeholders', currentImpacts, true);
                }
                arrayStakeholdersId.push(stakeholder._id);
                arrayStakeholders.push(stakeholder);
              }
            });
            if (j === impactLevel) {
              datasets = {
                label: arrayStakeholders.length > 0 && arrayStakeholders,
                selectedTab: type,
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
                data: [{x: impactLevel, y: i, r: getRadius(arrayStakeholdersId)}]
              };
              tempData.datasets.push(datasets);
              tempData.datasets = [...new Set(tempData.datasets)];
            }
          }
        }
        setMatrixData(tempData);
      }
    }
  ;

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

  const datasetKeyProvider = () => {
    return Math.random();
  };

  return (
    <Grid className={classes.root}>
      <Paper className={classes.paper}>
        <Grid container direction="row" justify="center" alignItems="center">
          <Grid item xs={6}>
            <Typography color="textSecondary" variant="h4" className={classes.topHeading}>
              Stakeholder matrix: Influence/Impact
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Tabs centered value={selectedTab} variant="fullWidth"
                  onChange={(e, newValue) => setSelectedTab(newValue)} indicatorColor="primary"
                  textColor="primary" className={classes.tabs}>
              <Tab value={0} label="GROUP" className={classes.tab}/>
              <Tab value={1} label="TEAM" className={classes.tab}/>
              <Tab value={2} label="LOCATION" className={classes.tab}/>
              <Tab value={3} label="BUSINESS UNIT" className={classes.tab}/>
              <Tab value={4} label="STAKEHOLDER" className={classes.tab}/>
            </Tabs>
          </Grid>
          <div>
            <Bubble data={matrixData} options={optionsImpact} width={600} height={600}
                    datasetKeyProvider={datasetKeyProvider}/>
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
})(withRouter(StakeholderMatrixImpacts));

export default withSnackbar(StakeholderMatrixPage);
