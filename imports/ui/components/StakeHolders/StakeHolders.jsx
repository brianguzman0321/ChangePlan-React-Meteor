import React, {useEffect, useState} from 'react';
import {withRouter} from 'react-router';
import {makeStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import IconButton from "@material-ui/core/IconButton/IconButton";
import Grid from '@material-ui/core/Grid';
import {InputBase, InputLabel, Select} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import {withTracker} from "meteor/react-meteor-data";
import {Companies} from "/imports/api/companies/companies";
import {Projects} from "/imports/api/projects/projects";
import {Peoples} from "/imports/api/peoples/peoples";
import {Templates} from "/imports/api/templates/templates";
import TopNavBar from '/imports/ui/components/App/App';
import config from '/imports/utils/config';
import StakeHolderList from './StakeHoldersList'
import AddStakeHolder from './Modals/AddStakeHolder';
import {Activities} from "../../../api/activities/activities";
import {Meteor} from "meteor/meteor";
import {withSnackbar} from "notistack";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import {AdditionalStakeholderInfo} from "../../../api/additionalStakeholderInfo/additionalStakeholderInfo";
import {Impacts} from "../../../api/impacts/impacts";
import {calculationLevels} from "../../../utils/utils";


const useStyles = makeStyles(theme => ({
  root: {
    // flexGrow: 1,
    // maxWidth: 400,
    // maxHeight: 200
  },
  gridContainer: {
    // marginBottom: 15,
    overFlow: 'hidden'
  },
  topBar: {
    marginTop: 13,
  },
  topHeading: {
    fontSize: '1.8rem',
    fontWeight: 500,
    lineHeight: 1.5,
    letterSpacing: '-0.015em',
    color: '#465563',
    marginLeft: 24,
  },
  searchGrid: {
    display: 'flex',
    background: '#fff',
    border: '1px solid #cbcbcc',
    maxHeight: 40,
    maxWidth: 352,
  },
  createNewProject: {
    flex: 1,
    marginTop: 2,
    marginLeft: 23
  },
  iconButton: {
    marginTop: -3
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  stakeHoldersList: {
    margin: theme.spacing(2)
  },
  stakeholdersCount: {
    fontSize: '30px'
  },
  gridFiltering: {
    marginTop: '-10px',
  },
  selectFiltering: {
    width: '80%',
  },
  labelForSelect: {
    top: '8px',
  },
}));

function StakeHolders(props) {
  let menus = config.menus;
  const [search, setSearch] = React.useState('');
  const classes = useStyles();
  let {match, project, template, stakeHoldersTemplate, stakeHolders, company, currentCompany, activities, additionalInfo, allImpacts} = props;
  let {projectId, templateId} = match.params;
  project = project || {};
  template = template || {};
  const [type, setType] = useState(templateId && 'template' || projectId && 'project');
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isChangeManager, setIsChangeManager] = useState(false);
  const [isManager, setIsManager] = useState(false);
  const [isActivityDeliverer, setIsActivityDeliverer] = useState(false);
  const [isActivityOwner, setIsActivityOwner] = useState(false);
  const [filteringField, setFilteringField] = useState(0);
  const [filteringValue, setFilteringValue] = useState(0);
  const [currentCompanyId, setCompanyId] = useState(null);
  const [stakeholders, setStakeholders] = useState([]);
  const [defaultStakeholders, setDefaultStakeholders] = useState([]);

  const searchFilter = event => {
    setSearch(event.target.value);
    updateFilter('localPeoples', 'search', event.target.value);
  };

  useEffect(() => {
    checkRoles();
    if (templateId) {
      setType('template')
    } else if (projectId) {
      setType('project')
    }
  }, [currentCompany, template, project]);

  useEffect(() => {
    let allStakeholders = [];
    if (stakeHolders && allImpacts) {
      allStakeholders = stakeHolders;
      getTotalTime(allStakeholders, true);
      getLevels(allStakeholders);
      getImpactsLevel(allStakeholders);
    } else if (stakeHoldersTemplate) {
      allStakeholders = stakeHoldersTemplate;
      getTotalTime(allStakeholders, true);
      getLevels(allStakeholders);
      getImpactsLevel(allStakeholders);
    }
  }, [stakeHolders, stakeHoldersTemplate, activities]);

  const getNumberStakeholders = () => {
    let numberStakeholders = 0;
    stakeholders.forEach(stakeholder => {
      if (stakeholder.numberOfPeople && stakeholder.numberOfPeople > 0) {
        numberStakeholders = numberStakeholders + stakeholder.numberOfPeople;
      } else {
        numberStakeholders++;
      }
    });
    return numberStakeholders;
  };

  const getLevels = (allStakeholders) => {
    allStakeholders.map(stakeholder => {
      const currentLevels = additionalInfo.find(info => info.stakeholderId === stakeholder._id && info.projectId === projectId);
      if (currentLevels) {
        stakeholder.supportLevel = currentLevels.levelOfSupport;
        stakeholder.influenceLevel = currentLevels.levelOfInfluence;
      }
      return stakeholder
    })
  };

  const getImpactsLevel = (allStakeholders) => {
    allStakeholders.map(stakeholder => {
      const currentImpacts = allImpacts.filter(impact => impact.stakeholders.includes(stakeholder._id));
      if (currentImpacts.length > 0) {
        stakeholder.impactLevel = calculationLevels('stakeholders', currentImpacts)
      }
      return stakeholder
    });
  };

  const getTotalTime = (allStakeholders, isDefault = false) => {
    if (activities) {
      allStakeholders.map(stakeholder => {
        const allActivities = activities.filter(activity => activity.stakeHolders.includes(stakeholder._id));
        let totalTime = 0;
        allActivities.forEach(activity => {
          totalTime = totalTime + activity.time;
        });
        totalTime = totalTime < 60 ? totalTime + " mins" : parseFloat(totalTime / 60).toFixed(2) + " hrs";
        stakeholder.totalTime = totalTime;
        return stakeholder
      });
      setStakeholders(allStakeholders);
      if (isDefault) {
        setDefaultStakeholders(allStakeholders);
      }
    }
  };

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

    if (currentCompany && currentCompany.admins && currentCompany.admins.includes(userId)) {
      setIsAdmin(true);
    }

    if (currentCompany) {
      const projectsCurCompany = Projects.find({companyId: currentCompany._id}).fetch();
      if (projectsCurCompany) {
        const changeManagers = [...new Set([].concat.apply([], projectsCurCompany.map(project => project.changeManagers)))];
        if (!Roles.userIsInRole(userId, 'superAdmin') && changeManagers.includes(userId)) {
          setIsChangeManager(true);
        }
        const managers = [...new Set([].concat.apply([], projectsCurCompany.map(project => project.managers)))];
        if (!Roles.userIsInRole(userId, 'superAdmin') && managers.includes(userId)) {
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

  const selectFieldForFiltering = (e) => {
    setFilteringField(e.target.value);
    if (e.target.value === 0) {
      setFilteringValue(0);
    }
  };

  const selectValueForFiltering = (e) => {
    setFilteringValue(e.target.value);
  };

  useEffect(() => {
    let filteredStakeholders = [];
    switch (filteringField) {
      case 0:
        filteredStakeholders = defaultStakeholders;
        break;
      case 1:
        filteredStakeholders = defaultStakeholders.filter(stakeholder => stakeholder.businessUnit === filteringValue);
        break;
      case 2:
        filteredStakeholders = defaultStakeholders.filter(stakeholder => stakeholder.team === filteringValue);
        break;
      case 3:
        filteredStakeholders = defaultStakeholders.filter(stakeholder =>
          stakeholder.role === filteringValue || stakeholder.jobTitle === filteringValue);
        break;
      case 4:
        filteredStakeholders = defaultStakeholders.filter(stakeholder =>
          stakeholder.roleTags && stakeholder.roleTags.includes(filteringValue));
        break;
      case 5:
        filteredStakeholders = defaultStakeholders.filter(stakeholder => stakeholder.location === filteringValue);
        break;
      default:
        break;
    }
    getTotalTime(filteredStakeholders);
  }, [filteringValue, defaultStakeholders]);

  const getFilteringValue = (field) => {
    switch (field) {
      case 'businessUnit':
        let units = [];
        defaultStakeholders.forEach(stakeholder => {
          if (stakeholder.businessUnit) {
            units.push(stakeholder.businessUnit);
          }
        });
        const noReplayUnits = [...new Set(units)];
        return noReplayUnits.map(businessUnit => {
          return <MenuItem key={businessUnit} value={businessUnit}>
            {businessUnit}</MenuItem>
        });
      case 'team':
        let teams = [];
        defaultStakeholders.forEach(stakeholder => {
          if (stakeholder.team) {
            teams.push(stakeholder.team);
          }
        });
        const noReplayTeams = [...new Set(teams)];
        return noReplayTeams.map(team => {
          return <MenuItem key={team} value={team}>
            {team}</MenuItem>
        });
      case 'jobTitle':
        let jobs = [];
        defaultStakeholders.forEach(stakeholder => {
          if (stakeholder.jobTitle) {
            jobs.push(stakeholder.jobTitle);
          }
          if (stakeholder.role) {
            jobs.push(stakeholder.role);
          }
        });
        const noReplayJobs = [...new Set(jobs)];
        return noReplayJobs.map(job => {
          if (job !== undefined) {
            return <MenuItem key={job} value={job}>
              {job}</MenuItem>
          }
        });
      case 'roleTags':
        let roleTags = [];
        defaultStakeholders.forEach(stakeholder => {
          if (stakeholder.roleTags) {
            stakeholder.roleTags.forEach(roleTag => {
              roleTags.push(roleTag);
            })
          }
        });
        const noReplayRoleTags = [...new Set(roleTags)];
        return noReplayRoleTags.map(roleTag => {
          if (!!roleTag) {
            return <MenuItem key={roleTag} value={roleTag}>
              {roleTag}</MenuItem>
          }
        });
      case 'location':
        let locations = [];
        defaultStakeholders.forEach(stakeholder => {
          if (stakeholder.location) {
            locations.push(stakeholder.location);
          }
        });
        const noReplayLocations = [...new Set(locations)];
        return noReplayLocations.map(location => {
          if (!!location) {
            return <MenuItem key={location} value={location}>
              {location}</MenuItem>
          }
        });
      default:
        break;
    }
  };

  return (
    <div>
      <TopNavBar menus={menus} {...props} />
      <Grid
        container
        direction="row"
        justify="flex-start"
        alignItems="center"
        className={classes.gridContainer}
        spacing={0}
      >
        <Grid container className={classes.topBar}>
          <Grid item xs={12} sm={6} md={filteringField === 0 ? 4 : 3}>
            <Typography color="textSecondary" variant="h4" className={classes.topHeading}>
              Stakeholders
              &nbsp;&nbsp;&nbsp;
              <span
                className={classes.stakeholdersCount}>{getNumberStakeholders()}</span>
            </Typography>
          </Grid>
          <Grid item xs={4} className={classes.searchGrid} md={3} sm={6}>
            <InputBase
              className={classes.input}
              placeholder="Search"
              inputProps={{'aria-label': 'search by project name'}}
              onChange={searchFilter}
              value={search}
            />
            <IconButton className={classes.iconButton} aria-label="search">
              <SearchIcon/>
            </IconButton>
          </Grid>
          {((isAdmin && template && (template.companyId === currentCompanyId)) || isSuperAdmin || (type === 'project' && (project && (isAdmin || isChangeManager)))) ?
            <Grid item xs={4} md={2} sm={2} className={classes.secondTab}>
              <AddStakeHolder type={type} company={currentCompany} projectId={projectId} templateId={templateId}
                              project={project} template={template}/>
            </Grid>
            : ''}
          <Grid item xs={2} md={2} sm={2} className={classes.gridFiltering}>
            <FormControl className={classes.selectFiltering}>
              <InputLabel id={'fields-for-filtering'} className={classes.labelForSelect}>Filter by</InputLabel>
              <Select fullWidth id={'fields-for-filtering'} value={filteringField} onChange={selectFieldForFiltering}>
                <MenuItem key={0} value={0}>None</MenuItem>
                <MenuItem key={1} value={1}>Business unit</MenuItem>
                <MenuItem key={2} value={2}>Team</MenuItem>
                <MenuItem key={3} value={3}>Job Title</MenuItem>
                <MenuItem key={4} value={4}>Tag</MenuItem>
                <MenuItem key={5} value={5}>Location</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={2} md={2} sm={2} className={classes.gridFiltering}>
            {filteringField !== 0 &&
            <FormControl className={classes.selectFiltering}>
              <InputLabel id={'fields-for-filtering'} className={classes.labelForSelect}>Filter by value</InputLabel>
              <Select fullWidth id={'fields-for-filtering'} value={filteringValue} onChange={selectValueForFiltering}>
                {filteringField === 1 && getFilteringValue('businessUnit')}
                {filteringField === 2 && getFilteringValue('team')}
                {filteringField === 3 && getFilteringValue('jobTitle')}
                {filteringField === 4 && getFilteringValue('roleTags')}
                {filteringField === 5 && getFilteringValue('location')}
              </Select>
            </FormControl>
            }

          </Grid>
        </Grid>
        <StakeHolderList className={classes.stakeHoldersList} template={template} company={currentCompany}
                         isChangeManager={isChangeManager} isActivityDeliverer={isActivityDeliverer}
                         isActivityOwner={isActivityOwner}
                         isSuperAdmin={isSuperAdmin} isAdmin={isAdmin} isManager={isManager} projectId={projectId}
                         project={project}
                         rows={stakeholders} type={type}/>
      </Grid>

    </div>
  )
}

const StakeHoldersPage = withTracker(props => {
  let {match} = props;
  let {projectId, templateId} = match.params;
  let local = LocalCollection.findOne({
    name: 'localPeoples'
  });
  let userId = Meteor.userId();
  let currentCompany = {};
  Meteor.subscribe('companies');
  Meteor.subscribe('compoundProject', projectId);
  Meteor.subscribe('templates');
  Meteor.subscribe('projects');
  Meteor.subscribe('activities.notLoggedIn');
  Meteor.subscribe('additionalStakeholderInfo.findAll');
  Meteor.subscribe('impacts.findAll');
  let project = Projects.findOne({
    _id: projectId
  });
  let activities = Activities.find({}).fetch();
  let template = Templates.findOne({_id: templateId});
  const companies = Companies.find({}).fetch();
  const company = Companies.findOne({_id: project && project.companyId || (template && template.companyId || '')});
  currentCompany = company;
  Meteor.subscribe('peoples', currentCompany && currentCompany._id, {
    name: local.search
  });
  Meteor.subscribe('activities.notLoggedIn');
  Meteor.subscribe('findAllPeoples');
  const additionalInfo = AdditionalStakeholderInfo.find({}).fetch();
  return {
    stakeHolders: Peoples.find({
      _id: {
        $in: project && project.stakeHolders || []
      }
    }).fetch(),
    stakeHoldersTemplate: Peoples.find({
      _id: {
        $in: template && template.stakeHolders || []
      }
    }).fetch(),
    allImpacts: Impacts.find({projectId: projectId}).fetch(),
    project: Projects.findOne({_id: projectId}),
    template: Templates.findOne({_id: templateId}),
    companies: Companies.find({}).fetch(),
    company,
    currentCompany,
    activities,
    additionalInfo,
  };
})(withRouter(StakeHolders));

export default withSnackbar(StakeHoldersPage);