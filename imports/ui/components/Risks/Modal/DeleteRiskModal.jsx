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

function DeleteRiskModal(props) {
  const {risk, multiple } = props;
  const [open, setOpen] = React.useState(props.open || false);

  const handleClickOpen = (e) => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const removeImpact = () => {
    let params = {
      risk: {
        _id: risk._id,
      }
    };
    Meteor.call('risks.remove', params, (err, res) => {
      if (err) {
        props.enqueueSnackbar(err.reason, {variant: 'error'})
      } else {
        handleClose();
        props.enqueueSnackbar('Risk Deleted Successfully.', {variant: 'success'})
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
          Delete Risk
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure? You are going to remove this risk permanently. This action can't be reversed.
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

export default withSnackbar(withRouter(DeleteRiskModal))