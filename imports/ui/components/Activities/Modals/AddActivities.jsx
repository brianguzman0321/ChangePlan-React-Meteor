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
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
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
  DateTimePicker, TimePicker,
} from '@material-ui/pickers';
import {data} from "/imports/activitiesContent.json";
import SelectStakeHolders from './SelectStakeHolders';
import {Peoples} from '/imports/api/peoples/peoples'
import {Companies} from '/imports/api/companies/companies'
import AutoComplete from '/imports/ui/components/utilityComponents/AutoCompleteInline'
import AddNewPerson from './AddNewPerson';
import {withRouter} from 'react-router'
import DeleteActivity from './DeleteActivity';
import SaveChanges from "../../Modals/SaveChanges";
import {Projects} from "../../../../api/projects/projects";
import {Templates} from "../../../../api/templates/templates";
import NotificationModal from "./NotificationModal";
import {
  ClickAwayListener, InputAdornment,
  ListSubheader,
  Select,
  Switch
} from "@material-ui/core";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";


const styles = theme => ({
  root: {
    margin: 0,
    padding: theme.spacing(2, 3, 0, 3),
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
    '&:selected': {
      background: '#dae0e5;'
    }
  },
}));

const useStyles = makeStyles(theme => ({
  AddNewActivity: {
    flex: 1,
  },
  datePicker: {
    display: 'flex',
    alignItems: 'center',
  },
  buttonAwareness: {
    background: '#f1753e',
    color: 'white',
    '&:hover': {
      background: '#f1753e',
      color: 'white'
    },
    boxShadow: 'none',
  },
  buttonInterest: {
    background: '#8BC34A',
    color: 'white',
    '&:hover': {
      background: '#8BC34A',
      color: 'white'
    },
    boxShadow: 'none',
  },
  buttonUnderstanding: {
    background: '#29B6F6',
    color: 'white',
    '&:hover': {
      background: '#29B6F6',
      color: 'white'
    },
    boxShadow: 'none',
  },
  buttonPreparedness: {
    background: '#53cbd0',
    color: 'white',
    '&:hover': {
      background: '#53cbd0',
      color: 'white'
    },
    boxShadow: 'none',
  },
  buttonSupport: {
    background: '#bbabd2',
    color: 'white',
    '&:hover': {
      background: '#bbabd2',
      color: 'white'
    },
    boxShadow: 'none',
  },
  button: {
    background: '#1976d2',
    color: 'white',
    '&:hover': {
      background: '#1976d2',
      color: 'white'
    },
    boxShadow: 'none',
    fontWeight: 300,
  },
  heading: {
    fontSize: theme.typography.pxToRem(14),
    flexBasis: '33.33%',
    flexShrink: 0,
    fontWeight: 420,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  gridText: {
    fontSize: theme.typography.pxToRem(12),
    color: '#465563'
  },
  panelSummary: {
    background: 'red',
    root: {
      background: 'red'
    }
  },
  reportContainer: {
    backgroundColor: '#f5f5f5',
    height: '50px',
    borderRadius: '4px',
    alignContent: 'center',
  },
  linkButton: {
    textAlign: 'right',
    paddingRight: '18px',
  },
  description: {
    backgroundColor: '#f5f5f5',
    border: '1px solid #f5f5f5',
    borderRadius: '4px',
  },
  buttonAsLink: {
    padding: '0px',
    '&:hover': {
      backgroundColor: '#ffffff',
      borderColor: '#ffffff',
      boxShadow: 'none',
    },
    '&:active': {
      boxShadow: 'none',
      backgroundColor: '#ffffff',
      borderColor: '#fffff',
    },
  },
  buttonPreview: {
    padding: '0px',
    '&:hover': {
      backgroundColor: '#f5f5f5',
      borderColor: '#f5f5f5',
      boxShadow: 'none',
    },
    '&:active': {
      boxShadow: 'none',
      backgroundColor: '#f5f5f5',
      borderColor: '#f5f5f5',
    },
  },
  selectPhase: {
    height: '35px',
  },
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

const DialogContent = withStyles(theme => ({
  root: {
    padding: theme.spacing(0, 3, 2, 3),
  }
}))(MuiDialogContent);

const DialogActions = withStyles(theme => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

function AddActivities(props) {
  let {
    company, stakeHolders, local, project, match, edit, activity, list, isOpen, currentChangeManager,
    template, type, stakeHoldersTemplate, isSuperAdmin, isAdmin, isChangeManager, isManager, isActivityDeliverer, step,
  } = props;
  const customActivityIcon = data.find(item => item.category === "Custom").iconSVG;
  const [open, setOpen] = useState(edit || isOpen || false);
  const [phase, setPhase] = useState((step) || 1);
  const [color, setColor] = useState('#f1753e');
  const [deleteModal, setDeleteModal] = useState(false);
  const [time, setTime] = useState('');
  const [isNew, setIsNew] = useState(false);
  const [users, setUsers] = useState([]);
  const [description, setDescription] = useState('');
  const [person, setPerson] = useState(null);
  const [owner, setOwner] = useState(null);
  const [peoples, setPeoples] = useState(stakeHolders.map(item => item._id));
  const [activityType, setActivityType] = useState({});
  const [currentProject, setProject] = useState(project);
  const [vision, setVision] = useState([]);
  const [cost, setCost] = useState('');
  const [objectives, setObjectives] = useState([]);
  const [dueDate, setDueDate] = useState(new Date());
  const [completedDate, setCompletedDate] = useState(null);
  const [buildStartDate, setBuildStartDate] = useState(null);
  const [buildEndDate, setBuildEndDate] = useState(null);
  const [signOffDate, setSignOffDate] = useState(null);
  const [changeManager, setChangeManager] = useState(currentChangeManager);
  const [showModalDialog, setShowModalDialog] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [checkSchedule, setCheckSchedule] = useState(false);
  const [timeSendEmail, setTimeSendEmail] = useState(null);
  const activityCategories = ["Engagement", "Communication", "Learning/coaching"];
  const disabled = (isManager && !isSuperAdmin && !isChangeManager && !isAdmin)
    || (isActivityDeliverer && !isSuperAdmin && !isChangeManager && !isAdmin)
    || (isChangeManager && template && !project && !isSuperAdmin && !isAdmin)
    || (isAdmin && !project && template && (template.companyId === '') && !isSuperAdmin);
  const disabledManager = (isManager || isActivityDeliverer) && !isChangeManager && !isAdmin && !isSuperAdmin;
  const [showSelect, setShowSelect] = useState(false);
  const [selectActivity, setSelectActivity] = useState({});
  const [showInputEditActivity, setShowInputEditActivity] = useState(isNew || false);


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

  useEffect(() => {
    let phaseColor = '';
    switch (phase) {
      case 1: {
        phaseColor = '#f1753e';
        break;
      }
      case 2: {
        phaseColor = '#53cbd0';
        break;
      }
      case 3: {
        phaseColor = '#bbabd2';
        break;
      }
      case 4: {
        phaseColor = '#8BC34A';
        break;
      }
      case 5: {
        phaseColor = '#03A9F4';
        break;
      }
    }
    setColor(phaseColor);
  }, [phase]);

  const updateValues = () => {
    if (isNew) {
      resetValues();
      return false;
    }
    let selectedActivity = data.find(item => (item.name === activity.type) || item.category === "Custom") || {};
    if (selectedActivity.category === "Custom") {
      selectedActivity.name = activity.type;
      selectedActivity.buttonText = activity.name;
    }
    setActivityType(selectedActivity);
    setSelectActivity(selectedActivity);
    setDueDate(activity.dueDate);
    setPhase(activity.step);
    setTimeSendEmail(activity.timeSchedule || null);
    setCheckSchedule(activity.stakeholdersFeedback || false);
    setBuildStartDate(activity.buildStartDate || null);
    setBuildEndDate(activity.buildEndDate || null);
    setSignOffDate(activity.signOffDate || null);
    setCost(activity.cost);
    setCompletedDate(activity.completedAt);
    setDescription(activity.description);
    if (activity.ownerInfo !== undefined) {
      const _owner = {
        label: `${activity.ownerInfo.profile.firstName} ${activity.ownerInfo.profile.lastName}`,
        firstName: activity.ownerInfo.profile.firstName,
        value: activity.ownerInfo._id,
        email: activity.ownerInfo.emails,
      };
      setOwner(_owner);
    }
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
      }
    } else {
      setProject(template);
      setChangeManager('');
    }
  };

  const resetValues = () => {
    setActivityType({});
    setSelectActivity({});
    setDueDate(new Date());
    setPhase(1);
    setColor('');
    setCheckSchedule(false);
    setTimeSendEmail(null);
    setCompletedDate(null);
    setBuildStartDate(null);
    setBuildEndDate(null);
    setSignOffDate(null);
    setCost('');
    setDescription('');
    setOwner(owner);
    setPerson(person);
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
      updateValues();
    }
  }, [props.company, stakeHolders, company, props.edit, props.activity, isNew, local]);


  const handleClickOpen = () => {
    setIsNew(true);
    setOpen(true);
  };

  const changeActivityType = (item, custom = false) => {
    if (custom) {
      const activityCustom = {
        buttonText: item,
        name: item,
        iconSVG: customActivityIcon,
        category: "Custom",
        engageSection: true,
        equipSection: true,
        embedSection: true,
        helpArticleAvailable: false,
        helpArticleText: "",
        helpArticleLink: "",
        resourceAvailable: false,
        resourceText: "",
        resourceFileName: "",
        helpTextTitle: "Other",
        helpText: "Describe the activity in the 'Description' field.",
      };
      setActivityType(activityCustom);
      setSelectActivity(activityCustom);
    } else {
      setActivityType(item);
      setSelectActivity(item);
    }
    setIsUpdated(true);
    setShowSelect(false);
    setShowInputEditActivity(false);
  };

  const handleClose = () => {
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

  const handleShowSelect = () => {
    setShowSelect(true);
  };

  const createActivity = (e, isMail = true) => {
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
    } else if (checkSchedule && !timeSendEmail) {
      setShowNotification(false);
      props.enqueueSnackbar('Please fill all required fields', {option: 'error'});
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
            deliverer: person && person.value,
            owner: owner && owner.value,
            dueDate,
            completedAt: completedDate,
            buildStartDate: buildStartDate,
            buildEndDate: buildEndDate,
            signOffDate: signOffDate,
            cost: Number(cost),
            stakeHolders: peoples,
            step: phase,
            time: Number(time),
            timeSchedule: timeSendEmail,
            stakeholdersFeedback: checkSchedule,
          }
        }
      } else if (type === 'template') {
        params = {
          activity: {
            name: activityType.buttonText,
            type: activityType.name,
            description,
            templateId: templateId,
            deliverer: person && person.value,
            owner: owner && owner.value,
            dueDate,
            completedAt: completedDate,
            buildStartDate: buildStartDate,
            buildEndDate: buildEndDate,
            signOffDate: signOffDate,
            cost: Number(cost),
            stakeHolders: peoples,
            step: phase,
            time: Number(time),
            timeSchedule: timeSendEmail,
            stakeholdersFeedback: checkSchedule,
          }
        };
      }
      if (completedDate) {
        params.activity.completed = true;
      }
      let methodName = isNew ? 'activities.insert' : 'activities.update';
      !isNew && (params.activity._id = activity._id);
      if (!isNew && activity.sentEmail) {
        params.activity.sentEmail = false;
      }
      Meteor.call(methodName, params, (err, res) => {
        if (err) {
          props.enqueueSnackbar(err.reason, {variant: 'error'})
        } else {
          handleClose();
          props.enqueueSnackbar(`Activity ${isNew ? 'Added' : 'Updated'} Successfully.`, {variant: 'success'});
        }
      })
    } else {
      params = {
        activity: {
          name: activityType.buttonText,
          type: activityType.name,
          description,
          projectId: projectId,
          deliverer: person && person.value,
          owner: owner && owner.value,
          dueDate,
          completedAt: completedDate,
          buildStartDate: buildStartDate,
          buildEndDate: buildEndDate,
          signOffDate: signOffDate,
          cost: Number(cost),
          stakeHolders: peoples,
          step: phase,
          time: Number(time),
          timeSchedule: timeSendEmail,
          stakeholdersFeedback: checkSchedule,
        }
      };
      if (completedDate) {
        params.activity.completed = true;
      }
      let methodName = isNew ? 'activities.insert' : 'activities.update';
      !isNew && (params.activity._id = activity._id);
      if (!isNew && params.activity.sentEmail) {
        params.activity.sentEmail = false;
      }
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
  };

  const handleEndingDate = date => {
    setCompletedDate(date);
    setIsUpdated(true);
  };

  const handleBuildStartDate = date => {
    setBuildStartDate(date);
    setIsUpdated(true);
  };

  const handleBuildEndDate = date => {
    setBuildEndDate(date);
    setIsUpdated(true);
  };

  const handleSignOffDate = date => {
    setSignOffDate(date);
    setIsUpdated(true);
  };


  const handleTimeChange = (e) => {
    setTime(Number(e.target.value));
    setIsUpdated(true);
  };

  const updateUsers = (value) => {
    setPerson(value);
    setIsUpdated(true);
  };

  const updateOwner = (value) => {
    setOwner(value);
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

  const handleSchedule = () => event => {
    setCheckSchedule(event.target.checked);
    if (!event.target.checked) {
      setTimeSendEmail(null);
    }
  };

  const handleTimeSendEmail = (value) => {
    setTimeSendEmail(value);
  };

  const onCalendarClick = (id) => {
    document.getElementById(id).click();
  };

  const handleCloseNotification = (e) => {
    setShowNotification(false);
    const isMail = false;
    createActivity(e, isMail);
  };

  const handleShowEditActivity = () => {
    setActivityType({});
    setShowInputEditActivity(true);
  };

  const resetActivityType = (e) => {
    e.preventDefault();
    setActivityType({});
  };

  const handlePhaseChange = (e) => {
    setPhase(e.target.value);
    setIsUpdated(true);
  };

  const handleCostChange = (e) => {
    setCost(e.target.value);
    setIsUpdated(true);
  };

  return (
    <div className={classes.AddNewActivity}>
      {!list && !disabled ?
        <Button variant="contained"
                className={step === 4 ? classes.buttonInterest : step === 5 ? classes.buttonUnderstanding :
                  step === 1 ? classes.buttonAwareness :
                    step === 2 ? classes.buttonPreparedness :
                      step === 3 ? classes.buttonSupport : classes.button}
                fullWidth={true} onClick={handleClickOpen}
        >
          Add Activity
        </Button> : null
      }
      <Dialog onClose={handleOpenModalDialog} aria-labelledby="customized-dialog-title" open={open} maxWidth="md"
              fullWidth={true}>
        <DialogTitle id="customized-dialog-title" onClose={handleOpenModalDialog}>
          Activity
        </DialogTitle>
        <form onSubmit={createActivity} noValidate>
          <DialogContent>
            <div className={classes.root}>
              <Grid container justify="space-between">
                <Grid item xs={5}>
                  <FormControl fullWidth disabled={disabledManager}>
                    <InputLabel id="select-activity-type">Type*</InputLabel>
                    <Select fullWidth value={0} id="select-activity-type" open={showSelect} onOpen={handleShowSelect}>
                      <MenuItem value={0} style={{display: 'none'}}>
                        <Typography className={classes.secondaryHeading}>
                          {activityType.category && `${activityType.category}: ${activityType.buttonText}` || 'Choose Activity*'}
                          {activityType.iconSVG ? <SVGInline
                            style={{position: 'absolute', marginTop: -8}}
                            width="35px"
                            height="35px"
                            fill={color}
                            svg={activityType.iconSVG || customActivityIcon}
                          /> : null}
                        </Typography>
                      </MenuItem>
                      <ClickAwayListener onClickAway={() => {
                        setActivityType(selectActivity);
                        setShowInputEditActivity(false);
                        setShowSelect(false);
                      }}>
                        <Grid style={{width: '50vw'}}>
                          {activityCategories.map((activityCategory, index) => {
                            return (<div><ListSubheader disableSticky>{activityCategory.toUpperCase()}</ListSubheader>
                              <Grid container key={index} direction="row" style={{width: '48vw'}}>
                                {data.filter(item => item.category === activityCategory).map((item, index) => {
                                  return <Grid item xs={3} key={index}
                                               style={{background: activityType.name === item.name ? '#dae0e5' : ''}}>
                                    <MenuItem value={item} onClick={() => {
                                      changeActivityType(item)
                                    }}>
                                      <Tooltip title={item.helpText} key={index} enterDelay={600}>
                                        <Grid item={true} xs={12} classes={classes1}>
                                          <SVGInline
                                            width="35px"
                                            height="35px"
                                            fill={color}
                                            svg={item.iconSVG}
                                          />
                                          <Typography className={classes.gridText}>
                                            {item.buttonText}
                                          </Typography>
                                        </Grid>
                                      </Tooltip>
                                    </MenuItem>
                                  </Grid>
                                })}
                              </Grid>
                              <br/>
                              <hr/>
                            </div>)
                          })
                          }

                          <ListSubheader disableSticky>CUSTOM</ListSubheader>
                          {(activityType.category !== "Custom") || showInputEditActivity ?
                            <Grid container direction="row" justify="flex-start" alignItems="flex-start"
                                  style={{width: '48vw'}}>
                              <Grid item xs={1} style={{maxWidth: '5%'}}>
                                <SVGInline
                                  width="35px"
                                  height="35px"
                                  fill={color}
                                  svg={customActivityIcon}
                                />
                              </Grid>
                              <Grid item xs={11}>
                                <TextField
                                  placeholder={"Enter activity type"}
                                  onFocus={resetActivityType}
                                  fullWidth type={"text"}
                                  defaultValue={activityType.category === "Custom" ? activityType.buttonText : ''}
                                  onKeyPress={(e) => {
                                    (e.key === 'Enter' ? changeActivityType(e.target.value, true) : null)
                                  }}/>
                              </Grid>
                            </Grid> :
                            <Grid style={{width: '48vw'}} onClick={handleShowEditActivity}>
                              <Grid item xs={3}>
                                <MenuItem value={activityType}>
                                  <Grid item={true} xs={12} classes={classes1}
                                        style={{background: activityType.category === "Custom" ? '#dae0e5' : ''}}>
                                    <SVGInline
                                      width="35px"
                                      height="35px"
                                      fill={color}
                                      svg={customActivityIcon}
                                    />
                                    <Typography className={classes.gridText}>
                                      {activityType.buttonText}
                                    </Typography>
                                  </Grid>
                                </MenuItem>
                              </Grid>
                            </Grid>
                          }
                        </Grid>
                      </ClickAwayListener>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={5}>
                  <FormControl fullWidth disabled={disabledManager}>
                    <InputLabel id="select-phase">Change phase*</InputLabel>
                    <Select fullWidth value={phase || 1} id="select-phase" onChange={handlePhaseChange} className={classes.selectPhase}>
                      <MenuItem value={1}>{(company.activityColumns && company.activityColumns[0].toUpperCase()) || "AWARENESS"}</MenuItem>
                      <MenuItem value={4}>{(company.activityColumns && company.activityColumns[3].toUpperCase()) || "INTEREST"}</MenuItem>
                      <MenuItem value={5}>{(company.activityColumns && company.activityColumns[4].toUpperCase()) || "UNDERSTANDING"}</MenuItem>
                      <MenuItem value={2}>{(company.activityColumns && company.activityColumns[1].toUpperCase()) || "PREPAREDNESS"}</MenuItem>
                      <MenuItem value={3}>{(company.activityColumns && company.activityColumns[2].toUpperCase()) || "SUPPORT"}</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              <br/>
              <br/>

              <Grid container>
                <Grid item xs={12}>
                  <Typography className={classes.heading}>Description</Typography>
                  <TextField
                    margin="normal"
                    id="description"
                    value={description}
                    disabled={disabledManager}
                    multiline
                    rows={3}
                    placeholder="Add Notes or Instructions for the person responsible"
                    onChange={handleDescriptionChange}
                    type="text"
                    fullWidth
                    className={classes.description}
                  />
                </Grid>
              </Grid>
              <br/>

              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <Grid container justify="space-between" spacing={2}>
                  <Grid item xs={4} className={classes.datePicker}>
                    <Grid item xs={10}>
                      <DateTimePicker
                        fullWidth
                        variant="inline"
                        disabled={disabledManager}
                        margin="normal"
                        id="date-time-picker-inline"
                        label="Due date & time*"
                        format="MM/dd/yyyy hh:mm a"
                        value={dueDate}
                        autoOk={true}
                        onChange={handleDueDate}
                      />
                    </Grid>
                    <Grid item xs={2}>
                      <IconButton aria-label="close" className={classes.closeButton}
                                  disabled={disabledManager}
                                  onClick={() => onCalendarClick("date-time-picker-inline")}>
                        <CalendarTodayIcon/>
                      </IconButton>
                    </Grid>
                  </Grid>

                  <Grid item xs={4}>
                    <TextField
                      margin="normal"
                      id="time"
                      disabled={disabledManager}
                      label="Time Away from BAU (mins)"
                      value={time}
                      onChange={handleTimeChange}
                      type="number"
                      fullWidth
                    />
                  </Grid>

                  <Grid item xs={4} className={classes.datePicker}>
                    <Grid item xs={10}>
                      <DatePicker
                        disableToolbar
                        fullWidth
                        variant="inline"
                        margin="normal"
                        id="date-picker-dialog"
                        disabled={disabled}
                        label="Completed"
                        format="MM/dd/yyyy"
                        value={completedDate}
                        minDate={dueDate}
                        autoOk={true}
                        onChange={handleEndingDate}
                      />
                    </Grid>
                    <Grid item xs={2}>
                      <IconButton aria-label="close" className={classes.closeButton}
                                  disabled={disabled}
                                  onClick={() => onCalendarClick("date-picker-dialog")}>
                        <CalendarTodayIcon/>
                      </IconButton>
                    </Grid>
                  </Grid>
                </Grid>

                <Grid container justify="space-between" spacing={2}>
                  <Grid item xs={4} className={classes.datePicker}>
                    <Grid item xs={10}>
                      <DatePicker
                        disableToolbar
                        fullWidth
                        variant="inline"
                        disabled={disabledManager}
                        margin="normal"
                        id="build-start-date-picker-inline"
                        label="Activity build start date"
                        format="MM/dd/yyyy"
                        autoOk={true}
                        value={buildStartDate}
                        onChange={handleBuildStartDate}
                      />
                    </Grid>
                    <Grid item xs={2}>
                      <IconButton aria-label="close" className={classes.closeButton}
                                  disabled={disabledManager}
                                  onClick={() => onCalendarClick("build-start-date-picker-inline")}>
                        <CalendarTodayIcon/>
                      </IconButton>
                    </Grid>
                  </Grid>

                  <Grid item xs={4} className={classes.datePicker}>
                    <Grid item xs={10}>
                      <DatePicker
                        disableToolbar
                        fullWidth
                        variant="inline"
                        disabled={disabledManager}
                        margin="normal"
                        id="build-end-date-picker-inline"
                        label="Activity build end date"
                        format="MM/dd/yyyy"
                        autoOk={true}
                        minDate={buildStartDate}
                        value={buildEndDate}
                        onChange={handleBuildEndDate}
                      />
                    </Grid>
                    <Grid item xs={2}>
                      <IconButton aria-label="close" className={classes.closeButton}
                                  disabled={disabledManager}
                                  onClick={() => onCalendarClick("build-end-date-picker-inline")}>
                        <CalendarTodayIcon/>
                      </IconButton>
                    </Grid>
                  </Grid>

                  <Grid item xs={4} className={classes.datePicker}>
                    <Grid item xs={10}>
                      <DatePicker
                        disableToolbar
                        fullWidth
                        variant="inline"
                        margin="normal"
                        id="sign-off-date-picker-dialog"
                        disabled={disabledManager}
                        label="Sign off date"
                        format="MM/dd/yyyy"
                        value={signOffDate}
                        autoOk={true}
                        onChange={handleSignOffDate}
                      />
                    </Grid>
                    <Grid item xs={2}>
                      <IconButton aria-label="close" className={classes.closeButton}
                                  disabled={disabledManager}
                                  onClick={() => onCalendarClick("sign-off-date-picker-dialog")}>
                        <CalendarTodayIcon/>
                      </IconButton>
                    </Grid>
                  </Grid>
                </Grid>
              </MuiPickersUtilsProvider>
              <br/>
              <br/>

              <Grid container>
                <Grid item xs={4}>
                  <Typography className={classes.heading}>Stakeholders targeted</Typography>
                </Grid>
                <Grid item xs={8}>
                  <Typography className={classes.secondaryHeading}>
                    {peoples.length} of {type === 'project' ? stakeHolders.length : stakeHoldersTemplate.length}
                  </Typography>
                  <SelectStakeHolders rows={type === 'project' ? stakeHolders : stakeHoldersTemplate} local={local}
                                      isImpacts={false} isBenefits={false} disabledManager={disabledManager}/>
                </Grid>
              </Grid>
              <br/>
              <br/>

              <Grid container justify="space-around" direction="row" alignItems="center">
                <Grid item xs={4}>
                  <Typography className={classes.heading}>Stakeholder feedback</Typography>
                </Grid>
                <Grid item xs={5}>
                  <Switch checked={checkSchedule} onChange={handleSchedule()} value="checkSchedule" color="primary"
                          disabled={disabledManager}/>
                </Grid>
                <Grid item xs={3} className={classes.linkButton}>
                  <Button variant="text" color="primary" className={classes.buttonAsLink}>
                    Preview Email
                  </Button>
                </Grid>
              </Grid>

              {checkSchedule &&
              <Grid container>
                <Grid item xs={4} className={classes.datePicker}>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <Grid item xs={10}>
                      <DateTimePicker
                        variant="inline"
                        format="yyyy/MM/dd hh:mm a"
                        margin="normal"
                        id="date-time-schedule-picker-inline"
                        label="Time to send email*"
                        value={timeSendEmail}
                        fullWidth
                        disabled={disabledManager}
                        onChange={handleTimeSendEmail}
                      />
                    </Grid>
                    <Grid item xs={2}>
                      <IconButton aria-label="close" className={classes.closeButton}
                                  disabled={disabled}
                                  onClick={() => onCalendarClick("time-picker-inline")}>
                        <CalendarTodayIcon/>
                      </IconButton>
                    </Grid>
                  </MuiPickersUtilsProvider>
                </Grid>
              </Grid>
              }
              <br/>

              {checkSchedule &&
              <Grid container className={classes.reportContainer} justify="space-around" direction="row"
                    alignItems="center">
                <Grid item xs={4} style={{paddingLeft: '18px'}}>
                  <Typography variant="body1" display="inline">Responses: <Typography variant="button"
                                                                                      display="inline">0</Typography></Typography>
                </Grid>
                <Grid item xs={5} style={{paddingLeft: '18px'}}>
                  <Typography variant="body1" display="inline">Average score: <Typography variant="button"
                                                                                          display="inline">0</Typography></Typography>
                </Grid>
                <Grid item xs={3} className={classes.linkButton}>
                  <Button color="primary" variant="text" className={classes.buttonPreview}>
                    View full report
                  </Button>
                </Grid>
              </Grid>
              }

              <br/>
              <br/>
              <Grid container>
                <Grid item xs={5}>
                  <Typography className={classes.heading}>Activity deliverer</Typography>
                </Grid>
                <Grid item xs={7}>
                  <Typography className={classes.heading}>Activity owner</Typography>
                </Grid>
                <Grid item={true} xs={5}>
                  <AutoComplete updateUsers={updateUsers} data={users} selectedValue={person}
                                currentChangeManager={changeManager} isActivity={true} isManager={isManager}
                                isSuperAdmin={isSuperAdmin} isAdmin={isAdmin} isChangeManager={isChangeManager}
                                isActivityDeliverer={isActivityDeliverer}/>
                  {type === 'project' &&
                  <Button variant="text" color="primary" className={classes.buttonAsLink}
                          disabled={disabledManager}
                          onClick={() => {
                            sendNotificationEmail(activityType.name, activity.dueDate, time, activity.name, description, stakeHolders.length, project, person, projectId, project.vision, project.objectives)
                          }}>
                    Notify/Remind by email
                  </Button>
                  }
                </Grid>
                <Grid item={true} xs={5}>
                  <AutoComplete updateUsers={updateOwner} data={users} selectedValue={owner}
                                currentChangeManager={changeManager} isActivity={true} isManager={isManager}
                                isSuperAdmin={isSuperAdmin} isAdmin={isAdmin} isChangeManager={isChangeManager}
                                isActivityDeliverer={isActivityDeliverer}/>
                  {type === 'project' &&
                  <Button variant="text" color="primary" className={classes.buttonAsLink}
                          disabled={disabledManager}
                          onClick={() => {
                            sendNotificationEmail(activityType.name, activity.dueDate, time, activity.name, description, stakeHolders.length, project, owner, projectId, project.vision, project.objectives)
                          }}>
                    Notify/Remind by email
                  </Button>
                  }
                </Grid>
                <Grid item={true} xs={2} className={classes.linkButton}>
                  <AddNewPerson company={company} isActivity={true} isManager={isManager}
                                isActivityDeliverer={isActivityDeliverer}
                                isSuperAdmin={isSuperAdmin} isAdmin={isAdmin} isChangeManager={isChangeManager}/>
                </Grid>
              </Grid>

              <br/>
              <br/>
              <Grid container>
                <Grid item xs={4}>
                  <Typography className={classes.heading}>Cost</Typography>
                  <FormControl>
                    <Input value={cost} type="number" onChange={handleCostChange}
                           startAdornment={<InputAdornment position="start">$</InputAdornment>} />
                  </FormControl>
                </Grid>
              </Grid>

            </div>
          </DialogContent>
          <DialogActions>
            {isNew ? <Button onClick={handleClose} color="secondary">
                cancel
              </Button> :
              <Button onClick={deleteActivity} color="secondary"
                      disabled={disabled}>
                Delete
              </Button>}
            {isNew ? <Button color="primary" onClick={() => handleShowNotification()}>Save</Button> :
              <Button type="submit" color="primary"
                      disabled={disabled}>
                Save
              </Button>}
          </DialogActions>
          <SaveChanges
            handleClose={handleClose}
            showModalDialog={showModalDialog}
            handleSave={createActivity}
            closeModalDialog={closeModalDialog}
          />
          <NotificationModal handleClose={handleCloseNotification} showModalDialog={showNotification}
                             handleSend={createActivity}
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
})(withRouter(AddActivities));

export default withSnackbar(AddActivityPage)