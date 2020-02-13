import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TopNavBar from '/imports/ui/components/App/App'
import config from '/imports/utils/config';
import Grid from "@material-ui/core/Grid/Grid";
import Typography from "@material-ui/core/Typography/Typography";
import ImpactReport from "./ImpactReport";


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
        fontSize: '1.8rem',
        fontWeight: 500,
        lineHeight: 1.5,
        letterSpacing: '-0.015em',
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

export default function Reports(props){
    let menus = config.menus;
    const classes = useStyles();
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
                            Reports
                        </Typography>
                    </Grid>
                </Grid>
                <Grid container direction="row" justify="space-between">
                    <ImpactReport match={props.match}/>
                </Grid>
            </Grid>
        </div>
    )
}
