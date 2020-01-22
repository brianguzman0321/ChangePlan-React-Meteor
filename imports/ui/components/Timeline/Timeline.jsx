import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router';
import { withTracker } from "meteor/react-meteor-data";
import moment from "moment";

import Tabs from '@material-ui/core/Tabs';
import Button from '@material-ui/core/Button';
import Tab from '@material-ui/core/Tab';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import ViewColumnIcon from '@material-ui/icons/ViewColumn';
import ListIcon from '@material-ui/icons/List';
import PeopleOutlineIcon from '@material-ui/icons/PeopleOutline';

import config from '/imports/utils/config';

import { Activities } from '/imports/api/activities/activities';
import { Projects } from '/imports/api/projects/projects';

//Importing DHTMLX Modules
import Gantt, { handleImportData, handleDownload } from './Gantt/index.js';
import ExportDialog from './Dialog/ExportDialog';
import ImportDialog from './Dialog/ImportDialog';
import TopNavBar from '/imports/ui/components/App/App';
import AddActivity from '/imports/ui/components/Activities/Modals/AddActivity';
import AddActivity2 from '/imports/ui/components/Activities/Modals/AddActivity2';
import AddActivity3 from '/imports/ui/components/Activities/Modals/AddActivity3';
import ImpactsModal from '../DashBoard/Modals/ImpactsModal';
import BenefitsModal from '../DashBoard/Modals/BenefitsModal';
import EditProject from '/imports/ui/components/Projects/Models/EditProject';
import { useStyles, changeManagersNames } from './utils';
import { scaleTypes, colors } from './constants';
import AddActivities from "../Activities/Modals/AddActivities";
import ListView from "../Activities/ListView";
import { Templates } from "../../../api/templates/templates";
import { Companies } from "../../../api/companies/companies";


