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

const useStyles = makeStyles(theme => ({
  AddNewActivity: {
    flex: 1,
  },
    datePicker: {
    display: 'flex',
    alignItems: 'center',
  },
  button: {
    background: '#53cbd0',
    color: 'white',
    '&:hover': {
      background: '#53cbd0',
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
  let {company, stakeHolders, local, project, match, edit, activity, list, isOpen, currentChangeManager, template, type} = props;
  const [open, setOpen] = React.useState(edit || false);
  const [deleteModal, setDeleteModal] = React.useState(false);
  const [time, setTime] = useState('');
  const [isNew, setIsNew] = React.useState(false);
  const [users, setUsers] = React.useState([]);
  const [name, setName] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [person, setPerson] = React.useState('');
  const [peoples, setPeoples] = React.useState(stakeHolders.map(item => item._id));
  const [activityType, setActivityType] = React.useState({});
  const [startingDate, setStartingDate] = React.useState(new Date());
  const [changeManager, setChangeManager] = useState(currentChangeManager);
  const [dueDate, setDueDate] = React.useState(new Date());
  const [currentProject, setProject] = useState(project);
  const [completedDate, setCompletedDate] = useState(null);
  const [startingDateOpen, setStartingDateOpen] = React.useState(false);
  const [endingDate, setEndingDate] = React.useState(new Date());
  const [endingDateOpen, setEndingDateOpen] = React.useState(false);
  const [dueDateOpen, setDueDateOpen] = useState(false);
  const [selectOpen, setSelectOpen] = React.useState(false);
  const [role, setRole] = React.useState('changeManager');
  const [expanded, setExpanded] = useState(true);
  const [showModalDialog, setShowModalDialog] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);

  let {projectId, templateId} = match.params;

  const classes = useStyles();
  const classes1 = gridStyles();

  const sendNotificationEmail = (username,
                                 activityType,
                                 activityDueDate,
                                 time,
                                 activityName,
                                 description,
                                 stakeholders, currentProject, person, projectId, currentChangeManager) => {
    const projectName = currentProject && currentProject.name;
    const email = person ? (person && person.email[0].address) : (currentChangeManager && currentChangeManager.email[0].address);
    if (description === undefined) {
      description = ''
    }
    const fromEmail = email;
    const activityHelpLink = `https://changeplan.herokuapp.com/projects/${projectId}/activities`
    Meteor.call('sendEmail', email, fromEmail, username,
      projectName,
      activityType,
      activityDueDate,
      time,
      activityName,
      description,
      stakeholders,
      activityHelpLink, (error, result) => {
        if (error) {
          props.enqueueSnackbar(err.reason, {variant: 'error'});
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

  useEffect(() => {
    setOpen(edit || open);
    updateUsersList();
    if (isNew) {
      let updatedStakeHolders = local.changed ? local.ids : stakeHolders.map(item => item._id);
      setPeoples(updatedStakeHolders);
      updateFilter('localStakeHolders', 'ids', updatedStakeHolders);
    }
    if (edit && activity && activity.name) {
      setExpanded(true);
      updateValues();
    }
    getProjectManager();

  }, [props.company, stakeHolders, company, props.edit, props.activity, isNew, local]);

  const handleChangePanel = panel => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleClickOpen = () => {
    setIsNew(true);
    setExpanded(true);
    setOpen(true);
  };

  const changeActivityType = (item) => {
    setExpanded(false);
    setActivityType(item);
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
              value: user._id,
              role: user.roles,
              email: user.emails
            }
          }))
        } else {
          setUsers([])
        }
      }
    )
  };

  const getProjectManager = () => {
    if (type === 'project') {
      const curProject = Projects.find({_id: projectId}).fetch()[0];
      setProject(curProject);
      if (curProject && curProject.changeManagers) {
        const changeManager = users.find(user => curProject.changeManagers.includes(user.value));
        setChangeManager(changeManager);
      }
    } else {
      setProject(template);
      setChangeManager('');
    }
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


  const resetValues = () => {
    let selectedActivity = data.find(item => item.name === activity.type) || {};
    setActivityType({});
    setDueDate(new Date());
    setCompletedDate(null);
    setDescription('');
    setPerson(changeManager);
    setTime('');
    setPeoples(stakeHolders.map(item => item._id));
    updateFilter('localStakeHolders', 'ids', stakeHolders.map(item => item._id));

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

  const createProject = (e) => {
    e.preventDefault();
    let params;
    if (!(dueDate)) {
      props.enqueueSnackbar('Please fill all required fields', {variant: 'error'});
      return false;
    } else if (!(activityType && activityType.name) && Array.isArray(stakeHolders)) {
      props.enqueueSnackbar('Please fill all required fields', {variant: 'error'});
      return false;
    }
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
          step: 2,
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
          step: 2,
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

  const openDueDatePicker = () => {
    setDueDateOpen(true)
  };

  const openCompletedDatePicker = () => {
    setEndingDateOpen(true);
  };

  const openEnding = (e) => {
    setEndingDateOpen(true)
  };

  const handleTimeChange = (e) => {
    setTime(Number(e.target.value));
    setIsUpdated(true);
  };

  const updateUsers = (value) => {
    setPerson(value);
    setIsUpdated(true);
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


  return (
    <div className={classes.AddNewActivity}>
      {
        !list ? <Button variant="contained" className={classes.button} fullWidth={true} onClick={handleClickOpen}>
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
              <ExpansionPanel defaultExpanded expanded={expanded} onChange={handleChangePanel('panel1')}>
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
                      fill='#53cbd0'
                      svg={activityType.iconSVG}
                    /> : ''
                    }
                  </Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <Grid container justify="space-between" spacing={4}>
                    {
                      data.map((item, index) => {
                        return <Tooltip title={item.helpText} key={index} enterDelay={1200}>
                          <Grid item={true} xs={2} classes={classes1}
                                style={{background: activityType.name === item.name ? '#dae0e5' : ''}} onClick={(e) => {
                            changeActivityType(item);
                          }}>

                            <SVGInline
                              width="35px"
                              height="35px"
                              fill='#53cbd0'
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
              <ExpansionPanel defaultExpanded>

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
                            id="date-picker-inline"
                            label="Due Date"
                            value={dueDate}
                            autoOk={true}
                            onChange={handleDueDate}
                          />
                        </Grid>
                        <Grid item xs={1}>
                          <IconButton aria-label="close" className={classes.closeButton}
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
                                      onClick={() => onCalendarClick("date-picker-dialog")}>
                            <CalendarTodayIcon/>
                          </IconButton>
                        </Grid>
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          margin="dense"
                          id="time"
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
              <ExpansionPanel defaultExpanded>
                <ExpansionPanelSummary
                  expandIcon={<ExpandMoreIcon/>}
                  aria-controls="panel3bh-content"
                  id="panel3bh-header"
                >
                  <Typography className={classes.heading}>Stakeholders targeted</Typography>
                  <Typography className={classes.secondaryHeading}>
                    {peoples.length} of {stakeHolders.length}
                  </Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <Grid container justify="center">
                    <SelectStakeHolders rows={stakeHolders} local={local} isImpacts={false} isBenefits={false}/>
                  </Grid>
                </ExpansionPanelDetails>
              </ExpansionPanel>
              <ExpansionPanel defaultExpanded>
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

              <ExpansionPanel defaultExpanded>
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
                            sendNotificationEmail(person.label, activityType.name, activity.dueDate, time, activity.name, description, stakeHolders.length, currentProject, person, projectId, currentChangeManager)
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
                cancel
              </Button> :
              <Button onClick={deleteActivity} color="secondary">
                Delete
              </Button>}

            <Button type="submit" color="primary">
              Save
            </Button>
          </DialogActions>
          <SaveChanges
            handleClose={handleClose}
            showModalDialog={showModalDialog}
            handleSave={createProject}
            closeModalDialog={closeModalDialog}
          />
        </form>
      </Dialog>
      <DeleteActivity open={deleteModal} handleModalClose={deleteActivityClose} activity={activity}/>
    </div>
  );
}

const AddActivityPage = withTracker(props => {
  let local = LocalCollection.findOne({
    name: 'localStakeHolders'
  });
  Meteor.subscribe('companies');
  let company = Companies.findOne() || {};
  let companyId = company._id || {};
  Meteor.subscribe('peoples', companyId);
  return {
    stakeHolders: Peoples.find().fetch(),
    local,
    company
  };
})(withRouter(AddActivity));

export default withSnackbar(AddActivityPage)