import React, {useEffect, useState} from "react";
import TopNavBar from '/imports/ui/components/App/App';
import Grid from "@material-ui/core/Grid/Grid";
import Typography from "@material-ui/core/Typography/Typography";
import Button from "@material-ui/core/Button/Button";
import {makeStyles} from "@material-ui/core";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import {withTracker} from "meteor/react-meteor-data";
import {Projects} from "../../../api/projects/projects";
import {withRouter} from 'react-router';
import moment from 'moment';
import LinearProgress from '@material-ui/core/LinearProgress';
import Divider from '@material-ui/core/Divider';
import Icon from '@material-ui/core/Icon';
import VisionModal from './Modals/VisionModal';
import ObjectiveModal from './Modals/ObjectiveModal';
import RisksModal from './Modals/RisksModal';
import DeleteValue from './Modals/deleteModal';
import config from '/imports/utils/config';
import {stringHelpers} from '/imports/helpers/stringHelpers';
import EditProject from "/imports/ui/components/Projects/Models/EditProject";
import {Companies} from "../../../api/companies/companies";
import {Peoples} from "../../../api/peoples/peoples";
import BenefitsModal from "./Modals/BenefitsModal";
import {Templates} from "../../../api/templates/templates";
import {withSnackbar} from "notistack";
import ChangeTemplate from "./Modals/ChangeTemplate";
import {Activities} from "../../../api/activities/activities";
import {Meteor} from "meteor/meteor";
import {getTotalStakeholders} from '/imports/utils/utils';
import {changeManagersNames} from "../../../utils/utils";
import Chip from "@material-ui/core/Chip";


