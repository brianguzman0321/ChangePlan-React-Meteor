import React, {useEffect, useState} from 'react';
import moment from 'moment';
import {makeStyles} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Paper from '@material-ui/core/Paper';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import IconButton from "@material-ui/core/IconButton/IconButton";
import CardHeader from "@material-ui/core/CardHeader/CardHeader";
import Grid from '@material-ui/core/Grid';
import LinearProgress from '@material-ui/core/LinearProgress';
import {InputBase} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import {withTracker} from "meteor/react-meteor-data";
import {Companies} from "/imports/api/companies/companies";
import {Projects} from "/imports/api/projects/projects";
import NewProject from './Models/CreateProject';
import ProjectMenus from './ProjectMenus';
import {Activities} from "../../../api/activities/activities";
import {Templates} from "../../../api/templates/templates";
import {Meteor} from "meteor/meteor";
import {Peoples} from "../../../api/peoples/peoples";
import {getTotalStakeholders} from "../../../utils/utils";
import Chip from "@material-ui/core/Chip";
import Button from "@material-ui/core/Button";
import AllProjects from "./ProjectsTable/AllProjects";
import {Impacts} from "../../../api/impacts/impacts";
import SVGInline from "react-svg-inline";
import SideMenu from "../App/SideMenu";
import {svg} from "../../../utils/сonstants";


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
    backgroundColor: '#f4f5f7',
    height: '100vw',
    width: '95vw',
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  card: {
    minHeight: 192,
    marginTop: 23,
    marginLeft: 30,
    color: '#465563',
    cursor: 'pointer'
  },
  newProject: {
    minHeight: 192,
    minWidth: 300,
    maxWidth: 295,
    marginTop: 23,
    marginLeft: 23,
    marginRight: '0 !important',
    color: '#465563',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  progress: {
    color: '#4294db'
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  cardTitle: {
    fontWeight: '500 !important'
  },
  title: {
    fontSize: 11,
    color: '##455564'
  },
  pos: {
    fontWeight: 'Bold',
  },
  bottomText: {
    marginTop: 12,
    fontSize: 11,
    color: '##455564'
  },
  searchContainer: {
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
  input: {
    marginLeft: theme.spacing(1),
    backgroundColor: '#e2e8ed',
    flex: 1,
    [theme.breakpoints.up('md')]: {
      width: 200,
    },
    [theme.breakpoints.down('md')]: {
      width: 150,
    },
  },
  searchGrid: {
    display: 'flex',
    background: '#fff',
    border: '1px solid #cbcbcc',
    maxHeight: 40,
    backgroundColor: '#e2e8ed',
    borderRadius: 2,
    [theme.breakpoints.up('md')]: {
      width: 200,
    },
    [theme.breakpoints.down('md')]: {
      width: 150,
    },
  },
  iconButton: {
    marginTop: -3
  },
  sortBy: {
    float: 'right',
    marginTop: 8,
    fontSize: 18
  },
  formControl: {
    margin: theme.spacing(0, 1),
    minWidth: 200,
    background: '#ffffff',
    '&:selected': {
      background: '#ffffff'
    }
  },
  selectEmpty: {
    border: '1px solid #c5c6c7',
    paddingLeft: 5,
    minHeight: 40,
    background: '#ffffff',
    '&:selected': {
      background: '#ffffff'
    }
  },
  activities: {
    paddingLeft: 12
  },
  secondTab: {
    display: 'flex'
  },
  createNewProject: {
    flex: 1,
    marginLeft: 23
  },
  gridContainer: {
    marginBottom: 15,
    overFlow: 'hidden'
  },
  grid: {
    margin: -5,
    marginTop: 5,
    [theme.breakpoints.only('lg')]: {
      maxWidth: '24.5%',
      flexBasis: '25%',
    },
  },
  cardContent: {
    paddingTop: 0,
    "&:last-child": {
      paddingBottom: 0
    }
  },
  notFound: {},
  noData: {
    backgroundColor: '#f4f5f7',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(3, 2),
    minHeight: 200,
    margin: 23
  },
  selected: {
    background: 'white'
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
  button: {
    textAlign: "right",
  },
  selectedButton: {
    background: '#ffffff',
    textTransform: 'none',
    border: '1px #92a1af solid',
    borderRadius: 1,
    width: 100,
    marginRight: 10,
  },
  viewButton: {
    color: '#92a1af',
    textTransform: 'none',
    border: '1px #92a1af solid',
    borderRadius: 1,
    width: 100,
    marginRight: 10,
  },
  svg: {
    paddingRight: 5,
    width: 20,
    height: 20,
  }
}));

function ProjectCard(props) {
  let {projects, company, activities, currentCompany, templates, history: {push}, stakeholders, allImpacts} = props;
  const [currentCompanyId, setCompanyId] = useState(null);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isChangeManager, setIsChangeManager] = useState(false);
  const [isManager, setIsManager] = useState(false);
  const [isActivityDeliverer, setIsActivityDeliverer] = useState(false);
  const [isActivityOwner, setIsActivityOwner] = useState(false);
  const [projectCard, setProjectCard] = useState(projects || []);
  const [viewMode, setViewMode] = React.useState(0);

  useEffect(() => {
    if (currentCompany) {
      setCompanyId(currentCompany._id);
      setViewMode(Number(localStorage.getItem(`viewModeProject_${Meteor.userId()}`)));
    }
  }, [currentCompany]);

  const checkRoles = () => {
    const userId = Meteor.userId();
    if (Roles.userIsInRole(userId, 'superAdmin')) {
      setIsSuperAdmin(true);
    }
    if (company && company.admins.includes(userId)) {
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
    if (projects) {
      projects.forEach(project => {
        const activities = Activities.find({projectId: project._id}).fetch();
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
      })
    }
  };

  useEffect(() => {
    let projectsFiltering = [];
    const userId = Meteor.userId();
    if (projects) {
      if (isSuperAdmin) {
        projectsFiltering = projects;
        setProjectCard(projectsFiltering);
      }
      if (isAdmin && !isSuperAdmin) {
        projectsFiltering = projects.filter(project => project.companyId === currentCompanyId);
        setProjectCard(projectsFiltering);
      }
      if (isChangeManager && !isAdmin && !isSuperAdmin) {
        projectsFiltering = projects.filter(project => project.changeManagers.includes(userId));
        setProjectCard(projectsFiltering);
      }
      if (isManager && !isSuperAdmin && !isAdmin) {
        projectsFiltering = projectsFiltering.concat(projects.filter(project => project.managers.includes(userId)));
        setProjectCard([...new Set(projectsFiltering)]);
      }
      if (isActivityDeliverer && !isSuperAdmin && !isAdmin) {
        const _activities = Activities.find({deliverer: userId}).fetch();
        if (activities) {
          _activities.forEach(activity => {
            const project = projects.find(project => project._id === activity.projectId);
            if (project) {
              projectsFiltering.push(project);
            }
          });
          setProjectCard([...new Set(projectsFiltering)]);
        }
      }
      if (isActivityOwner && !isSuperAdmin && !isAdmin) {
        const _activities = Activities.find({owner: userId}).fetch();
        if (activities) {
          _activities.forEach(activity => {
            const project = projects.find(project => project._id === activity.projectId);
            if (project) {
              projectsFiltering.push(project);
            }
          });
          setProjectCard([...new Set(projectsFiltering)]);
        }
      }
    }
  }, [isActivityDeliverer, isActivityOwner, isManager, isChangeManager, isAdmin, isSuperAdmin, projects, viewMode]);

  useEffect(() => {
    checkRoles();
  }, [projects]);


  const useStyles1 = makeStyles(theme => ({
    title: {
      fontWeight: 1000,
      fontSize: 16
    }
  }));

  const classes = useStyles();
  const classes1 = useStyles1();
  const [search, setSearch] = React.useState('');
  search || updateFilter('localProjects', 'search', '');

  React.useEffect(() => {
    if (!projects.length && !activities.length) {
      return;
    }
    projects.forEach((project, i) => {
      const projectActivities = activities.filter((activity) => activity.projectId === project._id) || [];
      projects[i].totalActivities = projectActivities.length;
    });
  }, [activities]);

  const selectProject = (project, e) => {
    props.history.push(`/projects/${project._id}`);
    window.scroll(0, 0);
  };

  const searchFilter = event => {
    setSearch(event.target.value);
    updateFilter('localProjects', 'search', event.target.value);
  };

  const getClass = (status) => {
    return status !== 'on-hold' ? classes[status] : classes.onHold;
  };

  const changeViewMode = (view) => {
    setViewMode(view);
    localStorage.setItem(`viewModeProject_${Meteor.userId()}`, view);
  };

  return (
    <div className={classes.root}>
      <SideMenu projects={projectCard} {...props}/>
      <main className={classes.content}>
        <div className={classes.toolbar}/>
        <Grid
          container
          direction="row"
          justify="flex-start"
          alignItems="center"
          className={classes.gridContainer}
          spacing={0}
        >
          <Grid container className={classes.searchContainer} direction="row" alignItems="center"
                justify="space-between">
            <Grid item xs={3}>
              <Grid container direction="row" justify="flex-start" alignItems="center">
                <Typography color="textSecondary" variant="h4" className={classes.topHeading}>
                  Projects
                </Typography>
                {(isAdmin || isSuperAdmin || isChangeManager) &&
                <NewProject {...props} className={classes.createNewProject} isSuperAdmin={isSuperAdmin} isAdmin={isAdmin}/>}
              </Grid>
            </Grid>
            <Grid item xs={5}>
              <Grid container direction={"row"} alignItems={"flex-end"} justify={"flex-end"}>
                <Grid item xs={11} className={classes.button}>
                  <Button onClick={() => changeViewMode(1)}
                          className={viewMode === 1 ? classes.selectedButton : classes.viewButton}>
                    <SVGInline
                      className={classes.svg}
                      svg={svg.iconList}/>
                    List
                  </Button>
                  <Button onClick={() => changeViewMode(0)}
                          className={viewMode === 0 ? classes.selectedButton : classes.viewButton}>
                    <SVGInline
                      className={classes.svg}
                      svg={svg.iconCard}/>
                    Card
                  </Button>

                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={3} className={classes.searchGrid}>
              <InputBase
                className={classes.input}
                classes={{input: classes.input}}
                inputProps={{'aria-label': 'search by project name'}}
                onChange={searchFilter}
                value={search}
              />
              <IconButton className={classes.iconButton} aria-label="search">
                <SearchIcon/>
              </IconButton>
            </Grid>
          </Grid>
          <Grid container
                direction="row"
                justify="flex-start"
                alignItems="flex-start">
            {viewMode === 0 && projectCard.map((project, index) => {
              return <Grid item xs={12} md={4} sm={6} lg={2} xl={2} key={index} className={classes.grid}>
                <Card className={classes.card} onClick={(e) => selectProject(project)}>
                  <LinearProgress variant="determinate"
                                  value={project.totalActivities && project.totalActivities > 0 ? parseInt((100 * project.completedActivities) / project.totalActivities) : 0}
                                  color="primary"/>
                  <CardHeader
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                    }}
                    action={<ProjectMenus project={project} company={company} activities={activities}
                                          isManager={isManager}
                                          isChangeManager={isChangeManager} isAdmin={isAdmin}
                                          isSuperAdmin={isSuperAdmin}
                                          isActivityOwner={isActivityOwner} isActivityDeliverer={isActivityDeliverer}/>}
                    classes={classes1}
                    style={{cursor: "auto"}}
                    title={projectName(project.name)}
                  />
                  <CardContent className={classes.cardContent}>
                    {project.status &&
                    <Chip size="small" label={project.status[0].toUpperCase() + project.status.slice(1)}
                          className={getClass(project.status)}/>}
                    <Grid container direction={"row"} alignItems={"center"} justify={"flex-start"}>
                      <Grid item xs={4}>
                        <Typography className={classes.title} gutterBottom>
                          STAKEHOLDERS
                        </Typography>
                        <Typography className={classes.pos} color="textSecondary">
                          {getTotalStakeholders(stakeholders, project.stakeHolders)}
                        </Typography>
                      </Grid>
                      <Grid item xs={4} className={classes.activities}>
                        <Typography className={classes.title} gutterBottom>
                          ACTIVITIES
                        </Typography>
                        <Typography className={classes.pos} color="textSecondary">
                          {project.totalActivities || 0}
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography className={classes.title} gutterBottom>
                          DUE
                        </Typography>
                        <Typography className={classes.pos} color="textSecondary">
                          {moment(project.endingDate).format('DD-MMM-YY')}
                        </Typography>
                      </Grid>

                      <Grid item xs={4}>
                        <Typography variant="body2" component="p" className={classes.bottomText}>
                          {project.changeManagers.length > 1 ? "CHANGE MANAGERS" : "CHANGE MANAGER"}
                          <br/>
                          {ChangeManagersNames(project)}
                        </Typography>
                      </Grid>
                      {company && company.organizationField && project.organization && <Grid item xs={4}>
                        <Typography variant={"body2"} component="p" className={classes.bottomText}>
                          ORGANIZATION:
                          <br/>
                          {project.organization && project.organization[0].toUpperCase() + project.organization.slice(1)}
                        </Typography>
                      </Grid>}
                      {company && company.functionField && project.function && <Grid item xs={4}>
                        <Typography variant={"body2"} component="p" className={classes.bottomText}>
                          FUNCTION:
                          <br/>
                          {project.function && project.function[0].toUpperCase() + project.function.slice(1)}
                        </Typography>
                      </Grid>}
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            })
            }
            {viewMode === 1 && <AllProjects allActivities={activities} allProjects={projectCard} allImpacts={allImpacts}
                                            allStakeholders={stakeholders} company={company} isAdmin={isAdmin}
                                            isChangeManager={isChangeManager} isManager={isManager}
                                            isActivityDeliverer={isActivityDeliverer}
                                            isActivityOwner={isActivityOwner} {...props}/>}
          </Grid>
        </Grid>
        {!projectCard.length &&
        <Grid
          container
          direction="row"
          justify="center"
          alignItems="center"
          justify-content="center"
        >
          <Grid item xs={12}>
            <Paper className={classes.noData}>
              <Typography variant="h5" component="h5" align="center">
                No Data Found.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
        }
      </main>
    </div>
  );
}

