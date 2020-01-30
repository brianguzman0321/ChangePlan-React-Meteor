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
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import {withTracker} from "meteor/react-meteor-data";
import {Companies} from "/imports/api/companies/companies";
import {Projects} from "/imports/api/projects/projects";
import NewProject from './Models/CreateProject';
import ProjectMenus from './ProjectMenus';
import {Activities} from "../../../api/activities/activities";
import ProjectNavBar from "./ProjectsNavBar";
import {Templates} from "../../../api/templates/templates";
import {Meteor} from "meteor/meteor";


const useStyles = makeStyles(theme => ({
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
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  searchGrid: {
    display: 'flex',
    background: '#fff',
    border: '1px solid #cbcbcc',
    maxHeight: 40,
    maxWidth: 352,
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
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(3, 2),
    minHeight: 200,
    margin: 23

  },
  selected: {
    background: 'white'
  }
}));

function ProjectCard(props) {
  let {projects, company, activities, currentCompany, templates, history: {push}} = props;
  const [selectedTab, setSelectedTab] = useState(0);
  const [currentCompanyId, setCompanyId] = useState(null);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isChangeManager, setIsChangeManager] = useState(false);
  const [isManager, setIsManager] = useState(false);
  const [isActivityDeliverer, setIsActivityDeliverer] = useState(false);
  const [projectCard, setProjectCard] = useState(projects || []);

  useEffect(() => {
    if (currentCompany) {
      setCompanyId(currentCompany._id);
    }
  }, [currentCompany, projects]);

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
    }
  }, [projects, isActivityDeliverer, isManager, isChangeManager, isAdmin, isSuperAdmin]);

  useEffect(() => {
    checkRoles();
  }, [projects]);

  useEffect(() => {
    let currentNav = location.pathname;
    switch (currentNav) {
      case '/':
        setSelectedTab(0);
        break;
      case `/${currentCompanyId}/templates`:
        setSelectedTab(1);
        break;
      case '/templates':
        setSelectedTab(2);
        break;
      default:
        break;
    }
  }, []);


  const changeTab = (value) => {
    setSelectedTab(value);
    switch (value) {
      case 0: {
        push(`/`);
        break;
      }
      case 1: {
        push(`/${currentCompanyId}/templates`);
        break;
      }
      case 2: {
        push(`/templates`);
        break;
      }
      default:
        break;
    }
    window.scroll(0, 0);
  };


  /*  if (projects && projects.length) {
      projects = projects.map(project => {
        const peoples = Peoples.find({
          '_id': {
            $in: project.stakeHolders
          }
        }).fetch();

        return {
          ...project,
          stakeHolders: peoples.map(people => people._id),
        }
      });
    }*/

  const useStyles1 = makeStyles(theme => ({
    title: {
      fontWeight: 1000,
      fontSize: 16
    }
  }));

  const classes = useStyles();
  const classes1 = useStyles1();
  const [age, setAge] = React.useState('endingDate');
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

  const handleChange = event => {
    setAge(event.target.value);
    updateFilter('localProjects', 'sort', event.target.value);
  };
  const selectProject = (project, e) => {
    props.history.push(`/projects/${project._id}`);
    window.scroll(0, 0);
  };

  const searchFilter = event => {
    setSearch(event.target.value);
    updateFilter('localProjects', 'search', event.target.value);
  };

  return (
    <>
      <Grid
        container
        direction="row"
        justify="flex-start"
        alignItems="center"
        className={classes.gridContainer}
        spacing={0}
      >
        <Grid container className={classes.searchContainer}>
          <Grid item xs={2}>
            <Typography color="textSecondary" variant="h4" className={classes.topHeading}>
              Projects
            </Typography>
          </Grid>
          <Grid item xs={4} className={classes.searchGrid}>
            <InputBase
              className={classes.input}
              inputProps={{'aria-label': 'search by project name'}}
              onChange={searchFilter}
              value={search}
            />
            <IconButton className={classes.iconButton} aria-label="search">
              <SearchIcon/>
            </IconButton>
          </Grid>
          <Grid item xs={4} className={(isAdmin || isSuperAdmin || isChangeManager) ? classes.secondTab : null}>
            {(isAdmin || isSuperAdmin || isChangeManager) &&
            <NewProject {...props} className={classes.createNewProject}/>}
            <Typography color="textSecondary" variant="title" className={classes.sortBy}>
              Sort by
            </Typography>
          </Grid>
          <Grid item xs={2}>
            <FormControl className={classes.formControl}>
              <Select
                style={{background: 'white'}}
                value={age}
                onChange={handleChange}
                displayEmpty
                name="age"
                className={classes.selectEmpty}
              >
                <MenuItem value="createdAt" classes={{root: classes.selected, selected: classes.selected}}>Date
                  Added</MenuItem>
                <MenuItem value="endingDate" classes={{root: classes.selected, selected: classes.selected}}>Date
                  Due</MenuItem>
                <MenuItem value="name" classes={{root: classes.selected, selected: classes.selected}}>Project
                  Name</MenuItem>
                <MenuItem value="stakeHolder" classes={{root: classes.selected, selected: classes.selected}}>Stakeholder
                  Count</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <Grid container
              direction="row"
              justify="flex-start"
              alignItems="center"
              className={classes.gridContainer}
              spacing={0}>
          <ProjectNavBar {...props} selectedTab={selectedTab} handleChange={changeTab} templates={templates}
                         isSuperAdmin={isSuperAdmin}
                         isAdmin={isAdmin} currentCompanyId={currentCompanyId} isChangeManager={isChangeManager}/>
        </Grid>
        <Grid container
              direction="row"
              justify="flex-start"
              alignItems="flex-start">
          {projectCard.map((project, index) => {
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
                  action={<ProjectMenus project={project} company={company} activities={activities}/>}
                  classes={classes1}
                  style={{cursor: "auto"}}
                  title={projectName(project.name)}
                />
                <CardContent className={classes.cardContent}>
                  <Grid container>
                    <Grid item xs={4}>
                      <Typography className={classes.title} gutterBottom>
                        STAKEHOLDERS
                      </Typography>
                      <Typography className={classes.pos} color="textSecondary">
                        {project.stakeHolders.length}
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

                  </Grid>
                  <Typography variant="body2" component="p" className={classes.bottomText}>
                    {project.changeManagers.length > 1 ? "CHANGE MANAGERS" : "CHANGE MANAGER"}
                    <br/>
                    {ChangeManagersNames(project)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          })
          }
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
    </>

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
  return {
    templates: Templates.find({}).fetch(),
    company: Companies.findOne({_id: currentCompany && currentCompany._id}),
    activities: Activities.find({}).fetch(),
    projects: sortingFunc(Projects.find().fetch(), local),
    companies: Companies.find({}).fetch(),
    currentCompany,
  };
})(ProjectCard);

export default ProjectsPage;