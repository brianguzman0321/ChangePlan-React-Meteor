import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TopNavBar from '/imports/ui/components/App/App'
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Button from '@material-ui/core/Button';
import ViewColumnIcon from '@material-ui/icons/ViewColumn';
import ListIcon from '@material-ui/icons/List';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import AWARENESSCard from './step1'
import Step2Card from './step2'
import Step3Card from './step3'
import config from '/imports/utils/config';
import { withRouter } from 'react-router';
import {withTracker} from "meteor/react-meteor-data";
import { Activities } from '/imports/api/activities/activities'
import ListView from './ListView'

const useStyles = makeStyles({
    root: {
        // flexGrow: 1,
        // maxWidth: 400,
        // maxHeight: 200
    },
    activitiesGrid: {
        paddingRight: 20
    },
    activityTabs: {
        wrapper: {
            flexDirection:'row',
        },
    },
    iconTab: {
        display: 'flex',
        alignItems: 'center'
    },
    activityTab: {
        border: '0.5px solid #c5c6c7',
        minWidth: 101,
        '&:selected': {
            backgroundColor: '#3f51b5',
            color: '#ffffff'
        }
    },
    searchContainer: {
        marginTop: 13,
        overflow: 'hidden'
    },
    topHeading: {
        color: '#465563',
        marginLeft: 24,
    },
    gridContainer: {
        // marginBottom: 15,
        overFlow: 'hidden'
    },
    topBar: {
        marginTop: 13,
    }
});
function ActivitiesCard(props){
    const classes = useStyles();
    const [value, setIndex] = React.useState(0);
    const [addNew, setAddNew] = React.useState(false);

    const handleChange = (event, newValue) => {
        setIndex(newValue);
    };
    let menus = config.menus;
    return (
        <div>
            <TopNavBar menus={menus} {...props} />
            <Grid
                container
                direction="row"
                justify="space-between"
                alignItems="center"
                className={classes.gridContainer}
                spacing={0}
            >
                <Grid
                    container
                    className={classes.topBar}
                    direction="row"
                    justify="space-between"
                >
                    <Grid item xs={3} md={7}>
                        <Typography color="textSecondary" variant="h4" className={classes.topHeading}>
                            Activities
                        </Typography>
                    </Grid>
                    <Grid item xs={3} md={2}>
                        {
                            // value === 1 && <Button variant="outlined" color="primary" onClick={(e) => setAddNew(true)}>
                            false && <Button variant="outlined" color="primary" onClick={(e) => setAddNew(true)}>
                                Add Activity
                            </Button>
                        }

                    </Grid>
                    <Grid item xs={6} md={3}>
                        <Tabs
                            value={value}
                            onChange={handleChange}
                            indicatorColor="primary"
                            textColor="primary"
                            aria-label="icon tabs example"
                        >
                            <Tab className={classes.activityTab} label={<><div className={classes.iconTab}><ViewColumnIcon/>&nbsp; Board</div></>}/>
                            <Tab className={classes.activityTab} label={<><div className={classes.iconTab}><ListIcon/>&nbsp; List</div></>}/>
                        </Tabs>
                    </Grid>
                </Grid>
            </Grid>
            {
                value === 0 ?
                <Grid
                    container
                    direction="row"
                    justify="flex-start"
                    alignItems="flex-start"
                    spacing={0}
                    style={{paddingRight: 20}}
                >
                    <Grid item xs={12} md={4}>
                        <AWARENESSCard activities={props.activities.filter(activity => activity.step === 1)}/>
                    </Grid>
                    <Grid item xs={12} md={4} >
                        <Step2Card activities={props.activities.filter(activity => activity.step === 2)}/>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Step3Card activities={props.activities.filter(activity => activity.step === 3)}/>
                    </Grid>
                </Grid>: <ListView rows={props.activities} addNew={addNew}/>
            }

        </div>
    )
}



const ActivitiesPage = withTracker(props => {
    let { match } = props;
    let { projectId } = match.params;
    Meteor.subscribe('compoundActivities', projectId);
    return {
        activities : Activities.find().fetch()
    };
})(withRouter(ActivitiesCard));

export default ActivitiesPage