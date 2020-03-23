import React, {useEffect, useState} from "react";
import {withStyles, makeStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import TextField from '@material-ui/core/TextField';
import {withSnackbar} from 'notistack';
import 'date-fns';
import Grid from '@material-ui/core/Grid';
import {withTracker} from "meteor/react-meteor-data";
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  DatePicker
} from '@material-ui/pickers';
import {Peoples} from '/imports/api/peoples/peoples'
import {Companies} from '/imports/api/companies/companies'
import AutoComplete from '/imports/ui/components/utilityComponents/AutoCompleteInline'
import {withRouter} from 'react-router'
import SaveChanges from "../../Modals/SaveChanges";
import FormControl from "@material-ui/core/FormControl";
import {InputLabel, Select, Step, StepContent, StepLabel, Stepper} from "@material-ui/core";
import MenuItem from "@material-ui/core/MenuItem";
import {CustomStepConnector, CustomStepIcon} from "../../../../utils/CustomStepper";
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import AddNewPerson from "../../Activities/Modals/AddNewPerson";

const styles = theme => ({
  root: {
    margin: 0,
    padding: '0px',
  },
  closeButton: {
    position: 'fixed',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[200],
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

const useStyles = makeStyles(theme => ({
  AddNewActivity: {
    flex: 1,
    marginTop: 2,
    marginLeft: 15
  },
  button: {
    background: '#f1753e',
    color: 'white',
    '&:hover': {
      background: '#f1753e',
      color: 'white'
    }
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
  },
  datePicker: {
    display: 'flex',
    alignItems: 'center',
  },
  gridButtons: {
    padding: '0px 20px 0px 20px'
  },
  createButton: {
    backgroundColor: '#4294db'
  },
  stepLabelCompleted: {
    fontSize: '20px'
  },
  stepLabelActive: {
    padding: '0px 12px 0px 12px',
    fontSize: '20px'
  },
  container: {
    padding: '0px 20px 20px 20px'
  },
  stepLabelMain: {
    padding: '0px 12px 0px 12px',
    fontSize: '26px'
  },
  stepContentRoot: {
    marginLeft: '19px'
  },
}));

const DialogTitle = withStyles(styles)(props => {
  const {classes, onClose} = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root}>
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
    padding: theme.spacing(2),
  }
}))(MuiDialogContent);

