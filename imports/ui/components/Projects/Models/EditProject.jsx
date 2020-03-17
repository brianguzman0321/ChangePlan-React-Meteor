import React, {useEffect, useState} from "react";
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
import Grid from '@material-ui/core/Grid';
import {withTracker} from "meteor/react-meteor-data";
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
  DatePicker
} from '@material-ui/pickers';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {data} from "/imports/activitiesContent.json";
import {Peoples} from '/imports/api/peoples/peoples'
import {Companies} from '/imports/api/companies/companies'
import AutoComplete from '/imports/ui/components/utilityComponents/AutoCompleteInline'
import {withRouter} from 'react-router'
import SaveChanges from "../../Modals/SaveChanges";
import FormControl from "@material-ui/core/FormControl";
import {InputLabel, Select} from "@material-ui/core";
import MenuItem from "@material-ui/core/MenuItem";

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
  let {company, open, handleModalClose, handleType, project, template, stakeHolders, local, match, edit, activity, isOpen, displayEditButton, isSuperAdmin, isAdmin, isChangeManager, isManager, isActivityDeliverer = false} = props;
  project = project || {}
  const [isNew, setIsNew] = React.useState(false);
  const [status, setStatus] = React.useState(project.status || 'Active');
  const [users, setUsers] = React.useState([]);
  const [name, setName] = React.useState(project.name || '');
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
    })
  const [person, setPerson] = React.useState(...managers || '');
  const [peoples, setPeoples] = React.useState(stakeHolders.map(item => item._id));
  const [activityType, setActivityType] = React.useState({});
  const [startingDate, setStartingDate] = React.useState(project.startingDate || new Date());
  const [dueDate, setDueDate] = React.useState(project.endingDate || new Date());
  const [func, setFunc] = React.useState(project.function);
  const [organization, setOrganization] = React.useState(project.organization);
  const [expanded, setExpanded] = React.useState('panel1');

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
    setActivityType({});
    setDueDate(new Date());
    setDescription('');
    setPerson(null);
    setStatus('');
    setOrganization('');
    setFunc('');
    setPeoples(stakeHolders.map(item => item._id));
    updateFilter('localStakeHolders', 'ids', stakeHolders.map(item => item._id));

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

    delete project.changeManagerDetails;
    delete project.managerDetails;
    delete project.peoplesDetails;
    delete project.totalActivities;
    delete project.completedActivities;
    project.name = description;
    project.startingDate = startingDate;
    project.status = status;
    project.endingDate = dueDate;
    project.organization = organization;
    project.function = func;
    project.managers = person && person.map(p => p.value) || [];
    let params = {
      project
    };
    Meteor.call('projects.update', params, (err, res) => {
      if (err) {
        props.enqueueSnackbar(err.reason, {variant: 'error'});
      } else {
        setName('');
        resetValues();
        props.enqueueSnackbar('Project Updated Successfully.', {variant: 'success'})
        handleClose();
      }

    })

  };

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
      setExpanded('panel1');
      updateValues();
    }


  }, [props.company, stakeHolders, company, props.edit, props.activity, isNew, local]);

  const handleChangePanel = panel => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleClickOpen = () => {
    setIsNew(true);
    setExpanded('panel1');
  };
  const handleClose = () => {
    setName('');
    setIsNew(false);
    updateFilter('localStakeHolders', 'changed', false);
    resetValues()
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
          <DialogContent dividers>
            <div className={classes.root}>
              <ExpansionPanel expanded={expanded === 'panel1'} onChange={handleChangePanel('panel1')}>
                <ExpansionPanelSummary
                  expandIcon={<ExpandMoreIcon/>}
                  aria-controls="panel4bh-content"
                  id="panel4bh-header"
                >
                  <Typography className={classes.heading}>Project Name</Typography>
                  <Typography className={classes.secondaryHeading}>
                  </Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <Grid container direction={"row"} alignItems={"center"} justify={"space-between"}>
                    <Grid item xs={((isChangeManager && !isAdmin) || isAdmin) ? 6 : 12}>
                      <TextField
                        autoFocus
                        margin="dense"
                        id="description"
                        label="Project Name"
                        value={description}
                        onChange={handleDescriptionChange}
                        required={true}
                        disabled={disabled}
                        type="text"
                        fullWidth
                      />
                    </Grid>
                    {((isChangeManager && !isAdmin) || isAdmin) && <Grid item xs={5}>
                      <FormControl fullWidth={true}>
                        <InputLabel id={'select-project-status'}>Select Project Status</InputLabel>
                        <Select id={'select-project-status'} value={status} onChange={(e) => setStatus(e.target.value)}>
                          <MenuItem value={'active'}>Active</MenuItem>
                          <MenuItem value={'completed'}>Completed</MenuItem>
                          <MenuItem value={'on-hold'}>On-Hold</MenuItem>
                          <MenuItem value={'canceled'}>Canceled</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>}
                    {company && company.organizationField && <Grid item xs={6}>
                      <FormControl fullWidth={true}>
                        <InputLabel id={'select-project-organization'}>Organization</InputLabel>
                        <Select id={'select-project-organization'} value={organization} onChange={(e) => setOrganization(e.target.value)}>
                          {company.organization && company.organization.map(_organization => {
                            return <MenuItem value={_organization}>{_organization[0].toUpperCase() + _organization.slice(1)}</MenuItem>}
                          )}
                        </Select>
                      </FormControl>
                    </Grid>}
                    {company && company.functionField && <Grid item xs={5}>
                      <FormControl fullWidth={true}>
                        <InputLabel id={'select-project-function'}>Function</InputLabel>
                        <Select id={'select-project-function'} value={func} onChange={(e) => setFunc(e.target.value)}>
                          {company.function && company.function.map(_func => {
                            return <MenuItem value={_func}>{_func[0].toUpperCase() + _func.slice(1)}</MenuItem>}
                          )}
                        </Select>
                      </FormControl>
                    </Grid>}
                  </Grid>
                </ExpansionPanelDetails>
              </ExpansionPanel>
              <ExpansionPanel expanded={expanded === 'panel2'} onChange={handleChangePanel('panel2')}>
                <ExpansionPanelSummary
                  expandIcon={<ExpandMoreIcon/>}
                  aria-controls="panel1bh-content"
                  id="panel1bh-header"
                >
                  <Typography className={classes.heading}>Date</Typography>
                  <Typography className={classes.secondaryHeading}>Start and estimated due dates</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <Grid container justify="space-between" spacing={4}>
                      <Grid item xs={6}>
                        <DatePicker
                          fullWidth
                          disableToolbar
                          variant="inline"
                          format="MM/dd/yyyy"
                          margin="normal"
                          id="date-picker-inline"
                          label="Start Date"
                          value={startingDate}
                          autoOk={true}
                          disabled={disabled}
                          onChange={handleStartingDate}
                          KeyboardButtonProps={{
                            'aria-label': 'change date',
                          }}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <DatePicker
                          disableToolbar
                          fullWidth
                          variant="inline"
                          margin="normal"
                          id="date-picker-dialog"
                          label="Estimated Due Date"
                          format="MM/dd/yyyy"
                          value={dueDate}
                          minDate={startingDate}
                          autoOk={true}
                          disabled={disabled}
                          onChange={handleDueDate}
                          KeyboardButtonProps={{
                            'aria-label': 'change date',
                          }}
                        />
                      </Grid>
                    </Grid>
                  </MuiPickersUtilsProvider>
                </ExpansionPanelDetails>
              </ExpansionPanel>
              <ExpansionPanel expanded={expanded === (disabled === true) ? 'panel3' : null}
                              onChange={handleChangePanel('panal3')}>
                <ExpansionPanelSummary
                  expandIcon={<ExpandMoreIcon/>}
                  aria-controls="panal5bh-content"
                  id="panal5bh-header"
                >
                  <Typography className={classes.heading}>Managers</Typography>
                  <Typography className={classes.secondaryHeading}>
                    {person && person.length ? person.map(t => t.label).join(", ") : 'Invite for view-only access (optional)'}
                  </Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <Grid container justify="space-between" spacing={2}>
                    <Grid item={true} xs={12}>
                      <AutoComplete updateUsers={updateUsers} data={users} selectedValue={person} multiple={true}
                                    isManager={isManager}
                                    isSuperAdmin={isSuperAdmin} isAdmin={isAdmin} isChangeManager={isChangeManager}
                                    isActivityDeliverer={isActivityDeliverer}/>
                    </Grid>
                  </Grid>
                </ExpansionPanelDetails>
              </ExpansionPanel>
            </div>
            <SaveChanges
              handleClose={handleClose}
              showModalDialog={showModalDialog}
              handleSave={updateProject}
              closeModalDialog={closeModalDialog}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={isUpdated ? handleOpenModalDialog : () => handleClose()} disabled={disabled}
                    color="secondary">
              Cancel
            </Button>
            <Button type="submit" color="primary" disabled={disabled} onClick={updateProject}>
              Update Project
            </Button>
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