import React from 'react';
import { Dialog, makeStyles, withStyles } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { Activities } from "../../../../api/activities/activities";
import { withTracker } from "meteor/react-meteor-data";
import MuiDialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from '@material-ui/icons/Close';
import MuiDialogContent from "@material-ui/core/DialogContent/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions/DialogActions";
import {withSnackbar} from "notistack";

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

function CreateProjectModal(props) {
  let { open, handleClose, template, company } = props;
  const [names, setNames] = React.useState('');
  let newProjectId;

  const handleChange = (e) => {
    setNames(e.target.value)
  };

  const createProject = () => {
    if (!names.length) {
      return;
    }
    let userId = Meteor.userId();
    let newBenefits = template.benefits;
    newBenefits  = newBenefits.map(newBenefit => {
      newBenefit.expectedDate = null;
      newBenefit.stakeholders = [];
      return newBenefit;
    });
    let newImpacts = template.impacts;
    newImpacts  = newImpacts.map(newImpact => {
      newImpact.expectedDate = null;
      newImpact.stakeholders = [];
      return newImpact;
    });
    const params = {
      project: {
        startingDate: new Date(),
        endingDate: new Date(),
        owner: userId,
        changeManager: userId,
        stakeHolders: [],
        vision: template.vision,
        objectives: template.objectives,
        impacts: newImpacts,
        benefits: newBenefits,
        risks: template.risks,
        name: (names || 'Template copy').trim(),
        companyId: company._id,
      }
    };

    Meteor.call('projects.insert', params, (err, res) => {
      if (err) {
        props.enqueueSnackbar(err.reason, {variant: 'error'})
      }
      newProjectId = res;
      duplicateActivities();
      props.enqueueSnackbar('Project Create Successfully.', {variant: 'success'})
    })

  };

  const duplicateActivities = () => {
    const templateId = template._id;
    const activities = Activities.find({ templateId: templateId }).fetch();
    if (!activities.length) {
      handleClose();
      return;
    }
    activities.map(newActivity => {
      const paramsActivity = {
        activity: {
          name: newActivity.name,
          type: newActivity.type,
          description: newActivity.description,
          deliverer: newActivity.deliverer,
          dueDate: newActivity.dueDate,
          stakeHolders: [],
          projectId: newProjectId,
          step: newActivity.step,
          time: newActivity.time
        }
      };
      Meteor.call('activities.insert', paramsActivity, (err, res) => {
        if (err) {
          console.log('---',err)
        } else {
          setNames('');
          handleClose();
        }
      })
    })
  };

  return (
    <div>
      <Dialog open={open} onClose={() => handleClose()} maxWidth="md" fullWidth={true}>
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          {"Create new project from template"}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container
            direction="row" >
            <Typography item variant="body1">
              Resulting project name/s
            </Typography>
          </Grid>
          <TextField onChange={handleChange} id="name" type="text" label="Project name/s" />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleClose()}>
            Cancel
          </Button>
          <Button color="primary" onClick={createProject}>
            Create project
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default withTracker(props => {
  const { template: { _id: templateId } } = props;
  Meteor.subscribe('compoundActivitiesTemplates', templateId);
  return {
    activities: Activities.find({ templateId }).fetch()
  };
})(withSnackbar(CreateProjectModal));