const DialogActions = withStyles(theme => ({
  root: {
    margin: 0,
    backgroundColor: '#f5f5f5',
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

function AddActivity(props) {
  let {company, open, handleModalClose, handleType, project, template, stakeHolders, local, match, displayEditButton, isSuperAdmin, isAdmin, isChangeManager, isManager, isActivityDeliverer = false} = props;
  project = project || {}
  const [isNew, setIsNew] = React.useState(false);
  const [status, setStatus] = React.useState(project.status || 'Active');
  const [users, setUsers] = React.useState([]);
  const [description, setDescription] = React.useState(project.name || '');
  const [showModalDialog, setShowModalDialog] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);
  const disabled = (isManager && !isSuperAdmin && !isChangeManager && !isAdmin)
    || (isChangeManager && template && !project && !isSuperAdmin && !isAdmin)
    || (isAdmin && !project && template && (template.companyId === '') && !isSuperAdmin);
  let managers;
  if (project && project.managerDetails)
    managers = project.managerDetails.map((manager) => {
      return {
        label: `${manager.profile.firstName} ${manager.profile.lastName}`,
        value: manager._id
      }
    });
  const [person, setPerson] = React.useState(...managers || '');
  const [startingDate, setStartingDate] = React.useState(project.startingDate || new Date());
  const [dueDate, setDueDate] = React.useState(project.endingDate || new Date());
  const [func, setFunc] = React.useState(project.function);
  const [organization, setOrganization] = React.useState(project.organization);
  const [isDone, setIsDone] = React.useState([]);

  const modalName = 'edit';
  let {projectId} = match.params;
  const classes = useStyles();
  const classes1 = gridStyles();

  const updateValues = () => {
    if (project && project.managerDetails)
      managers = project.managerDetails.map((manager) => {
        return {
          label: `${manager.profile.firstName} ${manager.profile.lastName}`,
          value: manager._id
        }
      });
    setPerson(managers);
    setDescription(project.name);
    setStartingDate(project.startingDate);
    setDueDate(project.endingDate);
    setStatus(project.status);
    setOrganization(project.organization);
    setFunc(project.function);
  };

  const resetValues = () => {
    setDueDate(new Date());
    setDescription('');
    setPerson(null);
    setStatus('');
    setOrganization('');
    setFunc('');
    setIsDone([]);
  };


  const updateProject = (e) => {
    e.preventDefault();
    if (!(description && startingDate && dueDate)) {
      props.enqueueSnackbar('Please fill all required fields', {variant: 'error'});
      return false;
    } else if (dueDate < startingDate) {
      props.enqueueSnackbar('Please fix the date error', {variant: 'error'});
      return false;
    }

    let params = {
      project: {
        _id: project._id,
        owner: project.owner,
        companyId: project.companyId,
        peoples: project.peoples,
        stakeHolders: project.stakeHolders,
        changeManagers: project.changeManagers,
        peopleCount: project.peopleCount,
        name: description,
        startingDate: startingDate,
        status: status,
        endingDate: dueDate,
        organization: organization,
        function: func,
        managers: person && person.map(p => p.value) || []
      }
    };
    Meteor.call('projects.update', params, (err, res) => {
      if (err) {
        props.enqueueSnackbar(err.reason, {variant: 'error'});
      } else {
        resetValues();
        props.enqueueSnackbar('Project Updated Successfully.', {variant: 'success'})
        handleClose();
      }
    })
  };

  useEffect(() => {
    if (description) {
      setIsDone([...new Set(['0'].concat(isDone))])
    }
  }, [description, company]);

  useEffect(() => {
    if (startingDate && dueDate) {
      setIsDone([...new Set(['1'].concat(isDone))])
    }
  }, [startingDate, dueDate,]);

  useEffect(() => {
    if (person) {
      setIsDone([...new Set(['2'].concat(isDone))])
    }
  }, [person]);

  const updateUsersList = () => {
    Meteor.call(`users.getPersons`, {company: company}, (err, res) => {
      if (err) {
        props.enqueueSnackbar(err.reason, {variant: 'error'});
      }
      if (res && res.length) {
        setUsers(res.map(user => {
          return {
            label: `${user.profile.firstName} ${user.profile.lastName}`,
            value: user._id
          }
        }))
      } else {
        setUsers([])
      }
    })
  };

  useEffect(() => {
    updateUsersList();
    if (project && project && project.name) {
      updateValues();
    }


  }, [props.company, stakeHolders, company, props.edit, props.activity, isNew, local]);

  const handleClickOpen = () => {
    setIsNew(true);
  };
  const handleClose = () => {
    setIsNew(false);
    resetValues();
    if (handleType !== 'timeline') {
      handleModalClose(modalName);
    } else {
      handleModalClose(false);
    }
    setIsUpdated(false);
    setShowModalDialog(false);
  };

  const handleStartingDate = date => {
    setIsUpdated(true);
    setStartingDate(date)
  };

  const handleDueDate = date => {
    setIsUpdated(true);
    setDueDate(date)
  };

  const handleOpenModalDialog = () => {
    if (isUpdated) {
      setShowModalDialog(true);
    }
  };

  const closeModalDialog = () => {
    setShowModalDialog(false);
  };

  const updateUsers = (value) => {
    setIsUpdated(true);
    setPerson(value)
  };
  const handleDescriptionChange = (e) => {
    setIsUpdated(true);
    setDescription(e.target.value)
  };

  const onCalendarClick = (id) => {
    document.getElementById(id).click();
  };

  return (
    <div className={classes.AddNewActivity}>
      {displayEditButton ? <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Edit Project Details
      </Button> : ''}

      <Dialog onClose={isUpdated ? handleOpenModalDialog : () => handleClose()}
              aria-labelledby="customized-dialog-title" open={open} maxWidth="md" fullWidth={true}>
        <DialogTitle id="customized-dialog-title" onClose={isUpdated ? handleOpenModalDialog : () => handleClose()}>
          Edit Project Details
        </DialogTitle>
        <form onSubmit={updateProject} noValidate>
          <DialogContent>
            <div className={classes.root}>
              <Stepper orientation="vertical" connector={<CustomStepConnector/>}>
                <Step key={0} active={true} completed={isDone.includes('0')}>
                  <StepLabel StepIconComponent={CustomStepIcon} classes={{active: classes.stepLabelMain}}>Edit
                    Project</StepLabel>
                  <StepContent classes={{root: classes.stepContentRoot}}>
                    <Grid container direction={'row'} alignItems={"center"} justify={'space-between'}
                          className={classes.container}>
                      <Grid item xs={((isChangeManager && !isAdmin) || isAdmin) ? 5 : 12}
                            style={{paddingBottom: '10px'}}>
                        <TextField
                          autoFocus
                          margin="dense"
                          id="name"
                          label="Project Name"
                          value={description}
                          onChange={handleDescriptionChange}
                          required={true}
                          type="text"
                          variant={"outlined"}
                          fullWidth
                        />
                      </Grid>
                      {((isChangeManager && !isAdmin) || isAdmin) && <Grid item xs={6}>
                        <FormControl fullWidth={true}>
                          <InputLabel id={'select-project-status'}>Select Project Status</InputLabel>
                          <Select id={'select-project-status'} value={status}
                                  onChange={(e) => setStatus(e.target.value)}>
                            <MenuItem value={'active'}>Active</MenuItem>
                            <MenuItem value={'completed'}>Completed</MenuItem>
                            <MenuItem value={'on-hold'}>On-Hold</MenuItem>
                            <MenuItem value={'canceled'}>Canceled</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>}
                      {company && company.organizationField && <Grid item xs={5}>
                        <FormControl fullWidth={true}>
                          <InputLabel id={'select-project-status'}>Organization</InputLabel>
                          <Select id={'select-project-status'} value={organization}
                                  onChange={(e) => setOrganization(e.target.value)}>
                            {company.organization.map(organization => {
                                return <MenuItem
                                  value={organization}>{organization[0].toUpperCase() + organization.slice(1)}</MenuItem>
                              }
                            )}
                          </Select>
                        </FormControl>
                      </Grid>}
                      {company && company.functionField && <Grid item xs={6}>
                        <FormControl fullWidth={true}>
                          <InputLabel id={'select-project-status'}>Function</InputLabel>
                          <Select id={'select-project-status'} value={func} onChange={(e) => setFunc(e.target.value)}>
                            {company.function.map(func => {
                                return <MenuItem value={func}>{func[0].toUpperCase() + func.slice(1)}</MenuItem>
                              }
                            )}
                          </Select>
                        </FormControl>
                      </Grid>}

                    </Grid>
                  </StepContent>
                </Step>
                <Step key={1} active={true} completed={isDone.includes('1')}>
                  <StepLabel StepIconComponent={CustomStepIcon}
                             classes={{active: classes.stepLabelActive}}>Date</StepLabel>
                  <StepContent classes={{root: classes.stepContentRoot}}>

                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <Grid container justify="space-between" alignItems={"center"} className={classes.container}>
                        <Grid item xs={6} className={classes.datePicker}>
                          <Grid item xs={10}>
                            <DatePicker
                              fullWidth
                              disableToolbar
                              variant="inline"
                              format="MM/dd/yyyy"
                              id="start-date-picker"
                              label="Start Date*"
                              value={startingDate}
                              autoOk={true}
                              onChange={handleStartingDate}
                            />
                          </Grid>
                          <Grid item xs={2}>
                            <IconButton aria-label="close" className={classes.closeButton}
                                        onClick={() => onCalendarClick("start-date-picker")}>
                              <CalendarTodayIcon/>
                            </IconButton>
                          </Grid>
                        </Grid>

                        <Grid item xs={6} className={classes.datePicker}>
                          <Grid item xs={10}>
                            <DatePicker
                              disableToolbar
                              fullWidth
                              variant="inline"
                              id="ending-date-picker"
                              label="Estimated Due Date*"
                              format="MM/dd/yyyy"
                              value={dueDate}
                              minDate={startingDate}
                              autoOk={true}
                              onChange={handleDueDate}
                            />
                          </Grid>
                          <Grid item xs={2}>
                            <IconButton aria-label="close" className={classes.closeButton}
                                        onClick={() => onCalendarClick("ending-date-picker")}>
                              <CalendarTodayIcon/>
                            </IconButton>
                          </Grid>
                        </Grid>
                      </Grid>
                    </MuiPickersUtilsProvider>
                  </StepContent>
                </Step>


                <Step key={2} active={true} completed={true} completed={isDone.includes('2')}>
                  <StepLabel StepIconComponent={CustomStepIcon}
                             classes={{active: classes.stepLabelActive}}>Managers</StepLabel>
                  <StepContent classes={{root: classes.stepContentRoot}}>

                    <Grid container justify="space-between" alignItems={"center"} className={classes.container}>
                      <Grid item xs={12} style={{paddingBottom: '10px'}}>
                        <AutoComplete updateUsers={updateUsers} data={users} selectedValue={person} multiple={true}
                                      isActivity={false} label={'Select Person*'}/>
                      </Grid>
                      <Grid item xs={12}>
                        <AddNewPerson company={company._id}/>
                      </Grid>
                    </Grid>
                  </StepContent>
                </Step>
              </Stepper>
            </div>
            <SaveChanges
              handleClose={handleClose}
              showModalDialog={showModalDialog}
              handleSave={updateProject}
              closeModalDialog={closeModalDialog}
            />
          </DialogContent>
          <DialogActions>
            <Grid container direction={"row"} alignItems={"center"} justify={"space-between"}
                  className={classes.gridButtons}>
              <Grid item xs={1}>
                <Button onClick={isUpdated ? handleOpenModalDialog : () => handleClose()} disabled={disabled}
                        color="default">
                  Cancel
                </Button>
              </Grid>
              <Grid item xs={1}>
                <Button type="submit" variant="contained" className={classes.createButton} color="primary"
                        disabled={disabled} onClick={updateProject}>
                  Update
                </Button>
              </Grid>
            </Grid>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}

const AddActivityPage = withTracker(props => {
  let local = LocalCollection.findOne({
    name: 'localStakeHolders'
  });
  Meteor.subscribe('companies');
  let allCompany = Companies.find({}).fetch();
  let currentCompany = {};
  if (allCompany) {
    currentCompany = allCompany.find(company => company.peoples.includes(Meteor.userId()))
  } else {
    currentCompany = Companies.findOne() || {}
  }
  let companyId = currentCompany && currentCompany._id || {};
  Meteor.subscribe('peoples', companyId);
  return {
    stakeHolders: Peoples.find().fetch(),
    local,
    company: currentCompany || {}
  };
})(withRouter(AddActivity));

export default withSnackbar(AddActivityPage)