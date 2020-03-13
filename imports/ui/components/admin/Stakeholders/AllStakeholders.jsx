import React, {useEffect, useState} from "react";
import {withSnackbar} from "notistack";
import {withTracker} from "meteor/react-meteor-data";
import {Peoples} from "../../../../api/peoples/peoples";
import TopNavBar from "../../App/App";
import Grid from "@material-ui/core/Grid";
import {InputLabel, makeStyles, Select} from "@material-ui/core";
import {Projects} from "../../../../api/projects/projects";
import {Meteor} from "meteor/meteor";
import {Activities} from "../../../../api/activities/activities";
import {AdditionalStakeholderInfo} from "../../../../api/additionalStakeholderInfo/additionalStakeholderInfo";
import {Companies} from "../../../../api/companies/companies";
import AllStakeholderList from "./AllStakeholdersList";
import Typography from "@material-ui/core/Typography";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import AddStakeHolder from "../../StakeHolders/Modals/AddStakeHolder";

const useStyles = makeStyles(theme => ({
  gridContainer: {
    overFlow: 'hidden'
  },
  stakeHoldersList: {
    margin: theme.spacing(2)
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

const AllStakeholders = (props) => {
  const {allStakeholders, company, allProjects, allActivities, allAdditionalInfo} = props;
  const classes = useStyles();
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isChangeManager, setIsChangeManager] = useState(false);
  const [isManager, setIsManager] = useState(false);
  const [filteringField, setFilteringField] = useState(0);
  const [filteringValue, setFilteringValue] = useState(0);
  const [currentProjects, setCurrentProjects] = useState(allProjects ? allProjects : []);
  const [currentStakeholders, setCurrentStakeholders] = useState([]);
  const [defaultStakeholders, setDefaultStakeholders] = useState([]);

  useEffect(() => {
    checkRoles();
  }, [company]);

  const checkRoles = () => {
    const userId = Meteor.userId();
    if (Roles.userIsInRole(userId, 'superAdmin')) {
      setIsSuperAdmin(true);
    }

    if (company && company.admins && company.admins.includes(userId)) {
      setIsAdmin(true);
    }

    if (company) {
      const projectsCurCompany = Projects.find({companyId: company._id}).fetch();
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
  };

  useEffect(() => {
    let stakeholders = [];
    let projects = [];
    if (isAdmin) {
      stakeholders = allStakeholders.filter(stakeholder => stakeholder.company === company._id && !stakeholder.archived);
      projects = allProjects.filter(project => project.companyId === company._id);
    }
    if (isChangeManager && !isAdmin) {
      projects = allProjects.filter(project => project.changeManagers.includes(Meteor.userId()));
      const projectStakeholders = [];
      projects.forEach(project => {
        projectStakeholders.push(...new Set(project.stakeHolders))
      });
      stakeholders = allStakeholders.filter(stakeholder => projectStakeholders.includes(stakeholder._id) && !stakeholder.archived);
    }
    setCurrentProjects(projects);
    getTotalTime(stakeholders, true)
  }, [isAdmin, isChangeManager, allStakeholders, allProjects, allAdditionalInfo]);

  const getNumberStakeholders = () => {
    let numberStakeholders = 0;
    currentStakeholders.forEach(stakeholder => {
      if (stakeholder.numberOfPeople && stakeholder.numberOfPeople > 0) {
        numberStakeholders = numberStakeholders + stakeholder.numberOfPeople;
      } else {
        numberStakeholders++;
      }
    });
    return numberStakeholders;
  };

  const getTotalTime = (stakeholders, isDefault = false) => {
    if (allActivities) {
      stakeholders.map(stakeholder => {
        const activities = allActivities.filter(activity => activity.stakeHolders.includes(stakeholder._id));
        let totalTime = 0;
        activities.forEach(activity => {
          totalTime = totalTime + activity.time;
        });
        totalTime = totalTime < 60 ? totalTime + " mins" : parseFloat(totalTime / 60).toFixed(2) + " hrs";
        stakeholder.totalTime = totalTime;
        stakeholder.projectName = getProjectName(stakeholder);
        stakeholder.activities = activities;
        return stakeholder
      });
      setCurrentStakeholders(stakeholders);
      if (isDefault) {
        setDefaultStakeholders(stakeholders);
      }
    }
  };

  const getProjectName = (stakeholder) => {
    const projectsNames = [];
    const projects = allProjects.filter(project => project.stakeHolders.includes(stakeholder._id));
    projects.forEach(project => {
      projectsNames.push(project.name)
    });
    return projectsNames
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
        const project = allProjects.find(project => project.name === filteringValue);
        filteredStakeholders = defaultStakeholders.filter(stakeholder => project.stakeHolders.includes(stakeholder._id));
        break;
      case 2:
        filteredStakeholders = defaultStakeholders.filter(stakeholder => stakeholder.businessUnit === filteringValue);
        break;
      case 3:
        filteredStakeholders = defaultStakeholders.filter(stakeholder => stakeholder.team === filteringValue);
        break;
      case 4:
        filteredStakeholders = defaultStakeholders.filter(stakeholder =>
          stakeholder.role === filteringValue || stakeholder.jobTitle === filteringValue);
        break;
      case 5:
        filteredStakeholders = defaultStakeholders.filter(stakeholder =>
          stakeholder.roleTags && stakeholder.roleTags.includes(filteringValue));
        break;
      case 6:
        filteredStakeholders = defaultStakeholders.filter(stakeholder => stakeholder.location === filteringValue);
        break;
      default:
        break;
    }
    getTotalTime(filteredStakeholders);
  }, [filteringValue, defaultStakeholders]);

  const getFilteringValue = (field) => {
    switch (field) {
      case 'project':
        let projectsName = [];
        let projects = [];
        defaultStakeholders.forEach(stakeholder => {
          const project = allProjects.filter(project => project.stakeHolders.includes(stakeholder._id));
          projects.push(...new Set(project));
        });
        projects.forEach(project => {
          projectsName.push(project.name);
        });
        const noReplayProjectsName = [...new Set(projectsName)];
        return noReplayProjectsName.map(projectName => {
          return <MenuItem key={projectName} value={projectName}>
            {projectName}
          </MenuItem>
        });
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
      <TopNavBar {...props} />
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
          <Grid item xs={2} md={2} sm={2}>
            <Grid item xs={4} md={2} sm={2} className={classes.secondTab}>
              <AddStakeHolder company={company} type={'project'}
                              projects={isAdmin ? allProjects.filter(project => project.companyId === company._id)
                                : allProjects.filter(project => project.changeManagers.includes(Meteor.userId()))}/>
            </Grid>
          </Grid>
          <Grid item xs={2} md={2} sm={2} className={classes.gridFiltering}>
            <FormControl className={classes.selectFiltering}>
              <InputLabel id={'fields-for-filtering'} className={classes.labelForSelect}>Filter by</InputLabel>
              <Select fullWidth id={'fields-for-filtering'} value={filteringField} onChange={selectFieldForFiltering}>
                <MenuItem key={0} value={0}>None</MenuItem>
                <MenuItem key={1} value={1}>Project</MenuItem>
                <MenuItem key={2} value={2}>Business unit</MenuItem>
                <MenuItem key={3} value={3}>Team</MenuItem>
                <MenuItem key={4} value={4}>Job Title</MenuItem>
                <MenuItem key={5} value={5}>Tag</MenuItem>
                <MenuItem key={6} value={6}>Location</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={2} md={2} sm={2} className={classes.gridFiltering}>
            {filteringField !== 0 &&
            <FormControl className={classes.selectFiltering}>
              <InputLabel id={'fields-for-filtering'} className={classes.labelForSelect}>Filter by value</InputLabel>
              <Select fullWidth id={'fields-for-filtering'} value={filteringValue} onChange={selectValueForFiltering}>
                {filteringField === 1 && getFilteringValue('project')}
                {filteringField === 2 && getFilteringValue('businessUnit')}
                {filteringField === 3 && getFilteringValue('team')}
                {filteringField === 4 && getFilteringValue('jobTitle')}
                {filteringField === 5 && getFilteringValue('roleTags')}
                {filteringField === 6 && getFilteringValue('location')}
              </Select>
            </FormControl>
            }
          </Grid>
          <AllStakeholderList className={classes.stakeHoldersList} company={company}
                              isChangeManager={isChangeManager} projects={currentProjects}
                              isSuperAdmin={isSuperAdmin} isAdmin={isAdmin} isManager={isManager}
                              rows={currentStakeholders}/>
        </Grid>
      </Grid>
    </div>
  )
};

export default withTracker(props => {
  let {match} = props;
  let local = LocalCollection.findOne({
    name: 'localPeoples'
  });
  let userId = Meteor.userId();
  Meteor.subscribe('activities.notLoggedIn');
  Meteor.subscribe('projects.notLoggedIn');
  Meteor.subscribe('findAllPeoples');
  Meteor.subscribe('additionalStakeholderInfo.findAll');
  Meteor.subscribe('companies');
  return {
    allStakeholders: Peoples.find({}).fetch(),
    company: Companies.findOne({peoples: userId}),
    allProjects: Projects.find({}).fetch(),
    allActivities: Activities.find({}).fetch(),
    allAdditionalInfo: AdditionalStakeholderInfo.find({}).fetch(),
  }
})(withSnackbar(AllStakeholders))