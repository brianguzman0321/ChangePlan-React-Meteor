import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';

import { Companies } from "/imports/api/companies/companies";
import { Projects } from "/imports/api/projects/projects";

import { withTracker } from "meteor/react-meteor-data";
import {Meteor} from "meteor/meteor";
import ControlledOpenSelect from '/imports/ui/components/admin/control-panel/selectionModal'
import ProjectsControlPanel from '/imports/ui/components/admin/control-panel/projectsSettings'
import TopNavBar from '/imports/ui/components/App/App'


function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
        <Typography
            component="div"
            role="tabpanel"
            hidden={value !== index}
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tab-${index}`}
            {...other}
        >
            <Box p={3}>{children}</Box>
        </Typography>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

function a11yProps(index) {
    return {
        id: `full-width-tab-${index}`,
        'aria-controls': `full-width-tabpanel-${index}`,
    };
}

const useStyles = makeStyles(theme => ({
    root: {
        backgroundColor: theme.palette.background.paper,
        // width: 500,
    },
}));

function FullWidthTabs(props) {
    const classes = useStyles();
    const theme = useTheme();
    const [value, setValue] = React.useState(0);

    function handleChange(event, newValue) {
        setValue(newValue);
    }

    function handleChangeIndex(index) {
        setValue(index);
    }

    useEffect(() => {
    });

    return (
        <div className={classes.root}>
            <TopNavBar {...props}/>
            <Divider />
            <AppBar position="static" color="default">
                <Tabs
                    value={0}
                    onChange={handleChange}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="fullWidth"
                    aria-label="full width tabs example"
                >
                    <Tab label="Projects" {...a11yProps(0)} />
                </Tabs>
            </AppBar>
            <SwipeableViews
                axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                index={value}
                onChangeIndex={handleChangeIndex}
            >
                <TabPanel value={value} index={0} dir={theme.direction}>
                    <br/>
                    {props.companies ? <ControlledOpenSelect {...props} title="Companies" entity="Company" entities={props.companies} localCollection="localCompanies" id="companyId"/> : ''}
                    <br/>
                    <ProjectsControlPanel {...props}/>
                </TabPanel>
            </SwipeableViews>
        </div>
    );
}


const ControlPanelPage = withTracker(props => {
    Meteor.subscribe('companies');
    Meteor.subscribe('projects');

    return {
        companies: Companies.find({}).fetch(),
        projects: Projects.find({}).fetch()
    };
})(FullWidthTabs);

export default ControlPanelPage