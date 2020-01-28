import React, {useEffect, useState} from "react";
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
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
import Grid from "@material-ui/core/Grid/Grid";
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import {withTracker} from "meteor/react-meteor-data";
import {Companies} from "/imports/api/companies/companies";
import SaveChanges from "../../Modals/SaveChanges";
import moment from "moment";
import {data} from "/imports/activitiesContent.json";
import {stringHelpers} from "../../../../helpers/stringHelpers";
import SVGInline from "react-svg-inline";
import {SurveysStakeholders} from "../../../../api/surveysStakeholders/surveysStakeholders";

const styles = theme => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const useStyles = makeStyles(theme => ({
  createNewProject: {
    flex: 1,
    marginTop: 2,
    marginLeft: 15
  },
  addStakeHolder: {
    background: '#92a1af',
    '&:hover': {
      background: '#92a1af'
    }
  },
  stakeholderDetails: {
    background: '#f4f5f7',
    '&:hover': {
      background: '#f4f5f7'
    }
  },
  columnHeadings: {
    color: '#465563',
    fontSize: '0.75rem',
    fontWeight: 500
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

function EditStakeHolder(props) {
  let {stakeholder, open, close, isAdmin, isSuperAdmin, isManager, isChangeManager, project, template, type, company, projectId, disabled} = props;
  const [firstName, setFirstName] = React.useState(stakeholder.firstName);
  const [lastName, setLastName] = React.useState(stakeholder.lastName);
  const [role, setRole] = React.useState(stakeholder.role);
  const [businessUnit, setBusinessUnit] = React.useState(stakeholder.businessUnit);
  const [email, setEmail] = React.useState(stakeholder.email);
  const [supportLevel, setSupportLevel] = React.useState(stakeholder.influenceLevel);
  const [loI, setInfluenceLevel] = React.useState(stakeholder.supportLevel);
  const [selectOpen, setSelectOpen] = React.useState(false);
  const [selectOpen1, setSelectOpen1] = React.useState(false);
  const [notes, setNotes] = React.useState(stakeholder.notes);
  const [showModalDialog, setShowModalDialog] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);
  const [stakeholderActivities, setStakeholderActivities] = useState(false);
  const [stakeholderProjects, setStakeholderProjects] = useState(false);
  const [totalTimeAwayBAU, setTotalTimeAwayBAU] = useState(false);
  const [responseOnSurveys, setResponseOnSurveys] = useState({});
  const classes = useStyles();

  const resetChanges = () => {
    setFirstName(stakeholder.firstName);
    setLastName(stakeholder.lastName);
    setRole(stakeholder.role);
    setBusinessUnit(stakeholder.businessUnit);
    setEmail(stakeholder.email);
    setSupportLevel(stakeholder.supportLevel);
    setInfluenceLevel(stakeholder.influenceLevel);
    setNotes(stakeholder.notes);
  };

  const fetchStakeholderData = () => {
    let params = {
      activity: {
        stakeholderId: stakeholder._id
      }
    };
    Meteor.call('activities.getStakeholderActivities', params, (err, res) => {
      if (err) {
        props.enqueueSnackbar(err.reason, {variant: 'error'})
      } else {
        setStakeholderActivities(res.activities);
        let totalTime = res.totalTime;
        totalTime = totalTime < 60 ? totalTime + " Minutes" : parseFloat(totalTime / 60).toFixed(2) + " Hours";
        setTotalTimeAwayBAU(totalTime);
      }
    });

    let projectPrams = {
      project: {
        stakeholderId: stakeholder._id
      }
    };

    Meteor.call('projects.getStakeholderProjects', projectPrams, (err, res) => {
      if (err) {
        props.enqueueSnackbar(err.reason, {variant: 'error'})
      } else {
        setStakeholderProjects(res);
      }
    });

    const surveys = SurveysStakeholders.find({}).fetch();
    setResponseOnSurveys(surveys);
  };

  const handleClose = () => {
    setShowModalDialog(false);
    setIsUpdated(false);
    resetChanges();
    close();
  };

  const handleOpenModalDialog = () => {
    if (isUpdated) {
      setShowModalDialog(true);
    }
  };

  const closeModalDialog = () => {
    setShowModalDialog(false);
  };


  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setIsUpdated(true);
  };

  const onSubmit = (e) => {
    event.preventDefault();
    let params = {
      people: {
        _id: stakeholder._id,
        firstName,
        lastName,
        role,
        businessUnit,
        email,
        notes,
        influenceLevel: loI,
        supportLevel: supportLevel,

      }
    };
    Meteor.call('peoples.update', params, (err, res) => {
      if (err) {
        props.enqueueSnackbar(err.reason, {variant: 'error'})
      } else {
        handleClose();
        props.enqueueSnackbar('Stakeholder Updated Successfully.', {variant: 'success'})
      }

    })
  };

  function handleSelectClose() {
    setSelectOpen(false);
  }

  function handleSelectOpen() {
    setSelectOpen(true);
  }

  function handleSelectClose1() {
    setSelectOpen1(false);
  }

  function handleSelectOpen1() {
    setSelectOpen1(true);
  }

  useEffect(() => {
    if (open) {
      fetchStakeholderData();
    }
  }, [open]);

  return (
    <>
      <Dialog onClose={isUpdated ? handleOpenModalDialog : () => close()} aria-labelledby="customized-dialog-title"
              open={open} maxWidth="md" fullWidth={true}>
        <DialogTitle id="customized-dialog-title" onClose={isUpdated ? handleOpenModalDialog : () => close()}>
          Edit Stakeholder
        </DialogTitle>
        <form onSubmit={onSubmit}>
          <DialogContent dividers>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  disabled={disabled}
                  autoFocus
                  // margin="dense"
                  id="firstName"
                  label="First Name"
                  value={firstName}
                  onChange={(e) => {
                    setFirstName(e.target.value);
                    setIsUpdated(true);
                  }}
                  required={true}
                  type="text"
                  fullWidth={true}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  disabled={disabled}
                  // margin="dense"
                  id="lastName"
                  label="Last Name"
                  value={lastName}
                  onChange={(e) => {
                    setLastName(e.target.value);
                    setIsUpdated(true);
                  }}
                  required={true}
                  type="text"
                  fullWidth={true}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  disabled={disabled}
                  // margin="dense"
                  id="role"
                  label="Role"
                  value={role}
                  onChange={(e) => {
                    setRole(e.target.value);
                    setIsUpdated(true);
                  }}
                  required={true}
                  type="text"
                  fullWidth={true}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  disabled={disabled}
                  // margin="dense"
                  id="businessUnit"
                  label="Business Unit"
                  value={businessUnit}
                  onChange={(e) => {
                    setBusinessUnit(e.target.value);
                    setIsUpdated(true);
                  }}
                  required={true}
                  type="text"
                  fullWidth={true}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  disabled={disabled}
                  // margin="dense"
                  id="email"
                  label="Email"
                  value={email}
                  onChange={handleEmailChange}
                  required={true}
                  type="email"
                  fullWidth={true}
                />
              </Grid>
              <Grid item xs={6}/>
              <Grid item xs={12}>
                <TextField
                  disabled={disabled}
                  // margin="dense"
                  id="notes"
                  label="Notes"
                  value={notes}
                  onChange={(e) => {
                    setNotes(e.target.value);
                    setIsUpdated(true);
                  }}
                  type="text"
                  fullWidth={true}
                />
              </Grid>
              <Grid item xs={6}>
                <FormControl className={classes.formControl} fullWidth={true}>
                  <InputLabel htmlFor="demo-controlled-open-select">Level Of Support</InputLabel>
                  <Select
                    disabled={disabled}
                    id="role"
                    label="role"
                    fullWidth={true}
                    open={selectOpen}
                    onClose={handleSelectClose}
                    onOpen={handleSelectOpen}
                    value={supportLevel}
                    onChange={(e) => {
                      setSupportLevel(e.target.value);
                      setIsUpdated(true);
                    }}
                    inputProps={{
                      name: 'role',
                      id: 'demo-controlled-open-select',
                    }}
                  >
                    <MenuItem value={1}>1 = Very low level of support</MenuItem>
                    <MenuItem value={2}>2 = Low level of support</MenuItem>
                    <MenuItem value={3}>3 = Moderate level of support</MenuItem>
                    <MenuItem value={4}>4 = High level of support</MenuItem>
                    <MenuItem value={5}>5 = Engaged and supportive</MenuItem>
                  </Select>
                </FormControl>
                <br/>
                <br/>
                <br/>
              </Grid>
              <Grid item xs={6}>
                <FormControl className={classes.formControl} fullWidth={true}>
                  <InputLabel htmlFor="demo-controlled-open-select">Level Of Influence</InputLabel>
                  <Select
                    disabled={disabled}
                    id="role"
                    label="role"
                    fullWidth={true}
                    open={selectOpen1}
                    onClose={handleSelectClose1}
                    onOpen={handleSelectOpen1}
                    value={loI}
                    onChange={(e) => {
                      setInfluenceLevel(e.target.value);
                      setIsUpdated(true);
                    }}
                    inputProps={{
                      name: 'role',
                      id: 'demo-controlled-open-select',
                    }}
                  >
                    <MenuItem value={1}>1 = Little influence over outcomes</MenuItem>
                    <MenuItem value={2}>2 = Some influence over outcomes</MenuItem>
                    <MenuItem value={3}>3 = Moderate influence over outcomes</MenuItem>
                    <MenuItem value={4}>4 = Major influence over outcomes</MenuItem>
                    <MenuItem value={5}>5 = Project will not succeed without their support</MenuItem>
                  </Select>
                </FormControl>
                <br/>
                <br/>
                <br/>
              </Grid>
            </Grid>
            <Card className={classes.stakeholderDetails}>
              <CardActionArea>
                <CardContent>
                  <Typography gutterBottom variant="h6" component="h2">
                    Stakeholder Activity
                  </Typography>
                  <br/>
                  <Typography gutterBottom className={classes.columnHeadings}>
                    Total time away from BAU
                  </Typography>
                  <Typography variant="body2" color="textSecondary" component="p">
                    {totalTimeAwayBAU}
                  </Typography>
                  <br/>
                  <br/>
                  <Typography gutterBottom className={classes.columnHeadings}>
                    Current Projects
                  </Typography>
                  {
                    stakeholderProjects && stakeholderProjects.length ? stakeholderProjects.map((project) => {
                      return <Typography variant="body2" color="textSecondary" component="p" style={{marginTop: 5}}>
                        {project.name}
                      </Typography>
                    }) : <Typography variant="body2" color="textSecondary" component="p">
                      No projects found
                    </Typography>
                  }

                  <br/>
                  <br/>
                  <Typography gutterBottom className={classes.columnHeadings}>
                    Upcoming Activities
                  </Typography>
                  {
                    stakeholderActivities && stakeholderActivities.length ? stakeholderActivities.map((activity) => {
                      let selectedActivity = data.find(item => item.name === activity.type) || {};
                      return <Typography variant="body2" color="textSecondary" component="p" style={{marginTop: 5}}>
                        {moment(activity.dueDate).format('DD-MMM-YY')} &nbsp;&nbsp;&nbsp;&nbsp;
                        {selectedActivity.iconSVG ?
                          <SVGInline style={{position: 'absolute', marginTop: -4, marginLeft: -9}} width="23px"
                                     height="23px" fill='#465563' svg={selectedActivity.iconSVG}/> : ''
                        } &nbsp;&nbsp;&nbsp;
                        {activity.name} &nbsp;&nbsp;&nbsp;&nbsp;
                        <span
                          className={classes.activityDescription}>{stringHelpers.limitCharacters(activity.description, 112)}</span>
                        <br/>
                        {responseOnSurveys && responseOnSurveys.filter(response => response.activityId === activity._id).map(_response => {
                          return <Grid>
                            <p style={{margin: '0px'}}>Question 1: {_response.question1 === 1 ? 'Strongly disagree' :
                              _response.question2 === 2 ? 'Disagree' :
                                _response.question3 === 3 ? 'Neither agree or disagree' :
                                  _response.question3 === 4 ? 'Agree' :
                                    _response.question3 === 5 ? 'Strongly agree' : null}</p>
                            <p style={{margin: '0px'}}>Question 2: {_response.question2}</p>
                          </Grid>
                        })}
                      </Typography>
                    }) : <Typography variant="body2" color="textSecondary" component="p">
                      No activities Found
                    </Typography>
                  }
                </CardContent>
              </CardActionArea>
            </Card>
          </DialogContent>
          <DialogActions>
            {(isAdmin && template && (template.companyId === company._id)) || isSuperAdmin || (type === 'project' && (project && !isManager)) ?
              <Button onClick={isUpdated ? handleOpenModalDialog : () => close()} color="secondary">
                Cancel
              </Button> :
              <Button onClick={() => close()} color="secondary">
                OK
              </Button>}
            {(isAdmin && template && (template.companyId === company._id)) || isSuperAdmin || (type === 'project' && (project && !isManager && (isChangeManager || isAdmin))) ?
              <Button color="primary" type="submit">
                Update
              </Button> : null}
          </DialogActions>
          <SaveChanges
            handleClose={handleClose}
            showModalDialog={showModalDialog}
            handleSave={onSubmit}
            closeModalDialog={closeModalDialog}
          />
        </form>
      </Dialog>
    </>
  );
}

const EditStakeHolderPage = withTracker(props => {
  Meteor.subscribe('surveysStakeholders');
  return {
    company: Companies.findOne(),
  };
})(EditStakeHolder);

export default withSnackbar(EditStakeHolderPage)