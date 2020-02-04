import React from 'react';
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

function DeleteStakeHolder(props) {
  const {impact, multiple } = props;
  const [open, setOpen] = React.useState(props.open || false);

  const handleClickOpen = (e) => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const removeImpact = () => {
    let params = {
      impact: {
        _id: impact._id,
      }
    };
    Meteor.call('impacts.remove', params, (err, res) => {
      if (err) {
        props.enqueueSnackbar(err.reason, {variant: 'error'})
      } else {
        handleClose();
        props.enqueueSnackbar('Impact Deleted Successfully.', {variant: 'success'})
      }
    })
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
          Delete Impact
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure? You are going to remove this impact permanently. This action can't be reversed.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={removeImpact} color="secondary">
            Remove
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default withSnackbar(withRouter(DeleteStakeHolder))