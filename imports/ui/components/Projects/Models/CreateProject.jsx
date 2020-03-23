import React, {useEffect} from "react";
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
  DatePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import {Companies} from '/imports/api/companies/companies'
import AutoComplete from '/imports/ui/components/utilityComponents/AutoCompleteInline'
import {withRouter} from 'react-router'
import AddNewPerson from "../../Activities/Modals/AddNewPerson";
import FormControl from "@material-ui/core/FormControl";
import {InputLabel, Step, StepContent, StepLabel, Stepper} from "@material-ui/core";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import {CustomStepConnector, CustomStepIcon} from "../../../../utils/CustomStepper";

const styles = theme => ({
  root: {
    margin: 0,
    padding: 0,
  },
  closeButton: {
    position: 'fixed',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[200],
  },
});

const useStyles = makeStyles(theme => ({
  AddNewProject: {
    flex: 1,
    marginTop: 2,
    marginLeft: 15
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
  }
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

function AddProject(props) {
  let {company, companies, allCompany, isSuperAdmin} = props;
  const [open, setOpen] = React.useState(false);
  const [isNew, setIsNew] = React.useState(false);
  const [users, setUsers] = React.useState([]);
  const [name, setName] = React.useState('');
  const [person, setPerson] = React.useState('');
  const [startingDate, setStartingDate] = React.useState(new Date());
  const [endingDate, setEndingDate] = React.useState(new Date());
  const [organization, setOrganization] = React.useState('');
  const [func, setFunc] = React.useState('');
  const [isDone, setIsDone] = React.useState([]);
  const [currentCompany, setCurrentCompany] = React.useState({});

  const classes = useStyles();

  const resetValues = () => {
    setEndingDate(new Date());
    setStartingDate(new Date());
    setName('');
    setPerson(null);
    setCurrentCompany({});
    setUsers([]);
    setOrganization('');
    setFunc('');
    setIsDone([]);
  };

  useEffect(() => {
    if (company && !isSuperAdmin) {
      setCurrentCompany(company);
    }
  }, [company]);

  const createProject = (e) => {
    e.preventDefault();
    if (!(name && startingDate && endingDate)) {
      props.enqueueSnackbar('Please fill all required fields', {variant: 'error'});
      return false;
    } else if (endingDate < startingDate) {
      props.enqueueSnackbar('Please fix the date error', {variant: 'error'});
      return false;
    } else if (isSuperAdmin && !currentCompany) {
      props.enqueueSnackbar('Please choose company. This field is required', {variant: 'error'});
      return false;
    }
    let params = {
      project: {
        name: name,
        status: 'active',
        startingDate,
        endingDate,
        organization: organization,
        function: func,
        companyId: currentCompany._id,
        managers: person && person.map(p => p.value) || []
      }
    };
    Meteor.call('projects.insert', params, (err, res) => {
      if (err) {
        props.enqueueSnackbar(err.reason, {variant: 'error'})
      } else {
        resetValues();
        props.enqueueSnackbar('New Project Created Successfully.', {variant: 'success'});
        setOpen(false);
      }
    })
  };

  const updateUsersList = () => {
    let selectedCompany = company._id || {};
    if (companies && currentCompany) {
      selectedCompany = allCompany.find(_company => _company._id === currentCompany._id)
    }
    Meteor.call(`users.getPersons`, {company: selectedCompany}, (err, res) => {
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
  }, [currentCompany, isNew, open]);

  useEffect(() => {
    if (name) {
      setIsDone([...new Set(['0'].concat(isDone))])
    }
  }, [name, company]);

  useEffect(() => {
    if (startingDate && endingDate) {
      setIsDone([...new Set(['1'].concat(isDone))])
    }
  }, [startingDate, endingDate]);

  useEffect(() => {
    if (person) {
      setIsDone([...new Set(['2'].concat(isDone))])
    }
  }, [person]);


  const handleClickOpen = () => {
    setIsNew(true);
    setOpen(true);
  };

  const handleClose = () => {
    setIsNew(false);
    setOpen(false);
    resetValues()
  };

  const handleStartingDate = date => {
    setStartingDate(date);
    if (endingDate < date) {
      setEndingDate(date);
    }
  };

  const handleEndingDate = date => {
    setEndingDate(date);
  };

  const updateUsers = (value) => {
    setPerson(value)
  };

  const handleNameChange = (e) => {
    setName(e.target.value)
  };

  const onCalendarClick = (id) => {
    document.getElementById(id).click();
  };

  return (
    <div className={classes.AddNewProject}>
      <Button variant="contained" color="primary" onClick={handleClickOpen}>
        Create New Project
      </Button>
      <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open} maxWidth="md"
              fullWidth={true}>
        <DialogTitle onClose={handleClose}/>
        <form onSubmit={createProject} noValidate>
          <DialogContent>
            <div className={classes.root}>
              <Stepper orientation="vertical" connector={<CustomStepConnector />}>
                <Step key={0} active={true} completed={isDone.includes('0')}>
                  <StepLabel StepIconComponent={CustomStepIcon} classes={{active: classes.stepLabelMain}}>New
                    Project</StepLabel>
                  <StepContent classes={{root: classes.stepContentRoot}}>
                    <Grid container direction={'row'} alignItems={"center"} justify={'space-between'} className={classes.container}>
                      <Grid item xs={12} style={{paddingBottom: '10px'}}>
                        <TextField
                          autoFocus
                          margin="dense"
                          id="name"
                          label="Project Name"
                          value={name}
                          onChange={handleNameChange}
                          required={true}
                          type="text"
                          variant={"outlined"}
                          fullWidth
                        />
                      </Grid>
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

                      {isSuperAdmin && <Grid item xs={6}>
                        <Grid container justify="space-between" spacing={2}>
                          <Grid item xs={12}>
                            <FormControl fullWidth>
                              <InputLabel id="selectCompany">Company</InputLabel>
                              <Select value={currentCompany} id="selectCompany"
                                      onChange={(e) => setCurrentCompany(e.target.value)}>
                                {companies.map(_company => {
                                  return <MenuItem key={_company._id} value={_company}>
                                    {_company.name}
                                  </MenuItem>
                                })}
                              </Select>
                            </FormControl>
                          </Grid>
                        </Grid>
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
                              value={endingDate}
                              minDate={startingDate}
                              autoOk={true}
                              onChange={handleEndingDate}
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
          </DialogContent>
          <DialogActions>
            <Grid container direction={"row"} alignItems={"center"} justify={"space-between"}
                  className={classes.gridButtons}>
              <Grid item xs={1}>
                <Button onClick={handleClose} color="default">
                  cancel
                </Button>
              </Grid>
              <Grid item xs={1}>
                <Button type="submit" variant="contained" className={classes.createButton} color="primary">
                  Create
                </Button>
              </Grid>
            </Grid>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}

const AddProjectPage = withTracker(props => {
  Meteor.subscribe('companies');
  let allCompany = Companies.find({}).fetch();
  let currentCompany = {};
  if (allCompany) {
    currentCompany = allCompany.find(company => company.peoples.includes(Meteor.userId()))
  } else {
    currentCompany = Companies.findOne() || {}
  }
  return {
    allCompany,
    company: currentCompany || {},
  };
})(withRouter(AddProject));

export default withSnackbar(AddProjectPage)