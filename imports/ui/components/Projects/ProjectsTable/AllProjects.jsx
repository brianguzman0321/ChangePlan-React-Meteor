import React, {useEffect, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Grid from "@material-ui/core/Grid/Grid";
import {Paper} from "@material-ui/core";
import {changeManagersNames, getTotalStakeholders} from "../../../../utils/utils";
import moment from "moment";
import AllProjectsList from "./AllProjectsList";
import {Meteor} from "meteor/meteor";

const useStyles = makeStyles(theme => ({
  root: {
    width: '98%',
    margin: theme.spacing(2),
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  table: {
    width: '95%',
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
    overflowX: 'auto',
  },
}));

function AllProjects(props) {
  const classes = useStyles();
  const {
    allProjects, company, allImpacts, allActivities, allStakeholders,
    isSuperAdmin, isAdmin, isChangeManager, isManager, isActivityDeliverer, isActivityOwner
  } = props;
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    if (allProjects && company) {
      let projectsFiltering = [];
      const userId = Meteor.userId();
      if (isSuperAdmin) {
        projectsFiltering = allProjects;
      }
      if (isAdmin && !isSuperAdmin) {
        projectsFiltering = allProjects.filter(project => project.companyId === company._id);
      }
      if (isChangeManager && !isAdmin && !isSuperAdmin) {
        projectsFiltering = allProjects.filter(project => project.changeManagers.includes(userId));
      }
      if (isManager && !isSuperAdmin && !isAdmin) {
        projectsFiltering = projectsFiltering.concat(allProjects.filter(project => project.managers.includes(userId)));
      }
      if (isActivityDeliverer && !isSuperAdmin && !isAdmin && !isManager && !isChangeManager) {
        const _activities = allActivities.filter(activity => activity.deliverer === userId);
        if (_activities) {
          _activities.forEach(activity => {
            const project = allProjects.filter(project => project._id === activity.projectId);
            if (project) {
              projectsFiltering.push(...new Set(project));
            }
          });
        }
      }
      if (isActivityOwner && !isSuperAdmin && !isAdmin && !isManager && !isChangeManager) {
        const _activities = allActivities.filter(activity => activity.owner === userId);
        if (_activities) {
          _activities.forEach(activity => {
            const project = allProjects.filter(project => project._id === activity.projectId);
            if (project) {
              projectsFiltering.push(...new Set(project));
            }
          });
        }
      }
      const currentProjects = getProjectData(projectsFiltering);
      setTableData(currentProjects);
    }
  }, [allProjects, company, isAdmin, isChangeManager, isSuperAdmin, isActivityDeliverer, isActivityOwner, isManager]);

  const getProjectData = (projects) => {
    return projects.map(project => {
      const newProject = {...project};
      newProject.people = getTotalStakeholders(allStakeholders, project.stakeHolders);
      newProject.impacts = getImpacts(project._id);
      newProject.activities = getActivities(project._id);
      newProject.overdue = getOverdueActivities(project._id);
      newProject.timeConsumed = getTimeConsumed(project.startingDate, project.endingDate);
      newProject.adoption = getAdoption();
      newProject.changeManagersNames = changeManagersNames(project);
      newProject.lastLogin = getLastLogin();
      return newProject
    });
  };

  const getAdoption = () => {
    const adoption = Math.random();
    return `${adoption}%`;
  };

  const getLastLogin = () => {
    const date = new Date();
    return date;
  };

  const getImpacts = (projectId) => {
    const impacts = allImpacts.filter(impact => impact.projectId === projectId).length;
    return impacts;
  };

  const getActivities = (projectId) => {
    const activities = allActivities.filter(activity => activity.projectId === projectId).length;
    const completedActivities = allActivities.filter(activity => activity.projectId === projectId && activity.completed).length;
    return activities !== 0 ? `${completedActivities}/${activities} completed` : '0';
  };

  const getOverdueActivities = (projectId) => {
    const overdueActivities = allActivities.filter(activity => activity.projectId === projectId
      && moment(activity.dueDate).isAfter(new Date()) && !activity.completed).length;
    return overdueActivities;
  };

  const getTimeConsumed = (startingDate, endingDate) => {
    let allTime = moment(endingDate).diff(moment(startingDate), 'weeks');
    const todayDate = new Date();
    let timeConsumed = moment(todayDate).diff(moment(startingDate), 'weeks');
    if (allTime < timeConsumed) {
      timeConsumed = allTime;
    }
    return `${timeConsumed}/${allTime} weeks`;
  };

  const getProjectPage = (projectId) => {
    props.history.push(`/projects/${projectId}`);
  };

  return (
    <Grid className={classes.root}>
      <Paper className={classes.paper}>
        <Grid container direction="row" justify="center" alignItems="center">
          <Grid item xs={12} className={classes.gridTable}>
            <AllProjectsList rows={tableData} isAdmin={isAdmin} isSuperAdmin={isSuperAdmin}
                             isActivityOwner={isActivityOwner}
                             getProjectPage={getProjectPage} activities={allActivities}
                             isActivityDeliver={isActivityDeliverer}
                             isChangeManager={isChangeManager} company={company} isManager={isManager}/>
          </Grid>
        </Grid>
      </Paper>
    </Grid>
  )
}

export default AllProjects;
