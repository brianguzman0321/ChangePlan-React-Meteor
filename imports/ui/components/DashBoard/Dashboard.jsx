import React from 'react';
import TopNavBar from '/imports/ui/components/App/App';
import Grid from "@material-ui/core/Grid/Grid";
import Typography from "@material-ui/core/Typography/Typography";
import Button from "@material-ui/core/Button/Button";
import {makeStyles} from "@material-ui/core";
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';

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
    displayHeading: {
        color: '#465563',
        fontSize: 18
    },
    gridContainer: {
        // marginBottom: 15,
        overFlow: 'hidden'
    },
    topBar: {
        marginTop: 13,
    },
    firstRowCard: {
        minWidth: 275,
        margin: 12
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
    firstRow: {
        margin: 12
    }
});

export default function Dashboard(props){
    let { match } = props;
    let { projectId } = match.params;
    const classes = useStyles();
    let { params } = props.match;
    let menus = [
        {
            show: true,
            name: 'dashboard',
            count: 14
        },
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
    if (!params.projectId){
        menus = []
    }
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
            </Grid>
            <Grid
                container
                className={classes.topBar}
                direction="row"
                justify="space-between"
            >
                <Grid item xs={12}>
                    <Typography color="textSecondary" variant="h4" className={classes.topHeading}>
                        Dashboard
                    </Typography>
                </Grid>
                <Grid
                    container
                    direction="row"
                    justify="space-between"
                    alignItems="center"
                    className={classes.firstRow}
                    spacing={0}
                >
                    <Grid item xs={6}>
                        <Card className={classes.firstRowCard}>
                            <CardContent>
                                <Typography className={classes.displayHeading} gutterBottom>
                                    Change management activities
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Grid
                                    container
                                    direction="row"
                                    justify="flex-end"
                                    alignItems="baseline"
                                >
                                    <Button size="small" align="right" color="primary" onClick={() => props.history.push(`/projects/${projectId}/activities`)}>
                                        Activities Page
                                    </Button>
                                </Grid>
                            </CardActions>
                        </Card>
                    </Grid>
                    <Grid item xs={6}>
                        <Card className={classes.firstRowCard}>
                            <CardContent>
                                <Typography className={classes.displayHeading} gutterBottom>
                                    Stakeholders
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Grid
                                    container
                                    direction="row"
                                    justify="flex-end"
                                    alignItems="baseline"
                                >
                                    <Button size="small" align="right" color="primary" onClick={() => props.history.push(`/projects/${projectId}/stake-holders`)}>
                                        Stakeholders Page
                                    </Button>
                                </Grid>
                            </CardActions>
                        </Card>
                    </Grid>
                </Grid>
            </Grid>

        </div>
    )
}
