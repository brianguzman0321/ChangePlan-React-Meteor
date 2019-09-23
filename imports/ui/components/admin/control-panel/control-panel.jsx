import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import { Companies } from "/imports/api/companies/companies";
import { Projects } from "/imports/api/projects/projects";

import MaterialTable from 'material-table';
import { withTracker } from "meteor/react-meteor-data";
import {Meteor} from "meteor/meteor";
import ControlledOpenSelect from './selectionModal'
import CompaniesControlPanel from './companiesSettings'
import ProjectsControlPanel from './projectsSettings'


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
            <AppBar position="static" color="default">
                <Tabs
                    value={value}
                    onChange={handleChange}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="fullWidth"
                    aria-label="full width tabs example"
                >
                    <Tab label="Companies" {...a11yProps(0)} />
                    <Tab label="Projects" {...a11yProps(1)} />
                </Tabs>
            </AppBar>
            <SwipeableViews
                axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                index={value}
                onChangeIndex={handleChangeIndex}
            >
                <TabPanel value={value} index={0} dir={theme.direction}>
                    <br/>
                    {props.companies ? <ControlledOpenSelect {...props}
                                                             title="Companies"
                                                             entity="Company"
                                                             entities={props.companies}
                                                             localCollection="localCompanies"
                                                             id="companyId"
                    /> : ''}
                    <br/>
                    <CompaniesControlPanel {...props} parentProps="localCompanies"/>
                </TabPanel>
                <TabPanel value={value} index={1} dir={theme.direction}>
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
    // Do all your reactive data access in this method.
    // Note that this subscription will get cleaned up when your component is unmounted
    // const handle = Meteor.subscribe('todoList', props.id);
    Meteor.subscribe('companies');
    Meteor.subscribe('projects');
    // let { parentProps } = props;
    // let local = LocalCollection.findOne({
    //     name: parentProps.collection
    // });
    // //get dynamic type based of selected transactions types
    // let categoriesType = local.type === 'expenses' ? 'expense' : 'income';
    //
    // const categories = Categories.find({type: categoriesType}).fetch();

    return {
        companies: Companies.find({}).fetch(),
        projects: Projects.find({}).fetch()
        // categories,
        // local
    };
})(FullWidthTabs);

export default ControlPanelPage