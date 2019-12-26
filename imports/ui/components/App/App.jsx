import React, {useEffect, useState} from 'react';
import {fade, makeStyles} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MoreIcon from '@material-ui/icons/MoreVert';
import {Link} from "react-router-dom";
import {withTracker} from "meteor/react-meteor-data";
import ProjectSelectMenu from '/imports/ui/components/utilityComponents/selectMenu'
import config from "../../../utils/config";
import {Projects} from "../../../api/projects/projects";
import {Companies} from "../../../api/companies/companies";
import {Meteor} from "meteor/meteor";

const Brand = (handleChange1) => (
  <Link to='/' onClick={handleChange1.handleChange1}>
    <img style={{width: 170, marginTop: 8}} src={`/branding/logo-long.png`}/>
  </Link>

);

const useStyles = makeStyles(theme => ({
  grow: {
    flexGrow: 1,
  },
  toolbar: {
    minHeight: 48,
    flexWrap: 'wrap',
    justifyContent: 'center'
  },
  menuButton: {
    marginRight: theme.spacing(2),
    marginLeft: theme.spacing(2),
  },
  topTexts: {
    paddingRight: theme.spacing(4),
    paddingLeft: theme.spacing(4),
    color: '#465563',
    fontWeight: 700,
    borderRight: '0.1em solid #eaecef',
    padding: '1em',
    cursor: 'pointer',
    '&:selected': {
      color: '#1890ff',
      fontWeight: theme.typography.fontWeightMedium,
    },
    '&:first-child': {
      borderLeft: '0.1em solid #eaecef'
    }

  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  },
  searchIcon: {
    width: theme.spacing(7),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 7),
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: 200,
    },
  },
  sectionDesktop: {
    marginLeft: '10px',
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  appBar: {
    background: '#ffffff',
    minHeight: 48
  }
}));

function TopNavBar(props) {
  let { menus, projectExists, history, match, projects, company, currentCompany } = props;
  let {projectId, templateId} = match.params;
  const [type, setType] = useState(templateId && 'template' ||  projectId && 'project');
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isChangeManager, setIsChangeManager] = useState(false);
  let currentLocation = history.location.pathname.split("/");
  let currentNav = currentLocation[currentLocation.length - 1], selectedTab = 0;
  if(currentNav === '/'){
    selectedTab = 0;
  }
  switch (currentNav) {
    case 'timeline':
      selectedTab = 1;
      break;
    case 'activities':
      selectedTab = 2;
      break;
    case 'stake-holders':
      selectedTab = 3;
      break;
    case 'reports':
      selectedTab = 4;
      break;
    default:
      break;
  }
  //if not supply menus hide by default
  if (!menus) {
    menus = [];
  }
  let displayMenus = menus.filter(item => item.show);
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const [value, setValue] = React.useState(selectedTab);
  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const checkRole = () => {
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
  };

  useEffect(() => {
    checkRole()
  }, [projectExists]);

  function handleProfileMenuOpen(event) {
    setAnchorEl(event.currentTarget);
  }

  function handleMobileMenuClose() {
    setMobileMoreAnchorEl(null);
  }

  function handleMenuClose() {
    setAnchorEl(null);
    handleMobileMenuClose();
  }

  function logOut() {
    Meteor.logout(() => {
      props.history.push('/login')
    });
  }

  function changeRoute(route) {
    props.history.push(makeRoute())
  }

  function handleChange1(event, value) {
    setValue(value);
    if (type === 'project') {
      switch (value) {
        case 0:
          props.history.push(`/projects/${projectId}`);
          break;
        case 1:
          props.history.push(`/projects/${projectId}/timeline`)
          break;
        case 2:
          props.history.push(`/projects/${projectId}/activities`);

          break;
        case 3:
          props.history.push(`/projects/${projectId}/stake-holders`);
          break;
        case 4:
          props.history.push(`/projects/${projectId}/reports`);
          break;
        default:
          break;
      }
    }
  if (type === 'template') {
    switch (value) {
      case 0:
        props.history.push(`/templates/${templateId}`);
        break;
      case 1:
        props.history.push(`/templates/${templateId}/timeline`)
        break;
      case 2:
        props.history.push(`/templates/${templateId}/activities`);
        break;
      case 3:
        props.history.push(`/templates/${templateId}/stake-holders`);
        break;
      case 4:
        props.history.push(`/templates/${templateId}/reports`);
        break;
      default:
        break;
    }
  }
  }

  function handleMobileMenuOpen(event) {
    setMobileMoreAnchorEl(event.currentTarget);
  }

  function makeRoute() {
    if (Roles.userIsInRole(Meteor.userId(), 'superAdmin')) {
      return '/admin/control-panel'
    }
    return '/control-panel'
  }

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{vertical: 'top', horizontal: 'right'}}
      id={menuId}
      keepMounted
      transformOrigin={{vertical: 'top', horizontal: 'right'}}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      {
        (projectExists || isSuperAdmin || isAdmin) && <MenuItem onClick={changeRoute}>Settings</MenuItem>
      }
      <MenuItem onClick={logOut}>Logout</MenuItem>
    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';

  return (
    <div className={classes.grow}>
      <AppBar position="static" className={classes.appBar} color="default">
        <Toolbar className={classes.toolbar}>
          <Brand handleChange1={handleChange1}/>
          <div className={classes.grow}>
            {projectId ?
              <ProjectSelectMenu title="Projects" entity="Project" entities={[]} localCollection="localProjects"
                                 id="projectId"/> : ''}
          </div>
          {displayMenus.length ? <Tabs
            value={value}
            onChange={handleChange1}
            centered
            indicatorColor="primary"
          >
            {displayMenus.map((item, index) => {
              return <Tab label={item.name.toUpperCase()} value={item.value} className={classes.topTexts} key={index}
                          style={{minWidth: 50}}/>
            })}
            <div className={classes.sectionDesktop}>
              <IconButton
                edge="end"
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                <AccountCircle/>
              </IconButton>
            </div>
            <div className={classes.sectionMobile}>
              <IconButton
                aria-label="show more"
                aria-controls={mobileMenuId}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                <MoreIcon/>
              </IconButton>
            </div>
          </Tabs> : <div>
            <div className={classes.sectionDesktop}>
              <IconButton
                edge="end"
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                <AccountCircle/>
              </IconButton>
            </div>
            <div className={classes.sectionMobile}>
              <IconButton
                aria-label="show more"
                aria-controls={mobileMenuId}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                <MoreIcon/>
              </IconButton>
            </div>
          </div>
          }
        </Toolbar>
      </AppBar>
      {renderMenu}
    </div>
  );
}

const TopNavBarPage = withTracker(props => {
  Meteor.subscribe('projectExists');
  let userId = Meteor.userId();
  const companies = Companies.find({}).fetch();
  const currentCompany = companies.find(company => company.peoples.includes(userId));
  Meteor.subscribe('companies');
  Meteor.subscribe('projects');
  const projectExists = Counter.get('projectExists');
  return {
    company: Companies.findOne({peoples: userId}),
    projectExists,
    currentCompany,
    projects: Projects.find({}).fetch(),
  }
})(TopNavBar);

export default TopNavBarPage