import React, {useState, useEffect} from 'react';
import {withRouter} from 'react-router';
import {withTracker} from "meteor/react-meteor-data";
import moment from "moment";

import Tabs from '@material-ui/core/Tabs';
import Button from '@material-ui/core/Button';
import Tab from '@material-ui/core/Tab';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import ViewColumnIcon from '@material-ui/icons/ViewColumn';
import ListIcon from '@material-ui/icons/List';

import config from '/imports/utils/config';

import {Activities} from '/imports/api/activities/activities';
import {Projects} from '/imports/api/projects/projects';

//Importing DHTMLX Modules
import Gantt, {handleImportData, handleDownload} from './Gantt/index.js';
import ExportDialog from './Dialog/ExportDialog';
import ImportDialog from './Dialog/ImportDialog';
import EditProject from '/imports/ui/components/Projects/Models/EditProject';
import {useStyles, changeManagersNames} from './utils';
import {scaleTypes, colors} from './constants';
import AddActivities from "../Activities/Modals/AddActivities";
import ListView from "../Activities/ListView";
import {Templates} from "../../../api/templates/templates";
import {Companies} from "../../../api/companies/companies";
import AddEventModal from "../Events/AddEventModal";
import {ProjectEvents} from "../../../api/projectEvents/projectEvents";
import {Peoples} from "../../../api/peoples/peoples";
import {getTotalStakeholders} from "../../../utils/utils";
import SideMenu from "../App/SideMenu";
import SVGInline from "react-svg-inline";
import {svg} from "../../../utils/сonstants";
import AllUpcomingActivities from "../admin/Reports/AllUpcomingActivities/AllUpcomingActivities";


