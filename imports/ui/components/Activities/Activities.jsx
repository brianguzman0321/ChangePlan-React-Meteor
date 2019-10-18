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
        marginLeft: 74,
    },
    gridContainer: {
        marginBottom: 15,
        overFlow: 'hidden'
    },
});
export default function Activities(props){
    const classes = useStyles();
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    let menus = [
        {
            show: true,
            name: 'activities',
            count: 14
        },
        {
            show: true,
            name: 'stake Holders',
            count: 122
        },
        {
            name: 'reports',
            show: true
        }];
    return (
        <div>
            <TopNavBar menus={menus} {...props} />
            <Grid
                container
                direction="row"
                justify="flex-start"
                alignItems="center"
                className={classes.gridContainer}
                spacing={0}
            >
                <Grid item xs={2}>
                    <Typography color="textSecondary" variant="h4" className={classes.topHeading}>
                        Activities
                    </Typography>
                </Grid>
                <Grid item xs={4}>
                    <Tabs
                        classes={classes.activityTabs}
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