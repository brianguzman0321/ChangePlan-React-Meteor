import React from 'react';
import { fade, makeStyles } from '@material-ui/core/styles';
import TopNavBar from '/imports/ui/components/App/App'
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import PhoneIcon from '@material-ui/icons/Phone';
import FavoriteIcon from '@material-ui/icons/Favorite';
import PersonPinIcon from '@material-ui/icons/PersonPin';
import Icon from '@material-ui/core/Icon';
import ViewColumnIcon from '@material-ui/icons/ViewColumn';
import ListIcon from '@material-ui/icons/List';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import AWARENESSCard from './step1'
import Step2Card from './step2'
import Step3Card from './step3'
import config from '/imports/utils/config';

const useStyles = makeStyles({
    root: {
        // flexGrow: 1,
        // maxWidth: 400,
        // maxHeight: 200
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
export default function Activities(props){
    const classes = useStyles();
    const [value, setIndex] = React.useState(0);

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
                <Grid item xs={6} md={9}>
                    <Typography color="textSecondary" variant="h4" className={classes.topHeading}>
                        Activities
                    </Typography>
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
            <Grid
                container
                direction="row"
                justify="flex-start"
                alignItems="flex-start"
                spacing={0}
            >
                <Grid item xs={12} md={4}>
                    <AWARENESSCard />
                </Grid>
                <Grid item xs={12} md={4}>
                    <Step2Card />
                </Grid>
                <Grid item xs={12} md={4}>
                    <Step3Card />
                </Grid>
            </Grid>

        </div>
    )
}

function ActivitiesCard(props) {
    const useStyles1 = makeStyles(theme => ({
        title: {
            fontWeight: 1000,
            fontSize: 16
        }
    }));
    return <h1>Activities</h1>
}