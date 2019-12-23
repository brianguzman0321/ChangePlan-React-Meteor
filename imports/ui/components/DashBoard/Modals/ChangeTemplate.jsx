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

const ChangeTemplate = ({ showModalDialog, closeModalDialog }) => {
  const styles = useStyles();

  return (
    <div>
      <Dialog
        open={ showModalDialog }
        aria-labelledby="customized-dialog-title"
        aria-describedby="customized-dialog-description"
        >
        <DialogTitle id="customized-dialog-title" onClose={() => closeModalDialog()}>
          { "This project template is read-only" }
        </DialogTitle>
        <DialogContentText id="customized-dialog-description" className={styles.dialogContent}>
          Please duplicate it if you wish to use it and make changes.
        </DialogContentText>
        <DialogActions>
          <Button color="primary" onClick={ () => closeModalDialog() }>OK</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
};

export default ChangeTemplate;