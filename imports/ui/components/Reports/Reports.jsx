import React, {useEffect, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import TopNavBar from '/imports/ui/components/App/App'
import config from '/imports/utils/config';
import Grid from "@material-ui/core/Grid/Grid";
import Typography from "@material-ui/core/Typography/Typography";
import ImpactReport from "./ImpactReport";
import UpcomingActivitiesReport from "./UpcomingActivitiesReport";
import {Meteor} from "meteor/meteor";
import {Projects} from "../../../api/projects/projects";
import {Activities} from "../../../api/activities/activities";
import {withRouter} from "react-router";
import {withTracker} from "meteor/react-meteor-data";
import {Templates} from "../../../api/templates/templates";
import {Companies} from "../../../api/companies/companies";
import CompletedActivitiesReport from "./CompletedActivitiesReport";
import StakeholderMatrixReport from "./StakeholderMatrixReport";
import SurveyFeedback from "./SurveyFeedback";
import ActivityEventsReport from "./ActivityEventsReport";
import {Peoples} from "../../../api/peoples/peoples";
import {Impacts} from "../../../api/impacts/impacts";
import {withSnackbar} from "notistack";
import {SurveysStakeholders} from "../../../api/surveysStakeholders/surveysStakeholders";
import {SurveysActivityDeliverers} from "../../../api/surveysActivityDeliverers/surveysActivityDeliverers";
import TimeAndActivitiesReport from "./TimeAndActivitiesReport";

const useStyles = makeStyles({
  root: {
  },
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

function Reports(props) {
  let menus = config.menus;
  let {match, project, template, company, currentCompany, allActivities, allStakeholders, allImpacts, allSurveysStakeholders, allSurveysActivityDeliverers} = props;
  let {projectId} = match.params;
  const classes = useStyles();
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isChangeManager, setIsChangeManager] = useState(false);
  const [isManager, setIsManager] = useState(false);
  const [isActivityDeliverer, setIsActivityDeliverer] = useState(false);
  const [isActivityOwner, setIsActivityOwner] = useState(false);

  useEffect(() => {
    checkRoles();
  }, [currentCompany, company, template, project]);

  const checkRoles = () => {
    const userId = Meteor.userId();
    if (Roles.userIsInRole(userId, 'superAdmin')) {
      setIsSuperAdmin(true);
    }
    if (currentCompany && currentCompany.admins.includes(userId)) {
      setIsAdmin(true);
    }
    if (currentCompany) {
      const projectsCurCompany = Projects.find({companyId: currentCompany._id}).fetch();
      if (projectsCurCompany) {
        const changeManagers = [...new Set([].concat.apply([], projectsCurCompany.map(project => project.changeManagers)))];
        if (changeManagers.includes(userId)) {
          setIsChangeManager(true);
        }
      }
    }
    if (currentCompany) {
      const projectsCurCompany = Projects.find({companyId: currentCompany._id}).fetch();
      if (projectsCurCompany) {
        const managers = [...new Set([].concat.apply([], projectsCurCompany.map(project => project.managers)))];
        if (managers.includes(userId)) {
          setIsManager(true);
        }
      }
    }
    const activities = Activities.find({projectId: projectId}).fetch();
    if (activities) {
      activities.forEach(activity => {
        if (!Roles.userIsInRole(userId, 'superAdmin') && activity.deliverer && activity.deliverer.includes(Meteor.userId())) {
          setIsActivityDeliverer(true);
        }
        if (!Roles.userIsInRole(userId, 'superAdmin') && activity.owner && activity.owner.includes(Meteor.userId())) {
          setIsActivityOwner(true);
        }
      })
    }
  };

  return (
    <div>
      <TopNavBar menus={menus} {...props} />
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
          <TimeAndActivitiesReport match={props.match} allStakeholders={allStakeholders} allActivities={allActivities} type={"time"}/>
        </Grid>
        <Grid container direction="row" justify="space-between">
          <TimeAndActivitiesReport match={props.match} allStakeholders={allStakeholders} allActivities={allActivities} type={"activities"}/>
        </Grid>
        <Grid container direction="row" justify="space-between">
          <StakeholderMatrixReport match={props.match} allStakeholders={allStakeholders}/>
        </Grid>
        <Grid container direction="row" justify="space-between">
          <ImpactReport match={props.match} allStakeholders={allStakeholders} allImpacts={allImpacts}/>
        </Grid>
        <Grid container direction="row" justify="space-between">
          <UpcomingActivitiesReport match={props.match} isSuperAdmin={isSuperAdmin} isAdmin={isAdmin} type={'upcoming'} allActivities={allActivities} allImpacts={allImpacts}
                                    isChangeManager={isChangeManager} isManager={isManager} company={company} allStakeholders={allStakeholders}
                                    isActivityDeliverer={isActivityDeliverer} isActivityOwner={isActivityOwner}/>
        </Grid>
        <Grid container direction="row" justify="space-between">
          <UpcomingActivitiesReport match={props.match} isSuperAdmin={isSuperAdmin} isAdmin={isAdmin} type={'overdue'} allActivities={allActivities} allImpacts={allImpacts}
                                    isChangeManager={isChangeManager} isManager={isManager} company={company} allStakeholders={allStakeholders}
                                    isActivityDeliverer={isActivityDeliverer} isActivityOwner={isActivityOwner}/>
        </Grid>
        <Grid container direction="row" justify="space-between">
          <CompletedActivitiesReport match={props.match} isSuperAdmin={isSuperAdmin} isAdmin={isAdmin} allActivities={allActivities} allImpacts={allImpacts}
                                     allSurveysActivityDeliverers={allSurveysActivityDeliverers} allSurveysStakeholders={allSurveysStakeholders}
                                     isChangeManager={isChangeManager} isManager={isManager} company={company} allStakeholders={allStakeholders}
                                     isActivityDeliverer={isActivityDeliverer} isActivityOwner={isActivityOwner}/>
        </Grid>
        <Grid container direction="row" justify="space-between">
        <SurveyFeedback match={props.match} company={company} type={'isStakeholders'} allActivities={allActivities}
                        allStakeholders={allStakeholders} allDeliverersSurveys={allSurveysActivityDeliverers}
                        allStakeholdersSurveys={allSurveysStakeholders}/>
        </Grid>
        <Grid container direction="row" justify="space-between">
          <SurveyFeedback match={props.match} company={company} type={'isActivityDeliverers'} allActivities={allActivities}
                          allStakeholders={allStakeholders} allDeliverersSurveys={allSurveysActivityDeliverers}
                          allStakeholdersSurveys={allSurveysStakeholders}/>
        </Grid>
        <Grid container direction="row" justify="space-between">
          <ActivityEventsReport match={props.match} company={company} type={'Learning/coaching'} allStakeholders={allStakeholders} allImpacts={allImpacts}
                                allSurveysActivityDeliverers={allSurveysActivityDeliverers} allSurveysStakeholders={allSurveysStakeholders}
                                allActivities={allActivities} isSuperAdmin={isSuperAdmin} isAdmin={isAdmin} isChangeManager={isChangeManager}
                                isManager={isManager} isActivityDeliverer={isActivityDeliverer} isActivityOwner={isActivityOwner}/>
        </Grid>
        <Grid container direction="row" justify="space-between">
          <ActivityEventsReport match={props.match} company={company} type={'Communication'} allActivities={allActivities}
                                allImpacts={allImpacts} allStakeholders={allStakeholders} allSurveysActivityDeliverers={allSurveysActivityDeliverers}
                                allSurveysStakeholders={allSurveysStakeholders} isSuperAdmin={isSuperAdmin}
                                isAdmin={isAdmin} isChangeManager={isChangeManager} isManager={isManager}
                                isActivityDeliverer={isActivityDeliverer} isActivityOwner={isActivityOwner}/>
        </Grid>
        <Grid container direction="row" justify="space-between">
          <ActivityEventsReport match={props.match} company={company} type={'Engagement'} allStakeholders={allStakeholders} allImpacts={allImpacts}
                                allSurveysActivityDeliverers={allSurveysActivityDeliverers} allSurveysStakeholders={allSurveysStakeholders}
                                allActivities={allActivities} isSuperAdmin={isSuperAdmin} isAdmin={isAdmin} isChangeManager={isChangeManager}
                                isManager={isManager} isActivityDeliverer={isActivityDeliverer} isActivityOwner={isActivityOwner}/>
        </Grid>
      </Grid>
    </div>
  )
}

const ReportPage = withTracker(props => {
  let {match} = props;
  let {projectId, templateId} = match.params;
  let currentCompany = {};
  const userId = Meteor.userId();
  Meteor.subscribe('projects');
  Meteor.subscribe('templates');
  Meteor.subscribe('compoundActivities', projectId);
  Meteor.subscribe('findAllPeoples');
  Meteor.subscribe('impacts.findAll');
  Meteor.subscribe('surveysActivityDeliverers');
  Meteor.subscribe('surveysStakeholders');
  const project = Projects.findOne({_id: projectId});
  const template = Templates.findOne({_id: templateId});
  Meteor.subscribe('companies');
  const companies = Companies.find({}).fetch();
  const company = Companies.findOne({_id: project && project.companyId || template && template.companyId});
  if (!company) {
    currentCompany = companies.find(_company => _company.peoples.includes(userId));
  } else {
    currentCompany = company;
  }
  return {
    company,
    currentCompany,
    project,
    template,
    allActivities: Activities.find({projectId: projectId}).fetch(),
    allStakeholders: Peoples.find({
      _id: {
        $in: project && project.stakeHolders || []
      }
    }).fetch(),
    allImpacts: Impacts.find({}).fetch(),
    allSurveysStakeholders: SurveysStakeholders.find({}).fetch(),
    allSurveysActivityDeliverers: SurveysActivityDeliverers.find({}).fetch(),
  }
})(withRouter(Reports));

export default withSnackbar(ReportPage);