function projectName(name) {
  if (typeof name === 'string') {
    return name.length < 53 ? name : `${name.slice(0, 50)}...`
  }
  return name
}

function ChangeManagersNames(project) {
  if (project.changeManagerDetails) {
    let changeManagers = project.changeManagerDetails.map(changeManager => {
      return `${changeManager.profile.firstName} ${changeManager.profile.lastName}`
    });
    return changeManagers.join(", ")
  }
}

function sortingFunc(projects, local) {
  switch (local.sort) {
    case 'endingDate': {
      projects = projects.sort((a, b) => new Date(a.endingDate) - new Date(b.endingDate));
      break;
    }
    case 'createdAt': {
      projects = projects.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      break;
    }
    case 'name': {
      projects = projects.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
      break;
    }
    case 'stakeHolders': {
      projects = projects.sort((a, b) => a.stakeHolders.length - a.stakeHolders.length);
      break;
    }

  }
  return projects
}


const ProjectsPage = withTracker(props => {
  let local = LocalCollection.findOne({
    name: 'localProjects'
  });
  let userId = Meteor.userId();
  Meteor.subscribe('companies');
  const companies = Companies.find({}).fetch();
  const currentCompany = companies.find(company => company.peoples.includes(userId));
  Meteor.subscribe('myProjects', null, {
    sort: local.sort || {},
    name: local.search
  });
  Meteor.subscribe('templates');
  Meteor.subscribe('activities.notLoggedIn');
  Meteor.subscribe('findAllPeoples');
  Meteor.subscribe('impacts.findAll');
  return {
    templates: Templates.find({}).fetch(),
    company: Companies.findOne({_id: currentCompany && currentCompany._id}),
    activities: Activities.find({}).fetch(),
    projects: sortingFunc(Projects.find().fetch(), local),
    companies: Companies.find({}).fetch(),
    allImpacts: Impacts.find({}).fetch(),
    currentCompany,
    stakeholders: Peoples.find({}).fetch(),
  };
})(ProjectCard);

export default ProjectsPage;