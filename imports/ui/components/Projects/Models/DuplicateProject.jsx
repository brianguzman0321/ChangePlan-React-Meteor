import React from 'react';
import {Dialog, makeStyles, withStyles} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import {Activities} from "../../../../api/activities/activities";
import {withTracker} from "meteor/react-meteor-data";
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

function DuplicateProject(props) {
  let {open, handleClose, project, company} = props;
  const [names, setNames] = React.useState('');
  let newProjectId;

  const handleChange = (e) => {
    setNames(e.target.value)
  };

  const duplicateProject = () => {
    if (!names.length) {
      return;
    }

    const params = {
      project: {
        owner: project.owner,
        changeManagers: [],
        peoples: [],
        stakeHolders: [],
        managers: [],
        vision: project.vision,
        objectives: project.objectives,
        impacts: project.impacts,
        benefits: project.benefits,
        risks: project.risks,
        peopleCount: 0,
        name: (names || 'Project copy').trim(),
        startingDate: new Date(),
        endingDate: new Date(),
        companyId: company._id,
      }
    };

    Meteor.call('projects.insert', params, (error, result) => {
      if (error) {
        props.enqueueSnackbar(error.reason, {variant: 'error'})
      } else {
        newProjectId = result;
        duplicateActivities();
        props.enqueueSnackbar('Project Create Successfully.', {variant: 'success'})
      }
    })
  };

  const duplicateActivities = () => {
    const projectId = project._id;
    const activities = Activities.find({projectId}).fetch();
    activities.map(newActivity => {
      const paramsActivity = {
        activity: {
          name: newActivity.name,
          type: newActivity.type,
          description: newActivity.description,
          owner: newActivity.owner,
          dueDate: new Date(),
          stakeHolders: [],
          projectId: newProjectId,
          step: newActivity.step,
          time: newActivity.time
        }
      };
      Meteor.call('activities.insert', paramsActivity, (error, result) => {
        if (error) {
          props.enqueueSnackbar(error.reason, {variant: 'error'})
        }
      })
    });
    setNames('');
    handleClose();
  };

  return (
    <div>
      <Dialog open={open} onClose={() => handleClose()} maxWidth="md" fullWidth={true}>
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          {"Duplicate Project"}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container
                direction="row">
            <Typography item variant="body1">
              Resulting project name/s
            </Typography>
          </Grid>
          <TextField onChange={handleChange} id="name" type="text" label="Project name/s"/>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleClose()}>
            Cancel
          </Button>
          <Button color="primary" onClick={duplicateProject}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default withTracker(props => {
  const {project: {_id: projectId}} = props;
  Meteor.subscribe('compoundActivities', projectId);
  return {
    activities: Activities.find({projectId}).fetch()
  };
})(withSnackbar(DuplicateProject));
