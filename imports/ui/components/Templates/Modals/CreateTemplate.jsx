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
  KeyboardDatePicker,
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
import ProjectNavBar from "../../Projects/ProjectsNavBar";

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
  let {company, stakeHolders, local, match, edit, activity, isOpen, isAdmin, currentCompany, isSuperAdmin, selectedTab} = props;
  const [open, setOpen] = React.useState(edit || isOpen || false);
  const [deleteModal, setDeleteModal] = React.useState(false);
  const [age, setAge] = React.useState(5);
  const [isNew, setIsNew] = React.useState(false);
  const [users, setUsers] = React.useState([]);
  const [name, setName] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [person, setPerson] = React.useState('');
  const [peoples, setPeoples] = React.useState(stakeHolders.map(item => item._id));
  const [activityType, setActivityType] = React.useState({});
  const [dueDate, setDueDate] = React.useState(new Date());
  const [expanded, setExpanded] = React.useState('panel1');

  let {templateId} = match.params;
  const classes = useStyles();
  const classes1 = gridStyles();

  const updateValues = () => {
    if (isNew) {
      resetValues();
      return false;
    }
    let selectedActivity = data.find(item => item.name === activity.type) || {};
    setActivityType(selectedActivity);
    setDueDate(activity.dueDate);
    setDescription(activity.description);
    let obj = {
      label: `${activity.personResponsible.profile.firstName} ${activity.personResponsible.profile.lastName}`,
      value: activity.personResponsible._id
    };
    setPerson(obj);
    setAge(activity.time);
    local.changed || updateFilter('localStakeHolders', 'ids', activity.stakeHolders);
    let updatedStakeHolders = local.changed ? local.ids : activity.stakeHolders;
    setPeoples(updatedStakeHolders);

  };

  const resetValues = () => {
    setActivityType({});
    setDescription('');
    updateFilter('localStakeHolders', 'ids', stakeHolders.map(item => item._id));

  };

  const createTemplate = (e) => {
    e.preventDefault();
    if (!description) {
      props.enqueueSnackbar('Please fill all required fields', {variant: 'error'});
      return false;
    }
    let params = {};
    if (isAdmin) {
      params = {
        template: {
          name: description,
          companyId: currentCompany._id,
        }
      }
    } else {
      params = {
        template: {
          name: description,
        }
      };
    }

    Meteor.call('templates.insert', params, (err, res) => {
      if (err) {
        props.enqueueSnackbar(err.reason, {variant: 'error'})
      } else {
        setOpen(false);
        setName('');
        resetValues();
        props.enqueueSnackbar('New Template Created Successfully.', {variant: 'success'})
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
    setOpen(edit || open);
    updateUsersList();
    if (isNew) {
      let updatedStakeHolders = local.changed ? local.ids : stakeHolders.map(item => item._id);
      setPeoples(updatedStakeHolders);
    }
    if (edit && activity && activity.name) {
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
    setOpen(true);
  };
  const handleClose = () => {
    setName('');
    setOpen(false);
    setIsNew(false);
    props.newActivity();
    updateFilter('localStakeHolders', 'changed', false);
    resetValues()
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value)
  };

  function deleteActivity() {
    setDeleteModal(true);
  }


  return (
    <div className={classes.AddNewActivity}>
      {((isSuperAdmin && selectedTab === 2) || (isAdmin && selectedTab === 1)) && company &&
      <Button variant="contained" color="primary" onClick={handleClickOpen}>
        Create New Template
      </Button> }
      <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open} maxWidth="md"
              fullWidth={true}>
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          Create New Template
        </DialogTitle>
        <form onSubmit={createTemplate} noValidate>
          <DialogContent dividers>
            <div className={classes.root}>
              <ExpansionPanel expanded={expanded === 'panel1'} onChange={handleChangePanel('panel1')}>
                <ExpansionPanelSummary
                  expandIcon={<ExpandMoreIcon/>}
                  aria-controls="panel4bh-content"
                  id="panel4bh-header"
                >
                  <Typography className={classes.heading}>Template Name</Typography>
                  <Typography className={classes.secondaryHeading}>
                  </Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <TextField
                    autoFocus
                    margin="dense"
                    id="description"
                    label="Template Name"
                    value={description}
                    onChange={handleDescriptionChange}
                    required={true}
                    type="text"
                    fullWidth
                  />
                </ExpansionPanelDetails>
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
              Create Template
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