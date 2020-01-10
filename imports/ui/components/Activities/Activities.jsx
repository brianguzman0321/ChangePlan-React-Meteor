import React, {useEffect, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import TopNavBar from '/imports/ui/components/App/App'
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Button from '@material-ui/core/Button';
import ViewColumnIcon from '@material-ui/icons/ViewColumn';
import ListIcon from '@material-ui/icons/List';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import AWARENESSCard from './step1'
import Step2Card from './step2'
import Step3Card from './step3'
import ActivitiesColumn from './ActivitiesColumn';
import config from '/imports/utils/config';
import {withRouter} from 'react-router';
import {withTracker} from "meteor/react-meteor-data";
import {Activities} from '/imports/api/activities/activities'
import ListView from './ListView'
import {Templates} from "../../../api/templates/templates";
import {Projects} from "../../../api/projects/projects";
import {Companies} from "../../../api/companies/companies";

const useStyles = makeStyles({
  root: {
    // flexGrow: 1,
    // maxWidth: 400,
    // maxHeight: 200
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
    // marginBottom: 15,
    overFlow: 'hidden'
  },
  topBar: {
    marginTop: 13,
  }
});

function ActivitiesCard(props) {
  let {match, project, template, company, currentCompany} = props;
  let {projectId, templateId} = match.params;
  project = project || {};
  template = template || {};
  const classes = useStyles();
  const [type, setType] = useState(templateId && 'template' || projectId && 'project');
  const [value, setIndex] = React.useState(0);
  const [addNew, setAddNew] = React.useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isChangeManager, setIsChangeManager] = useState(false);
  const [isManager, setIsManager] = useState(false);
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
  };


  const handleChange = (event, newValue) => {
    setIndex(newValue);
  };
  let menus = config.menus;
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
              Activities
            </Typography>
          </Grid>
          <Grid item xs={3} md={2}>
            {false && <Button variant="outlined" color="primary" onClick={(e) => setAddNew(true)}>
              Add Activity
            </Button>
            }
          </Grid>
          <Grid item xs={6} md={3}>
            <Tabs
              value={value}
              onChange={handleChange}
              indicatorColor="primary"
              textColor="primary"
              aria-label="icon tabs example"
            >
              <Tab className={classes.activityTab} label={<>
                <div className={classes.iconTab}><ViewColumnIcon/>&nbsp; Board</div>
              </>}/>
              <Tab className={classes.activityTab} label={<>
                <div className={classes.iconTab}><ListIcon/>&nbsp; List</div>
              </>}/>
            </Tabs>
          </Grid>
        </Grid>
      </Grid>
      {
        value === 0 ?
          <Grid
            container
            direction="row"
            justify="space-around"
            alignItems="flex-start"
            spacing={0}
            /*style={{paddingRight: 20}}*/
          >
            {/*<Grid item xs={12} md={2}>
              <AWARENESSCard activities={type === 'project' ?
                props.activities.filter(activity => activity.step === 1) :
                props.activitiesTemplate.filter(activity => activity.step === 1)}
                             type={type} match={match}
                             template={template} isSuperAdmin={isSuperAdmin} isAdmin={isAdmin}
                             isChangeManager={isChangeManager} isManager={isManager}
                             project={project}/>
            </Grid>*/}
            <Grid item xs={12} md={5} sm={5} lg={2}>
              <ActivitiesColumn activities={type === 'project' ?
                props.activities : props.activitiesTemplate}
                                name='Awareness' step={1} color='#f1753e'
                                type={type} match={match}
                                template={template} isSuperAdmin={isSuperAdmin} isAdmin={isAdmin}
                                isChangeManager={isChangeManager} isManager={isManager}
                                project={project}/>
            </Grid>
            <Grid item xs={12} md={5} sm={5} lg={2}>
              <ActivitiesColumn activities={type === 'project' ?
                props.activities : props.activitiesTemplate}
                                name='Interest' step={4} color='#8BC34A'
                                type={type} match={match}
                                template={template} isSuperAdmin={isSuperAdmin} isAdmin={isAdmin}
                                isChangeManager={isChangeManager} isManager={isManager}
                                project={project}/>
            </Grid>
            <Grid item xs={12} md={5} sm={5} lg={2}>
              <ActivitiesColumn activities={type === 'project' ?
                props.activities : props.activitiesTemplate}
                                step={5} name='Understanding' color='#03A9F4'
                                type={type} match={match}
                                template={template} isSuperAdmin={isSuperAdmin} isAdmin={isAdmin}
                                isChangeManager={isChangeManager} isManager={isManager}
                                project={project}/>
            </Grid>
            <Grid item xs={12} md={5} sm={5} lg={2}>
              <ActivitiesColumn activities={type === 'project' ?
                props.activities : props.activitiesTemplate}
                                name='Preparedness' step={2} color='#53cbd0'
                                type={type} match={match}
                                template={template} isSuperAdmin={isSuperAdmin} isAdmin={isAdmin}
                                isChangeManager={isChangeManager} isManager={isManager}
                                project={project}/>
            </Grid>
            <Grid item xs={12} md={5} sm={5} lg={2}>
              <ActivitiesColumn activities={type === 'project' ?
                props.activities : props.activitiesTemplate}
                                step={3} name='Support' color='#bbabd2'
                                type={type} match={match}
                                template={template} isSuperAdmin={isSuperAdmin} isAdmin={isAdmin}
                                isChangeManager={isChangeManager} isManager={isManager}
                                project={project}/>
            </Grid>
            {/*<Grid item xs={12} md={2}>
              <Step2Card activities={type === 'project' ?
                props.activities.filter(activity => activity.step === 2) :
                props.activitiesTemplate.filter(activity => activity.step === 2)}
                         type={type} template={template}
                         isSuperAdmin={isSuperAdmin} isAdmin={isAdmin}
                         isChangeManager={isChangeManager} isManager={isManager}
                         project={project} match={match}/>
            </Grid>
            <Grid item xs={12} md={2}>
              <Step3Card activities={type === 'project' ?
                props.activities.filter(activity => activity.step === 3) :
                props.activitiesTemplate.filter(activity => activity.step === 3)}
                         type={type} template={template}
                         isSuperAdmin={isSuperAdmin} isAdmin={isAdmin}
                         isChangeManager={isChangeManager} isManager={isManager}
                         project={project} match={match}/>
            </Grid>*/}
          </Grid> :
          <ListView rows={type === 'project' ? props.activities : props.activitiesTemplate} addNew={addNew} type={type}
                    isSuperAdmin={isSuperAdmin} isAdmin={isAdmin}
                    isChangeManager={isChangeManager} isManager={isManager}
                    project={project} projectId={projectId} companyId={currentCompanyId}
                    template={template} match={match}/>
      }

    </div>
  )
}


const ActivitiesPage = withTracker(props => {
  let {match} = props;
  let {projectId, templateId} = match.params;
  let userId = Meteor.userId();
  let currentCompany = {};
  Meteor.subscribe('projects');
  Meteor.subscribe('templates');
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
  Meteor.subscribe('compoundActivities', projectId);
  Meteor.subscribe('compoundActivitiesTemplate', templateId);
  return {
    activities: Activities.find().fetch(),
    template: Templates.findOne({_id: templateId}),
    activitiesProject: Activities.find({projectId: projectId}).fetch(),
    activitiesTemplate: Activities.find({templateId: templateId}).fetch(),
    templates: Templates.find({}).fetch(),
    companies: Companies.find({}).fetch(),
    company,
    currentCompany,
  };
})(withRouter(ActivitiesCard));

export default ActivitiesPage