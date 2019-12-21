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
import {Templates} from "/imports/api/templates/templates";
import NewTemplate from './Modals/CreateTemplate'; ////!!!!!!!!!!!!!!!!!!1
import TemplateMenus from './TemplateMenus'; ///!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
import {Activities} from "../../../api/activities/activities";
import {Peoples} from '../../../api/peoples/peoples';
import ProjectNavBar from "../Projects/ProjectsNavBar";
import TopNavBar from "../App/App";
import config from "../../../utils/config";
import {Projects} from "../../../api/projects/projects";


const useStyles = makeStyles(theme => ({
  card: {
    minHeight: 192,
    minWidth: 300,
    maxWidth: 295,
    marginTop: 23,
    marginLeft: 30,
    color: '#465563',
    cursor: 'pointer'
  },
  newTemplate: {
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
  createNewTemplate: {
    flex: 1,
    marginLeft: 23
  },
  gridContainer: {
    marginBottom: 15,
    overFlow: 'hidden'
  },
  grid: {
    margin: -5,
    marginTop: 5
  },
  cardContent: {
    paddingTop: 0,
    "&:last-child": {
      paddingBottom: 0
    }
  },
  notFound: {

  },
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

function TemplateCard(props) {
  let {company, activities, currentCompany, companies, history: {push}, projects } = props;
  const [templates, setTemplates] = useState([]);
  const [selectedTab, setSelectedTab] = useState(0);
  const [currentCompanyId, setCompanyId] = useState(null);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isChangeManager, setIsChangeManager] = useState(false);

  useEffect(() => {
    if (currentCompany) {
      setCompanyId(currentCompany._id);
      let currentNav = location.pathname;
      switch (currentNav) {
        case '/':
          setSelectedTab(0);
          break;
        case `/${currentCompany._id}/templates`:
          setSelectedTab(1);
          setTemplates(props.templates.filter(template => template.companyId).map((template) => {
          template.totalActivities = (activities.filter((activity) => activity.templateId === template._id) || []).length;
          return template;
        }));
          break;
        case '/templates':
          setSelectedTab(2);
          setTemplates(props.templates.filter(template => !template.companyId).map((template) => {
            template.totalActivities = (activities.filter((activity) => activity.templateId === template._id) || []).length;
            return template;
          }));
          break;
        default:
          break;
      }
    }
  }, [activities]);


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
  };

  const useStyles1 = makeStyles(theme => ({
    title: {
      fontWeight: 1000,
      fontSize: 16
    }
  }));

  const checkRoles = () => {
    setCompanyId(currentCompany._id);
    const projectsCurCompany = Projects.find({companyId: currentCompany._id}).fetch();
    if (projectsCurCompany) {
      const userId = Meteor.userId();
      const changeManagers = [...new Set([].concat.apply([], projectsCurCompany.map(project => project.changeManagers)))];
      if (Roles.userIsInRole(userId, 'superAdmin')) {
        setIsSuperAdmin(true);
      } else if (company && company.admins.includes(userId)) {
        setIsAdmin(true);
      } else if (changeManagers.includes(userId)) {
        setIsChangeManager(true);
      }
    } else {
      if (Roles.userIsInRole(Meteor.userId(), 'superAdmin')) {
        setIsSuperAdmin(true);
      } else if (company && company.admins.includes(Meteor.userId())) {
        setIsAdmin(true);
      }
    }
  };

  useEffect(() => {
    if (currentCompany){
      checkRoles();
    }
  }, [currentCompany]);

  const classes = useStyles();
  const classes1 = useStyles1();
  const [age, setAge] = React.useState('endingDate');
  const [search, setSearch] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const [totalActivities, setTotalActivities] = React.useState();

  const handleChange = event => {
    setAge(event.target.value);
  };

  const selectTemplate = (template, e) => {
    props.history.push(`/templates/${template._id}`)
  };

  const searchFilter = event => {
    setSearch(event.target.value);
  };

  return (
    <>
      <TopNavBar menus={[]} {...props} />
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
              Templates
            </Typography>
          </Grid>
          <Grid item xs={4} className={classes.searchGrid}>
            <InputBase
              className={classes.input}
              inputProps={{'aria-label': 'search by template name'}}
              onChange={searchFilter}
              value={search}
            />
            <IconButton className={classes.iconButton} aria-label="search">
              <SearchIcon/>
            </IconButton>
          </Grid>
          <Grid item xs={4} className={(isAdmin || isSuperAdmin) && company ? classes.secondTab : ''}>
            {((isSuperAdmin && selectedTab === 2) || (isAdmin && selectedTab === 1)) && company && <NewTemplate {...props} isAdmin={isAdmin} className={classes.createNewTemplate}/>}
            <Typography color="textSecondary" variant="title" className={classes.sortBy}>
              Sort by
            </Typography>
          </Grid>
          <Grid item xs={2}>
            <FormControl className={classes.formControl}>
              <Select
                value={age}
                onChange={handleChange}
                displayEmpty
                name="age"
                className={classes.selectEmpty}
              >
                <MenuItem value="createdAt">Date Added</MenuItem>
                <MenuItem value="endingDate">Date Due</MenuItem>
                <MenuItem value="name">Template Name</MenuItem>
                <MenuItem value="stakeHolder">Stakeholder Count</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <ProjectNavBar {...props} selectedTab={selectedTab} handleChange={changeTab} isSuperAdmin={isSuperAdmin} isAdmin={isAdmin} isChangeManager={isChangeManager} currentCompanyId={currentCompanyId}/>
        </Grid>
        {templates.map((template, index) => {
          return <Grid item xs spacing={1} key={index} className={classes.grid}>
            <Card className={classes.card} onClick={(e) => selectTemplate(template)}>
              <LinearProgress variant="determinate"
                              value={template.totalActivities && template.totalActivities > 0 ? parseInt((100 * template.completedActivities) / templates.totalActivities) : 0}
                              color="primary"/>
              <CardHeader
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
                action={<TemplateMenus template={template} company={company} isAdmin={isAdmin} isSuperAdmin={isSuperAdmin}/>}
                classes={classes1}
                style={{cursor: "auto"}}
                title={templateName(template.name)}
              />
              <CardContent className={classes.cardContent}>
                <Grid container>
                  <Grid item xs={4}>
                    <Typography className={classes.title} gutterBottom>
                      STAKEHOLDERS
                    </Typography>
                    <Typography className={classes.pos} color="textSecondary">
                      {template.stakeHolders.length}
                    </Typography>
                  </Grid>
                  <Grid item xs={4} className={classes.activities}>
                    <Typography className={classes.title} gutterBottom>
                      ACTIVITIES
                    </Typography>
                    <Typography className={classes.pos} color="textSecondary">
                      {template.totalActivities}
                    </Typography>
                  </Grid>

                </Grid>
              </CardContent>
            </Card>
          </Grid>
        })
        }
      </Grid>
      {!templates.length &&
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


function templateName(name) {
  if (typeof name === 'string') {
    return name.length < 53 ? name : `${name.slice(0, 50)}...`
  }
  return name
}

/*function sortingFunc(templates, local) {
  switch (local.sort) {
    case 'endingDate': {
      templates = templates.sort((a, b) => new Date(a.endingDate) - new Date(b.endingDate));
      break;
    }
    case 'createdAt': {
      templates = templates.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      break;
    }
    case 'name': {
      templates = templates.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
      break;
    }
    case 'stakeHolders': {
      templates = templates.sort((a, b) => a.stakeHolders.length - a.stakeHolders.length);
      break;
    }

  }
  return templates
}*/


const TemplatesPage = withTracker(props => {
  let userId = Meteor.userId();
  Meteor.subscribe('companies.single');
  const companies = Companies.find({}).fetch();
  const currentCompany = companies.find(company => company.peoples.includes(userId));
  Meteor.subscribe('templates');
  Meteor.subscribe('projects');
  return {
    company: Companies.findOne(),
    activities: Activities.find({}).fetch(),
    templates: Templates.find({}).fetch(),
    companies: Companies.find({}).fetch(),
    currentCompany,
  };
})(TemplateCard);

export default TemplatesPage;