function Timeline(props) {
  let { match, projects0, activities, currentCompany, template, project, company } = props;
  let { projectId, templateId } = match.params;
  const classes = useStyles();
  const [viewMode, setViewMode] = useState(Number(localStorage.getItem(`viewMode_${projectId}_${Meteor.userId()}`)) || 0);
  // const [zoomMode, setZoomMode] = useState(localStorage.getItem(`zoomMode_${projectId}_${Meteor.userId()}`) || 1);
  const [zoomMode, setZoomMode] = useState(localStorage.getItem('zoomCondition') || 1);
  const [type, setType] = useState(templateId && 'template' || projectId && 'project');
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [exportType, setExportType] = useState(null);
  const [edit, setEdit] = useState(false);
  const [data, setData] = useState({ data: [] });
  const [activityId, setActivityId] = useState(null);
  const [activity, setActivity] = useState({});
  const [eventType, setEventType] = useState(null);
  const [impactIndex, setImpactIndex] = useState(null);
  const [impactLength, setImpactlength] = useState(null);
  const [benefitsIndex, setBenefitsIndex] = useState(null);
  const [currentCompanyId, setCompanyId] = useState(null);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isChangeManager, setIsChangeManager] = useState(false);
  const [isManager, setIsManager] = useState(false);
  
  console.error('------------', projectId);
  console.error('++++++++++++', projects0);
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
      const projectsCurCompany = Projects.find({ companyId: currentCompany._id }).fetch();
      if (projectsCurCompany) {
        const changeManagers = [...new Set([].concat.apply([], projectsCurCompany.map(project => project.changeManagers)))];
        if (changeManagers.includes(userId)) {
          setIsChangeManager(true);
        }
      }
    }
    if (currentCompany) {
      const projectsCurCompany = Projects.find({ companyId: currentCompany._id }).fetch();
      if (projectsCurCompany) {
        const managers = [...new Set([].concat.apply([], projectsCurCompany.map(project => project.managers)))];
        if (managers.includes(userId)) {
          setIsManager(true);
        }
      }
    }
  };

  const changeZoom = (newValue) => {
    setZoomMode(newValue);
    localStorage.setItem('zoomCondition', newValue);
  };

  const changeView = (event, value) => {
    setViewMode(value);
    localStorage.setItem(`viewMode_${projectId}_${Meteor.userId()}`, value);
  };

  useEffect(() => {
    setViewMode(Number(localStorage.getItem(`viewMode_${projectId}_${Meteor.userId()}`)));
  }, [projectId]);

  useEffect(() => {

    let tempData = [];
    let i;
    const defaultSteps = ["Awareness", "Ability", "Reinforcement",  "Desire", "Knowledge"];
    let startingDate = projects0 ? projects0.startingDate : new Date();
    let dueDate = projects0 ? projects0.endingDate : new Date();
    for (i = 0; i < activities.length; i++) {
      let type = activities[i].type;
      if ( activities[i].completed === true ) {
        tempData.push({
          id: activities[i]._id,
          eventType: activities[i].label || defaultSteps[activities[i].step - 1],
          text: type[0].toUpperCase() + type.slice(1),
          start_date: moment(activities[i].completedAt).format("DD-MM-YYYY"),
          duration: 1,
          color: colors.activity[activities[i].step - 1],
          stakeholders: activities[i].stakeHolders.length,
          owner: activities[i].owner && activities[i].personResponsible
            ? `${activities[i].personResponsible.profile.firstName} ${activities[i].personResponsible.profile.lastName}`
            : null,
          completed: activities[i].completed,
          description: activities[i].description,
        });
      } else {
        tempData.push({
          id: activities[i]._id,
          eventType: activities[i].label || defaultSteps[activities[i].step - 1],
          text: type[0].toUpperCase() + type.slice(1),
          start_date: moment(activities[i].dueDate).format("DD-MM-YYYY"),
          duration: 1,
          color: colors.activity[activities[i].step - 1],
          stakeholders: activities[i].stakeHolders.length,
          owner: activities[i].owner && activities[i].personResponsible
            ? `${activities[i].personResponsible.profile.firstName} ${activities[i].personResponsible.profile.lastName}`
            : null,
          completed: activities[i].completed,
          description: activities[i].description,
        });
      }
    }
    if (activities.length > 0) {
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
      });

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
      });
    }

    if (projects0) {
      setImpactlength(projects0.impacts.length);
      let owner = changeManagersNames(projects0);
      let impacts = projects0 ? projects0.impacts : [];
      for (i = 0; i < impacts.length; i++) {
        tempData.push({
          id: `impacts #${i}`,
          eventType: 'Impact',
          text: `Impact: ${impacts[i].type}`,
          start_date: moment(impacts[i].expectedDate).format("DD-MM-YYYY"),
          duration: 1,
          color: colors.impact,
          stakeholders: impacts[i].stakeholders.length,
          owner,
          description: impacts[i].description,
        })
      }
      let benefits = projects0 ? projects0.benefits : [];
      for (i = 0; i < benefits.length; i++) {
        tempData.push({
          id: `benefits #${i}`,
          eventType: 'Benefit',
          text: 'Stakeholder benefit',
          start_date: moment(benefits[i].expectedDate).format("DD-MM-YYYY"),
          duration: 1,
          color: colors.benefit,
          stakeholders: benefits[i].stakeholders.length,
          owner,
          description: benefits[i].description,
        })
      }
    }
    if (!_.isEqual(data.data, tempData))
      setData({ data: tempData });
  }, [props]);

  useEffect(() => {
    const activity = activities.find(({ _id }) => _id === activityId) || {};
    const extraActivity = data.data.find(({ id }) => id === activityId) || {};
    const impactindex = (activities.length > 0) ? data.data.indexOf(extraActivity) - activities.length - 2 : data.data.indexOf(extraActivity) ;
    const benefitsindex = (activities.length > 0) ? data.data.indexOf(extraActivity) - activities.length - impactLength - 2 : data.data.indexOf(extraActivity) - impactLength;
    setActivity(activity);
    setEventType(extraActivity.eventType);
    setImpactIndex(impactindex);
    setBenefitsIndex(benefitsindex);
  }, [activityId]);
  const handleModalClose = obj => {
    setEdit(obj);
  };

  return (
    <div>
      <TopNavBar menus={config.menus} {...props} />
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
            <Tabs
              value={viewMode}
              onChange={changeView}
              indicatorColor="primary"
              textColor="primary"
              aria-label="icon tabs example"
              style={{ background: "white" }}
            >
              <Tab className={classes.activityTab}
                label={<div className={classes.iconTab}><ViewColumnIcon />&nbsp; Gantt</div>} />
              <Tab className={classes.activityTab}
                label={<div className={classes.iconTab}><ListIcon />&nbsp; List</div>} />
            </Tabs>
          </Grid>
          {viewMode === 0 &&
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
                style={{ marginLeft: "20px" }}
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
          }
        </Grid>
        {viewMode === 0 &&
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
            {/* {(isAdmin && template && (template.companyId === companyId)) || isSuperAdmin ? */} 
            
            {((eventType === "Awareness") && ((isAdmin && template && ( template.companyId === companyID )) || isSuperAdmin)) ? (<AddActivities
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
            />) : null}

            {((eventType === "Ability") && ((isAdmin && template && ( template.companyId === companyID )) || isSuperAdmin)) ? (<AddActivities
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
            />) : null}

            {((eventType === "Reinforcement") && ((isAdmin && template && ( template.companyId === companyID )) || isSuperAdmin)) ? (<AddActivities
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
            />) : null}

            {((eventType === "Desire") && ((isAdmin && template && ( template.companyId === companyID )) || isSuperAdmin)) ? (<AddActivities
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
            />) : null}

            {((eventType === "Knowledge") && ((isAdmin && template && ( template.companyId === companyID )) || isSuperAdmin)) ? (<AddActivities
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
            />) : null}

            {((eventType === "Impact") && ((isAdmin && template && ( template.companyId === companyID )) || isSuperAdmin)) ? (<ImpactsModal
              open={edit}
              handleModalClose={handleModalClose}
              project={projects0}
              template={template}
              indexImpact={impactIndex}
              match={match}
              handleType={'timeline'}
              editValue={projects0.impacts[impactIndex]}
              currentType={projectId && 'project' || templateId && 'template'}
            />) : null}

            {((eventType === "Benefit") && ((isAdmin && template && ( template.companyId === companyID )) || isSuperAdmin)) ? (<BenefitsModal
              open={edit}
              handleModalClose={handleModalClose}
              project={projects0}
              indexBenefits={benefitsIndex}
              template={template}
              match={match}
              handleType={'timeline'}
              editValue={projects0.benefits[benefitsIndex]}
              currentType={projectId && 'project' || templateId && 'template'}
            />) : null}
            {((eventType === "Project_Start") && ((isAdmin && template && ( template.companyId === companyID )) || isSuperAdmin)) || ((eventType === "Project_End") && ((isAdmin && template && ( template.companyId === companyID )) || isSuperAdmin)) ? (<EditProject
              open={edit}
              handleModalClose={handleModalClose}
              project={projects0}
              template={template}
              handleType={'timeline'}
              displayEditButton={false}
            />) : null}

          </Grid> }
        {viewMode === 1 &&
          <ListView rows={type === 'project' ? props.activities : props.activitiesTemplate} addNew={false} type={type}
            isSuperAdmin={isSuperAdmin} isAdmin={isAdmin}
            isChangeManager={isChangeManager} isManager={isManager}
            project={project} projectId={projectId} companyId={currentCompanyId}
            template={template} match={match} />
        }
      </Grid>
    </div>
  )
}

