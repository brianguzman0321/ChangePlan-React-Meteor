import React, {useEffect, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import ActivitiesColumn from './ActivitiesColumn';
import config from '/imports/utils/config';
import {withRouter} from 'react-router';
import {withTracker} from "meteor/react-meteor-data";
import {Activities} from '/imports/api/activities/activities'
import {Templates} from "../../../api/templates/templates";
import {Projects} from "../../../api/projects/projects";
import {Companies} from "../../../api/companies/companies";
import {Meteor} from "meteor/meteor";
import SideMenu from "../App/SideMenu";

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
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
  gridColumn: {
    [theme.breakpoints.only('xl')]: {
      flexBasis: '19.5%',
      maxWidth: '20%',
    },
    [theme.breakpoints.only('lg')]: {
      flexBasis: '19.5%',
      maxWidth: '20%',
    },
    [theme.breakpoints.only('md')]: {
      flexBasis: '48.8%',
      maxWidth: '49%',
    },
    [theme.breakpoints.only('sm')]: {
      flexBasis: '48%',
      maxWidth: '49%',
    },
  },
  mainContainer: {
    paddingRight: '20px',
    paddingLeft: '20px',
  },
  gridContainer: {
    // marginBottom: 15,
    overFlow: 'hidden'
  },
  topBar: {
    marginTop: 13,
  }
}));

function ActivitiesCard(props) {
  let {match, project, template, company, currentCompany, activities, activitiesTemplate} = props;
  let {projectId, templateId} = match.params;
  project = project || {};
  template = template || {};
  const classes = useStyles();
  const [type, setType] = useState(templateId && 'template' || projectId && 'project');
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isChangeManager, setIsChangeManager] = useState(false);
  const [isManager, setIsManager] = useState(false);
  const [isActivityDeliverer, setIsActivityDeliverer] = useState(false);
  const [isActivityOwner, setIsActivityOwner] = useState(false);
  const [currentCompanyId, setCompanyId] = useState(null);

  useEffect(() => {
    checkRoles();
  }, [currentCompany, company, template, project]);

  useEffect(() => {
    if (currentCompany) {
      setCompanyId(currentCompany._id);
    }
  }, [currentCompany, template, project]);

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

  let menus = config.menus;
  return (
    <div className={classes.root}>
      <SideMenu menus={menus} {...props} />
      <main className={classes.content}>
        <div className={classes.toolbar}/>
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
                Phases
              </Typography>
            </Grid>
            <Grid item xs={3} md={2}>
              {false
              }
            </Grid>
          </Grid>
        </Grid>
        <Grid
          container
          direction="row"
          justify="space-around"
          alignItems="flex-start"
          spacing={0}
          className={classes.mainContainer}
        >
          <Grid item xs={12} md={5} sm={5} lg={2} xl={2} className={classes.gridColumn}>
            <ActivitiesColumn activities={type === 'project' ?
              activities : activitiesTemplate}
                              name='Awareness' step={1} color='#f1753e'
                              type={type} match={match}
                              template={template} isSuperAdmin={isSuperAdmin} isAdmin={isAdmin}
                              isChangeManager={isChangeManager} isManager={isManager}
                              isActivityDeliverer={isActivityDeliverer}
                              isActivityOwner={isActivityOwner}
                              project={project}/>
          </Grid>
          <Grid item xs={12} md={5} sm={5} lg={2} xl={2} className={classes.gridColumn}>
            <ActivitiesColumn activities={type === 'project' ?
              activities : activitiesTemplate}
                              name='Interest' step={4} color='#8BC34A'
                              type={type} match={match}
                              template={template} isSuperAdmin={isSuperAdmin} isAdmin={isAdmin}
                              isChangeManager={isChangeManager} isManager={isManager}
                              isActivityDeliverer={isActivityDeliverer}
                              isActivityOwner={isActivityOwner}
                              project={project}/>
          </Grid>
          <Grid item xs={12} md={5} sm={5} lg={2} xl={2} className={classes.gridColumn}>
            <ActivitiesColumn activities={type === 'project' ?
              activities : activitiesTemplate}
                              step={5} name='Understanding' color='#03A9F4'
                              type={type} match={match}
                              template={template} isSuperAdmin={isSuperAdmin} isAdmin={isAdmin}
                              isChangeManager={isChangeManager} isManager={isManager}
                              isActivityDeliverer={isActivityDeliverer}
                              isActivityOwner={isActivityOwner}
                              project={project}/>
          </Grid>
          <Grid item xs={12} md={5} sm={5} lg={2} xl={2} className={classes.gridColumn}>
            <ActivitiesColumn activities={type === 'project' ?
              activities : activitiesTemplate}
                              name='Preparedness' step={2} color='#53cbd0'
                              type={type} match={match}
                              template={template} isSuperAdmin={isSuperAdmin} isAdmin={isAdmin}
                              isChangeManager={isChangeManager} isManager={isManager}
                              isActivityDeliverer={isActivityDeliverer}
                              isActivityOwner={isActivityOwner}
                              project={project}/>
          </Grid>
          <Grid item xs={12} md={5} sm={5} lg={2} xl={2} className={classes.gridColumn}>
            <ActivitiesColumn activities={type === 'project' ?
              activities : activitiesTemplate}
                              step={3} name='Support' color='#bbabd2'
                              type={type} match={match}
                              template={template} isSuperAdmin={isSuperAdmin} isAdmin={isAdmin}
                              isChangeManager={isChangeManager} isManager={isManager}
                              isActivityDeliverer={isActivityDeliverer}
                              isActivityOwner={isActivityOwner}
                              project={project}/>
          </Grid>
        </Grid>
      </main>
    </div>
  )
}


const ActivitiesPage = withTracker(props => {
  let {match} = props;
  let {projectId, templateId} = match.params;
  Meteor.subscribe('projects.notLoggedIn');
  Meteor.subscribe('templates');
  Meteor.subscribe('compoundActivities');
  Meteor.subscribe('compoundActivitiesTemplate');
  Meteor.subscribe('companies');
  let userId = Meteor.userId();
  let currentCompany = {};
  const project = Projects.findOne({_id: projectId});
  const template = Templates.findOne({_id: templateId});
  const companies = Companies.find({}).fetch();
  const company = Companies.findOne({_id: project && project.companyId || template && template.companyId});
  if (!company) {
    currentCompany = companies.find(_company => _company.peoples.includes(userId));
  } else {
    currentCompany = company;
  }
  return {
    activities: Activities.find({projectId: projectId}).fetch(),
    project: project,
    template: Templates.findOne({_id: templateId}),
    activitiesTemplate: Activities.find({templateId: templateId}).fetch(),
    templates: Templates.find({}).fetch(),
    companies: Companies.find({}).fetch(),
    company,
    currentCompany,
  };
})(withRouter(ActivitiesCard));

export default ActivitiesPage