const useStyles = makeStyles({
  root: {
    // flexGrow: 1,
    // maxWidth: 400,
    // maxHeight: 200
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
  detailValues: {
    color: '#465563',
    marginTop: 9,
    marginBottom: 9,
    marginLeft: 5
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
  displayHeading: {
    color: '#465563',
    fontSize: 22
  },
  gridContainer: {
    // marginBottom: 15,
    overFlow: 'hidden'
  },
  topBar: {
    marginTop: 13,
  },
  firstRowCard: {
    margin: 12
  },
  initialRow: {
    marginTop: 12,
    marginLeft: 29,
    marginRight: 29
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  firstRow: {
    margin: 12
  },
  projectName: {
    textTransform: "uppercase",
    "fontSize": "1.5rem",
    "fontWeight": "500",
    "letterSpacing": "0em"
  },
  columnsHeadings: {
    fontSize: '0.75rem',
    fontWeight: 500,
    color: '#465563',
    marginTop: 9,
    marginBottom: 9,
    marginLeft: 5
  },
  helpTipText: {
    color: '#bebebe',
    fontSize: 16
  },
  active: {
    backgroundColor: 'orange',
    color: 'white',
    marginBottom: '5px',
  },
  onHold: {
    backgroundColor: 'lightblue',
    color: 'darkslategrey',
    marginBottom: '5px',
  },
  canceled: {
    backgroundColor: 'grey',
    color: 'white',
    marginBottom: '5px',
  },
  completed: {
    backgroundColor: 'limegreen',
    color: 'white',
    marginBottom: '5px',
  },
});

function Dashboard(props) {
  let {match, project: currentProject, template: currentTemplate, currentCompany, companies, company, allStakeholders} = props;
  let {projectId, templateId} = match.params;
  const classes = useStyles();
  let {params} = props.match;
  const [project, setProject] = useState({});
  const [template, setTemplate] = useState({});
  const [index, setIndex] = React.useState('');
  const [type, setType] = useState(projectId && 'project' || templateId && 'template');
  const [benefitsIndex, setBenefitsIndex] = React.useState('');
  const [editValue, setEditValue] = React.useState('');
  const [deleteValue, setDeleteValue] = React.useState('');
  const [vision, setVision] = React.useState(project.vision || template.vision || []);
  const [objectives, setObjective] = React.useState(project.objectives || template.objectives || []);
  const [risks, setRisks] = React.useState(project.risks || template.risks || []);
  const [benefits, setBenefits] = React.useState([]);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isChangeManager, setIsChangeManager] = useState(false);
  const [isActivityOwner, setIsActivityOwner] = useState(false);
  const [isActivityDeliverer, setIsActivityDeliverer] = useState(false);
  const [currentCompanyId, setCompanyId] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isManager, setIsManager] = useState(false);
  const [modals, setModals] = React.useState({
    vision: false,
    delete: false,
    objectives: false,
    impacts: false,
    benefits: false,
    risks: false,
  });
  let menus = config.menus;
  if (!(params.projectId || params.templateId)) {
    menus = []
  }

  const allowedValues = ['vision', 'delete', 'objectives', 'impacts', 'benefits', 'risks', 'edit'];


  const handleClose = (value) => {
    if (modals.edit) {
      return false
    }
    if (allowedValues.includes(value)) {
      let obj = {
        [value]: !modals[value]
      };
      setModals({modals, ...obj})
    }
  };

  const editVision = (index, value) => {
    if ((isAdmin && template.companyId !== '' || isSuperAdmin) || (type === 'project' && (project && (isAdmin || isChangeManager)))) {
      setIndex(index);
      setEditValue(value);
      handleClose('vision');
    }
  };

  const editObjectives = (index, value) => {
    if ((isAdmin && template.companyId !== '' || isSuperAdmin) || (type === 'project' && (project && (isAdmin || isChangeManager)))) {
      setIndex(index);
      setEditValue(value);
      handleClose('objectives');
    }
  };

  const editBenefits = (index, value) => {
    if ((isAdmin && template.companyId !== '' || isSuperAdmin) || (type === 'project' && (project && (isAdmin || isChangeManager)))) {
      setBenefitsIndex(index);
      setEditValue(value);
      handleClose('benefits');
    }
  };

  const editRisks = (index, value) => {
    if ((isAdmin && template.companyId !== '' || isSuperAdmin) || (type === 'project' && (project && (isAdmin || isChangeManager)))) {
      setIndex(index);
      setEditValue(value);
      handleClose('risks');
    }
  };

  const deleteEntity = (index, value) => {
    if ((isAdmin && template.companyId !== '' || isSuperAdmin) || (type === 'project' && (project && (isAdmin || isChangeManager)))) {
      setIndex(index);
      setDeleteValue(value);
      handleClose('delete')
    }
  };

  const handleModalClose = obj => {
    setModals({modals, ...obj});
    setIndex('');
    setBenefitsIndex('');
    setEditValue('');
  };

  const updateValues = project => {
    if (project && project.vision) {
      setVision(project.vision)
    }
    if (project && project.objectives) {
      setObjective(project.objectives)
    }
    if (project && project.benefits) {
      setBenefits(project.benefits)
    }
    if (project && project.risks) {
      setRisks(project.risks)
    }
  };

  const checkRoles = () => {
    const userId = Meteor.userId();
    if (Roles.userIsInRole(userId, 'superAdmin')) {
      setIsSuperAdmin(true);
    }
    if (currentCompany && currentCompany.admins && currentCompany.admins.includes(userId)) {
      setIsAdmin(true);
      if (!Roles.userIsInRole(userId, 'superAdmin') && template && template.companyId === '') {
        setIsOpen(true);
      }
    }
    if (currentCompany) {
      const projectsCurCompany = Projects.find({companyId: currentCompany._id}).fetch();
      if (projectsCurCompany) {
        const changeManagers = [...new Set([].concat.apply([], projectsCurCompany.map(project => project.changeManagers)))];
        if (changeManagers.includes(userId)) {
          setIsChangeManager(true);
          if (!Roles.userIsInRole(userId, 'superAdmin') && projectId === undefined) {
            setIsOpen(true);
          }
        }
        const managers = [...new Set([].concat.apply([], projectsCurCompany.map(project => project.managers)))];
        if (!Roles.userIsInRole(userId, 'superAdmin') && managers.includes(userId)) {
          setIsManager(true);
        }
      }
    }
    if (project) {
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
    }
  };

  useEffect(() => {
    checkRoles();
  }, [currentCompany, company, template, project]);

  useEffect(() => {
    if (currentCompany) {
      setCompanyId(currentCompany._id);
    }
  }, [currentCompany, template, project]);

  useEffect(() => {
    if (currentProject) {
      setProject(currentProject);
      updateValues(currentProject)
    } else if (currentTemplate) {
      setTemplate(currentTemplate);
      updateValues(currentTemplate)
    }
  }, [currentProject, currentTemplate]);

  const handleOpenChangeTemplateModal = () => {
    setIsOpen(false);
  };

  const getClass = (status) => {
    return status !== 'on-hold' ? classes[status] : classes.onHold;
  };

  return (
    <div>
      <VisionModal open={modals.vision} handleModalClose={handleModalClose} project={project} index={index}
                   template={template}
                   editValue={editValue} currentType={type}/>
      <ObjectiveModal open={modals.objectives} handleModalClose={handleModalClose} project={project} index={index}
                      template={template}
                      editValue={editValue} currentType={type}/>
      <RisksModal open={modals.risks} handleModalClose={handleModalClose} project={project} index={index}
                  template={template}
                  editValue={editValue} currentType={type}/>
      <BenefitsModal open={modals.benefits} handleModalClose={handleModalClose} project={project}
                     indexBenefits={benefitsIndex} template={template} match={match}
                     editValue={editValue} currentType={type}/>
      <DeleteValue open={modals.delete} handleModalClose={handleModalClose} project={project} index={index}
                   template={template}
                   deleteValue={deleteValue} type={type}/>
      <ChangeTemplate closeModalDialog={handleOpenChangeTemplateModal} showModalDialog={isOpen}/>

      <TopNavBar menus={menus} {...props} />
      <Grid
        container
        direction="row"
        justify="space-between"
        alignItems="center"
        className={classes.gridContainer}
        spacing={0}
      >
      </Grid>
      <Grid
        container
        className={classes.topBar}
        direction="row"
        justify="space-between"
      >
        <Grid item xs={12}>
          <Typography color="textSecondary" variant="h4" className={classes.topHeading}>
            Project
          </Typography>
        </Grid>
        <Grid
          container
          direction="row"
          justify="space-between"
          alignItems="center"
          className={classes.initialRow}
        >
          <Grid item xs={6}>
            <Typography variant="h4" className={classes.projectName}>
              {type === 'project' ? project && project.name : template && template.name}
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              {type === 'project' && project.status &&
              <Chip label={project.status[0].toUpperCase() + project.status.slice(1)}
                    className={getClass(project.status)}/>}
            </Typography>
            {type === 'project' && <Grid>
              <Typography gutterBottom style={{marginTop: 5}}>
                <b>Start date:</b> {moment(project.startingDate).format('DD-MMM-YY')}
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <b>Due date:</b> {moment(project.endingDate).format('DD-MMM-YY')}
              </Typography>
            </Grid>
            }
          </Grid>
          {type === 'project' && project &&
          <Grid item xs={4} style={{paddingLeft: 39}}>
            <Typography gutterBottom>
              <b>{project.changeManagers && project.changeManagers.length > 1 ? "Change managers" : "Change manager"}:</b>
              &nbsp;&nbsp;&nbsp;&nbsp;
              {changeManagersNames(project) || '-'}
            </Typography>
            <Typography gutterBottom>
              <b>{project.managers && project.managers.length > 1 ? "Managers" : "Manager"}:</b>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              {ManagersNames(project)}
            </Typography>
            {company && company.organizationField && <Typography gutterBottom>
              <b>Organization:</b>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              {project.organization ? project.organization : '-'}
            </Typography>}
            {company && company.functionField && <Typography gutterBottom>
              <b>Function:</b>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              {project.function ? project.function : '-'}
            </Typography>}
          </Grid>
          }
          {(type === 'project' && (project && (isSuperAdmin || isAdmin || isChangeManager))) &&
          <Grid item xs={2} onClick={handleClose.bind(null, 'edit')}>
            <EditProject open={modals.edit} handleModalClose={handleModalClose} project={project} template={template}
                         isSuperAdmin={isSuperAdmin} isAdmin={isAdmin} isChangeManager={isChangeManager}
                         isManger={isManager} isActivityOwner={isActivityOwner}
                         isActivityDeliverer={isActivityDeliverer}
                         displayEditButton={true}/>
          </Grid>
          }

        </Grid>
        <Grid
          container
          direction="row"
          justify="space-between"
          alignItems="center"
          className={classes.firstRow}
          spacing={0}
        >
          <Grid item xs={12}>
            <Card className={classes.firstRowCard} style={{background: '#f5f5f5'}}>
              <LinearProgress variant="determinate" color="primary" value={100}/>
              <CardContent>
                <Typography className={classes.displayHeading} style={{marginBottom: 15}}>
                  {type === 'project' ? 'PROJECT ' : 'TEMPLATE '}INFORMATION
                </Typography>
                <Card>
                  <CardContent>
                    <Typography className={classes.displayHeading} gutterBottom>
                      Vision &nbsp;&nbsp;
                      <Icon color="disabled" fontSize="small" style={{verticalAlign: 'middle', marginBottom: 4}}>
                        help
                      </Icon>
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      <span className={classes.helpTipText}>What is the big picture vision for this project and how it will benefit the organisation?</span>
                    </Typography>
                    <Divider/>
                    {vision.map((v, i) => {
                      return <><Grid key={i}
                                     container
                                     direction="row"
                                     justify="flex-end"
                                     alignItems="center"
                      >
                        <Grid item xs={10} onClick={(e) => {
                          editVision(i, v)
                        }}>
                          <Typography className={classes.detailValues} gutterBottom>
                            {stringHelpers.limitCharacters(v, 112)}
                          </Typography>
                        </Grid>
                        {((isAdmin && template && (template.companyId === currentCompany._id)) || isSuperAdmin || type === 'project' && (project && (isAdmin || isChangeManager))) ?
                          <Grid item xs={2} justify="flex-end" style={{display: 'flex'}}>
                            <Icon fontSize="small" style={{marginRight: 12, cursor: 'pointer'}} onClick={(e) => {
                              editVision(i, v)
                            }}>
                              edit
                            </Icon>
                            <Icon fontSize="small" style={{marginRight: 6, cursor: 'pointer'}} onClick={(e) => {
                              deleteEntity(i, 'vision')
                            }}>
                              delete
                            </Icon>
                          </Grid> : <Grid item xs={2} justify="flex-end" style={{display: 'flex'}}></Grid>}
                      </Grid>
                        <Divider/>
                      </>

                    })}

                    <Divider/>
                    {((isAdmin && template && (template.companyId === currentCompany._id)) || isSuperAdmin || type === 'project' && (project && (isAdmin || isChangeManager))) ?
                      <Button align="right" color="primary" variant="contained" fullWidth={true} style={{marginTop: 7}}
                              onClick={handleClose.bind(null, 'vision')}>
                        Add
                      </Button> : ''}
                  </CardContent>
                </Card>
                <br/>
                <Card>
                  <CardContent>
                    <Typography className={classes.displayHeading} gutterBottom>
                      Objectives &nbsp;&nbsp;
                      <Icon color="disabled" fontSize="small" style={{verticalAlign: 'middle', marginBottom: 4}}>
                        help
                      </Icon>
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      <span className={classes.helpTipText}>What are we trying to achieve?</span>
                    </Typography>
                    <Divider/>

                    {objectives.map((v, i) => {
                      return <><Grid key={i}
                                     container
                                     direction="row"
                                     justify="flex-end"
                                     alignItems="center"
                      >
                        <Grid item xs={10} onClick={(e) => {
                          editObjectives(i, v)
                        }}>
                          <Typography className={classes.detailValues} gutterBottom>
                            {stringHelpers.limitCharacters(v, 112)}
                          </Typography>
                        </Grid>
                        {((isAdmin && template && (template.companyId === currentCompany._id)) || isSuperAdmin || type === 'project' && (project && (isAdmin || isChangeManager))) ?
                          <Grid item xs={2} justify="flex-end" style={{display: 'flex'}}>
                            <Icon fontSize="small" style={{marginRight: 12, cursor: 'pointer'}} onClick={(e) => {
                              editObjectives(i, v)
                            }}>
                              edit
                            </Icon>
                            <Icon fontSize="small" style={{marginRight: 6, cursor: 'pointer'}} onClick={(e) => {
                              deleteEntity(i, 'objectives')
                            }}>
                              delete
                            </Icon>
                          </Grid> : <Grid item xs={2} justify="flex-end" style={{display: 'flex'}}></Grid>}
                      </Grid>
                        <Divider/>
                      </>

                    })}

                    <Divider/>
                    {((isAdmin && template && (template.companyId === currentCompany._id)) || isSuperAdmin || type === 'project' && (project && (isAdmin || isChangeManager))) ?
                      <Button align="right" color="primary" variant="contained" fullWidth={true} style={{marginTop: 7}}
                              onClick={handleClose.bind(null, 'objectives')}>
                        Add
                      </Button> : ''}

                  </CardContent>
                </Card>
                <br/>
                <Card>
                  <CardContent>
                    <Typography className={classes.displayHeading} gutterBottom>
                      Change management risks &nbsp;&nbsp;
                      <Icon color="disabled" fontSize="small" style={{verticalAlign: 'middle', marginBottom: 4}}>
                        help
                      </Icon>
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      <span className={classes.helpTipText}>List risks associated with the change that could effect the projects's success?</span>
                    </Typography>
                    <Divider/>
                    <Grid
                      container
                      direction="row"
                      justify="flex-end"
                      alignItems="center"
                    >
                      <Grid item xs={9}>
                        <Typography className={classes.columnsHeadings} gutterBottom style={{fontWeight: 'bold'}}>
                          DESCRIPTION
                        </Typography>

                      </Grid>
                      <Grid item xs={1}>
                        <Typography className={classes.columnsHeadings} gutterBottom style={{fontWeight: 'bold'}}>
                          LEVEL
                        </Typography>
                      </Grid>
                      <Grid item xs={2} justify="flex-end" style={{display: 'flex'}}>

                      </Grid>
                    </Grid>
                    <Divider/>
                    {risks.map((v, i) => {
                      return <><Grid key={i}
                                     container
                                     direction="row"
                                     justify="flex-end"
                                     alignItems="center"
                      >
                        <Grid item xs={9} onClick={(e) => {
                          editRisks(i, v)
                        }}>
                          <Typography className={classes.detailValues} gutterBottom>
                            {stringHelpers.limitCharacters(v.description, 92)}
                          </Typography>
                        </Grid>
                        <Grid item xs={1} onClick={(e) => {
                          editRisks(i, v)
                        }}>
                          {v.level.toUpperCase()}
                        </Grid>
                        {((isAdmin && template && (template.companyId === currentCompany._id)) || isSuperAdmin || type === 'project' && (project && (isAdmin || isChangeManager))) ?
                          <Grid item xs={2} justify="flex-end" style={{display: 'flex'}}>
                            <Icon fontSize="small" style={{marginRight: 12, cursor: 'pointer'}} onClick={(e) => {
                              editRisks(i, v)
                            }}>
                              edit
                            </Icon>
                            <Icon fontSize="small" style={{marginRight: 6, cursor: 'pointer'}} onClick={(e) => {
                              deleteEntity(i, 'risks')
                            }}>
                              delete
                            </Icon>
                          </Grid>
                          : <Grid item xs={2} justify="flex-end" style={{display: 'flex'}}></Grid>}
                      </Grid>
                        <Divider/>
                      </>

                    })}

                    <Divider/>
                    {((isAdmin && template && (template.companyId === currentCompany._id)) || isSuperAdmin || type === 'project' && (project && (isAdmin || isChangeManager))) ?
                      <Button align="right" color="primary" variant="contained" fullWidth={true} style={{marginTop: 7}}
                              onClick={handleClose.bind(null, 'risks')}>
                        Add
                      </Button> : ''}
                  </CardContent>
                </Card>
                <br/>
                <Card>
                  <CardContent>
                    <Typography className={classes.displayHeading} gutterBottom>
                      Benefits &nbsp;&nbsp;
                      <Icon color="disabled" fontSize="small" style={{verticalAlign: 'middle', marginBottom: 4}}>
                        help
                      </Icon>
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      <span className={classes.helpTipText}>List the project's benefit?</span>
                    </Typography>
                    <Divider/>
                    <Grid
                      container
                      direction="row"
                      justify="flex-end"
                      alignItems="center"
                    >
                      <Grid item xs={8}>
                        <Typography className={classes.columnsHeadings} gutterBottom style={{fontWeight: 'bold'}}>
                          DESCRIPTION
                        </Typography>

                      </Grid>
                      <Grid item xs={2}>
                        <Typography className={classes.columnsHeadings} gutterBottom style={{fontWeight: 'bold'}}>
                          STAKEHOLDERS
                        </Typography>
                      </Grid>
                      <Grid item xs={2} justify="flex-end" style={{display: 'flex'}}>

                      </Grid>
                    </Grid>
                    <Divider/>
                    {benefits.map((v, i) => {
                      return <><Grid key={i}
                                     container
                                     direction="row"
                                     justify="flex-end"
                                     alignItems="center"
                      >
                        <Grid item xs={8} onClick={(e) => {
                          editBenefits(i, v)
                        }}>
                          <Typography className={classes.detailValues} gutterBottom>
                            {stringHelpers.limitCharacters(v.description, 92)}
                          </Typography>
                        </Grid>
                        <Grid item xs={2} onClick={(e) => {
                          editBenefits(i, v)
                        }}>
                          {getTotalStakeholders(allStakeholders, v.stakeholders)}
                        </Grid>
                        {((isAdmin && template && (template.companyId === currentCompany._id)) || isSuperAdmin || type === 'project' && (project && (isAdmin || isChangeManager))) ?
                          <Grid item xs={2} justify="flex-end" style={{display: 'flex'}}>
                            <Icon fontSize="small" style={{marginRight: 12, cursor: 'pointer'}} onClick={(e) => {
                              editBenefits(i, v)
                            }}>
                              edit
                            </Icon>
                            <Icon fontSize="small" style={{marginRight: 6, cursor: 'pointer'}} onClick={(e) => {
                              deleteEntity(i, 'benefits')
                            }}>
                              delete
                            </Icon>
                          </Grid> : <Grid item xs={2} justify="flex-end" style={{display: 'flex'}}></Grid>}
                      </Grid>
                        <Divider/>
                      </>

                    })}

                    <Divider/>
                    {((isAdmin && template && (template.companyId === currentCompany._id)) || isSuperAdmin || type === 'project' && (project && (isAdmin || isChangeManager))) ?
                      <Button align="right" color="primary" variant="contained" fullWidth={true} style={{marginTop: 7}}
                              onClick={handleClose.bind(null, 'benefits')}>
                        Add
                      </Button> : null}
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Grid>

    </div>
  )
}

function ManagersNames(project) {
  if (project.managerDetails) {
    let managers = project.managerDetails.map(manager => {
      return `${manager.profile.firstName} ${manager.profile.lastName}`
    });
    if (managers.length) {
      return managers.join(", ")
    } else {
      return "-"
    }
  }
}

const DashboardPage = withTracker(props => {
  let {match} = props;
  let {projectId, templateId} = match.params;
  let userId = Meteor.userId();
  let currentCompany = {};
  Meteor.subscribe('projects');
  Meteor.subscribe('templates');
  const project = Projects.findOne({_id: projectId});
  const template = Templates.findOne({_id: templateId});
  Meteor.subscribe('compoundActivities', projectId);
  Meteor.subscribe('compoundProject', projectId);
  Meteor.subscribe('companies');
  Meteor.subscribe('findAllPeoples');
  const companies = Companies.find({}).fetch();
  const company = Companies.findOne({_id: project && project.companyId || template && template.companyId});
  if (!company) {
    currentCompany = companies.find(_company => _company.peoples.includes(userId));
  } else {
    currentCompany = company;
  }
  Meteor.subscribe('peoples', currentCompany && currentCompany._id);
  return {
    project: Projects.findOne({_id: projectId}),
    company,
    template: Templates.findOne({_id: templateId}),
    companies: Companies.find({}).fetch(),
    currentCompany,
    allStakeholders: Peoples.find({company: currentCompany && currentCompany._id}).fetch(),
  };
})(withRouter(Dashboard));

export default withSnackbar(DashboardPage)




