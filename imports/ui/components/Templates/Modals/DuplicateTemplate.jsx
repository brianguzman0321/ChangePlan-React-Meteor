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

function DuplicateTemplate(props) {
  let { open, handleClose, template, company } = props;
  const [names, setNames] = React.useState('');
  let newTemplateId;

  const handleChange = (e) => {
    setNames(e.target.value)
  };

  const duplicateTemplate = () => {
    if (!names.length) {
      return;
    }

    const params = {
      template: {
        stakeHolders: [],
        vision: template.vision,
        objectives: template.objectives,
        impacts: template.impacts,
        benefits: template.benefits,
        risks: template.risks,
        name: (names || 'Template copy').trim(),
        companyId: template.companyId,
      }
    };

    Meteor.call('templates.insert', params, (error, result) => {
      if (error) {
        props.enqueueSnackbar(error.response, {variant: 'error'})
      }
      handleClose();
      newTemplateId = result;
      duplicateActivities();
      props.enqueueSnackbar('Template Create Successfully.', {variant: 'success'})
    })
  };

  const duplicateActivities = () => {
    const templateId = template._id;
    const activities = Activities.find({ templateId }).fetch();
    activities.map(newActivity => {
      const paramsActivity = {
        activity: {
          name: newActivity.name,
          type: newActivity.type,
          description: newActivity.description,
          owner: newActivity.owner,
          dueDate: new Date(),
          stakeHolders: [],
          templateId: newTemplateId,
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
          {"Duplicate Template"}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container
            direction="row" >
            <Typography item variant="body1">
              Resulting template name/s
            </Typography>
          </Grid>
          <TextField onChange={handleChange} id="name" type="text" label="Template name/s" />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleClose()}>
            Cancel
          </Button>
          <Button color="primary" onClick={duplicateTemplate}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default withTracker(props => {
  const { template: { _id: templateId } } = props;
  Meteor.subscribe('compoundActivities', templateId);
  return {
    activities: Activities.find({ templateId }).fetch()
  };
})(DuplicateTemplate);
