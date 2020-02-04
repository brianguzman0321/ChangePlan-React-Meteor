import React, {useEffect, useState} from 'react';
import {withRouter} from 'react-router';
import {makeStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import IconButton from "@material-ui/core/IconButton/IconButton";
import Grid from '@material-ui/core/Grid';
import {InputBase} from '@material-ui/core';
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
}));

function ImpactsTable(props) {
  let menus = config.menus;
  const [search, setSearch] = React.useState('');
  const classes = useStyles();
  let {match, project, impactsProject, impactsTemplate, template, currentCompany} = props;
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
    }
    if (templateId && impactsTemplate) {
      setImpacts(impactsTemplate);
    }
  }, [impactsProject, impactsTemplate]);

  const handleOpenModal = () => {
    setShowAddImpact(true);
  };

  const handleCloseModal = () => {
    setShowAddImpact(false);
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
            <Grid item xs={4} className={classes.secondTab}>
              <Button variant="outlined" color="primary" className={classes.createNewImpact} onClick={handleOpenModal}>
                Add/Import
              </Button>
              <ImpactsModal currentType={type} project={project} open={showAddImpact} handleModalClose={handleCloseModal}
                            isNew={true} project={project} template={template} match={match} projectId={projectId} templateId={templateId}/>
            </Grid>
            : ''}
        </Grid>
        <ImpactsList className={classes.impactsList} template={template} company={currentCompany}
                         isChangeManager={isChangeManager} isActivityDeliverer={isActivityDeliverer} isActivityOwner={isActivityOwner}
                         isSuperAdmin={isSuperAdmin} isAdmin={isAdmin} isManager={isManager} projectId={projectId}
                         project={project} match={match}
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