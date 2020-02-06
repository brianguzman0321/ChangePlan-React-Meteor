import React, {useEffect, useState} from 'react';
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
import moment from 'moment';
import Grid from "@material-ui/core/Grid/Grid";
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import SaveChanges from "../../Modals/SaveChanges";
import {withTracker} from "meteor/react-meteor-data";
import SelectStakeHolders from "../../Activities/Modals/SelectStakeHolders";
import {Companies} from "../../../../api/companies/companies";
import {Peoples} from "../../../../api/peoples/peoples";
import {withRouter} from "react-router";
import {Templates} from "../../../../api/templates/templates";
import {Projects} from "../../../../api/projects/projects";
import {TableCell, TableHead, TableRow} from "@material-ui/core";
import Table from "@material-ui/core/Table";
import {Activities} from "../../../../api/activities/activities";
import SelectActivities from "./SelectActivities";

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
    marginLeft: 15,
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
  datePicker: {
    display: 'flex',
    alignItems: 'center',
  },
  input: {
    backgroundColor: '#f5f5f5',
    border: '1px solid #f5f5f5',
    borderRadius: '4px',
  },
  containerStakeholders: {
    padding: '8px',
  },
  buttonActivities: {
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
  buttonContainer: {
    textAlign: 'right',
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
    padding: theme.spacing(2),
  }
}))(MuiDialogContent);

const DialogActions = withStyles(theme => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);


