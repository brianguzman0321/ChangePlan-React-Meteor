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
          { "You don't have permissions to edit this template" }
        </DialogTitle>
        <DialogContentText id="customized-dialog-description" className={styles.dialogContent}>
          Please create the project from this template if you wish to make changes.
        </DialogContentText>
        <DialogActions>
          <Button color="primary" onClick={ () => closeModalDialog() }>OK</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
};

export default ChangeTemplate;