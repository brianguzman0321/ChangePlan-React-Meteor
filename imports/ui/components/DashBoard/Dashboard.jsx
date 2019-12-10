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
import ObjectiveModal from './Modals/ObjectiveModal';
import ImpactsModal from './Modals/ImpactsModal';
import RisksModal from './Modals/RisksModal';
import DeleteValue from './Modals/deleteModal';
import { stringHelpers } from '/imports/helpers/stringHelpers';
import EditProject from "/imports/ui/components/Projects/Models/EditProject";

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
        marginLeft: 29,
        marginRight: 29
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
    const [index, setIndex] = React.useState('');
    const [editValue, setEditValue] = React.useState('');
    const [deleteValue, setDeleteValue] = React.useState('');
    const [vision, setVision] = React.useState(project.vision || []);
    const [objectives, setObjective] = React.useState(project.objectives || []);
    const [impacts, setImpacts] = React.useState(project.impacts || []);
    const [risks, setRisks] = React.useState(project.risks || []);
    const [editProjectModal, setEditProjectModal] = React.useState(false);
    const [modals, setModals] = React.useState({
        vision: false,
        delete: false,
        objectives: false,
        impacts: false,
        risks: false
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
            name: 'stakeHolders',
            count: 122
        },
        {
            name: 'reports',
            show: true
        }];
    if (!params.projectId){
        menus = []
    }

    const allowedValues = ['vision', 'delete', 'objectives', 'impacts', 'risks', 'edit'];

    const handleClose = (value) => {
        if(allowedValues.includes(value)){
            let obj = {
                [value]: !modals[value]
            };
            setModals({modals, ...obj})
        }
    };

    const editVision = (index, value) => {
        setIndex(index);
        setEditValue(value);
        handleClose('vision')
    };

    const editObjectives = (index, value) => {
        setIndex(index);
        setEditValue(value);
        handleClose('objectives')
    };

    const editImpacts = (index, value) => {
        setIndex(index);
        setEditValue(value);
        handleClose('impacts')
    };

    const editRisks = (index, value) => {
        setIndex(index);
        setEditValue(value);
        handleClose('risks')
    };
    const deleteEntity = (index, value) => {
        setIndex(index);
        setDeleteValue(value);
        handleClose('delete')
    };

    const handleModalClose = obj => {
        setModals({modals, ...obj});
        setIndex('');
        setEditValue('');
    };

    const updateValues = obj => {
        if(project && project.vision){
            setVision(project.vision)
        }
        if(project && project.objectives){
            setObjective(project.objectives)
        }

        if(project && project.impacts){
            setImpacts(project.impacts)
        }

        if(project && project.risks){
            setRisks(project.risks)
        }

    };

    function handleEditModalClose(){
        console.log("I am running")
        setEditProjectModal(false)
    }

    useEffect(() => {
        updateValues()
    }, [project, editProjectModal]);

    return (
        <div>
            <VisionModal open={modals.vision} handleModalClose={handleModalClose} project={project} index={index} editValue={editValue}/>
            <ObjectiveModal open={modals.objectives} handleModalClose={handleModalClose} project={project} index={index} editValue={editValue}/>
            <ImpactsModal open={modals.impacts} handleModalClose={handleModalClose} project={project} index={index} editValue={editValue}/>
            <RisksModal open={modals.risks} handleModalClose={handleModalClose} project={project} index={index} editValue={editValue}/>
            <DeleteValue open={modals.delete} handleModalClose={handleModalClose} project={project} index={index} deleteValue={deleteValue}/>
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
                    <Grid item xs={4} style={{paddingLeft: 39}}>
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
                    <Grid item xs={2} onClick={handleClose.bind(null, 'edit')}>
                        <EditProject open={modals.edit} handleModalClose={handleModalClose} project={project} displayEditButton={true}/>
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

                                        {vision.map((v, i) => {
                                            return <><Grid key={i}
                                                           container
                                                           direction="row"
                                                           justify="flex-end"
                                                           alignItems="center"
                                            >
                                                <Grid item xs={10} >
                                                    <Typography className={classes.detailValues} gutterBottom>
                                                        {stringHelpers.limitCharacters(v, 112)}
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={2} justify="flex-end" style={{display: 'flex'}}>
                                                    <Icon fontSize="small" style={{marginRight: 12, cursor: 'pointer'}} onClick={(e) => {editVision(i, v)}}>
                                                        edit
                                                    </Icon>
                                                    <Icon fontSize="small" style={{marginRight: 6, cursor: 'pointer'}} onClick={(e) => {deleteEntity(i, 'vision')}}>
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

                                        {objectives.map((v, i) => {
                                            return <><Grid key={i}
                                                           container
                                                           direction="row"
                                                           justify="flex-end"
                                                           alignItems="center"
                                            >
                                                <Grid item xs={10} >
                                                    <Typography className={classes.detailValues} gutterBottom>
                                                        {stringHelpers.limitCharacters(v, 112)}
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={2} justify="flex-end" style={{display: 'flex'}}>
                                                    <Icon fontSize="small" style={{marginRight: 12, cursor: 'pointer'}} onClick={(e) => {editObjectives(i, v)}}>
                                                        edit
                                                    </Icon>
                                                    <Icon fontSize="small" style={{marginRight: 6, cursor: 'pointer'}} onClick={(e) => {deleteEntity(i, 'objectives')}}>
                                                        delete
                                                    </Icon>
                                                </Grid>
                                            </Grid>
                                                <Divider />
                                            </>

                                        })}

                                        <Divider />
                                        <Button align="right" color="primary" style={{marginTop: 5, marginLeft: 9}} onClick={handleClose.bind(null, 'objectives')}>
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
                                        <Grid
                                              container
                                              direction="row"
                                              justify="flex-end"
                                              alignItems="center"
                                        >
                                            <Grid item xs={3} >
                                                <Typography className={classes.detailValues} gutterBottom style={{fontWeight: 'bold'}}>
                                                    TYPE
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={6} >
                                                <Typography className={classes.detailValues} gutterBottom style={{fontWeight: 'bold'}}>
                                                    DESCRIPTION
                                                </Typography>

                                            </Grid>
                                            <Grid item xs={1} >
                                                <Typography className={classes.detailValues} gutterBottom style={{fontWeight: 'bold'}}>
                                                    LEVEL
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={2} justify="flex-end" style={{display: 'flex'}}>

                                            </Grid>
                                        </Grid>
                                        <Divider />
                                        {impacts.map((v, i) => {
                                            return <><Grid key={i}
                                                           container
                                                           direction="row"
                                                           justify="flex-end"
                                                           alignItems="center"
                                            >
                                                <Grid item xs={3} >
                                                    <Typography className={classes.detailValues} gutterBottom>
                                                        {stringHelpers.capitalize(v.type)}
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={6} >
                                                    {stringHelpers.limitCharacters(v.description, 92)}
                                                </Grid>
                                                <Grid item xs={1} >
                                                    {v.level.toUpperCase()}
                                                </Grid>
                                                <Grid item xs={2} justify="flex-end" style={{display: 'flex'}}>
                                                    <Icon fontSize="small" style={{marginRight: 12, cursor: 'pointer'}} onClick={(e) => {editImpacts(i, v)}}>
                                                        edit
                                                    </Icon>
                                                    <Icon fontSize="small" style={{marginRight: 6, cursor: 'pointer'}} onClick={(e) => {deleteEntity(i, 'impacts')}}>
                                                        delete
                                                    </Icon>
                                                </Grid>
                                            </Grid>
                                                <Divider />
                                            </>

                                        })}

                                        <Divider />
                                        <Button align="right" color="primary" style={{marginTop: 5, marginLeft: 9}} onClick={handleClose.bind(null, 'impacts')}>
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
                                        <Grid
                                            container
                                            direction="row"
                                            justify="flex-end"
                                            alignItems="center"
                                        >
                                            <Grid item xs={9} >
                                                <Typography className={classes.detailValues} gutterBottom style={{fontWeight: 'bold'}}>
                                                    DESCRIPTION
                                                </Typography>

                                            </Grid>
                                            <Grid item xs={1} >
                                                <Typography className={classes.detailValues} gutterBottom style={{fontWeight: 'bold'}}>
                                                    LEVEL
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={2} justify="flex-end" style={{display: 'flex'}}>

                                            </Grid>
                                        </Grid>
                                        <Divider />
                                        {risks.map((v, i) => {
                                            return <><Grid key={i}
                                                           container
                                                           direction="row"
                                                           justify="flex-end"
                                                           alignItems="center"
                                            >
                                                <Grid item xs={9} >
                                                    <Typography className={classes.detailValues} gutterBottom>
                                                        {stringHelpers.limitCharacters(v.description, 92)}
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={1} >
                                                    {v.level.toUpperCase()}
                                                </Grid>
                                                <Grid item xs={2} justify="flex-end" style={{display: 'flex'}}>
                                                    <Icon fontSize="small" style={{marginRight: 12, cursor: 'pointer'}} onClick={(e) => {editRisks(i, v)}}>
                                                        edit
                                                    </Icon>
                                                    <Icon fontSize="small" style={{marginRight: 6, cursor: 'pointer'}} onClick={(e) => {deleteEntity(i, 'risks')}}>
                                                        delete
                                                    </Icon>
                                                </Grid>
                                            </Grid>
                                                <Divider />
                                            </>

                                        })}

                                        <Divider />
                                        <Button align="right" color="primary" style={{marginTop: 5, marginLeft: 9}} onClick={handleClose.bind(null, 'risks')}>
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


