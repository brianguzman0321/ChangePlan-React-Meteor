import React, {useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { Projects } from '/imports/api/projects/projects'
import { withTracker } from "meteor/react-meteor-data";
import { withRouter, generatePath } from 'react-router';

const useStyles = makeStyles(theme => ({
    button: {
        display: 'block',
        marginTop: theme.spacing(2),
    },
    formControl: {
        marginBottom: -16,
        minWidth: 65,
        width: 220,
    },
    topTexts: {
        color : '#465563',
        fontWeight: 700,
        '&:selected': {
            color: '#1890ff',
            fontWeight: theme.typography.fontWeightMedium,
        },

    },
}));

function ProjectSelectMenu(props) {
    const classes = useStyles();
    let {  match } = props;
    let { projectId } = match.params;
    const [age, setAge] = React.useState(projectId || '');
    const [itemIndex, setIndex] = React.useState(props.index);
    const [open, setOpen] = React.useState(false);


    function handleChange(event) {
        setAge(event.target.value);
        updateFilter(props.localCollection, props.id, event.target.value);
        projectId = event.target.value;
        const path = generatePath(props.match.path, { projectId });
        props.history.replace(path);
    }

    function handleClose() {
        setOpen(false);
    }

    function handleOpen() {
        setOpen(true);
    }

    useEffect(() => {
        if(itemIndex !== props.index){
            updateFilter('localCompanies', 'companyId', '');
            updateFilter('localProjects', 'projectId', '');
            setIndex(props.index)
        }

        return () => {
            setAge('');
            updateFilter('localCompanies', 'companyId', '');
            updateFilter('localProjects', 'projectId', '');
        }

    }, [props.index]);

    return (
        <form autoComplete="off" style={{marginLeft: 23, flexGrow: 1, fontWeight: 'bold'}}>
            <FormControl className={classes.formControl} fullWidth>
                <Select
                    open={open}
                    onClose={handleClose}
                    onOpen={handleOpen}
                    value={age}
                    onChange={handleChange}
                    inputProps={{
                        name: 'age',
                        id: 'demo-controlled-open-select',
                    }}
                >

                    {props.projects && props.projects.map((entity) => {
                        return <MenuItem key={entity._id} className={classes.topTexts} value={entity._id}>{entity.name.toUpperCase()}</MenuItem>
                    })
                    }
                </Select>
            </FormControl>
        </form>
    );
}

const ProjectSelectMenuPage = withTracker(props => {
    let local = LocalCollection.findOne({
        name: 'localProjects'
    });
    Meteor.subscribe('projects');
    return {
        projects: Projects.find().fetch(),
        local
    }
})(withRouter(ProjectSelectMenu));

export default ProjectSelectMenuPage