function AddImpact(props) {
  let {
    open, handleModalClose, currentType, stakeHoldersImpacts, isNew,
    stakeHoldersTemplate, isSuperAdmin, isAdmin, isChangeManager, isManager, activities, projectId, templateId, impact
  } = props;
  const [peoples, setPeoples] = useState([]);
  const [type, setType] = React.useState('');
  const [level, setLevel] = React.useState('');
  const [showModalDialog, setShowModalDialog] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);
  const [change, setChange] = useState('');
  const [describeImpact, setDescribeImpact] = useState('');
  const [activitiesImpact, setActivitiesImpact] = useState([]);
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [showActivities, setShowActivities] = useState(false);
  const disabled = (isManager && !isSuperAdmin && !isChangeManager && !isAdmin)
    || (isChangeManager && currentType === 'template' && !isSuperAdmin && !isAdmin)
    || (isAdmin && currentType === 'template' && !isSuperAdmin);

  useEffect(() => {
    if (!isNew && impact) {
      setType(impact.type);
      setLevel(impact.level);
      setChange(impact.change);
      setDescribeImpact(impact.impact);
      setPeoples(impact.stakeholders);
      setActivitiesImpact(impact.activities);
      setSelectedActivities(impact.activities);
      updateActivities(impact.activities);
    } else if (isNew) {
      resetValues();
    }
  }, [impact]);

  const resetValues = () => {
    setType('');
    setLevel('');
    setChange('');
    setDescribeImpact('');
    setActivitiesImpact([]);
    setSelectedActivities([]);
    setPeoples([]);
  };

  const classes = useStyles();

  const handleClose = () => {
    handleModalClose();
    updateFilter('localStakeHoldersImpacts', 'changed', false);
    setIsUpdated(false);
  };

  const handleOpenModalDialog = () => {
    if (isUpdated) {
      handleModalClose();
    }
  };

  const handleChangeInput = (e) => {
    setChange(e.target.value);
  };

  const handleDescribeImpact = (e) => {
    setDescribeImpact(e.target.value);
  };

  const closeModalDialog = () => {
    setShowModalDialog(false);
  };

  const handleSelectActivities = (newSelectedActivities) => {
    setSelectedActivities(newSelectedActivities);
    updateActivities(newSelectedActivities);
  };

  const updateActivities = (newSelectedActivities) => {
    const newActivities = [];
    newSelectedActivities.forEach(_activity => {
      const newActivity = activities.find(activity => activity._id === _activity);
      newActivities.push(newActivity);
    });
    setActivitiesImpact(newActivities);
  };

  const createImpact = () => {
    if (!(type && level)) {
      props.enqueueSnackbar('Please fill the required Field', {variant: 'error'});
      return false;
    }
    let methodName = 'impacts.insert';
    let params = {
      impact: {
        type: type,
        level: level,
        change: change,
        impact: describeImpact,
        stakeholders: peoples,
        activities: selectedActivities,
      }
    };

    if (currentType === 'project') {
      params.impact.projectId = projectId;
    } else if (currentType === 'template') {
      params.impact.templateId = templateId;
    }
    if (!isNew) {
      methodName = 'impacts.update';
      params.impact._id = impact._id;
    }
    Meteor.call(methodName, params, (err, res) => {
      if (err) {
        props.enqueueSnackbar(err.reason, {variant: 'error'})
      } else {
        resetValues();
        handleClose();
        props.enqueueSnackbar(isNew ? 'Impact Saving Successfully' : 'Impact Updating Successfully', {variant: 'success'})
      }
    })
  };

  const handleSelectStakeholders = (newStakeholders) => {
    setPeoples(newStakeholders);
  };

  function handleLevelChange(event) {
    setLevel(event.target.value);
    setIsUpdated(true);
  };

  function handleTypeChange(event) {
    setType(event.target.value);
    setIsUpdated(true);
  };

  const handleShowActivities = () => {
    setShowActivities(true);
  };

  const handleCloseActivities = () => {
    setShowActivities(false);
  };

  const selectPhase = (phase) => {
    switch (phase) {
      case 1:
        return '1';
      case 2:
        return '4';
      case 3:
        return '5';
      case 4:
        return '2';
      case 5:
        return '3';
      default:
        break;
    }
  };

  return (
    <div className={classes.createNewProject}>
      <Dialog onClose={isUpdated ? handleOpenModalDialog : handleClose} aria-labelledby="customized-dialog-title"
              open={open} maxWidth="md" fullWidth={true}>
        <DialogTitle id="customized-dialog-title" onClose={isUpdated ? handleOpenModalDialog : handleClose}>
          Add a change impact
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <br/>
              <FormControl className={classes.formControl} fullWidth={true}>
                <InputLabel htmlFor="demo-controlled-open-select"
                            required={true}>Impact type</InputLabel>
                <Select
                  id="type"
                  label="type"
                  fullWidth={true}
                  value={type}
                  disabled={disabled}
                  onChange={handleTypeChange}
                  inputProps={{
                    name: 'type',
                    id: 'demo-controlled-open-select',
                  }}
                >
                  <MenuItem value={'Process'}>Process</MenuItem>
                  <MenuItem value={'Technology'}>Technology</MenuItem>
                  <MenuItem value={'People'}>People</MenuItem>
                  <MenuItem value={'Organization'}>Organization</MenuItem>
                </Select>
              </FormControl>
              <br/>
              <br/>
              <br/>
            </Grid>
            <Grid item xs={6}>
              <br/>
              <FormControl className={classes.formControl} fullWidth={true}>
                <InputLabel htmlFor="demo-controlled-open-select"
                            required={true}>Impact level</InputLabel>
                <Select
                  id="level"
                  label="level"
                  fullWidth={true}
                  disabled={disabled}
                  value={level}
                  onChange={handleLevelChange}
                  inputProps={{
                    name: 'level',
                    id: 'demo-controlled-open-select',
                  }}
                >
                  <MenuItem value={'High'}>High</MenuItem>
                  <MenuItem value={'Medium'}>Medium</MenuItem>
                  <MenuItem value={'Low'}>Low</MenuItem>
                </Select>
              </FormControl>
              <br/>
            </Grid>

            <Grid item xs={12}>
              <Typography className={classes.heading}>What is changing?</Typography>
              <TextField
                id="change"
                value={change}
                multiline
                rows={3}
                placeholder="Describe the change..."
                onChange={handleChangeInput}
                type="text"
                fullWidth
                className={classes.input}
              />
            </Grid>

            <Grid container justify={"space-between"} direction={"row"} className={classes.containerStakeholders}>
              <br/>
              <Grid item xs={3}>
                <Typography className={classes.heading}>Stakeholders impacted</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography className={classes.secondaryHeading}>
                  {peoples && peoples.length || 0} of {currentType === 'project' ? stakeHoldersImpacts.length : stakeHoldersTemplate.length}
                </Typography>
              </Grid>
              <Grid item xs={3} className={classes.buttonContainer}>
                <SelectStakeHolders rows={currentType === 'project' ? stakeHoldersImpacts : stakeHoldersTemplate}
                                    local={peoples} handleChange={handleSelectStakeholders} disabled={disabled} isImpacts={true} isBenefits={false}/>
              </Grid>
              <br/>
              <br/>
            </Grid>

            <Grid item xs={12}>
              <Typography className={classes.heading}>Describe how the change will impact the stakeholders</Typography>
              <TextField
                id="impact"
                value={describeImpact}
                multiline
                rows={3}
                placeholder="Describe the impact..."
                onChange={handleDescribeImpact}
                type="text"
                fullWidth
                className={classes.input}
              />
              <br/>
              <br/>
            </Grid>

            <Grid container justify={"space-between"} direction={"row"} className={classes.containerStakeholders}>
              <Grid item xs={10}>
                <Typography className={classes.heading}>Related activities (?)</Typography>
              </Grid>
              <Grid item xs={2} className={classes.buttonContainer}>
                <Button color="primary" className={classes.buttonActivities} onClick={handleShowActivities}>
                  Select Activities
                </Button>
                <SelectActivities handleClose={handleCloseActivities} handleChange={handleSelectActivities}
                                  open={showActivities} activities={activities} selectedActivities={selectedActivities}/>
              </Grid>
              <br/>
              <br/>
              <Grid item xs={12}>
                <Table size={"small"}>
                  <TableHead>
                    <TableRow>
                      <TableCell align={"left"}>Date Due/Completed</TableCell>
                      <TableCell align={"left"}>Phase</TableCell>
                      <TableCell align={"left"}>Type</TableCell>
                      <TableCell align={"left"}>Time away from BAU</TableCell>
                    </TableRow>
                    {activitiesImpact.map((activity, index) => {
                      return <TableRow key={index}>
                        <TableCell>{activity && activity.completedAt && moment(activity.completedAt).format('MM-DD-YYYY')
                        || activity && activity.dueDate && moment(activity.dueDate).format('MM-DD-YYYY')}</TableCell>
                        <TableCell>{activity && selectPhase(activity.step)}</TableCell>
                        <TableCell>{activity && activity.name}</TableCell>
                        <TableCell>{activity && activity.time}</TableCell>
                      </TableRow>
                    })}
                  </TableHead>
                </Table>
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={createImpact} disabled={disabled} color="primary">
            Save
          </Button>
        </DialogActions>
        <SaveChanges
          handleClose={handleClose}
          showModalDialog={showModalDialog}
          handleSave={createImpact}
          closeModalDialog={closeModalDialog}
        />
      </Dialog>
    </div>
  );
}

const AddImpactPage = withTracker(props => {
  let {match} = props;
  let {projectId, templateId} = match.params;
  let localImpacts = LocalCollection.findOne({
    name: 'localStakeHoldersImpacts'
  });
  Meteor.subscribe('compoundProject', projectId);
  Meteor.subscribe('templates');
  Meteor.subscribe('companies');
  Meteor.subscribe('compoundActivities', projectId);
  let project = Projects.findOne({_id: projectId});
  let company = Companies.findOne() || {};
  let template = Templates.findOne({_id: templateId});
  let companyProjectId = project && project.companyId;
  let companyTemplateId = template && template.companyId;
  let activities = Activities.find({projectId: projectId}).fetch();
  Meteor.subscribe('peoples', companyProjectId || companyTemplateId);
  return {
    stakeHoldersImpacts: Peoples.find({
      _id: {
        $in: project && project.stakeHolders || []
      }
    }).fetch(),
    stakeHoldersTemplate: Peoples.find({
      _id: {
        $in: template && template.stakeHolders || []
      }
    }).fetch(),
    activities,
    localImpacts,
    company,
  };
})(withRouter(AddImpact));

export default withSnackbar(AddImpactPage)