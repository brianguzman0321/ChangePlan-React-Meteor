import React, {useEffect, useState} from "react";
import moment from 'moment';
import {withStyles, makeStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import {withSnackbar} from 'notistack';
import 'date-fns';
import Tooltip from '@material-ui/core/Tooltip';
import SVGInline from "react-svg-inline";
import Grid from '@material-ui/core/Grid';
import {withTracker} from "meteor/react-meteor-data";
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  DatePicker,
} from '@material-ui/pickers';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {data} from "/imports/activitiesContent.json";
import SelectStakeHolders from './SelectStakeHolders';
import {Peoples} from '/imports/api/peoples/peoples'
import {Companies} from '/imports/api/companies/companies'
import {stringHelpers} from '/imports/helpers/stringHelpers';
import AutoComplete from '/imports/ui/components/utilityComponents/AutoCompleteInline'
import AddNewPerson from './AddNewPerson';
import {withRouter} from 'react-router'
import DeleteActivity from './DeleteActivity';
import SaveChanges from "../../Modals/SaveChanges";
import {Projects} from "../../../../api/projects/projects";
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import {Templates} from "../../../../api/templates/templates";
import NotificationModal from "./NotificationModal";

const styles = theme => ({
  root: {
    margin: 0,
    padding: theme.spacing(3, 3),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const gridStyles = makeStyles(theme => ({
  root: {
    cursor: 'pointer',
    textAlign: 'center',
    '&:hover': {
      background: '#dae0e5;'
    },
    '&:selected': {
      background: '#dae0e5;'
    }
  },
  item: {
    // background: '#dae0e5'
  }
}));
const styles2 = {
  root: {
    cursor: 'pointer',
    textAlign: 'center',
    '&:hover': {
      background: '#dae0e5;'
    },
    '&:selected': {}
  },
  item: {
    // background: '#dae0e5'
  }
};

const classes3 = withStyles(styles2);


const useStyles = makeStyles(theme => ({
  AddNewActivity: {
    flex: 1,
  },
  datePicker: {
    display: 'flex',
    alignItems: 'center',
  },
  button: {
    background: '#bbabd2',
    color: 'white',
    '&:hover': {
      background: '#bbabd2',
      color: 'white'
    },
    boxShadow: 'none',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '33.33%',
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  gridText: {
    fontSize: theme.typography.pxToRem(12),
    color: theme.palette.text.secondary,
  },
  avatar: {
    position: 'absolute',
    top: theme.spacing(1),
    left: theme.spacing(1),
    width: 15,
    height: 15
  },
  panelSummary: {
    background: 'red',
    root: {
      background: 'red'
    }
  }
}));

const DialogTitle = withStyles(styles)(props => {
  const {children, classes, onClose} = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon/>
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

function createData(name, calories, fat, carbs, protein) {
  return {_id: name, calories, fat, carbs, protein};
}

const rows = [
  createData('Cupcake', 305, 3.7, 67, 4.3),
  createData('Donut', 452, 25.0, 51, 4.9),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
  createData('Honeycomb', 408, 3.2, 87, 6.5),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Jelly Bean', 375, 0.0, 94, 0.0),
  createData('KitKat', 518, 26.0, 65, 7.0),
  createData('Lollipop', 392, 0.2, 98, 0.0),
  createData('Marshmallow', 318, 0, 81, 2.0),
  createData('Nougat', 360, 19.0, 9, 37.0),
  createData('Oreo', 437, 18.0, 63, 4.0),
];

const DialogContent = withStyles(theme => ({
  root: {
    padding: theme.spacing(2),
  }
}))(MuiDialogContent);

const DialogActions = withStyles(theme => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

function AddActivity(props) {
  let {
    company, stakeHolders, local, project, match, edit, activity, list, currentChangeManager,
    template, type, stakeHoldersTemplate, isSuperAdmin, isAdmin, isChangeManager, isManager, expandAccordian1, expandAccordian2, expandAccordian3, expandAccordian4, expandAccordian5
  } = props;
  const [open, setOpen] = React.useState(edit || false);
  const [deleteModal, setDeleteModal] = React.useState(false);
  const [time, setTime] = useState('');
  const [isNew, setIsNew] = React.useState(false);
  const [users, setUsers] = React.useState([]);
  const [name, setName] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [person, setPerson] = useState(null);
  const [peoples, setPeoples] = React.useState(stakeHolders.map(item => item._id));
  const [activityType, setActivityType] = React.useState({});
  const [startingDate, setStartingDate] = React.useState(new Date());
  const [dueDate, setDueDate] = React.useState(new Date());
  const [dueDateOpen, setDueDateOpen] = useState(false);
  const [vision, setVision] = useState([]);
  const [objectives, setObjectives] = useState([]);
  const [currentProject, setProject] = useState(project);
  const [changeManager, setChangeManager] = useState(currentChangeManager);
  const [completedDate, setCompletedDate] = useState(null);
  const [endingDate, setEndingDate] = React.useState(new Date());
  const [endingDateOpen, setEndingDateOpen] = React.useState(false);
  const [expanded1, setExpanded1] = useState(expandAccordian1);
  const [expanded2, setExpanded2] = useState(expandAccordian2);
  const [expanded3, setExpanded3] = useState(expandAccordian3);
  const [expanded4, setExpanded4] = useState(expandAccordian4);
  const [expanded5, setExpanded5] = useState(expandAccordian5);
  const [showModalDialog, setShowModalDialog] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  let {projectId, templateId} = match.params;

  const classes = useStyles();
  const classes1 = gridStyles();

  const sendNotificationEmail = (activityType,
                                 activityDueDate,
                                 time,
                                 activityName,
                                 description,
                                 stakeholders, currentProject, person, projectId, vision, objectives) => {
    const projectName = currentProject && currentProject.name;
    const currentChangeManagers = currentProject && currentProject.changeManagerDetails;
    const name = person && person.firstName;
    const email = person ? (person && person.email[0].address) : (currentChangeManagers && currentChangeManagers.emails[0].address);
    if (description === undefined) {
      description = '';
    }
    const activityHelpLink = `https://changeplan.herokuapp.com/projects/${projectId}/activities`;
    Meteor.call('sendEmail', email, name,
      projectName,
      activityType,
      activityDueDate,
      time,
      activityName,
      description,
      stakeholders,
      activityHelpLink, vision, objectives, currentChangeManagers, (error, result) => {
        if (error) {
          props.enqueueSnackbar(error.reason, {variant: 'error'});
        } else {
          props.enqueueSnackbar('Email send successful', {variant: 'success'});
        }
      });
  };

  const updateValues = () => {
    if (isNew) {
      resetValues();
      return false;
    }
    let selectedActivity = data.find(item => item.name === activity.type) || {};
    setActivityType(selectedActivity);
    setDueDate(activity.dueDate);
    setCompletedDate(activity.completedAt);
    setDescription(activity.description);
    if (activity.personResponsible !== undefined) {
      let obj = {
        label: `${activity.personResponsible.profile.firstName} ${activity.personResponsible.profile.lastName}`,
        firstName: activity.personResponsible.profile.firstName,
        value: activity.personResponsible._id,
        email: activity.personResponsible.emails,
      };
      setPerson(obj);
    }
    setTime(activity.time);
    local.changed || updateFilter('localStakeHolders', 'ids', activity.stakeHolders);
    if (local.changed) {
      setIsUpdated(true)
    }
    let updatedStakeHolders = local.changed ? local.ids : activity.stakeHolders;
    setPeoples(updatedStakeHolders);

  };

  const getProjectManager = () => {
    if (type === 'project') {
      const curProject = Projects.find({_id: projectId}).fetch()[0];
      setProject(curProject);
      if (curProject) {
        if (curProject.changeManagers) {
          const newChangeManager = users.find(user => curProject.changeManagers.includes(user.value));
          setChangeManager(newChangeManager);
          setPerson(newChangeManager);
        }
        if (curProject.vision) {
          setVision(curProject.vision)
        }
        if (curProject.objectives) {
          setObjectives(curProject.objectives)
        }
      } else {
        setProject(template);
        setChangeManager('');
      }
    }
  };

  const resetValues = () => {
    let selectedActivity = data.find(item => item.name === activity.type) || {};
    setActivityType({});
    setDueDate(new Date());
    setCompletedDate(null);
    setDescription('');
    setPerson(person);;
    setTime('');
    setPeoples(stakeHolders.map(item => item._id));
    updateFilter('localStakeHolders', 'ids', stakeHolders.map(item => item._id));

  };

  const updateUsersList = () => {
    Meteor.call(`users.getAllUsersInCompany`, {company: company}, (err, res) => {
      if (err) {
        props.enqueueSnackbar(err.reason, {variant: 'error'});
      }
      if (res && res.length) {
        setUsers(res.map(user => {
          return {
            label: `${user.profile.firstName} ${user.profile.lastName}`,
            firstName: user.profile.firstName,
            value: user._id,
            role: user.roles,
            email: user.emails
          }
        }))
      } else {
        setUsers([])
      }
    })
  };

  useEffect(() => {
    setOpen(edit || open);
    updateUsersList();
    if (isNew) {
      let updatedStakeHolders = local.changed ? local.ids : stakeHolders.map(item => item._id);
      setPeoples(updatedStakeHolders);
      updateFilter('localStakeHolders', 'ids', updatedStakeHolders);
      getProjectManager();
    }
    if (edit && activity && activity.name) {
      setExpanded1(expandAccordian1);
      setExpanded2(expandAccordian2);
      setExpanded3(expandAccordian3);
      setExpanded4(expandAccordian4);
      setExpanded5(expandAccordian5);
      updateValues();
    }
  }, [props.company, stakeHolders, company, props.edit, props.activity, isNew, local]);

  const handleChangePanel = panel => (event, isExpanded) => {
    if(panel==='panel1') { setExpanded1(isExpanded ? panel : false); }
    if(panel==='panel2') { setExpanded2(isExpanded ? panel : false); }
    if(panel==='panel3') { setExpanded3(isExpanded ? panel : false); }
    if(panel==='panel4') { setExpanded4(isExpanded ? panel : false); }
    if(panel==='panel5') { setExpanded5(isExpanded ? panel : false); }
  };

  const handleClickOpen = () => {
    setIsNew(true);
    setOpen(true);
  };

  const changeActivityType = (item) => {
    setExpanded1(false);
    setActivityType(item);
  };

  const handleClose = () => {
    setName('');
    setIsNew(false);
    props.newActivity();
    updateFilter('localStakeHolders', 'changed', false);
    resetValues();
    setShowModalDialog(false);
    setIsUpdated(false);
    setOpen(false);
  };

  const handleOpenModalDialog = () => {
    if (isUpdated && !isNew) {
      setShowModalDialog(true);
    } else {
      handleClose();
    }
  };

  const closeModalDialog = () => {
    setShowModalDialog(false);
  };

  const handleShowNotification = () => {
    if (!dueDate) {
      props.enqueueSnackbar('Please fill all required fields', {variant: 'error'});
    } else if (!(activityType && activityType.name) && Array.isArray(stakeHolders)) {
      props.enqueueSnackbar('Please fill all required fields', {variant: 'error'});
    } else {
      setShowNotification(true)
    }
  };

  const createProject = (e, isMail = true) => {
    e.preventDefault();
    let params;
    if (!(dueDate)) {
      setShowNotification(false);
      props.enqueueSnackbar('Please fill all required fields', {variant: 'error'});
      return false;
    } else if (!(activityType && activityType.name) && Array.isArray(stakeHolders)) {
      setShowNotification(false);
      props.enqueueSnackbar('Please fill all required fields', {variant: 'error'});
      return false;
    }
    if (!isMail || !isNew) {
      if (type === 'project') {
        params = {
          activity: {
            name: activityType.buttonText,
            type: activityType.name,
            description,
            projectId: projectId,
            owner: person && person.value,
            dueDate,
            completedAt: completedDate,
            stakeHolders: peoples,
            step: 3,
            time: Number(time)
          }
        }
      } else if (type === 'template') {
        params = {
          activity: {
            name: activityType.buttonText,
            type: activityType.name,
            description,
            templateId: templateId,
            owner: person && person.value,
            dueDate,
            completedAt: completedDate,
            stakeHolders: peoples,
            step: 3,
            time: Number(time)
          }
        };
      }
      if (completedDate) {
        activity.completed = true;
        params.activity.completed = activity.completed;
      }
      let methodName = isNew ? 'activities.insert' : 'activities.update';
      !isNew && (params.activity._id = activity._id);
      Meteor.call(methodName, params, (err, res) => {
        if (err) {
          props.enqueueSnackbar(err.reason, {variant: 'error'})
        } else {
          handleClose();
          props.enqueueSnackbar(`Activity ${isNew ? 'Added' : 'Updated'} Successfully.`, {variant: 'success'})
        }
      })
    } else {
      params = {
        activity: {
          name: activityType.buttonText,
          type: activityType.name,
          description,
          projectId: projectId,
          owner: person && person.value,
          dueDate,
          completedAt: completedDate,
          stakeHolders: peoples,
          step: 3,
          time: Number(time)
        }
      };
      if (completedDate) {
        activity.completed = true;
        params.activity.completed = activity.completed;
      }
      let methodName = isNew ? 'activities.insert' : 'activities.update';
      !isNew && (params.activity._id = activity._id);
      Meteor.call(methodName, params, (err, res) => {
        if (err) {
          props.enqueueSnackbar(err.reason, {variant: 'error'})
        } else {
          sendNotificationEmail(activityType.name, dueDate, time, activityType.buttonText, description, peoples.length, currentProject, person, projectId, vision, objectives);
          setShowNotification(false);
          handleClose();
          props.enqueueSnackbar(`Activity ${isNew ? 'Added' : 'Updated'} Successfully.`, {variant: 'success'})
        }
      })
    }
  };

  const handleDueDate = date => {
    setDueDate(date);
    setIsUpdated(true);
    setDueDateOpen(false);
  };

  const handleEndingDate = date => {
    if (!(endingDate < startingDate)) {
      setEndingDateOpen(false)
    }
    setCompletedDate(date);
    setIsUpdated(true);
    setEndingDateOpen(false);
  };

  const handleTimeChange = (e) => {
    setTime(Number(e.target.value));
    setIsUpdated(true);
  };

  const updateUsers = (value) => {
    setPerson(value)
  };
  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
    setIsUpdated(true);
  };

  function deleteActivity() {
    setDeleteModal(true);
  }

  function deleteActivityClose(deleted) {
    setDeleteModal(false);
    deleted === true && handleClose();
  }

  const onCalendarClick = (id) => {
    document.getElementById(id).click();
  };

  const handleCloseNotification = (e) => {
    setShowNotification(false);
    const isMail = false;
    createProject(e, isMail);
  };

  return (
    <div className={classes.AddNewActivity}>
      {!list && (!((isManager && !isSuperAdmin && !isChangeManager && !isAdmin)
        || (isChangeManager && template && !project && !isSuperAdmin && !isAdmin)
        || (isAdmin && !project && template && (template.companyId === '') && !isSuperAdmin)))
        ? <Button variant="contained" className={classes.button} fullWidth={true} onClick={handleClickOpen}>
          Add Activity
        </Button> : ''
      }
      <Dialog onClose={handleOpenModalDialog} aria-labelledby="customized-dialog-title" open={open} maxWidth="md"
              fullWidth={true}>
        <DialogTitle id="customized-dialog-title" onClose={handleOpenModalDialog}>
          {isNew ? 'Add' : 'Edit'} Activity
        </DialogTitle>
        <form onSubmit={createProject} noValidate>
          <DialogContent dividers>
            <div className={classes.root}>
              <ExpansionPanel
                square expanded={expanded1 === 'panel1'}
                onChange={handleChangePanel('panel1')}
                disabled={(isManager && !isSuperAdmin && !isChangeManager && !isAdmin)
                || (isChangeManager && template && !project && !isSuperAdmin && !isAdmin)
                || (isAdmin && !project && template && (template.companyId === '') && !isSuperAdmin)}>
                <ExpansionPanelSummary
                  expandIcon={<ExpandMoreIcon/>}
                  aria-controls="panel2bh-content"
                  id="panel2bh-header"
                >
                  <Typography className={classes.heading}>Activity Type</Typography>
                  <Typography className={classes.secondaryHeading}>
                    {activityType.buttonText || ''}
                    {activityType.iconSVG ? <SVGInline
                      style={{position: 'absolute', marginTop: -8}}
                      width="35px"
                      height="35px"
                      fill='#bbabd2'
                      svg={activityType.iconSVG}
                    /> : ''
                    }
                  </Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <Grid container justify="space-between" spacing={4}>
                    {
                      data.map((item, index) => {
                        return <Tooltip title={item.helpText} key={index} enterDelay={600}>
                          <Grid item={true} xs={2} classes={classes1}
                                style={{background: activityType.name === item.name ? '#dae0e5' : ''}} onClick={(e) => {
                            changeActivityType(item);
                          }}>

                            <SVGInline
                              width="35px"
                              height="35px"
                              fill='#bbabd2'
                              svg={item.iconSVG}
                            />
                            <Typography className={classes.gridText}>
                              {item.buttonText}
                            </Typography>
                          </Grid>
                        </Tooltip>
                      })
                    }
                  </Grid>
                </ExpansionPanelDetails>
              </ExpansionPanel>

              <ExpansionPanel 
              square expanded={expanded2 === 'panel2'}
              onChange={handleChangePanel('panel2')}
              disabled={(isManager && !isSuperAdmin && !isChangeManager && !isAdmin)
              || (isChangeManager && template && !project && !isSuperAdmin && !isAdmin)
              || (isAdmin && !project && template && (template.companyId === '') && !isSuperAdmin)}>
                <ExpansionPanelSummary
                  expandIcon={<ExpandMoreIcon/>}
                  aria-controls="panel1bh-content"
                  id="panel1bh-header"
                >
                  <Typography className={classes.heading}>Date</Typography>
                  <Typography className={classes.secondaryHeading}>Due
                    Date: {moment(dueDate).format('DD-MMM-YY')}</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <Grid container justify="space-between" spacing={4}>
                      <Grid item xs={6} className={classes.datePicker}>
                        <Grid item xs={11}>
                          <DatePicker
                            fullWidth
                            disableToolbar
                            variant="inline"
                            format="MM/dd/yyyy"
                            margin="normal"
                            disabled={(isManager && !isSuperAdmin && !isChangeManager && !isAdmin)
                            || (isChangeManager && template && !project && !isSuperAdmin && !isAdmin)
                            || (isAdmin && !project && template && (template.companyId === '') && !isSuperAdmin)}
                            id="date-picker-inline"
                            label="Due Date"
                            value={dueDate}
                            autoOk={true}
                            onChange={handleDueDate}
                          />
                        </Grid>
                        <Grid item xs={1}>
                          <IconButton aria-label="close" className={classes.closeButton}
                                      disabled={(isManager && !isSuperAdmin && !isChangeManager && !isAdmin)
                                      || (isChangeManager && template && !project && !isSuperAdmin && !isAdmin)
                                      || (isAdmin && !project && template && (template.companyId === '') && !isSuperAdmin)}
                                      onClick={() => onCalendarClick("date-picker-inline")}>
                            <CalendarTodayIcon/>
                          </IconButton>
                        </Grid>
                      </Grid>
                      <Grid item xs={6} className={classes.datePicker}>
                        <Grid item xs={11}>
                          <DatePicker
                            disableToolbar
                            fullWidth
                            variant="inline"
                            margin="normal"
                            disabled={(isManager && !isSuperAdmin && !isChangeManager && !isAdmin)
                            || (isChangeManager && template && !project && !isSuperAdmin && !isAdmin)
                            || (isAdmin && !project && template && (template.companyId === '') && !isSuperAdmin)}
                            id="date-picker-dialog"
                            label="Date Completed"
                            format="MM/dd/yyyy"
                            value={completedDate}
                            autoOk={true}
                            onChange={handleEndingDate}
                          />
                        </Grid>
                        <Grid item xs={1}>
                          <IconButton aria-label="close" className={classes.closeButton}
                                      disabled={(isManager && !isSuperAdmin && !isChangeManager && !isAdmin)
                                      || (isChangeManager && template && !project && !isSuperAdmin && !isAdmin)
                                      || (isAdmin && !project && template && (template.companyId === '') && !isSuperAdmin)}
                                      onClick={() => onCalendarClick("date-picker-dialog")}>
                            <CalendarTodayIcon/>
                          </IconButton>
                        </Grid>
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          margin="dense"
                          id="time"
                          disabled={(isManager && !isSuperAdmin && !isChangeManager && !isAdmin)
                          || (isChangeManager && template && !project && !isSuperAdmin && !isAdmin)
                          || (isAdmin && !project && template && (template.companyId === '') && !isSuperAdmin)}
                          label="Time Away from BAU (Minutes)"
                          value={time}
                          onChange={handleTimeChange}
                          type="number"
                          fullWidth
                        />
                      </Grid>
                    </Grid>
                  </MuiPickersUtilsProvider>
                </ExpansionPanelDetails>
              </ExpansionPanel>

              <ExpansionPanel
                square expanded={expanded3 === 'panel3'}
                onChange={handleChangePanel('panel3')}
                disabled={(isManager && !isSuperAdmin && !isChangeManager && !isAdmin)
                || (isChangeManager && template && !project && !isSuperAdmin && !isAdmin)
                || (isAdmin && !project && template && (template.companyId === '') && !isSuperAdmin)}>
                <ExpansionPanelSummary
                  expandIcon={<ExpandMoreIcon/>}
                  aria-controls="panel3bh-content"
                  id="panel3bh-header"
                >
                  <Typography className={classes.heading}>Stakeholders targeted</Typography>
                  <Typography className={classes.secondaryHeading}>
                    {peoples.length} of {type === 'project' ? stakeHolders.length : stakeHoldersTemplate.length}
                  </Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <Grid container justify="center">
                    <SelectStakeHolders rows={type === 'project' ? stakeHolders : stakeHoldersTemplate} local={local}
                                        isImpacts={false} isBenefits={false}/>
                  </Grid>
                </ExpansionPanelDetails>
              </ExpansionPanel>
              <ExpansionPanel
                square expanded={expanded4 === 'panel4'}
                onChange={handleChangePanel('panel4')}
                disabled={(isManager && !isSuperAdmin && !isChangeManager && !isAdmin)
                || (isChangeManager && template && !project && !isSuperAdmin && !isAdmin)
                || (isAdmin && !project && template && (template.companyId === '') && !isSuperAdmin)}>
                <ExpansionPanelSummary
                  expandIcon={<ExpandMoreIcon/>}
                  aria-controls="panel4bh-content"
                  id="panel4bh-header"
                >
                  <Typography className={classes.heading}>Description</Typography>
                  <Typography className={classes.secondaryHeading}>{
                    stringHelpers.limitCharacters(description, 36) || 'Add Notes or Instructions for the person responsible'
                  }</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <TextField
                    margin="dense"
                    id="description"
                    label="Description"
                    value={description}
                    onChange={handleDescriptionChange}
                    type="text"
                    fullWidth
                  />
                </ExpansionPanelDetails>
              </ExpansionPanel>

              <ExpansionPanel
                square expanded={expanded5 === 'panel5'}
                onChange={handleChangePanel('panel5')}
                disabled={(isManager && !isSuperAdmin && !isChangeManager && !isAdmin)
                || (isChangeManager && template && !project && !isSuperAdmin && !isAdmin)
                || (isAdmin && !project && template && (template.companyId === '') && !isSuperAdmin)}>
                <ExpansionPanelSummary
                  expandIcon={<ExpandMoreIcon/>}
                  aria-controls="panal5bh-content"
                  id="panal5bh-header"
                >
                  <Typography className={classes.heading}>Activity owner</Typography>
                  <Typography
                    className={classes.secondaryHeading}>{person ? `${person.label}` : (changeManager || {label: ''}).label}</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <Grid container justify="space-between" spacing={2}>
                    <Grid item={true} xs={7}>
                      <AutoComplete updateUsers={updateUsers} data={users} selectedValue={person}
                                    currentChangeManager={changeManager}/>
                    </Grid>
                    <Grid item={true} xs={5}>
                      <AddNewPerson company={company}/>
                    </Grid>
                  </Grid>
                </ExpansionPanelDetails>
                {type === 'project' && <Grid container
                                             direction="row"
                                             justify="flex-end"
                                             alignItems="baseline">
                  <Button color="primary"
                          onClick={() => {
                            sendNotificationEmail(activityType.name, activity.dueDate, time, activity.name, description, stakeHolders.length, currentProject, person, projectId, vision, objectives)
                          }}>
                    Notify/Remind by email
                  </Button>
                </Grid>
                }
              </ExpansionPanel>
            </div>
          </DialogContent>
          <DialogActions>
            {isNew ? <Button onClick={handleClose} color="secondary">
                Cancel
              </Button> :
              <Button onClick={deleteActivity} color="secondary" disabled={(isManager && !isSuperAdmin && !isChangeManager && !isAdmin)
              || (isChangeManager && template && !project && !isSuperAdmin && !isAdmin)
              || (isAdmin && !project && template && (template.companyId === '') && !isSuperAdmin)}>
                Delete
              </Button>
            }
            {isNew ? <Button color="primary" onClick={() => handleShowNotification()}>Save</Button> :
              <Button type="submit" color="primary" disabled={(isManager && !isSuperAdmin && !isChangeManager && !isAdmin)
              || (isChangeManager && template && !project && !isSuperAdmin && !isAdmin)
              || (isAdmin && !project && template && (template.companyId === '') && !isSuperAdmin)}>
                Save
              </Button>}
          </DialogActions>
          <SaveChanges
            handleClose={handleClose}
            showModalDialog={showModalDialog}
            handleSave={createProject}
            closeModalDialog={closeModalDialog}
          />
          <NotificationModal handleClose={handleCloseNotification} showModalDialog={showNotification}
                             handleSend={createProject}
          />
        </form>
      </Dialog>
      <DeleteActivity open={deleteModal} handleModalClose={deleteActivityClose} activity={activity}/>
    </div>
  );
}

const AddActivityPage = withTracker(props => {
  let {match} = props;
  let {projectId, templateId} = match.params;
  let local = LocalCollection.findOne({
    name: 'localStakeHolders'
  });
  Meteor.subscribe('compoundProject', projectId);
  Meteor.subscribe('templates');
  Meteor.subscribe('companies');
  Meteor.subscribe('templates');
  let project = Projects.findOne({
    _id: projectId
  });
  let template = Templates.findOne({_id: templateId});
  let companyProjectId = project && project.companyId;
  let companyTemplateId = template && template.companyId;
  let company = Companies.findOne({_id: companyProjectId || companyTemplateId}) || {};
  Meteor.subscribe('peoples', companyProjectId || companyTemplateId);
  return {
    project: Projects.findOne({_id: projectId}),
    stakeHolders: Peoples.find({
      _id: {
        $in: project && project.stakeHolders || []
      }
    }).fetch(),
    stakeHoldersTemplate: Peoples.find({
      _id: {
        $in: template && template.stakeHolders || []
      }
    }).fetch(),
    template: Templates.findOne({_id: templateId}),
    local,
    company,
  };
})(withRouter(AddActivity));

export default withSnackbar(AddActivityPage)