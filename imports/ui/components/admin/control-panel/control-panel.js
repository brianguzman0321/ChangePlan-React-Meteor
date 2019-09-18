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


import MaterialTable from 'material-table';
import {createContainer, withTracker} from "meteor/react-meteor-data";
import {Meteor} from "meteor/meteor";

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
                    <ProjectsControlPanel {...props}/>
                </TabPanel>
                <TabPanel value={value} index={1} dir={theme.direction}>
                    Projects
                </TabPanel>
            </SwipeableViews>
        </div>
    );
}

//
function ProjectsControlPanel(props) {
    const [companies, setCompanies] = React.useState({});
    const [state, setState] = React.useState({
        columns: [
            { title: 'FirstName', field: 'firstName', editable: 'onAdd' },
            { title: 'LastName', field: 'lastName', editable: 'onAdd'},
            { title: 'Email', field: 'email', editable: 'onAdd'},
            {
                title: 'Company',
                field: 'company',
                lookup: {},
            },
            {
                title: 'Role',
                field: 'role',
                lookup: {
                    admin: 'Admin',
                    manager: 'Manager',
                    changeManager: 'Change Manager',
                    activityOwner: 'Activity Owner',
                },
            },
        ],
        data: [],
    });


    const getUsers = () => {
        Meteor.call('users.getAllusers', (err, res) => {
            if(res){
                let data = [...state.data];
                data = res.map(user => {
                    return {
                        firstName: user.profile.firstName,
                        lastName: user.profile.lastName,
                        email: user.emails[0].address,
                        role: 'manager',
                        company: 'PTXYQkJd6qwJdRYYD'
                    }

                });
                setState({ ...state, data });
            }
        })
    };

    const updateColumns = (companies) => {
        setCompanies(companies);
        let columns = [...state.columns];
        if(!Object.keys(columns[columns.length - 2].lookup).length){
            columns[columns.length - 2].lookup = companies;
            setState({...state, columns});
        }

    };

    useEffect(() => {

        if(!state.data.length){
            getUsers();
            if(!Object.keys(companies).length){
                if(props.companies && props.companies.length){
                    let companies1 = props.companies.reduce(function(acc, cur, i) {
                        acc[cur._id] = cur.name;
                        return acc;
                    }, {});
                    updateColumns(companies1);
                }

            }
        }




    });


    return (
        <MaterialTable
            title="Control Panel"
            columns={state.columns}
            options={{
                actionsColumnIndex: -1
            }}
            data={state.data}
            editable={{
                onRowAdd: newData =>
                    new Promise(resolve => {
                        setTimeout(() => {
                            resolve();
                            const data = [...state.data];
                            data.push(newData);
                            setState({ ...state, data });
                        }, 600);
                    }),
                onRowUpdate: (newData, oldData) =>
                    new Promise(resolve => {
                        setTimeout(() => {
                            resolve();
                            const data = [...state.data];
                            data[data.indexOf(oldData)] = newData;
                            setState({ ...state, data });
                        }, 600);
                    }),
                onRowDelete: oldData =>
                    new Promise(resolve => {
                        setTimeout(() => {
                            resolve();
                            const data = [...state.data];
                            data.splice(data.indexOf(oldData), 1);
                            setState({ ...state, data });
                        }, 600);
                    }),
            }}
        />
    );
}

const ControlPanelPage = withTracker(props => {
    // Do all your reactive data access in this method.
    // Note that this subscription will get cleaned up when your component is unmounted
    // const handle = Meteor.subscribe('todoList', props.id);
    Meteor.subscribe('companies');

    return {
        companies: Companies.find({}).fetch()
    };
})(FullWidthTabs);

export default ControlPanelPage