function Timeline(props) {
  let {match, projects0, activities, currentCompany, template, project, company, events, allStakeholders, activitiesTemplate, allProjects} = props;
  let {projectId, templateId} = match.params;
  const classes = useStyles();
  const [viewMode, setViewMode] = useState(1);
  const [zoomMode, setZoomMode] = useState(localStorage.getItem('zoomCondition') || 1);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [exportType, setExportType] = useState(null);
  const [extraType, setExtraType] = useState(null);
  const [edit, setEdit] = useState(false);
  const [data, setData] = useState({data: []});
  const [activityId, setActivityId] = useState(null);
  const [activity, setActivity] = useState({});
  const [eventType, setEventType] = useState(null);
  const [event, setEvent] = useState(null);
  const [currentCompanyId, setCompanyId] = useState(null);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isChangeManager, setIsChangeManager] = useState(false);
  const [isManager, setIsManager] = useState(false);
  const [isActivityDeliverer, setIsActivityDeliverer] = useState(false);
  const [showAddEventModal, setShowAddEventModal] = useState(false);


  useEffect(() => {
    checkRoles();
  }, [currentCompany, company, template, projects0]);

  useEffect(() => {
    if (currentCompany) {
      setCompanyId(currentCompany._id);
    }
  }, [currentCompany, template, projects0]);

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
        const changeManagers = [...new Set([].concat.apply([], projectsCurCompany.map(projects0 => projects0.changeManagers)))];
        if (changeManagers.includes(userId)) {
          setIsChangeManager(true);
        }
        const managers = [...new Set([].concat.apply([], projectsCurCompany.map(projects0 => projects0.managers)))];
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
      })
    }
  };

  const changeZoom = (newValue) => {
    setZoomMode(newValue);
    localStorage.setItem('zoomCondition', newValue);
  };

  useEffect(() => {

    let tempData = [];
    let i;
    const defaultSteps = ["Awareness", "Ability", "Reinforcement", "Desire", "Knowledge"];
    let startingDate = projects0 ? projects0.startingDate : new Date();
    let dueDate = projects0 ? projects0.endingDate : new Date();
    if (activities.length > 0 || events.filter(event => event.projectId === projectId).length > 0) {
      tempData.unshift({
        id: `Project_Start`,
        eventType: 'Project_Start',
        text: 'Project Start',
        start_date: moment(startingDate).format('DD-MM-YYYY'),
        duration: 1,
        color: 'grey',
        stakeholders: '',
        owner: '',
        completed: false,
        description: '',
        type: '',
      });
      if (events) {
        events.filter(_event => _event.projectId === projectId).forEach(event => {
          tempData.push({
            id: event._id,
            eventType: 'Project Event',
            text: event.name,
            start_date: moment(event.startDate).format('DD-MM-YYYY'),
            end_date: moment(event.endDate).format('DD-MM-YYYY'),
            duration: 1,
            color: 'grey',
            stakeholders: '',
            owner: '',
            completed: false,
            description: '',
            type: '',
          });
        });
      }
      tempData.push({
        id: `Project_End`,
        eventType: 'Project_End',
        text: 'Project End',
        start_date: moment(dueDate).format('DD-MM-YYYY'),
        duration: 1,
        color: 'grey',
        stakeholders: '',
        owner: '',
        completed: false,
        description: '',
        type: '',
      });
    }
    activities.forEach(activity => {
      let type = activity.type[0].toUpperCase() + activity.type.slice(1);
      if (activity.buildStartDate !== null) {
        tempData.push({
          id: activity._id + 1,
          eventType: 'Activity Event',
          text: `${type}: Design & Build`,
          start_date: moment(activity.buildStartDate).format('DD-MM-YYYY'),
          end_date: moment(activity.buildEndDate).format('DD-MM-YYYY'),
          duration: 1,
          color: colors.activity[activity.step - 1],
          stakeholders: '',
          owner: '',
          completed: false,
          description: '',
          type: activity.label || defaultSteps[activity.step - 1],
        });
      }
      if (activity.signOffDate !== null) {
        tempData.push({
          id: activity._id + 2,
          eventType: 'Activity Event',
          text: `${type}: Sign off`,
          start_date: moment(activity.signOffDate).format('DD-MM-YYYY'),
          duration: 1,
          color: colors.activity[activity.step - 1],
          stakeholders: '',
          owner: '',
          completed: false,
          description: '',
          type: activity.label || defaultSteps[activity.step - 1],
        });
      }
      if (activity.dueDateToInviteSent !== null) {
        tempData.push({
          id: activity._id + 3,
          eventType: 'Activity Event',
          text: `${type}: Invitation`,
          start_date: moment(activity.dueDateToInviteSent).format('DD-MM-YYYY'),
          duration: 1,
          color: colors.activity[activity.step - 1],
          stakeholders: '',
          owner: '',
          completed: false,
          description: '',
          type: activity.label || defaultSteps[activity.step - 1],
        });
      }
      if (activity.completed === true) {
        tempData.push({
          id: activity._id,
          eventType: activity.label || defaultSteps[activity.step - 1],
          text: type,
          start_date: moment(activity.completedAt).format("DD-MM-YYYY"),
          duration: 1,
          color: colors.activity[activity.step - 1],
          stakeholders: getTotalStakeholders(allStakeholders, activity.stakeHolders),
          owner: activity.deliverer && activity.personResponsible
            ? `${activity.personResponsible.profile.firstName} ${activity.personResponsible.profile.lastName}`
            : null,
          completed: activity.completed,
          description: activity.description,
          type: '',
        });
      } else {
        tempData.push({
          id: activity._id,
          eventType: activity.label || defaultSteps[activity.step - 1],
          text: type,
          start_date: moment(activity.dueDate).format("DD-MM-YYYY"),
          duration: 1,
          color: colors.activity[activity.step - 1],
          stakeholders: getTotalStakeholders(allStakeholders, activity.stakeHolders),
          owner: activity.deliverer && activity.personResponsible
            ? `${activity.personResponsible.profile.firstName} ${activity.personResponsible.profile.lastName}`
            : null,
          completed: activity.completed,
          description: activity.description,
          type: '',
        });
      }
    });

    if (!_.isEqual(data.data, tempData))
      setData({data: tempData});
  }, [props]);

  useEffect(() => {
    let activity = activities.find(({_id}) => _id === activityId);
    if (!activity && activityId) {
      const id = activityId.slice(0, -1);
      activity = activities.find(({_id}) => _id === id) || {};
    }
    const extraActivity = data.data.find(({id}) => id === activityId) || {};
    const projectEvents = events.filter(_event => _event.projectId === projectId);
    const projectEvent = projectEvents.find(_event => _event._id === activityId);
    setActivity(activity);
    setExtraType(extraActivity.type);
    setEventType(extraActivity && extraActivity.eventType);
    setEvent(projectEvent);
  }, [activityId, events, activities, projects0]);

  const handleModalClose = obj => {
    setEdit(obj);
  };

  const handleCloseAddEventModal = () => {
    setShowAddEventModal(false);
  };

  const changeViewMode = (value) => {
    if (value === 0) {
      props.history.push(`/projects/${projectId}/activities`);
    }
    setViewMode(value);
  };

  return (
    <div className={classes.root}>
      <SideMenu menus={config.menus} {...props} />
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
            <Grid item className={classes.flexBox}>
              <Typography color="textSecondary" variant="h4" className={classes.topHeading} display="inline">
                Timeline
              </Typography>
              <Grid item className={classes.addEventContainer}>
                <AddActivities
                  edit={false}
                  list={false}
                  isOpen={false}
                  project={projects0}
                  template={template}
                  activity={{}}
                  newActivity={() => setEdit(false)}
                  type={templateId && 'template' || projectId && 'project'}
                  match={match}
                  isSuperAdmin={isSuperAdmin}
                  isAdmin={isAdmin}
                  isChangeManager={isChangeManager}
                  isManager={isManager}
                  isActivityDeliverer={isActivityDeliverer}
                />
              </Grid>
              <Grid item className={classes.addEventContainer}>
                <Button variant="contained" onClick={() => setShowAddEventModal(true)}
                        className={classes.addEventButton}>
                  Add Project Event
                </Button>
              </Grid>
            </Grid>

            <Grid className={classes.flexBox}>
              <Grid className={classes.flexBox}>
                <Button
                  color="primary"
                  onClick={() => setIsImporting(true)}
                >
                  Import
                </Button>
                <Button
                  color="primary"
                  onClick={() => setIsExporting(true)}
                  style={{marginLeft: "20px"}}
                >
                  Export
                </Button>
                <Tabs
                  value={Number(zoomMode)}
                  onChange={(e, newValue) => changeZoom(newValue)}
                  indicatorColor="primary"
                  textColor="primary"
                  style={{
                    marginLeft: "20px",
                    background: "white",
                  }}
                >
                  {scaleTypes.map((unit, idx) =>
                    <Tab
                      key={`date-unit-tab-${idx}`}
                      className={classes.activityTab}
                      label={<div className={classes.iconTab}>&nbsp; {unit.toUpperCase()}</div>}
                    />
                  )}
                </Tabs>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Grid container direction={"row"} alignItems={"flex-end"} justify={"flex-end"}>
                <Grid item xs={11} className={classes.button}>
                  <Button onClick={() => changeViewMode(0)}
                          className={viewMode === 0 ? classes.selectedButton : classes.viewButton}>
                    <SVGInline
                      className={classes.svg}
                      svg={svg.iconPhases}/>
                    Phases
                  </Button>
                  <Button onClick={() => changeViewMode(1)}
                          className={viewMode === 1 ? classes.selectedButton : classes.viewButton}>
                    <SVGInline
                      className={classes.svg}
                      svg={svg.iconTimeline}/>
                    Timeline
                  </Button>
                  <Button onClick={() => changeViewMode(2)}
                          className={viewMode === 2 ? classes.selectedButton : classes.viewButton}>
                    <SVGInline
                      className={classes.svg}
                      svg={svg.iconList}/>
                    List
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          {viewMode === 1 &&
          <Grid container>
            <Gantt
              tasks={data}
              scaleText={scaleTypes[zoomMode]}
              setActivityId={setActivityId}
              setEdit={setEdit}
              activities={activities}
              project={projects0}
              isSuperAdmin={isSuperAdmin}
              isAdmin={isAdmin}
              isManager={isManager}
              isChangeManager={isChangeManager}
              template={template}
              event={events}
            />
            <ExportDialog
              isExporting={isExporting}
              setIsExporting={setIsExporting}
              exportType={exportType}
              setExportType={setExportType}
              handleDownload={handleDownload}
            />
            <ImportDialog
              isImporting={isImporting}
              setIsImporting={setIsImporting}
              handleImportData={handleImportData}
              currentProject={projects0}
              activities={activities}
            />

            {(eventType === "Awareness" || (eventType === 'Activity Event' && extraType === 'Awareness')) ? (
              <AddActivities
                edit={edit}
                list={true}
                isOpen={false}
                step={1}
                color={'#f1753e'}
                project={projects0}
                template={template}
                activity={activity}
                newActivity={() => setEdit(false)}
                type={templateId && 'template' || projectId && 'project'}
                match={match}
                isSuperAdmin={isSuperAdmin}
                isAdmin={isAdmin}
                isChangeManager={isChangeManager}
                isManager={isManager}
                isActivityDeliverer={isActivityDeliverer}
              />) : null}

            {(eventType === "Ability" || (eventType === 'Activity Event' && extraType === 'Ability')) ? (<AddActivities
              edit={edit}
              list={true}
              isOpen={false}
              step={2}
              color={'#53cbd0'}
              project={projects0}
              template={template}
              activity={activity}
              newActivity={() => setEdit(false)}
              type={templateId && 'template' || projectId && 'project'}
              match={match}
              isSuperAdmin={isSuperAdmin}
              isAdmin={isAdmin}
              isChangeManager={isChangeManager}
              isManager={isManager}
              isActivityDeliverer={isActivityDeliverer}
            />) : null}

            {(eventType === "Reinforcement" || (eventType === 'Activity Event' && extraType === 'Reinforcement')) ? (
              <AddActivities
                edit={edit}
                list={true}
                isOpen={false}
                step={3}
                color={'#bbabd2'}
                project={projects0}
                template={template}
                activity={activity}
                newActivity={() => setEdit(false)}
                type={templateId && 'template' || projectId && 'project'}
                match={match}
                isSuperAdmin={isSuperAdmin}
                isAdmin={isAdmin}
                isChangeManager={isChangeManager}
                isManager={isManager}
                isActivityDeliverer={isActivityDeliverer}
              />) : null}

            {(eventType === "Desire" || (eventType === 'Activity Event' && extraType === 'Desire')) ? (<AddActivities
              edit={edit}
              list={true}
              isOpen={false}
              step={4}
              color={'#8BC34A'}
              project={projects0}
              template={template}
              activity={activity}
              newActivity={() => setEdit(false)}
              type={templateId && 'template' || projectId && 'project'}
              match={match}
              isSuperAdmin={isSuperAdmin}
              isAdmin={isAdmin}
              isChangeManager={isChangeManager}
              isManager={isManager}
              isActivityDeliverer={isActivityDeliverer}
            />) : null}

            {(eventType === "Knowledge" || (eventType === 'Activity Event' && extraType === 'Knowledge')) ? (
              <AddActivities
                edit={edit}
                list={true}
                isOpen={false}
                step={5}
                color={'#03A9F4'}
                project={projects0}
                template={template}
                activity={activity}
                newActivity={() => setEdit(false)}
                type={templateId && 'template' || projectId && 'project'}
                match={match}
                isSuperAdmin={isSuperAdmin}
                isAdmin={isAdmin}
                isChangeManager={isChangeManager}
                isManager={isManager}
                isActivityDeliverer={isActivityDeliverer}
              />) : null}

            {eventType === "Project Event" &&
            <AddEventModal open={edit} event={event} handleClose={handleModalClose} isNew={false}/>}
            {(eventType === "Project_Start" || eventType === "Project_End") ? (<EditProject
              open={edit}
              handleModalClose={handleModalClose}
              project={projects0}
              template={template}
              handleType={'timeline'}
              displayEditButton={false}
              isSuperAdmin={isSuperAdmin}
              isAdmin={isAdmin}
              isManager={isManager}
              isActivityDeliverer={isActivityDeliverer}
              isChangeManager={isChangeManager}
            />) : null}

          </Grid>}
          {viewMode === 2 && <AllUpcomingActivities  match={props.match} allActivities={activities ? activities : activitiesTemplate} allProjects={allProjects.filter(project => project._id === projectId)}
                                                     type={'activities'}
                                                     company={company} isAdmin={isAdmin} isChangeManager={isChangeManager}
                                                     allStakeholders={allStakeholders}/>}
        </Grid>
        <AddEventModal open={showAddEventModal} handleClose={handleCloseAddEventModal}/>
      </main>
    </div>
  )
}

const TimelinePage = withTracker(props => {
  let {match} = props;
  let {projectId, templateId} = match.params;
  let userId = Meteor.userId();
  let currentCompany = {};
  Meteor.subscribe('projects.notLoggedIn');
  Meteor.subscribe('projectEvents.find');
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
  Meteor.subscribe('findAllPeoples');
  Meteor.subscribe('compoundActivities');
  Meteor.subscribe('compoundActivitiesTemplate');
  // Meteor.subscribe('myProjects', null, {
  //     sort: local.sort || {},
  //     name: local.search
  // });
  return {
    activities: Activities.find({projectId: projectId || templateId}).fetch(),
    template: Templates.findOne({_id: templateId}),
    projects0: Projects.findOne({_id: projectId}),
    activitiesProject: Activities.find({projectId: projectId}).fetch(),
    activitiesTemplate: Activities.find({templateId: templateId}).fetch(),
    templates: Templates.find({}).fetch(),
    companies: Companies.find({}).fetch(),
    events: ProjectEvents.find({}).fetch(),
    allProjects: Projects.find({}).fetch(),
    company,
    currentCompany,
    allStakeholders: Peoples.find({}).fetch(),
  };
})(withRouter(Timeline));

export default TimelinePage;