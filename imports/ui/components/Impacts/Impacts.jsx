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
import {Activities} from "../../../api/activities/activities";
import {Impacts} from "../../../api/impacts/impacts";
import {Meteor} from "meteor/meteor";
import ImpactsList from "./ImpactsList";
import ImpactsModal from "./Modals/ImpactsModal";
import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";


const useStyles = makeStyles(theme => ({
  root: {
  },
  createNewImpact: {
    flex: 1,
    marginTop: 2,
    marginLeft: 15
  },
  gridContainer: {
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
  iconButton: {
    marginTop: -3
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  impactsList: {
    margin: theme.spacing(2)
  },
  impactsCount: {
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

function ImpactsTable(props) {
  let menus = config.menus;
  const [search, setSearch] = React.useState('');
  const classes = useStyles();
  let {match, project, impactsProject, impactsTemplate, template, currentCompany, stakeholders, stakeholdersTemplate} = props;
  let {projectId, templateId} = match.params;
  project = project || {};
  template = template || {};
  const [type, setType] = useState(templateId && 'template' || projectId && 'project');
  const [impacts, setImpacts] = useState([]);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isChangeManager, setIsChangeManager] = useState(false);
  const [isManager, setIsManager] = useState(false);
  const [isActivityDeliverer, setIsActivityDeliverer] = useState(false);
  const [isActivityOwner, setIsActivityOwner] = useState(false);
  const [showAddImpact, setShowAddImpact] = useState(false);
  const [filteringValue, setFilteringValue] = useState(0);
  const [filteringField, setFilteringField] = useState(0);
  const [defaultImpacts, setDefaultImpacts] = useState([]);
  const [currentCompanyId, setCompanyId] = useState(null);

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

  useEffect(() => {
    if (projectId && impactsProject) {
      setImpacts(impactsProject);
      setDefaultImpacts(impactsProject)
    }
    if (templateId && impactsTemplate) {
      setImpacts(impactsTemplate);
      setDefaultImpacts(impactsTemplate)
    }
  }, [impactsProject, impactsTemplate]);

  const handleOpenModal = () => {
    setShowAddImpact(true);
  };

  const handleCloseModal = () => {
    setShowAddImpact(false);
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
    switch (filteringField) {
      case 0:
        setImpacts(defaultImpacts);
        break;
      case 1:
        setImpacts(defaultImpacts.filter(impact => impact.type === filteringValue));
        break;
      case 2:
        setImpacts(defaultImpacts.filter(impact => impact.level === filteringValue));
        break;
      default:
        break;
    }
  }, [filteringValue, defaultImpacts]);

  const getFilteringValue = (field) => {
    switch (field) {
      case 'type':
        let types = [];
        defaultImpacts.forEach(impact => {
          if (impact.type) {
            types.push(impact.type);
          }
        });
        const noReplayTypes = [...new Set(types)];
        return noReplayTypes.map(type => {
          return <MenuItem key={type} value={type}>
            {type}</MenuItem>
        });
      case 'level':
        let levels = [];
        defaultImpacts.forEach(impact => {
          if (impact.level) {
            levels.push(impact.level);
          }
        });
        const noReplayLevels = [...new Set(levels)];
        return noReplayLevels.map(level => {
          return <MenuItem key={level} value={level}>
            {level}</MenuItem>
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
          <Grid item xs={12} sm={6} md={4}>
            <Typography color="textSecondary" variant="h4" className={classes.topHeading}>
              Impacts
              &nbsp;&nbsp;&nbsp;
              <span
                className={classes.impactsCount}>{impacts.length}</span>
            </Typography>
          </Grid>
          <Grid item xs={4} className={classes.searchGrid} md={3} sm={6}>
            <InputBase
              className={classes.input}
              placeholder="Search"
              inputProps={{'aria-label': 'search by impact name'}}
              onChange={searchFilter}
              value={search}
            />
            <IconButton className={classes.iconButton} aria-label="search">
              <SearchIcon/>
            </IconButton>
          </Grid>
          {((isAdmin && template && (template.companyId === currentCompanyId)) || isSuperAdmin || (type === 'project' && (project && (isAdmin || isChangeManager)))) ?
            <Grid item xs={4} md={1} sm={2} className={classes.secondTab}>
              <Button variant="outlined" color="primary" className={classes.createNewImpact} onClick={handleOpenModal}>
                Add
              </Button>
              <ImpactsModal currentType={type} project={project} open={showAddImpact} handleModalClose={handleCloseModal}
                            isNew={true} template={template} match={match} projectId={projectId} templateId={templateId}/>
            </Grid>
            : ''}
          <Grid item xs={2} md={2} sm={2} className={classes.gridFiltering}>
            <FormControl className={classes.selectFiltering}>
              <InputLabel id={'fields-for-filtering'} className={classes.labelForSelect}>Filter by</InputLabel>
              <Select fullWidth id={'fields-for-filtering'} value={filteringField} onChange={selectFieldForFiltering}>
                <MenuItem key={0} value={0}>None</MenuItem>
                <MenuItem key={1} value={1}>Type</MenuItem>
                <MenuItem key={2} value={2}>Level</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={2} md={2} sm={2} className={classes.gridFiltering}>
            {filteringField !== 0 &&
            <FormControl className={classes.selectFiltering}>
              <InputLabel id={'fields-for-filtering'} className={classes.labelForSelect}>Filter by value</InputLabel>
              <Select fullWidth id={'fields-for-filtering'} value={filteringValue} onChange={selectValueForFiltering}>
                {filteringField === 1 && getFilteringValue('type')}
                {filteringField === 2 && getFilteringValue('level')}
              </Select>
            </FormControl>
            }

          </Grid>
        </Grid>
        <ImpactsList className={classes.impactsList} template={template} company={currentCompany}
                         isChangeManager={isChangeManager} isActivityDeliverer={isActivityDeliverer} isActivityOwner={isActivityOwner}
                         isSuperAdmin={isSuperAdmin} isAdmin={isAdmin} isManager={isManager} projectId={projectId}
                         project={project} match={match} allStakeholders={type === 'project' ? stakeholders : stakeholdersTemplate}
                         rows={impacts} type={type}/>
      </Grid>

    </div>
  )
}

const ImpactsPage = withTracker(props => {
  let {match} = props;
  let {projectId, templateId} = match.params;
  let local = LocalCollection.findOne({
    name: 'localPeoples'
  });
  Meteor.subscribe('companies');
  Meteor.subscribe('compoundProject', projectId);
  Meteor.subscribe('templates');
  Meteor.subscribe('projects');
  let project = Projects.findOne({
    _id: projectId
  });
  let template = Templates.findOne({_id: templateId});
  const company = Companies.findOne({_id: project && project.companyId || (template && template.companyId || '')});
  const currentCompany = company;
  Meteor.subscribe('peoples', currentCompany && currentCompany._id, {
    name: local.search
  });
  Meteor.subscribe('impacts.findAll');
  Meteor.subscribe('activities.notLoggedIn');
  Meteor.subscribe('findAllPeoples');
  return {
    stakeholders: Peoples.find({
      _id: {
        $in: project && project.stakeHolders || []
      }
    }).fetch(),
    stakeholdersTemplate: Peoples.find({
      _id: {
        $in: template && template.stakeHolders || []
      }
    }).fetch(),
    project: Projects.findOne({_id: projectId}),
    template: Templates.findOne({_id: templateId}),
    companies: Companies.find({}).fetch(),
    impactsProject: Impacts.find({projectId: projectId}).fetch(),
    impactsTemplates: Impacts.find({templateId: templateId}).fetch(),
    company,
    currentCompany,
  };
})(withRouter(ImpactsTable));

export default ImpactsPage