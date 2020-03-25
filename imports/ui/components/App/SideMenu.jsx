import React, {useEffect, useState} from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import AppBar from "@material-ui/core/AppBar";
import clsx from "clsx";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from '@material-ui/icons/Menu';
import Drawer from "@material-ui/core/Drawer";
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import List from "@material-ui/core/List";
import {makeStyles, useTheme, withStyles} from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import {Link} from "react-router-dom";
import SVGInline from "react-svg-inline";
import config from "../../../utils/config";
import {LinearProgress, Typography} from "@material-ui/core";
import {withTracker} from "meteor/react-meteor-data";
import {Meteor} from "meteor/meteor";
import {Companies} from "../../../api/companies/companies";
import {Projects} from "../../../api/projects/projects";
import {Activities} from "../../../api/activities/activities";
import {Risks} from "../../../api/risks/risks";
import {Peoples} from "../../../api/peoples/peoples";
import Grid from "@material-ui/core/Grid";
import {getTotalStakeholders} from "../../../utils/utils";
import {Impacts} from "../../../api/impacts/impacts";
import Button from "@material-ui/core/Button";
import ProjectSelectMenu from "../utilityComponents/selectMenu";
import AccountCircle from '@material-ui/icons/AccountCircle';
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import SearchIcon from '@material-ui/icons/Search';
import NotificationsIcon from '@material-ui/icons/Notifications';

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  appBar: {
    backgroundColor: '#465664',
    boxShadow: 'none',
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    backgroundColor: '#465664',
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerOpen: {
    border: 'none',
    backgroundColor: '#f4f5f7',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    border: 'none',
    backgroundColor: '#f4f5f7',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(6) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(8) + 1,
    },
  },
  toolbar: {
    backgroundColor: '#465664',
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
  menuList: {
    backgroundColor: '#f4f5f7',
  },
  menuListText: {
    fontWeight: 600,
    fontSize: '1.1rem'
  },
  gridContainer: {
    textAlign: 'right',
  },
  activitiesCompleted: {
    color: '#92a1af'
  },
  gridProgress: {
    padding: '10px'
  },
  svg: {
    filter: 'brightness(0) invert(1)',
  },
  button: {
    whiteSpace: 'nowrap',
    textTransform: 'none',
    height: '46px',
    marginLeft: '10px',
    color: 'white',
    backgroundColor: '#465664',
    borderColor: 'black',
  },
  sectionDesktop: {
    marginLeft: '10px',
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  icon: {
    color: '#92a1af',
    padding: '12px 10px 12px 12px',
    whiteSpace: 'nowrap',
    textTransform: 'none',
  },
  userName: {
    color: '#f5f5f5',
    marginLeft: '5px',
  }
}));

const StyledListItem = withStyles({
  root: {
    color: '#566572',
    "&$selected": {
      color: 'white',
      backgroundColor: '#4294db'
    }
  },
  selected: {}
})(ListItem);

