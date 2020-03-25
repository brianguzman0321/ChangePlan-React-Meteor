import React, {useEffect, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import {Projects} from '/imports/api/projects/projects'
import {withTracker} from "meteor/react-meteor-data";
import {withRouter, generatePath} from 'react-router';
import {Activities} from "../../../api/activities/activities";
import {Meteor} from "meteor/meteor";

const useStyles = makeStyles(theme => ({
  button: {
    display: 'block',
    marginTop: theme.spacing(2),
  },
  formControl: {
    minWidth: 65,
    color: '#465563',
    [theme.breakpoints.up('md')]: {
      width: 300,
    },
    [theme.breakpoints.down('md')]: {
      width: 200,
    },
  },
  topTexts: {
    color: '#465563',
    fontWeight: 700,
    '&:selected': {
      color: '#1890ff',
      fontWeight: theme.typography.fontWeightMedium,
    },
  },
  select: {
    backgroundColor: '#2f3d4a',
    color: '#f5f5f5',
    borderRadius: '4px',
    height: '46px',
  }
}));

function ProjectSelectMenu(props) {
  const classes = useStyles();
  let {match, currentCompany, projects, isSuperAdmin,
    isAdmin, isManager, isChangeManager, isActivityDeliverer, isActivityOwner} = props;
  let {projectId} = match.params;
  const [projectsMenu, setProjectsMenu] = useState(projects || []);
  const [age, setAge] = React.useState(projectId || '');
  const [itemIndex, setIndex] = React.useState(props.index);
  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    let menuItem = [];
    const userId = Meteor.userId();
    if (projects) {
      if (isSuperAdmin) {
        menuItem = projects;
        setProjectsMenu(menuItem);
      }
      if (isAdmin && !isSuperAdmin && !isChangeManager && !isManager) {
        menuItem = projects.filter(project => project.companyId === currentCompany._id);
        setProjectsMenu(menuItem);
      }
      if (isChangeManager && !isAdmin && !isSuperAdmin) {
        menuItem = projects.filter(project => project.changeManagers.includes(userId));
        setProjectsMenu(menuItem);
      }
      if (isManager && !isSuperAdmin && !isAdmin) {
        menuItem = menuItem.concat(projects.filter(project => project.managers.includes(userId)));
        setProjectsMenu([...new Set(menuItem)]);
      }
      if (isActivityDeliverer && !isSuperAdmin && !isAdmin) {
        const activities = Activities.find({deliverer: userId}).fetch();
        if (activities) {
          activities.forEach(activity => {
            const project = projects.find(project => project._id === activity.projectId);
            if (project) {
              menuItem.push(project);
            }
          });
          setProjectsMenu([...new Set(menuItem)]);
        }
      }
      if (isActivityOwner && !isSuperAdmin && !isAdmin) {
        const activities = Activities.find({owner: userId}).fetch();
        if (activities) {
          activities.forEach(activity => {
            const project = projects.find(project => project._id === activity.projectId);
            if (project) {
              menuItem.push(project);
            }
          });
          setProjectsMenu([...new Set(menuItem)]);
        }
      }
    }
  }, [projects, isActivityDeliverer, isActivityOwner, isManager, isChangeManager, isAdmin, isSuperAdmin]);

  function handleChange(event) {
    setAge(event.target.value);
    updateFilter(props.localCollection, props.id, event.target.value);
    projectId = event.target.value;
    const path = generatePath(props.match.path, {projectId});
    props.history.replace(path);
  }

  function handleClose() {
    setOpen(false);
  }

  function handleOpen() {
    setOpen(true);
  }

  useEffect(() => {
    if (itemIndex !== props.index) {
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
          variant="outlined"
          defaultValue={projectId}
          onChange={handleChange}
          className={classes.select}
          inputProps={{
            name: 'age',
            id: 'demo-controlled-open-select',
          }}
        >
          {projectsMenu && projectsMenu.map((entity) => {
            return <MenuItem key={entity._id} className={classes.topTexts}
                             value={entity._id}>{entity.name.toUpperCase()}</MenuItem>
          })}
        </Select>
      </FormControl>
    </form>
  );
}

const ProjectSelectMenuPage = withTracker(props => {
  let local = LocalCollection.findOne({
    name: 'localProjects'
  });
  Meteor.subscribe('projects.notLoggedIn');
  Meteor.subscribe('activities.notLoggedIn');
  return {
    projects: Projects.find().fetch(),
    local,
  }
})(withRouter(ProjectSelectMenu));

export default ProjectSelectMenuPage