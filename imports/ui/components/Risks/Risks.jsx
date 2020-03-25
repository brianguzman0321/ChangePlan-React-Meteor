import React, {useEffect, useState} from 'react';
import {withRouter} from 'react-router';
import {makeStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import {withTracker} from "meteor/react-meteor-data";
import {Companies} from "/imports/api/companies/companies";
import {Projects} from "/imports/api/projects/projects";
import TopNavBar from '/imports/ui/components/App/App';
import config from '/imports/utils/config';
import {Activities} from "../../../api/activities/activities";
import {Meteor} from "meteor/meteor";
import Button from "@material-ui/core/Button";
import {Risks} from "../../../api/risks/risks";
import RisksList from "./RisksList";
import RisksModal from "./Modal/RisksModal";
import {InputBase} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from "@material-ui/core/SvgIcon/SvgIcon";
import SideMenu from "../App/SideMenu";


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
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  createNewRisk: {
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
  risksList: {
    margin: theme.spacing(2)
  },
  risksCount: {
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

function RisksTable(props) {
  let menus = config.menus;
  const classes = useStyles();
  let {match, project, currentCompany, allRisks} = props;
  let {projectId, templateId} = match.params;
  project = project || {};
  const [risks, setRisks] = useState([]);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isChangeManager, setIsChangeManager] = useState(false);
  const [isManager, setIsManager] = useState(false);
  const [isActivityDeliverer, setIsActivityDeliverer] = useState(false);
  const [isActivityOwner, setIsActivityOwner] = useState(false);
  const [showAddRisk, setShowAddRisk] = useState(false);
  const [search, setSearch] = useState('');
  const [currentCompanyId, setCompanyId] = useState(null);

  useEffect(() => {
    checkRoles();
  }, [currentCompany, project]);

  useEffect(() => {
    if (currentCompany) {
      setCompanyId(currentCompany._id);
    }
  }, [currentCompany, project]);

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
    if (projectId && allRisks && currentCompany) {
      getUsers();
    }
  }, [allRisks, projectId, currentCompany]);

  const getUsers = () => {
    let currentRisks = [...new Set(allRisks)];
    Meteor.call(`users.getAllUsersInCompany`, {company: currentCompany}, (err, res) => {
      if (err) {
        props.enqueueSnackbar(err.reason, {variant: 'error'});
      }
      if (res && res.length) {
        let users = res.map(user => {
          return {
            name: `${user.profile.firstName} ${user.profile.lastName}`,
            lastName: user.profile.lastName,
            id: user._id,
          }
        });
        currentRisks = currentRisks.map(risk => {
          const currentRisk = {...risk};
          const user = users.find(_user => _user.id === risk.owner);
          if (user) {
            currentRisk.ownerName = user.name;
            currentRisk.ownerLastName = user.lastName;
          }
          return currentRisk;
        })
      }
      setRisks(currentRisks);
    });
    setRisks(currentRisks);
  };

  const handleOpenModal = () => {
    setShowAddRisk(true);
  };

  const handleCloseModal = () => {
    setShowAddRisk(false);
  };

  const searchFilter = event => {
    setSearch(event.target.value);
  };

  return (
    <div className={classes.root}>
      <SideMenu menus={menus} {...props} />
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
          <Grid container className={classes.topBar}>
            <Grid item xs={12} sm={6} md={4}>
              <Typography color="textSecondary" variant="h4" className={classes.topHeading}>
                Risks
                &nbsp;&nbsp;&nbsp;
                <span
                  className={classes.risksCount}>{risks.length}</span>
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
            {((isAdmin || isSuperAdmin || isChangeManager)) ?
              <Grid item xs={4} md={1} sm={2} className={classes.secondTab}>
                <Button variant="outlined" color="primary" className={classes.createNewRisk} onClick={handleOpenModal}>
                  Add
                </Button>
                <RisksModal project={project} open={showAddRisk} handleModalClose={handleCloseModal}
                            company={currentCompany}
                            isNew={true} match={match} projectId={projectId}/>
              </Grid>
              : ''}
          </Grid>
          <RisksList className={classes.risksList} company={currentCompany}
                     isChangeManager={isChangeManager} isActivityDeliverer={isActivityDeliverer}
                     isActivityOwner={isActivityOwner}
                     isSuperAdmin={isSuperAdmin} isAdmin={isAdmin} isManager={isManager} projectId={projectId}
                     project={project} match={match}
                     rows={risks}/>
        </Grid>
      </main>
    </div>
  )
}

const RisksPage = withTracker(props => {
  let {match} = props;
  let {projectId} = match.params;
  Meteor.subscribe('companies');
  Meteor.subscribe('compoundProject', projectId);
  Meteor.subscribe('projects');
  Meteor.subscribe('risks.findAll');
  let project = Projects.findOne({
    _id: projectId
  });
  const company = Companies.findOne({_id: project && project.companyId});
  const currentCompany = company;
  return {
    project: Projects.findOne({_id: projectId}),
    companies: Companies.find({}).fetch(),
    allRisks: Risks.find({projectId: projectId}).fetch(),
    company,
    currentCompany,
  };
})(withRouter(RisksTable));

export default RisksPage