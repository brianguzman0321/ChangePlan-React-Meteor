import React, {useEffect} from "react";
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
  DatePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {Companies} from '/imports/api/companies/companies'
import AutoComplete from '/imports/ui/components/utilityComponents/AutoCompleteInline'
import {withRouter} from 'react-router'
import AddNewPerson from "../../Activities/Modals/AddNewPerson";
import FormControl from "@material-ui/core/FormControl";
import {InputLabel} from "@material-ui/core";
import Select from "@material-ui/core/Select";
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

function AddProject(props) {
  let {company, companies, allCompany, isSuperAdmin} = props;
  const [open, setOpen] = React.useState(false);
  const [isNew, setIsNew] = React.useState(false);
  const [users, setUsers] = React.useState([]);
  const [name, setName] = React.useState('');
  const [person, setPerson] = React.useState('');
  const [startingDate, setStartingDate] = React.useState(new Date());
  const [endingDate, setEndingDate] = React.useState(new Date());
  const [organization, setOrganization] =React.useState('');
  const [func, setFunc] =React.useState('');
  const [expanded, setExpanded] = React.useState('panel1');
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
    setExpanded('panel1')
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

  const handleChangePanel = panel => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleClickOpen = () => {
    setIsNew(true);
    setExpanded('panel1');
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


  return (
    <div className={classes.AddNewProject}>
      <Button variant="contained" color="primary" onClick={handleClickOpen}>
        Create New Project
      </Button>
      <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open} maxWidth="md"
              fullWidth={true}>
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          Create New Project
        </DialogTitle>
        <form onSubmit={createProject} noValidate>
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
                  <Grid container direction={'row'} alignItems={"center"} justify={"space-between"}>
                    <Grid item xs={12}>
                      <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Project Name"
                        value={name}
                        onChange={handleNameChange}
                        required={true}
                        type="text"
                        fullWidth
                      />
                    </Grid>
                    {company && company.organizationField &&<Grid item xs={5}>
                      <FormControl fullWidth={true}>
                        <InputLabel id={'select-project-status'}>Organization</InputLabel>
                        <Select id={'select-project-status'} value={organization} onChange={(e) => setOrganization(e.target.value)}>
                          {company.organization.map(organization => {
                            return <MenuItem value={organization}>{organization[0].toUpperCase() + organization.slice(1)}</MenuItem>}
                          )}
                        </Select>
                      </FormControl>
                    </Grid>}
                    {company && company.functionField && <Grid item xs={5}>
                      <FormControl fullWidth={true}>
                        <InputLabel id={'select-project-status'}>Function</InputLabel>
                        <Select id={'select-project-status'} value={func} onChange={(e) => setFunc(e.target.value)}>
                          {company.function.map(func => {
                            return <MenuItem value={func}>{func[0].toUpperCase() + func.slice(1)}</MenuItem>}
                          )}
                        </Select>
                      </FormControl>
                    </Grid>}
                  </Grid>
                </ExpansionPanelDetails>
              </ExpansionPanel>
              {isSuperAdmin &&
              <ExpansionPanel expanded={expanded === 'panel4'} onChange={handleChangePanel('panel4')}>
                <ExpansionPanelSummary
                  expandIcon={<ExpandMoreIcon/>}
                  aria-controls="panel4bh-content"
                  id="panel4bh-header"
                >
                  <Typography className={classes.heading}>Company</Typography>
                  <Typography className={classes.secondaryHeading}>
                    {(currentCompany.length > 0 && companies)? companies.find(_company => _company._id === (currentCompany._id)).name : 'Choose the company (required for Super Admin)'}
                  </Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <Grid container justify="space-between" spacing={2}>
                    <Grid item xs={6}>
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
                </ExpansionPanelDetails>
              </ExpansionPanel>}
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
                          value={endingDate}
                          minDate={startingDate}
                          autoOk={true}
                          onChange={handleEndingDate}
                          KeyboardButtonProps={{
                            'aria-label': 'change date',
                          }}
                        />
                      </Grid>
                    </Grid>
                  </MuiPickersUtilsProvider>
                </ExpansionPanelDetails>
              </ExpansionPanel>
              <ExpansionPanel expanded={expanded === 'panal3'} onChange={handleChangePanel('panal3')}>
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
                    <Grid item={true} xs={7}>
                      <AutoComplete updateUsers={updateUsers} data={users} selectedValue={person} multiple={true}
                                    isActivity={false} label={'Users'}/>
                    </Grid>
                    <Grid item={true} xs={5}>
                      <AddNewPerson company={company._id}/>
                    </Grid>
                  </Grid>
                </ExpansionPanelDetails>
              </ExpansionPanel>
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="secondary">
              cancel
            </Button>

            <Button type="submit" color="primary">
              Create Project
            </Button>
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