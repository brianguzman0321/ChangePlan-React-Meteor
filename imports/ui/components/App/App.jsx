import React from 'react';
import { fade, makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import Badge from '@material-ui/core/Badge';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MailIcon from '@material-ui/icons/Mail';
import NotificationsIcon from '@material-ui/icons/Notifications';
import MoreIcon from '@material-ui/icons/MoreVert';
import {Link} from "react-router-dom";
import {withTracker} from "meteor/react-meteor-data";
import { Companies } from "../../../api/companies/companies";
import {Projects} from "../../../api/projects/projects";

const Brand = () => (
    <Link to='/'>
        <img style={{ width: 200, marginTop: 8 }} src={`/branding/logo-long.png`} />
    </Link>

);

const useStyles = makeStyles(theme => ({
    grow: {
        flexGrow: 1,
    },
    toolbar: {
        minHeight: 48
    },
    menuButton: {
        marginRight: theme.spacing(2),
        marginLeft: theme.spacing(2),
    },
    topTexts: {
        paddingRight: theme.spacing(4),
        paddingLeft: theme.spacing(4),
        color : '#465563',
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
    let { menus, projectExists } = props;
    //if not supply menus hide by default
    if(!menus){
        menus = [
            {
                show: false,
                name: 'activities'
            },
            {
                show: false,
                name: 'stake Holders',
            },
            {
                show: false,
                name: 'reports'
            }
        ];
    }
    let displayMenus = menus.filter(item => item.show);
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
    const [value, setValue] = React.useState(0);

    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

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

    function handleChange1 (event, value) {
        setValue(value)
    }

    function handleMobileMenuOpen(event) {
        setMobileMoreAnchorEl(event.currentTarget);
    }

    function makeRoute(){
        if(Roles.userIsInRole(Meteor.userId(), 'superAdmin')){
            return '/admin/control-panel'
        }
        return 'control-panel'
    }

    const menuId = 'primary-search-account-menu';
    const renderMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            id={menuId}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            {
                projectExists && <MenuItem onClick={changeRoute} >Settings</MenuItem>
            }
            <MenuItem onClick={logOut}>Logout</MenuItem>
        </Menu>
    );

    const mobileMenuId = 'primary-search-account-menu-mobile';

    return (
        <div className={classes.grow}>
            <AppBar position="static" className={classes.appBar} color="default">
                <Toolbar className={classes.toolbar}>
                    <Brand />
                    {/*<IconButton*/}
                        {/*edge="start"*/}
                        {/*className={classes.menuButton}*/}
                        {/*color="inherit"*/}
                        {/*aria-label="open drawer"*/}
                    {/*>*/}
                        {/*<MenuIcon />*/}
                    {/*</IconButton>*/}
                    {/*<Typography className={classes.title} variant="h6" noWrap>*/}
                        {/*Material-UI*/}
                    {/*</Typography>*/}
                    {/*<div className={classes.search}>*/}
                        {/*<div className={classes.searchIcon}>*/}
                            {/*<SearchIcon />*/}
                        {/*</div>*/}
                        {/*<InputBase*/}
                            {/*placeholder="Search…"*/}
                            {/*classes={{*/}
                                {/*root: classes.inputRoot,*/}
                                {/*input: classes.inputInput,*/}
                            {/*}}*/}
                            {/*inputProps={{ 'aria-label': 'search' }}*/}
                        {/*/>*/}
                    {/*</div>*/}
                    <div className={classes.grow} />
                    {displayMenus.length ? <Tabs
                        value={value}
                        onChange={handleChange1}
                        centered
                        indicatorColor="primary"
                        // style={navStyle}
                    >
                        {displayMenus.map((item, index) => {
                            return <Tab label={item.name.toUpperCase()} className={classes.topTexts} value={index}/>
                        })}
                    </Tabs> : ''
                    }

                    {/*{menus.activities.show && <Typography className={classes.topTexts} noWrap style={{borderLeft: '0.1em solid #eaecef'}}>*/}
                        {/*<span style={{color: '#aab5c0'}}>102</span> ACTIVITIES*/}
                    {/*</Typography>}*/}
                    {/*{*/}
                        {/*menus.stakeHolders.show && <Typography className={classes.topTexts} noWrap>*/}
                            {/*<span style={{color: '#aab5c0'}}>3270</span> STAKEHOLDERS*/}
                        {/*</Typography>*/}
                    {/*}*/}
                    {/*{*/}
                        {/*menus.reports.show && <Typography className={classes.topTexts} noWrap>*/}
                            {/*REPORTS*/}
                        {/*</Typography>*/}
                    {/*}*/}

                    <div className={classes.sectionDesktop}>
                        <IconButton
                            edge="end"
                            aria-label="account of current user"
                            aria-controls={menuId}
                            aria-haspopup="true"
                            onClick={handleProfileMenuOpen}
                            color="inherit"
                        >
                            <AccountCircle />
                        </IconButton>
                    </div>
                    <div className={classes.sectionMobile}>
                        <IconButton
                            aria-label="show more"
                            aria-controls={mobileMenuId}
                            aria-haspopup="true"
                            onClick={handleMobileMenuOpen}
                            color="inherit"
                        >
                            <MoreIcon />
                        </IconButton>
                    </div>
                </Toolbar>
            </AppBar>
            {renderMenu}
        </div>
    );
}

const TopNavBarPage = withTracker(props => {
    Meteor.subscribe('projectExists');
    const projectExists = Counter.get('projectExists');
    return {
        projectExists
    }
})(TopNavBar);

export default TopNavBarPage