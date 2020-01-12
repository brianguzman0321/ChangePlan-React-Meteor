import React, { useEffect, useState } from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import { withSnackbar } from 'notistack';
import 'date-fns';
import Grid from "@material-ui/core/Grid/Grid";
import SaveChanges from "../../Modals/SaveChanges";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import SelectStakeHolders from "../../Activities/Modals/SelectStakeHolders";
import DateFnsUtils from "@date-io/date-fns";
import { withTracker } from "meteor/react-meteor-data";
import { Companies } from "../../../../api/companies/companies";
import { Peoples } from "../../../../api/peoples/peoples";
import { withRouter } from "react-router";
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import { Projects } from "../../../../api/projects/projects";
import { Templates } from "../../../../api/templates/templates";


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
}));

const DialogTitle = withStyles(styles)(props => {
  const { children, classes, onClose } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
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

function AddValue(props) {
  let { open, handleModalClose, handleType, project, indexBenefits, editValue, stakeHoldersBenefits, localBenefits, currentType, template, stakeHoldersTemplate } = props;
  const [name, setName] = React.useState('');
  const [expectedDateOpen, setExpectedDateOpen] = useState(false);
  const [peoples, setPeoples] = useState([]);
  const [showModalDialog, setShowModalDialog] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);
  const [benefits, setBenefits] = useState(project.benefits);
  const [expectedDate, setExpectedDate] = useState(null);

  if (handleType !== 'timeline') {
    useEffect(() => {
      if (project && currentType === 'project') {
        setBenefits(project.benefits)
      } else if (template && currentType === 'template') {
        setBenefits(template.benefits)
      }
    }, [project.benefits, template.benefits]);
  }
  const classes = useStyles();
  const modalName = 'benefits';
  const handleClose = () => {
    if (handleType !== 'timeline') {
      handleModalClose(modalName);
    }
    else {
      handleModalClose(false);
    }
    setName('');
    setExpectedDate(null);
    updateFilter('localStakeHoldersBenefits', 'changed', false);
    setShowModalDialog(false);
    setIsUpdated(false);
  };

  const handleOpenModalDialog = () => {
    if (isUpdated) {
      setShowModalDialog(true);
    }
  };

  const closeModalDialog = () => {
    setShowModalDialog(false);
  };

  const handleExpectedDate = date => {
    setExpectedDate(date);
    setIsUpdated(true);
    setExpectedDateOpen(false);
  };

  const openExpectedDatePicker = () => {
    setExpectedDateOpen(true)
  };

  const updateValues = () => {
    if (indexBenefits !== '') {
      console.error('--------------------', handleType);
      const newStakeholders = benefits && benefits[indexBenefits].stakeholders;
      localBenefits.changed || updateFilter('localStakeHoldersBenefits', 'ids', newStakeholders);
      if (localBenefits.changed) {
        setIsUpdated(true)
      }
      const newExpectedDate = benefits && benefits[indexBenefits].expectedDate;
      setExpectedDate(newExpectedDate);
      let updatedStakeHolders = localBenefits.changed ? localBenefits.ids : newStakeholders;
      setPeoples(updatedStakeHolders);
    } else {
      let updatedStakeHolders = localBenefits.changed ? localBenefits.ids : [];
      setPeoples(updatedStakeHolders);
      updateFilter('localStakeHoldersBenefits', 'ids', updatedStakeHolders);
    }
  };

  useEffect(() => {
    updateValues();
  }, [indexBenefits, stakeHoldersBenefits]);

  const createBenefits = () => {
    if (!(name)) {
      props.enqueueSnackbar('Please fill the required Field', { variant: 'error' });
      return false;
    }
    if (currentType === 'project') {
      let benefitsObj = {
        expectedDate,
        description: name,
        stakeholders: peoples,
      };

      let newBenefits = benefits;
      if (indexBenefits !== '') {
        newBenefits[indexBenefits] = benefitsObj;
        setBenefits(newBenefits);
      } else {
        newBenefits = project.benefits ? project.benefits.concat(benefitsObj) : [benefitsObj];
        setBenefits(newBenefits);
      }

      delete project.changeManagerDetails;
      delete project.managerDetails;
      delete project.peoplesDetails;

      let params = {
        ...project,
        benefits: newBenefits,
      };

      Meteor.call('projects.update', { project: params }, (err, res) => {
        if (err) {
          props.enqueueSnackbar(err.reason, { variant: 'error' })
        } else {
          handleClose();
          setName('');
          setExpectedDate(null);
          props.enqueueSnackbar('Project Updated Successfully.', { variant: 'success' })
        }
      })
    } else if (currentType === 'template') {
      let benefitsObj = {
        expectedDate,
        description: name,
        stakeholders: peoples,
      };

      let newBenefits = benefits;
      if (indexBenefits !== '') {
        newBenefits[indexBenefits] = benefitsObj;
        setBenefits(newBenefits);
      } else {
        newBenefits = template.benefits ? template.benefits.concat(benefitsObj) : [benefitsObj];
        setBenefits(newBenefits);
      }

      let params = {
        ...template,
        benefits: newBenefits,
      };

      Meteor.call('templates.update', { template: params }, (err, res) => {
        if (err) {
          props.enqueueSnackbar(err.reason, { variant: 'error' })
        } else {
          handleClose();
          setName('');
          setExpectedDate(null);
          props.enqueueSnackbar('Template Updated Successfully.', { variant: 'success' })
        }
      })
    }

  };

  const handleChange = (e) => {
    setName(e.target.value);
    setIsUpdated(true);
  };

  const onCalendarClick = (id) => {
    document.getElementById(id).click();
  };

  useEffect(() => {
    setName(editValue.description)
  }, [editValue]);

  return (
    <div className={classes.createNewProject}>
      <Dialog onClose={isUpdated ? handleOpenModalDialog : handleClose} aria-labelledby="customized-dialog-title"
        open={open} maxWidth="md" fullWidth={true}>
        <DialogTitle id="customized-dialog-title" onClose={isUpdated ? handleOpenModalDialog : handleClose}>
          Add a Project Benefits
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <br />
              <br />
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <Grid item xs={12} className={classes.datePicker}>
                  <Grid item xs={11}>
                    <DatePicker
                      fullWidth
                      disableToolbar
                      variant="inline"
                      format="MM/dd/yyyy"
                      margin="normal"
                      id="date-picker-inline"
                      label="Expected Date"
                      value={expectedDate}
                      autoOk={true}
                      onChange={handleExpectedDate}
                    />
                  </Grid>
                  <Grid item xs={1}>
                    <IconButton aria-label="close" className={classes.closeButton}
                      onClick={() => onCalendarClick("date-picker-inline")}>
                      <CalendarTodayIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              </MuiPickersUtilsProvider>
              <br />
              <br />
              <br />
            </Grid>
            <Grid item xs={6}>
              <br />
              <Typography className={classes.heading}>Stakeholders</Typography>
              <Typography className={classes.secondaryHeading}>
                {peoples && peoples.length || 0} of {currentType === 'project' ? stakeHoldersBenefits.length : stakeHoldersTemplate.length}
              </Typography>
              <SelectStakeHolders rows={currentType === 'project' ? stakeHoldersBenefits : stakeHoldersTemplate.length} local={localBenefits} isImpacts={false} isBenefits={true} />
              <br />
              <br />
              <br />
            </Grid>
            <Grid item xs={12}>
              <br />
              <TextField
                id="name"
                label="Description"
                value={name}
                onChange={handleChange}
                required={true}
                type="text"
                fullWidth={true}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={createBenefits} color="primary">
            Save
          </Button>
        </DialogActions>
        <SaveChanges
          handleClose={handleClose}
          showModalDialog={showModalDialog}
          handleSave={createBenefits}
          closeModalDialog={closeModalDialog}
        />
      </Dialog>
    </div>
  );
}

const AddActivityPage = withTracker(props => {
  let { match } = props;
  let { projectId, templateId } = match.params;
  let localBenefits = LocalCollection.findOne({
    name: 'localStakeHoldersBenefits'
  });
  Meteor.subscribe('compoundProject', projectId);
  Meteor.subscribe('templates');
  Meteor.subscribe('companies');
  Meteor.subscribe('templates');
  let project = Projects.findOne({
    _id: projectId
  });
  let company = Companies.findOne() || {};
  let template = Templates.findOne({ _id: templateId });
  let companyProjectId = project && project.companyId;
  let companyTemplateId = template && template.companyId;
  Meteor.subscribe('peoples', companyProjectId || companyTemplateId);
  return {
    stakeHoldersBenefits: Peoples.find({
      _id: {
        $in: project && project.stakeHolders || []
      }
    }).fetch(),
    stakeHoldersTemplate: Peoples.find({
      _id: {
        $in: template && template.stakeHolders || []
      }
    }).fetch(),
    localBenefits,
    company
  };
})(withRouter(AddValue));

export default withSnackbar(AddActivityPage)
