import React, {useState} from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import {withSnackbar} from 'notistack';
import {withRouter} from 'react-router';
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import {makeStyles} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";

const useStyles = makeStyles(() => ({
  formControl: {
    padding: '8px 24px',
  },
  button: {
    whiteSpace: 'nowrap',
  },
  grid: {
    textAlign: 'right',
  },
}));

function DeleteStakeHolder(props) {
  let {project, template, type, projects, isChangeManager, isAdmin, isSuperAdmin} = props;
  const [open, setOpen] = React.useState(props.open || false);
  const {stakeholder, multiple} = props;
  const [projectId, setProjectId] = useState(project ? project._id : '');
  const classes = useStyles();

  const handleClickOpen = (e) => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const removeStakeholderFromCompany = () => {
    let params = {
      people: {
        ids: [stakeholder._id],
      }
    };
    if (multiple) {
      params.people.ids = stakeholder
    }
    Meteor.call('peoples.archive', params, (err, res) => {
      if (err) {
        props.enqueueSnackbar(err.reason, {variant: 'error'})
      } else {
        props.enqueueSnackbar('Stakeholder Removed Successfully.', {variant: 'success'});
        setOpen(false);
      }
    })
  };

  const removeStakeholderFromProject = () => {
    let params = {
      people: {
        ids: [stakeholder._id],
        projectId: projectId
      }
    };
    if (multiple) {
      params.people.ids = stakeholder
    }
    Meteor.call('peoples.removeFromProject', params, (err, res) => {
      if (err) {
        props.enqueueSnackbar(err.reason, {variant: 'error'})
      } else {
        props.enqueueSnackbar('Stakeholder removed from project successfully.', {variant: 'success'});
        setOpen(false);
      }
    })
  };

  const handleChange = (e) => {
    setProjectId(e.target.value)
  };

  return (
    <>
      {multiple ? <IconButton aria-label="delete" onClick={handleClickOpen}>
        <DeleteIcon/>
      </IconButton> : <IconButton aria-label="delete" onClick={handleClickOpen}>
        <DeleteIcon/>
      </IconButton>
      }

      <Dialog open={open}
              onClose={handleClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
              maxWidth="sm" fullWidth={true}
      >
        <DialogTitle id="alert-dialog-title">
          Delete Stakeholder
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure? You are going to remove this stakeholder permanently. This action can't be reversed.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Grid container direction={'row'} alignItems={'center'} justify={'flex-end'}>
            {projects && <Grid item xs={12} className={classes.formControl}><FormControl fullWidth={true}>
              <InputLabel htmlFor="age-native-simple">Select project</InputLabel>
              <Select
                value={projectId}
                onChange={(e) => handleChange(e)}
              >
                {projects.map((_project, index) => {
                  return <MenuItem key={index} value={_project._id}>{_project.name}</MenuItem>
                })}
              </Select>
            </FormControl>
            </Grid>}
            <Grid item xs={6} className={classes.grid}>
              <Button onClick={removeStakeholderFromProject} disabled={!projectId} className={classes.button} color="secondary">
                Remove from project
              </Button>
            </Grid>
            <Grid item xs={4}>
              <Button onClick={removeStakeholderFromCompany} disabled={isChangeManager && !isAdmin} className={classes.button} color="secondary">
                Remove from company
              </Button>
            </Grid>
            <Grid item xs={2}>
              <Button onClick={handleClose} color="primary">
                Cancel
              </Button>
            </Grid>
          </Grid>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default withSnackbar(withRouter(DeleteStakeHolder))