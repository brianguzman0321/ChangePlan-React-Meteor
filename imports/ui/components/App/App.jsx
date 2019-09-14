import React from 'react';
import { fade, makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
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

const Brand = () => (
    <img style={{ width: "200px" }} src={`/branding/logo-long.png`} />
);

const useStyles = makeStyles(theme => ({
    grow: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
        marginLeft: theme.spacing(2),
    },
    topTexts: {
        paddingRight: theme.spacing(4),
        paddingLeft: theme.spacing(4),
        color : '#92a1af',
        borderRight: '0.1em solid #eaecef',
        padding: '1em',
        cursor: 'pointer'
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
        background: '#ffffff'
    }
}));

export default function PrimarySearchAppBar() {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

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
        Meteor.logout()
    }

    function handleMobileMenuOpen(event) {
        setMobileMoreAnchorEl(event.currentTarget);
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
            <MenuItem onClick={handleMenuClose}>My account</MenuItem>
            <MenuItem onClick={handleMenuClose}>Logout</MenuItem>
        </Menu>
    );

    const mobileMenuId = 'primary-search-account-menu-mobile';

    return (
        <div className={classes.grow}>
            <AppBar position="static" className={classes.appBar} color="default">
                <Toolbar>
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
                    <Typography className={classes.topTexts} noWrap style={{borderLeft: '0.1em solid #eaecef'}}>
                        <span style={{color: '#aab5c0'}}>102</span> ACTIVITIES
                    </Typography>
                    <Typography className={classes.topTexts} noWrap>
                        <span style={{color: '#aab5c0'}}>3270</span> STAKEHOLDERS
                    </Typography>
                    <Typography className={classes.topTexts} noWrap>
                        REPORTS
                    </Typography>
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