function SideMenu(props) {
  let {history, menus, match, projects, company, currentCompany, allStakeholders, allActivities, allRisks, allImpacts} = props;
  let {projectId, templateId} = match.params;
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isChangeManager, setIsChangeManager] = useState(false);
  const [isManager, setIsManager] = useState(false);
  const [isActivityDeliverer, setIsActivityDeliverer] = useState(false);
  const [isActivityOwner, setIsActivityOwner] = useState(false);
  const [stakeholders, setStakeholders] = useState([]);
  const [activities, setActivities] = useState([]);
  const [risks, setRisks] = useState([]);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [impacts, setImpacts] = useState([]);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const type = projectId ? 'project' : 'template';
  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const [displayMenus, setDisplayMenus] = useState([]);
  const [selectedListItem, setSelectedListItem] = useState(0);

  const checkRole = () => {
    const userId = Meteor.userId();
    if (Roles.userIsInRole(userId, 'superAdmin')) {
      setIsSuperAdmin(true);
    }
    if (currentCompany && currentCompany.admins.includes(userId)) {
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
    if (allStakeholders && projects && projectId) {
      const currentProject = projects.find(project => project._id === projectId);
      currentProject && setStakeholders(currentProject.stakeHolders);
    }
  }, [allStakeholders, projectId, projects]);

  useEffect(() => {
    if (allStakeholders) {
      setActivities(allActivities.filter(activity => activity.projectId === projectId));
    }
  }, [allActivities, projectId]);

  useEffect(() => {
    if (allRisks) {
      setRisks(allRisks.filter(risk => risk.projectId === projectId));
    }
  }, [allRisks, projectId]);

  useEffect(() => {
    if (allImpacts) {
      setImpacts(allImpacts.filter(impact => impact.projectId === projectId))
    }
  }, [allImpacts, projectId]);

  useEffect(() => {
    checkRole()
  }, [company, projects]);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  useEffect(() => {
    let currentLocation = history.location.pathname.split("/");
    let currentNav = currentLocation[currentLocation.length - 1];
    const navigation = [`${projectId}`, 'impacts', 'risks', 'stake-holders', 'activities', 'timeline', 'reports', 'all-stakeholders', 'all-reports'];
    setSelectedListItem(navigation.indexOf(currentNav));
  }, [history]);

  const handleChange = (value) => {
    if (value === 7) {
      props.history.push(`/all-stakeholders`);
    }
    if (value === 8) {
      props.history.push(`/all-reports`);
    }
    if (type === 'project' && value !== 7 && value !== 8) {
      const routes = ['', '/impacts', '/risks', '/stake-holders', '/activities', '/timeline', '/reports'];
      props.history.push(`/projects/${projectId}${routes[value]}`);
    }
    if (type === 'template' && value !== 7 && value !== 8) {
      const routes = ['', '/impacts', '/risks', '/stake-holders', '/activities', '/timeline', '/reports'];
      props.history.push(`/projects/${projectId}${routes[value]}`);
    }
  };

  const getAdditionalInfo = (value) => {
    switch (value) {
      case 1:
        return impacts.length;
      case 2:
        return risks.length;
      case 3:
        return getTotalStakeholders(allStakeholders, stakeholders);
      case 4:
        return activities.length;
      default:
        return 0;
    }
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    setDisplayMenus(menus ? menus.filter(item => item.show) : config.adminMenus);
  }, [menus]);

  const getProgress = () => {
    return Math.trunc((100 * (activities.filter(activity => activity.completed).length)) / activities.length)
  };

  const logOut = () => {
    Meteor.logout(() => {
      props.history.push('/login')
    });
  };

  const changeRoute = (route) => {
    props.history.push(makeRoute());
  };

  const makeRoute = () => {
    if (Roles.userIsInRole(Meteor.userId(), 'superAdmin')) {
      return '/admin/control-panel'
    }
    return '/control-panel'
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const getName = () => {
    const user = Meteor.users.findOne({_id: Meteor.userId()});
    return `${user.profile.firstName} ${user.profile.lastName}`
  };

  useEffect(() => {
    setUserName(getName());
  }, []);

  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{vertical: 'top', horizontal: 'right'}}
      id={'primary-search-account-menu'}
      keepMounted
      transformOrigin={{vertical: 'top', horizontal: 'right'}}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      {
        (isSuperAdmin || isAdmin) && <MenuItem onClick={changeRoute}>Settings</MenuItem>
      }
      <MenuItem onClick={logOut}>Logout</MenuItem>
    </Menu>
  );

  return (
    <div>
      <CssBaseline/>
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, {
              [classes.hide]: open,
            })}
          >
            <MenuIcon/>
          </IconButton>
          {!open && <Link to='/' onClick={() => history.push('/')}>
            <img style={{width: 170, marginTop: 8}} src={`/branding/logo-white.svg`}/>
          </Link>}
          <Grid container direction="row" justify="flex-start" alignItems="center">
            {projectId ? <Grid item xs={6}>
              <Grid container direction="row" justify="flex-start" alignItems="flex-start">
                <Grid item xs={4}>
                  <Button variant="outlined" className={classes.button} onClick={() => history.push('/')}>
                    All Projects</Button>
                </Grid>
                <Grid item xs={6}>
                  <ProjectSelectMenu title="Projects" entity="Project" entities={[]} localCollection="localProjects"
                                     currentCompany={currentCompany} id="projectId" isSuperAdmin={isSuperAdmin}
                                     isAdmin={isAdmin} isManager={isManager} isChangeManager={isChangeManager}
                                     isActivityDeliverer={isActivityDeliverer} isActivityOwner={isActivityOwner}/>
                </Grid>
              </Grid>
            </Grid> : <Grid item xs={6}/>}
            <Grid item xs={6}>
              <Grid container direction="row" justify="flex-end" alignItems="flex-start">
                <Grid item xs={1}>
                  <div className={classes.sectionDesktop}>
                    <IconButton
                      edge="end"
                      aria-label="account of current user"
                      aria-controls={'primary-search-account-menu'}
                      aria-haspopup="true"
                      className={classes.icon}
                    >
                      <SearchIcon/>
                    </IconButton>
                  </div>
                </Grid>
                <Grid item xs={1}>
                  <div className={classes.sectionDesktop}>
                    <IconButton
                      edge="end"
                      aria-label="account of current user"
                      aria-controls={'primary-search-account-menu'}
                      aria-haspopup="true"
                      className={classes.icon}
                    >
                      <NotificationsIcon/>
                    </IconButton>
                  </div>
                </Grid>
                <Grid item xs={4}>
                  <div className={classes.sectionDesktop}>
                    <Button
                      edge="end"
                      aria-label="account of current user"
                      aria-controls={'primary-search-account-menu'}
                      aria-haspopup="true"
                      onClick={handleProfileMenuOpen}
                      className={classes.icon}
                    >
                      <AccountCircle/>
                      <Typography variant='caption' className={classes.userName}>{userName}</Typography>
                    </Button>
                  </div>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      {renderMenu}
      <Drawer
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          }),
        }}
        open={open}
      >
        <div className={classes.toolbar}>
          <Link to='/' onClick={() => history.push('/')}>
            <img style={{width: 170, marginTop: 8}} src={`/branding/logo-white.svg`}/>
          </Link>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon/> : <ChevronLeftIcon/>}
          </IconButton>
        </div>
        <List className={classes.menuList}>
          {displayMenus.map((menu) => (
            <StyledListItem button key={menu.name} selected={selectedListItem === menu.value}
                            onClick={() => handleChange(menu.value)}>
              <ListItemIcon>
                <SVGInline
                  width="25px"
                  height="25px"
                  className={selectedListItem === menu.value ? classes.svg : null}
                  svg={menu.iconSvg}/>
              </ListItemIcon>
              <ListItemText primary={
                <Grid container direction={"row"} alignItems={"center"} justify={"space-between"}>
                  <Typography className={classes.menuListText}>{menu.name}</Typography>
                  {[1, 2, 3, 4].includes(menu.value) &&
                  open && <Typography variant={'caption'}>{getAdditionalInfo(menu.value)}</Typography>}
                </Grid>
              }/>
            </StyledListItem>
          ))}
        </List>
        {open && projectId &&
        <Grid container direction="row" justify="space-between" alignItems="center" className={classes.gridProgress}>
          <Grid item xs={6}>
            <Typography variant={'caption'}>{`${getProgress()}%`}</Typography>
          </Grid>
          <Grid item xs={6} className={classes.gridContainer}>
            <Typography variant={'caption'} className={classes.activitiesCompleted}>
              {`${activities.filter(activity => activity.completed).length}/${activities.length}completed`}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <LinearProgress color="primary" value={activities.length} variant="determinate"
                            valueBuffer={activities.filter(activity => activity.completed).length}/>
          </Grid>
        </Grid>}
      </Drawer>
    </div>
  )
};

const SideMenuPage = withTracker(props => {
  let userId = Meteor.userId();
  Meteor.subscribe('companies');
  const companies = Companies.find({}).fetch();
  const currentCompany = companies.find(company => company.peoples.includes(userId));
  Meteor.subscribe('projects');
  Meteor.subscribe('activities.notLoggedIn');
  Meteor.subscribe('risks.findAll');
  Meteor.subscribe('findAllPeoples');
  Meteor.subscribe('impacts.findAll');
  return {
    company: Companies.findOne({peoples: userId}),
    currentCompany,
    projects: Projects.find({}).fetch(),
    allImpacts: Impacts.find({}).fetch(),
    allActivities: Activities.find({}).fetch(),
    allRisks: Risks.find({}).fetch(),
    allStakeholders: Peoples.find({}).fetch(),
  }
})(SideMenu);

export default SideMenuPage;