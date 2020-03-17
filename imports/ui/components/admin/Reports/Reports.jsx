import React, {useEffect, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import TopNavBar from '/imports/ui/components/App/App'
import Grid from "@material-ui/core/Grid/Grid";
import Typography from "@material-ui/core/Typography/Typography";
import {Meteor} from "meteor/meteor";
import {Activities} from "../../../../api/activities/activities";
import {withRouter} from "react-router";
import {withTracker} from "meteor/react-meteor-data";
import {Companies} from "../../../../api/companies/companies";
import {Peoples} from "../../../../api/peoples/peoples";
import {Projects} from "../../../../api/projects/projects";
import {withSnackbar} from "notistack";
import TimeAndActivitiesReport from '../../Reports/TimeAndActivitiesReport';
import AllUpcomingActivities from "./AllUpcomingActivities/AllUpcomingActivities";
import {Impacts} from "../../../../api/impacts/impacts";
import AllProjectsReport from "./ProjectReports/AllProjects";

const useStyles = makeStyles({
  root: {},
  activitiesGrid: {
    paddingRight: 20
  },
  activityTabs: {
    wrapper: {
      flexDirection: 'row',
    },
  },
  iconTab: {
    display: 'flex',
    alignItems: 'center'
  },
  activityTab: {
    border: '0.5px solid #c5c6c7',
    minWidth: 101,
    '&:selected': {
      backgroundColor: '#3f51b5',
      color: '#ffffff'
    }
  },
  searchContainer: {
    marginTop: 13,
    overflow: 'hidden'
  },
  topHeading: {
    fontSize: '1.8rem',
    fontWeight: 500,
    lineHeight: 1.5,
    letterSpacing: '-0.015em',
    color: '#465563',
    marginLeft: 24,
  },
  gridContainer: {
    overFlow: 'hidden'
  },
  topBar: {
    marginTop: 13,
  }
});

function AdminReports(props) {
  let menus = [];
  let {company, allActivities, allStakeholders, allProjects, allImpacts} = props;
  const classes = useStyles();
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isChangeManager, setIsChangeManager] = useState(false);
  const [currentStakeholders, setCurrentStakeholders] = useState([]);

  useEffect(() => {
    checkRoles();
  }, [company]);

  const checkRoles = () => {
    const userId = Meteor.userId();
    if (Roles.userIsInRole(userId, 'superAdmin')) {
      setIsSuperAdmin(true);
    }

    if (company && company.admins && company.admins.includes(userId)) {
      setIsAdmin(true);
    }

    if (company) {
      const projectsCurCompany = Projects.find({companyId: company._id}).fetch();
      if (projectsCurCompany) {
        const changeManagers = [...new Set([].concat.apply([], projectsCurCompany.map(project => project.changeManagers)))];
        if (!Roles.userIsInRole(userId, 'superAdmin') && changeManagers.includes(userId)) {
          setIsChangeManager(true);
        }
      }
    }
  };

  useEffect(() => {
    let stakeholders = [];
    if (isAdmin) {
      stakeholders = allStakeholders.filter(stakeholder => stakeholder.company === company._id);
    }
    if (isChangeManager && !isAdmin) {
      const projects = allProjects.filter(project => project.changeManagers.includes(Meteor.userId()));
      const projectStakeholders = [];
      projects.forEach(project => {
        projectStakeholders.push(...project.stakeHolders)
      });
      stakeholders = allStakeholders.filter(stakeholder => projectStakeholders.includes(stakeholder._id));
    }
    setCurrentStakeholders(stakeholders)
  }, [isAdmin, isChangeManager, allStakeholders]);

  return (
    <div>
      <TopNavBar {...props} />
      <Grid
        container
        direction="row"
        justify="space-between"
        alignItems="center"
        className={classes.gridContainer}
        spacing={0}
      >
        <Grid
          container
          className={classes.topBar}
          direction="row"
          justify="space-between"
        >
          <Grid item xs={3} md={7}>
            <Typography color="textSecondary" variant="h4" className={classes.topHeading}>
              Reports
            </Typography>
          </Grid>
        </Grid>
        <Grid container direction="row" justify="space-between">
          <TimeAndActivitiesReport match={props.match} allStakeholders={currentStakeholders}
                                   allActivities={allActivities} type={"time"}/>
        </Grid>
        <Grid container direction="row" justify="space-between">
          <TimeAndActivitiesReport match={props.match} allStakeholders={currentStakeholders}
                                   allActivities={allActivities} type={"activities"}/>
        </Grid>
        <Grid container direction="row" justify="space-between">
          <AllUpcomingActivities match={props.match} allActivities={allActivities} allProjects={allProjects} type={'upcoming'}
                                 company={company} isAdmin={isAdmin} isChangeManager={isChangeManager} allStakeholders={allStakeholders}/>
        </Grid>
        <Grid container direction="row" justify="space-between">
          <AllUpcomingActivities match={props.match} allActivities={allActivities} allProjects={allProjects} type={'overdue'}
                                 company={company} isAdmin={isAdmin} isChangeManager={isChangeManager} allStakeholders={allStakeholders}/>
        </Grid>
        <Grid container direction="row" justify="space-between">
          <AllProjectsReport allActivities={allActivities} allProjects={allProjects} allImpacts={allImpacts} allStakeholders={allStakeholders}
                                 company={company} isAdmin={isAdmin} isChangeManager={isChangeManager} {...props}/>
        </Grid>
      </Grid>
    </div>
  )
}

const AdminReportsPage = withTracker(props => {
  const userId = Meteor.userId();
  Meteor.subscribe('compoundActivities');
  Meteor.subscribe('findAllPeoples');
  Meteor.subscribe('compoundProject');
  Meteor.subscribe('companies');
  Meteor.subscribe('impacts.findAll');
  return {
    company: Companies.findOne({peoples: userId}),
    allActivities: Activities.find({}).fetch(),
    allStakeholders: Peoples.find({}).fetch(),
    allProjects: Projects.find({}).fetch(),
    allImpacts: Impacts.find({}).fetch(),
  }
})(withRouter(AdminReports));

export default withSnackbar(AdminReportsPage);
