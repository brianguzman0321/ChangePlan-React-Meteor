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
import StakeHolderList from './StakeHoldersList'
import AddStakeHolder from './Modals/AddStakeHolder';
import AddActivity from "../Activities/Modals/AddActivity2";
import Step3Card from "../Activities/step3";


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
}));

function StakeHolders(props) {
  let menus = config.menus;
  const [search, setSearch] = React.useState('');
  const classes = useStyles();
  let {match, project, template, stakeHoldersTemplate, stakeHolders, company, currentCompany} = props;
  let {projectId, templateId} = match.params;
  project = project || {};
  template = template || {};
  const [type, setType] = useState(templateId && 'template' || projectId && 'project');
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isChangeManager, setIsChangeManager] = useState(false);
  const [currentCompanyId, setCompanyId] = useState(null);

  const searchFilter = event => {
    setSearch(event.target.value);
    updateFilter('localPeoples', 'search', event.target.value);
  };

  useEffect(() => {
    if (currentCompany) {
      checkRoles();
    }
  }, [currentCompany, company]);

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
              Stakeholders
              &nbsp;&nbsp;&nbsp;
              <span
                className={classes.stakeholdersCount}>{type === 'project' ? stakeHolders.length : stakeHoldersTemplate.length}</span>
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
          {((isAdmin && template && (template.companyId === currentCompanyId)) || isSuperAdmin || projectId !== undefined) ?
            <Grid item xs={4} className={classes.secondTab}>
              <AddStakeHolder type={type}/>
            </Grid>
            : ''}
        </Grid>
        <StakeHolderList className={classes.stakeHoldersList} template={template} company={company}
                         isSuperAdmin={isSuperAdmin} isAdmin={isAdmin} projectId={projectId}
                         rows={type === 'project' ? stakeHolders : stakeHoldersTemplate} type={type}/>
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
  Meteor.subscribe('companies');
  Meteor.subscribe('compoundProject', projectId);
  Meteor.subscribe('templates');
  Meteor.subscribe('projects');
  const companies = Companies.find({}).fetch();
  const currentCompany = companies.find(company => company.peoples.includes(userId));
  let company = Companies.findOne() || {};
  let project = Projects.findOne({
    _id: projectId
  });
  let template = Templates.findOne({_id: templateId});
  let companyId = company._id || {};
  Meteor.subscribe('peoples', companyId, {
    name: local.search
  });
  return {
    company: Companies.findOne(),
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
    currentCompany,
  };
})(withRouter(StakeHolders));

export default StakeHoldersPage