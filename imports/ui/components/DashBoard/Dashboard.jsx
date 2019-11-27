import React, {useEffect} from "react";
import TopNavBar from '/imports/ui/components/App/App';
import Grid from "@material-ui/core/Grid/Grid";
import Typography from "@material-ui/core/Typography/Typography";
import Button from "@material-ui/core/Button/Button";
import {makeStyles} from "@material-ui/core";
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import {withTracker} from "meteor/react-meteor-data";
import { Projects } from "../../../api/projects/projects";
import { withRouter } from 'react-router';
import moment from 'moment';
import LinearProgress from '@material-ui/core/LinearProgress';
import Divider from '@material-ui/core/Divider';
import Icon from '@material-ui/core/Icon';
import VisionModal from './Modals/VisionModal';

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
    detailValues: {
        color: '#465563',
        marginTop: 9,
        marginBottom: 9,
        marginLeft: 5
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
        margin: 12
    },
    initialRow: {
        marginTop: 12,
        marginLeft: 29
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

function Dashboard(props){
    let { match, project } = props;
    project = project || {};
    let { projectId } = match.params;
    const classes = useStyles();
    let { params } = props.match;
    const [vision, setVision] = React.useState(project.vision || []);
    const [visionModal, setVisionModal] = React.useState(false);
    const [modals, setModals] = React.useState({
        vision: false,
        duplicate: false,
        delete: false
    });
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

    const allowedValues = ['vision', 'delete', 'edit', 'duplicate'];

    const handleClose = (value) => {
        if(allowedValues.includes(value)){
            let obj = {
                [value]: !modals[value]
            };
            setModals({modals, ...obj})
        }
    };

    const handleModalClose = obj => {
        setModals({modals, ...obj})
    };

    const updateValues = obj => {
        if(project && project.vision){
            setVision(project.vision)
        }

    };

    useEffect(() => {
        updateValues()
    }, [project]);

    return (
        <div>
            <VisionModal open={modals.vision} handleModalClose={handleModalClose} project={project} />
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
                    className={classes.initialRow}
                >
                    <Grid item xs={6}>
                        <Typography variant="h4">
                            {project.name}
                        </Typography>
                        <Typography gutterBottom style={{marginTop: 5}}>
                            <b>Start date:</b> {moment(project.startingDate).format('DD-MMM-YY')}
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <b>Due date:</b> {moment(project.endingDate).format('DD-MMM-YY')}
                        </Typography>
                    </Grid>
                    <Grid item xs={6} style={{paddingLeft: 23}}>
                        <Typography gutterBottom>
                            <b>{project.changeManagers && project.changeManagers.length > 1 ? "Change managers" : "Change manager"}:</b>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            {ChangeManagersNames(project) || '-'}
                        </Typography>
                        <Typography gutterBottom>
                            <b>{project.managers && project.managers.length > 1 ? "Managers" : "Manager"}:</b>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            {ManagersNames(project)}
                        </Typography>
                    </Grid>
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
                                    <Button align="right" color="primary" onClick={() => props.history.push(`/projects/${projectId}/activities`)}>
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
                                    <Button align="right" color="primary" onClick={() => props.history.push(`/projects/${projectId}/stake-holders`)}>
                                        Stakeholders Page
                                    </Button>
                                </Grid>
                            </CardActions>
                        </Card>
                    </Grid>
                    <Grid item xs={12}>
                        <Card className={classes.firstRowCard} style={{background: '#f5f5f5'}}>
                            <LinearProgress variant="determinate"  color="primary" value={100}/>
                            <CardContent>
                                <Typography className={classes.displayHeading}  style={{marginBottom: 15}}>
                                    PROJECT INFORMATION
                                </Typography>
                                <Card>
                                    <CardContent>
                                        <Typography className={classes.displayHeading} gutterBottom>
                                            Vision &nbsp;&nbsp;
                                            <Icon color="disabled" fontSize="small" style={{verticalAlign: 'middle', marginBottom: 4}}>
                                            help
                                        </Icon>
                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                            <span style={{color: '#bebebe'}}>What is the big picture vision for this project and how it will benefit the organisation?</span>
                                        </Typography>
                                        <Divider />

                                        {vision.map(v => {
                                            return <><Grid
                                                container
                                                direction="row"
                                                justify="flex-end"
                                                alignItems="center"
                                            >
                                                <Grid item xs={9} >
                                                    <Typography className={classes.detailValues} gutterBottom>
                                                        {v}
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={3} justify="flex-end" display="flex" style={{display: 'flex'}}>
                                                    <Icon fontSize="small" style={{marginRight: 12, cursor: 'pointer'}}>
                                                        edit
                                                    </Icon>
                                                    <Icon fontSize="small" style={{marginRight: 6, cursor: 'pointer'}}>
                                                        delete
                                                    </Icon>
                                                </Grid>
                                            </Grid>
                                            <Divider />
                                            </>

                                        })}

                                        <Divider />
                                        <Button align="right" color="primary" style={{marginTop: 5, marginLeft: 9}} onClick={handleClose.bind(null, 'vision')}>
                                            Add
                                        </Button>
                                    </CardContent>
                                </Card>
                                <br/>
                                <Card>
                                    <CardContent>
                                        <Typography className={classes.displayHeading} gutterBottom>
                                            Objectives &nbsp;&nbsp;
                                            <Icon color="disabled" fontSize="small" style={{verticalAlign: 'middle', marginBottom: 4}}>
                                                help
                                            </Icon>
                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                            <span style={{color: '#bebebe'}}>List the ways in which the project/change will support the organisation. What problems is the project/change solving?</span>
                                        </Typography>
                                        <Divider />
                                        <Button align="right" color="primary" style={{marginTop: 5, marginLeft: 9}}>
                                            Add
                                        </Button>
                                    </CardContent>
                                </Card>
                                <br/>
                                <Card>
                                    <CardContent>
                                        <Typography className={classes.displayHeading} gutterBottom>
                                            Impacts &nbsp;&nbsp;
                                            <Icon color="disabled" fontSize="small" style={{verticalAlign: 'middle', marginBottom: 4}}>
                                                help
                                            </Icon>
                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                            <span style={{color: '#bebebe'}}>List the project's impact on processes, technology, people & organization?</span>
                                        </Typography>
                                        <Divider />
                                        <Button align="right" color="primary" style={{marginTop: 5, marginLeft: 9}}>
                                            Add
                                        </Button>
                                    </CardContent>
                                </Card>
                                <br/>
                                <Card>
                                    <CardContent>
                                        <Typography className={classes.displayHeading} gutterBottom>
                                            Risks &nbsp;&nbsp;
                                            <Icon color="disabled" fontSize="small" style={{verticalAlign: 'middle', marginBottom: 4}}>
                                                help
                                            </Icon>
                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                            <span style={{color: '#bebebe'}}>List risks associated with the change that could effect the projects's success?</span>
                                        </Typography>
                                        <Divider />
                                        <Button align="right" color="primary" style={{marginTop: 5, marginLeft: 9}}>
                                            Add
                                        </Button>
                                    </CardContent>
                                </Card>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Grid>

        </div>
    )
}

function ChangeManagersNames(project) {
    if(project.changeManagerDetails) {
        let changeManagers = project.changeManagerDetails.map(changeManager => {
            return `${changeManager.profile.firstName} ${changeManager.profile.lastName}`
        });
        if(changeManagers.length){
            return changeManagers.join(", ")
        }
        else {
            return "-"
        }

    }
}

function ManagersNames(project) {
    if(project.managerDetails) {
        let managers = project.managerDetails.map(manager => {
            return `${manager.profile.firstName} ${manager.profile.lastName}`
        });
        if(managers.length){
            return managers.join(", ")
        }
        else {
            return "-"
        }
    }

}

const DashboardPage = withTracker(props => {
    let { match } = props;
    let { projectId } = match.params;
    Meteor.subscribe('compoundActivities', projectId);
    Meteor.subscribe('compoundProject', projectId);
    return {
        project : Projects.findOne({_id: projectId})
    };
})(withRouter(Dashboard));

export default DashboardPage


