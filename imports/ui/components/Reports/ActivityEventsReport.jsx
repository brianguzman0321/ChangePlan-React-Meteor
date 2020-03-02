import React, {useEffect, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Grid from "@material-ui/core/Grid/Grid";
import {withRouter} from "react-router";
import {withSnackbar} from "notistack";
import {withTracker} from "meteor/react-meteor-data";
import {Impacts} from "../../../api/impacts/impacts";
import {Peoples} from "../../../api/peoples/peoples";
import {Paper, Table, TableBody, TableCell} from "@material-ui/core";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import {Projects} from "../../../api/projects/projects";
import Typography from "@material-ui/core/Typography";
import {Activities} from "../../../api/activities/activities";
import moment from "moment";
import {getPhase, getTotalStakeholders} from "../../../utils/utils";
import {stringHelpers} from "../../../helpers/stringHelpers";
import {SurveysStakeholders} from "../../../api/surveysStakeholders/surveysStakeholders";
import {SurveysActivityDeliverers} from "../../../api/surveysActivityDeliverers/surveysActivityDeliverers";
import AddActivities from "../Activities/Modals/AddActivities";
import {data} from "/imports/activitiesContent.json";

const useStyles = makeStyles(theme => ({
  root: {
    width: '96%',
    margin: theme.spacing(3),
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  table: {
    width: '100%',
  },
  tableCell: {
    border: '1px solid rgba(224, 224, 224, 1)',
    padding: '14px 30px 14px 30px',
  },
  tableHead: {
    border: '1px solid rgba(224, 224, 224, 1)',
    color: 'black',
    fontSize: '14px',
    letterSpacing: '0.001rem',
    whiteSpace: 'nowrap',
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
    overflowX: 'auto',
  },
}));

function ActivityEventsReport(props) {
  const classes = useStyles();
  const {
    match, allActivities, type, allStakeholders, company, allImpacts, allSurveysActivityDeliverers, allSurveysStakeholders,
    isSuperAdmin, isAdmin, isChangeManager, isManager, isActivityDeliverer, isActivityOwner
  } = props;
  const projectId = match.params.projectId;
  const [tableData, setTableData] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState({});
  const [step, setStep] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const editActivity = (activity) => {
    setSelectedActivity(activity);
    setShowModal(true);
    setStep(activity.step);
  };

  useEffect(() => {
    if (allActivities.length > 0 && allStakeholders.length > 0 ) {
      let activities = [];
      const filteredData = data.filter(_data => _data.category === type);
      filteredData.forEach(defaultActivityType => {
        const activity = allActivities.filter(_activity => _activity.type === defaultActivityType.name);
        if (activity.length > 0) {
          activities.push(...new Set(activity));
        }
      });
      if (activities.length > 0) {
        activities.map(activity => {
          const surveysActivityDeliverer = allSurveysActivityDeliverers.filter(survey => survey.activityId === activity._id);
          const surveysStakeholders = allSurveysStakeholders.filter(survey => survey.activityId === activity._id);
          activity.surveysStakeholders = surveysStakeholders.length ? 'Yes' : 'No';
          activity.surveysActivityDeliverer = surveysActivityDeliverer.length ? 'Yes' : 'No';
          return activity
        });
      }
      setTableData(activities);
    }
  }, [allStakeholders, allActivities, projectId]);

  const getImpacts = (activityId) => {
    const impacts = allImpacts.filter(impact => impact.activities.includes(activityId));
    return impacts.length || '-';
  };

  const getTitle = (type) => {
    switch (type) {
      case 'Learning/coaching':
        return 'Training events';
      case 'Communication':
        return 'Communications events';
      case 'Engagement':
        return 'Engagement events';
      default:
        break;
    }
  };

  return (
    <Grid className={classes.root}>
      <Paper className={classes.paper}>
        <Grid container direction="row" justify="center" alignItems="center">
          <Grid item xs={12}>
            <Typography color="textSecondary" variant="h4" className={classes.topHeading}>
              {getTitle(type)}
            </Typography>
          </Grid>
          <Grid item xs={12} className={classes.gridTable}>
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell size="small" className={classes.tableHead} align="center">DUE DATE</TableCell>
                  <TableCell size="small" className={classes.tableHead} align="center">ACTIVITY TYPE</TableCell>
                  <TableCell size="small" className={classes.tableHead} align="center">CHANGE PHASE</TableCell>
                  <TableCell size="small" className={classes.tableHead} align="center">STAKEHOLDERS</TableCell>
                  <TableCell size="small" className={classes.tableHead} align="center">DESCRIPTION</TableCell>
                  <TableCell size="small" className={classes.tableHead} align="center">IMPACTS MITIGATED</TableCell>
                  <TableCell size="small" className={classes.tableHead} align="center">TIME AWAY FROM BAU</TableCell>
                  <TableCell size="small" className={classes.tableHead} align="center">COST</TableCell>
                  <TableCell size="small" className={classes.tableHead} align="center">DELIVERER</TableCell>
                  <TableCell size="small" className={classes.tableHead} align="center">FEEDBACK</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tableData.map((activity, index) => {
                  return <TableRow key={index} onClick={() => editActivity(activity)}>
                    <TableCell className={classes.tableCell} align="center" padding="none"
                               key={index}>{moment(activity.dueDate).format('DD-MMM-YY')}</TableCell>
                    <TableCell size="small" className={classes.tableCell} align="center">{activity.name}</TableCell>
                    <TableCell size="small" className={classes.tableCell}
                               align="center">{getPhase(activity.step, company)}</TableCell>
                    <TableCell size="small" className={classes.tableCell}
                               align="center">{getTotalStakeholders(allStakeholders, activity.stakeHolders)}</TableCell>
                    <TableCell size="small" className={classes.tableCell}
                               align="center">{stringHelpers.limitCharacters(activity.description, 50)}</TableCell>
                    <TableCell size="small" className={classes.tableCell}
                               align="center">{getImpacts(activity._id)}</TableCell>
                    <TableCell size="small" className={classes.tableCell}
                               align="center">{activity.time || '-'}</TableCell>
                    <TableCell size="small" className={classes.tableCell}
                               align="center">{activity.cost !== 0 ? `$${activity.cost}` : '-'}</TableCell>
                    <TableCell size="small" className={classes.tableCell} align="center">
                      {activity.personResponsible ? `${activity.personResponsible.profile.firstName} ${activity.personResponsible.profile.lastName}` : ''}
                    </TableCell>
                    <TableCell size="small" className={classes.tableCell}
                               align="center">{activity.surveysStakeholders}</TableCell>
                  </TableRow>
                })}
              </TableBody>
            </Table>
          </Grid>
        </Grid>
        <AddActivities edit={showModal} activity={selectedActivity} newActivity={() => setShowModal(false)} list={true}
                       isOpen={false}
                       type={'project'} match={match} step={step} isSuperAdmin={isSuperAdmin} isAdmin={isAdmin}
                       isManager={isManager}
                       isActivityDeliverer={isActivityDeliverer} isChangeManager={isChangeManager}
                       isActivityOwner={isActivityOwner}/>
      </Paper>
    </Grid>
  )
}

const ActivityEventsReportPage = withTracker(props => {
  let {match} = props;
  let {projectId} = match.params;
  Meteor.subscribe('findAllPeoples');
  Meteor.subscribe('projects.notLoggedIn');
  const project = Projects.findOne({_id: projectId});
  Meteor.subscribe('compoundActivities', projectId);
  Meteor.subscribe('impacts.findAll');
  Meteor.subscribe('surveysActivityDeliverers');
  Meteor.subscribe('surveysStakeholders');
  return {
    allActivities: Activities.find({projectId: projectId}).fetch(),
    allImpacts: Impacts.find({}).fetch(),
    allStakeholders: Peoples.find({
      _id: {
        $in: project && project.stakeHolders || []
      }
    }).fetch(),
    allSurveysStakeholders: SurveysStakeholders.find({}).fetch(),
    allSurveysActivityDeliverers: SurveysActivityDeliverers.find({}).fetch(),
  };
})(withRouter(ActivityEventsReport));

export default withSnackbar(ActivityEventsReportPage);
