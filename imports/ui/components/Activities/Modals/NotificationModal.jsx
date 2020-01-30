import React from 'react';
import {DialogContentText} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  dialogContent: {
    padding: theme.spacing(3, 3),
  },
}));

const SendNotification = ({ showModalDialog, handleClose, handleSend, isProject = false }) => {
  const styles = useStyles();

  return (
    <div>
      <Dialog
        open={ showModalDialog }
        aria-labelledby="customized-dialog-title"
        aria-describedby="customized-dialog-description"
        >
        <DialogTitle id="customized-dialog-title">
          { "Send Email" }
        </DialogTitle>
        <DialogContentText id="customized-dialog-description" className={styles.dialogContent}>
          {isProject ? 'Notify the Change Manager via email?' : 'Notify the Activity deliverer via email?'}
        </DialogContentText>
        <DialogActions>
          <Button type="submit" color="primary" onClick={ (e) => handleSend (e)}>Yes</Button>
          <Button color="secondary" onClick={ (e) => handleClose(e) }>No</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
};

export default SendNotification;