const TimelinePage = withTracker(props => {
  let { match } = props;
  let { projectId, templateId } = match.params;
  let userId = Meteor.userId();
  let currentCompany = {};
  Meteor.subscribe('projects');
  Meteor.subscribe('templates');
  const project = Projects.findOne({ _id: projectId });
  const template = Templates.findOne({ _id: templateId });
  Meteor.subscribe('companies');
  const companies = Companies.find({}).fetch();
  const company = Companies.findOne({ _id: project && project.companyId || template && template.companyId });
  if (!company) {
    currentCompany = companies.find(_company => _company.peoples.includes(userId));
  } else {
    currentCompany = company;
  }
  Meteor.subscribe('compoundActivities', projectId);
  Meteor.subscribe('compoundActivitiesTemplate', templateId);
  // Meteor.subscribe('myProjects', null, {
  //     sort: local.sort || {},
  //     name: local.search
  // });
  return {
    activities: Activities.find({ projectId: projectId || templateId }).fetch(),
    template: Templates.findOne({ _id: templateId }),
    projects0: Projects.findOne({_id: projectId}),
    activitiesProject: Activities.find({ projectId: projectId }).fetch(),
    activitiesTemplate: Activities.find({ templateId: templateId }).fetch(),
    templates: Templates.find({}).fetch(),
    companies: Companies.find({}).fetch(),
    company,
    currentCompany,
  };
})(withRouter(Timeline));

export default TimelinePage;