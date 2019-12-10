import React from 'react';
import moment from 'moment';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Paper from '@material-ui/core/Paper';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import IconButton from "@material-ui/core/IconButton/IconButton";
import CardHeader from "@material-ui/core/CardHeader/CardHeader";
import Grid from '@material-ui/core/Grid';
import LinearProgress from '@material-ui/core/LinearProgress';
import { InputBase } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import {withTracker} from "meteor/react-meteor-data";
import { Companies } from "/imports/api/companies/companies";
import { Projects } from "/imports/api/projects/projects";
import NewProject from './Models/CreateProject';
import ProjectMenus from './ProjectMenus';


const useStyles = makeStyles(theme => ({
    card: {
        minHeight: 192,
        minWidth: 300,
        maxWidth: 295,
        marginTop: 23,
        marginLeft: 30,
        color: '#465563',
        cursor: 'pointer'
    },
    newProject: {
        minHeight: 192,
        minWidth: 300,
        maxWidth: 295,
        marginTop: 23,
        marginLeft: 23,
        marginRight: '0 !important',
        color: '#465563',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    progress:{
        color: '#4294db'
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    cardTitle: {
        fontWeight: '500 !important'
    },
    title: {
        fontSize: 11,
        color: '##455564'
    },
    pos: {
        fontWeight: 'Bold',
    },
    bottomText: {
        marginTop: 12,
        fontSize: 11,
        color: '##455564'
    },
    searchContainer: {
        marginTop: 13,
        overflow: 'hidden'
    },
    topHeading: {
        color: '#465563',
        marginLeft: 24,
    },
    input: {
        marginLeft: theme.spacing(1),
        flex: 1,
    },
    searchGrid: {
        display: 'flex',
        background: '#fff',
        border: '1px solid #cbcbcc',
        maxHeight: 40,
        maxWidth: 352,
    },
    iconButton: {
        marginTop: -3
    },
    sortBy:{
        float: 'right',
        marginTop: 13,
        fontSize: 18
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 200,
    },
    selectEmpty: {
        border: '1px solid #c5c6c7',
        paddingLeft: 5
    },
    activities: {
        paddingLeft: 12
    },
    secondTab: {
        display: 'flex'
    },
    createNewProject : {
        flex: 1,
        marginLeft: 23
    },
    gridContainer: {
        marginBottom: 15,
        overFlow: 'hidden'
    },
    grid: {
        margin: -5,
        marginTop: 5
    },
    cardContent: {
        paddingTop: 0,
        "&:last-child": {
            paddingBottom: 0
        }
    },
    notFound: {

    },
    noData: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: theme.spacing(3, 2),
        minHeight: 200,
        margin: 23

    },
}));

function ProjectCard(props) {
    const useStyles1 = makeStyles(theme => ({
        title: {
            fontWeight: 1000,
            fontSize: 16
        }
    }));
    let { projects, company } = props;
    let isAdmin = false;
    if (Roles.userIsInRole(Meteor.userId(), 'superAdmin')) {
        isAdmin = true;
    }
    else if(company && company.admins.includes(Meteor.userId())){
        isAdmin = true;
    }
    const classes = useStyles();
    const classes1 = useStyles1();
    const [age, setAge] = React.useState('endingDate');
    const [search, setSearch] = React.useState('');
    const [open, setOpen] = React.useState(false);
    search || updateFilter('localProjects', 'search', '');

    const handleChange = event => {
        setAge(event.target.value);
        updateFilter('localProjects', 'sort', event.target.value);
    };
    const selectProject = (project, e) => {
        props.history.push(`/projects/${project._id}`)
    };

    const searchFilter = event => {
        setSearch(event.target.value);
        updateFilter('localProjects', 'search', event.target.value);
    };

    return (
        <>
            <Grid
                container
                direction="row"
                justify="flex-start"
                alignItems="center"
                className={classes.gridContainer}
                spacing={0}
            >
                <Grid container className={classes.searchContainer}>
                    <Grid item xs={2}>
                        <Typography color="textSecondary" variant="h4" className={classes.topHeading}>
                            Projects
                        </Typography>
                    </Grid>
                    <Grid item xs={4} className={classes.searchGrid}>
                        <InputBase
                            className={classes.input}
                            inputProps={{ 'aria-label': 'search by project name' }}
                            onChange={searchFilter}
                            value={search}
                        />
                        <IconButton className={classes.iconButton} aria-label="search">
                            <SearchIcon />
                        </IconButton>
                    </Grid>
                    <Grid item xs={4} className={isAdmin && company ? classes.secondTab: ''}>
                        { isAdmin && company && <NewProject {...props} className={classes.createNewProject} /> }
                        <Typography color="textSecondary" variant="title" className={classes.sortBy}>
                            Sort by
                        </Typography>
                    </Grid>
                    <Grid item xs={2}>
                        <FormControl className={classes.formControl}>
                            <Select
                                value={age}
                                onChange={handleChange}
                                displayEmpty
                                name="age"
                                className={classes.selectEmpty}
                            >
                                <MenuItem value="createdAt">Date Added</MenuItem>
                                <MenuItem value="endingDate">Date Due</MenuItem>
                                <MenuItem value="name">Project Name</MenuItem>
                                <MenuItem value="stakeHolder">Stakeholder Count</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
                {projects.map((project, index) => (
                    <Grid item xs spacing={1} key={index} className={classes.grid} onClick={(e) =>selectProject(project)}>
                        <Card className={classes.card}>
                            <LinearProgress variant="determinate" value={index * 10} color="primary"/>
                            <CardHeader
                                onClick={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                }}
                                action={<ProjectMenus project={project} company={company} />}
                                classes={classes1}
                                title={projectName(project.name)}
                            />
                            <CardContent className={classes.cardContent}>
                                <Grid container>
                                    <Grid item xs={4}>
                                        <Typography className={classes.title}  gutterBottom>
                                            STAKEHOLDERS
                                        </Typography>
                                        <Typography className={classes.pos} color="textSecondary">
                                            {project.stakeHolders.length}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={4} className={classes.activities}>
                                        <Typography className={classes.title} gutterBottom>
                                            ACTIVITIES
                                        </Typography>
                                        <Typography className={classes.pos} color="textSecondary">
                                            {/*{project.totalActivities}*/}
                                            0
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Typography className={classes.title} gutterBottom>
                                            DUE
                                        </Typography>
                                        <Typography className={classes.pos} color="textSecondary">
                                            {moment(project.endingDate).format('DD-MMM-YY')}
                                        </Typography>
                                    </Grid>

                                </Grid>
                                <Typography variant="body2" component="p" className={classes.bottomText}>
                                    {project.changeManagers.length > 1 ? "CHANGE MANAGERS" : "CHANGE MANAGER"}
                                    <br />
                                    {ChangeManagersNames(project)}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            {!projects.length &&
            <Grid
                container
                direction="row"
                justify="center"
                alignItems="center"
                justify-content="center"
            >
                <Grid item xs={12}>
                    <Paper className={classes.noData}>
                        <Typography variant="h5" component="h5" align="center">
                            No Data Found.
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>
            }
        </>

    );
}

function projectName(name){
    if(typeof name === 'string') {
        return name.length < 53 ? name : `${name.slice(0, 50)}...`
    }
    return name
}

function ChangeManagersNames(project) {
    if(project.changeManagerDetails) {
        let changeManagers = project.changeManagerDetails.map(changeManager => {
            return `${changeManager.profile.firstName} ${changeManager.profile.lastName}`
        });
        return changeManagers.join(", ")
    }
}

function sortingFunc(projects, local) {
    switch (local.sort){
        case 'endingDate':{
            projects = projects.sort((a, b) => new Date(a.endingDate) -  new Date(b.endingDate));
            break;
        }
        case 'createdAt':{
            projects = projects.sort((a, b) => new Date(a.createdAt) -  new Date(b.createdAt));
            break;
        }
        case 'name': {
            projects = projects.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
            break;
        }
        case 'stakeHolders': {
            projects = projects.sort((a, b) => a.stakeHolders.length - a.stakeHolders.length);
            break;
        }

    }
    return projects
}


const ProjectsPage = withTracker(props => {
    let local = LocalCollection.findOne({
        name: 'localProjects'
    });
    Meteor.subscribe('companies.single');
    Meteor.subscribe('myProjects', null, {
        sort: local.sort || {},
        name: local.search
    } );
    return {
        company: Companies.findOne(),
        projects: sortingFunc(Projects.find({}).fetch(), local),
    };
})(ProjectCard);

export default ProjectsPage