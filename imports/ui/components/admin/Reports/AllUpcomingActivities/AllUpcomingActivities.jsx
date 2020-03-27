import React, {useEffect, useState} from "react";
import {withTracker} from "meteor/react-meteor-data";
import {withSnackbar} from 'notistack';
import {makeStyles} from '@material-ui/core/styles';
import UpcomingActivitiesList from "./UpcomingActivitiesList";
import {Impacts} from "../../../../../api/impacts/impacts";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import {Paper} from "@material-ui/core";
import moment from "moment";

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
  },
  head: {
    background: 'red'
  },
  paper: {
    width: '92vw',
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  gridTable: {
    padding: '10px 24px 20px 0px',
    overflowX: 'auto',
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
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
  tableCell: {
    whiteSpace: 'nowrap',
    color: 'white',
  }
}));

function AllUpcomingActivities(props) {
  const {allActivities, allStakeholders, allProjects, allImpacts, company, match, isChangeManager, isAdmin, type} = props;
  const [activities, setActivities] = useState([]);
  const classes = useStyles();

  useEffect(() => {
    if (allActivities && allProjects && allImpacts) {
      let currentActivities = [];
      let projects = [];
      if (isAdmin) {
        projects = allProjects.filter(project => project.companyId === company._id);
      } else if (isChangeManager && !isAdmin) {
        projects = allProjects.filter(project => project.changeManagers.includes(Meteor.userId()));
      }
      projects.forEach(project => {
        let projectActivities = [];
        let today = new Date();
        if (type === 'upcoming') {
          projectActivities = allActivities.filter(activity => activity.projectId === project._id && !activity.completed && moment(activity.dueDate).isAfter(moment(today)));
        } else if (type === 'overdue') {
          projectActivities = allActivities.filter(activity => activity.projectId === project._id && !activity.completed && moment(activity.dueDate).isBefore(moment(today)));
        } else if (type === 'activities') {
          projectActivities = allActivities.filter(activity => activity.projectId === project._id);
        }
        projectActivities.map(activity => {
          activity.project = project.name;
          activity.changeManagers = project.changeManagerDetails;
          activity.impacts = allImpacts.filter(impact => impact.activities.includes(activity._id)).length;
        });
        currentActivities.push(...projectActivities);
      });
      setActivities(currentActivities);
    }
  }, [isChangeManager, isAdmin, allActivities, allProjects, allImpacts]);

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <Grid container direction="row" justify="space-between" alignItems="center">
          <Grid item xs={12}>
            <Typography color="textSecondary" variant="h4" className={classes.topHeading}>
              {type === 'upcoming' && 'Upcoming activities'}
              {type === 'overdue' && 'Overdue Activities'}
              {type === 'activities' && ''}
            </Typography>
          </Grid>
          <Grid item xs={12} className={classes.gridTable}>
            <UpcomingActivitiesList rows={activities} classes={classes} match={match} isChangeManager={isChangeManager}
                                    isAdmin={isAdmin} company={company} allStakeholders={allStakeholders} type={type}/>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
}

const AllUpcomingActivitiesPage = withTracker(props => {
  Meteor.subscribe('impacts.findAll');
  return {
    allImpacts: Impacts.find({}).fetch(),
  }
})(AllUpcomingActivities);

export default withSnackbar(AllUpcomingActivitiesPage)