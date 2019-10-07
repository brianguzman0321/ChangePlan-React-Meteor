import React from 'react';
import moment from 'moment';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Avatar from "@material-ui/core/Avatar/Avatar";
import IconButton from "@material-ui/core/IconButton/IconButton";
import MoreVertIcon from '@material-ui/icons/MoreVert';
import CardHeader from "@material-ui/core/CardHeader/CardHeader";
import Grid from '@material-ui/core/Grid';
import LinearProgress from '@material-ui/core/LinearProgress';
import { InputBase } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import AddIcon from '@material-ui/icons/Add';
import {withTracker} from "meteor/react-meteor-data";
import { Companies } from "/imports/api/companies/companies";
import { Projects } from "/imports/api/projects/projects";
import CustomizedDialogs from './NewProject';


const useStyles = makeStyles(theme => ({
    card: {
        minHeight: 211,
        minWidth: 300,
        maxWidth: 300,
        marginTop: 23,
        marginLeft: 15,
        marginRight: '0 !important',
        // color: theme.primary,
        color: '#465563'
    },
    newProject: {
        minHeight: 211,
        minWidth: 300,
        maxWidth: 300,
        marginTop: 23,
        marginLeft: 15,
        marginRight: '0 !important',
        // color: theme.primary,
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
        fontSize: 11,
    },
    title: {
        fontSize: 11,
        color: '#51616e'
    },
    pos: {
        fontWeight: 'Bold',
    },
    bottomText: {
        marginTop: 12,
    },
    searchContainer: {
        marginTop: 13
    },
    topHeading: {
        color: '#465563',
        marginLeft: 74,
    },
    input: {
        marginLeft: theme.spacing(1),
        flex: 1,
    },
    searchGrid: {
        display: 'flex',
        background: '#fff',
        border: '1px solid #cbcbcc',
        maxHeight: 40
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
        marginTop: 2,
        marginLeft: 15
    }
}));

function ProjectCard(props) {
    let { projects } = props;
    const classes = useStyles();
    const bull = <span className={classes.bullet}>•</span>;
    const [age, setAge] = React.useState('createdAt');
    const [open, setOpen] = React.useState(false);

    const handleChange = event => {
        setAge(event.target.value);
        updateFilter('localProjects', 'sort', event.target.value);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleOpen = () => {
        setOpen(true);
    };

    return (
        <Grid
            container
            direction="row"
            justify="flex-start"
            alignItems="flex-start"
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
                        placeholder="Search By Project Name"
                        inputProps={{ 'aria-label': 'search by project name' }}
                    />
                    <IconButton className={classes.iconButton} aria-label="search">
                        <SearchIcon />
                    </IconButton>
                </Grid>
                <Grid item xs={4} className={classes.secondTab}>
                    <CustomizedDialogs {...props} className={classes.createNewProject} />
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
                        </Select>
                        {/*<FormHelperText>Without label</FormHelperText>*/}
                    </FormControl>
                </Grid>
            </Grid>
            {projects.map((project, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                    <Card className={classes.card}>
                        <LinearProgress variant="determinate" value={index * 10} color="primary"/>
                        <CardHeader
                            titleTypographyProps={{variant: 'h6'}}
                            className={classes.cardTitle}
                            action={
                                <IconButton aria-label="settings">
                                    <MoreVertIcon />
                                </IconButton>
                            }
                            title={projectName(project.name)}
                        />
                        <CardContent className={classes.cardContent}>
                            <Grid container>
                                <Grid item xs={4}>
                                    <Typography className={classes.title} color="textSecondary" gutterBottom>
                                        STAKEHOLDERS
                                    </Typography>
                                    <Typography className={classes.pos} color="textSecondary">
                                        {project.stakeHolders.length}
                                    </Typography>
                                </Grid>
                                <Grid item xs={4} className={classes.activities}>
                                    <Typography className={classes.title} color="textSecondary" gutterBottom>
                                        ACTIVITIES
                                    </Typography>
                                    <Typography className={classes.pos} color="textSecondary">
                                        {/*{project.totalActivities}*/}
                                        0
                                    </Typography>
                                </Grid>
                                <Grid item xs={4}>
                                    <Typography className={classes.title} color="textSecondary" gutterBottom>
                                        DUE
                                    </Typography>
                                    <Typography className={classes.pos} color="textSecondary">
                                        {moment(project.endingDate).format('DD-MMM-YY')}
                                    </Typography>
                                </Grid>

                            </Grid>
                            <Typography variant="body2" component="p" className={classes.bottomText}>
                                {project.changeManagers.length > 1 ? "Change Managers" : "Change Manager"}
                                <br />
                                {ChangeManagersNames(project)}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
}

function projectName(name){
    if(typeof name === 'string') {
        return name.length < 22 ? name : `${name.slice(0, 19)}...`
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


const ProjectsPage = withTracker(props => {
    let local = LocalCollection.findOne({
        name: 'localProjects'
    });
    Meteor.subscribe('companies.single');
    Meteor.subscribe('myProjects', null, {
        sort: local.sort || {}
    } );
    return {
        company: Companies.findOne(),
        projects: Projects.find({}).fetch(),
    };
})(ProjectCard);

export default ProjectsPage