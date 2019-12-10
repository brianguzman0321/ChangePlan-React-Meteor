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

const SaveChanges = ({ showModalDialog, handleClose, handleSave, closeModalDialog }) => {
  const styles = useStyles();

  return (
    <div>
      <Dialog
        open={ showModalDialog }
        aria-labelledby="customized-dialog-title"
        aria-describedby="customized-dialog-description"
        onClose={ () => closeModalDialog() }>
        <DialogTitle id="customized-dialog-title" onClose={() => closeModalDialog()}>
          { "Save Changes?" }
        </DialogTitle>
        <DialogContentText id="customized-dialog-description" className={styles.dialogContent}>
              Save changes before closing the modal window?
        </DialogContentText>
        <DialogActions>
          <Button type="submit" color="primary" onClick={ (e) => handleSave(e) }>Save changes</Button>
          <Button color="secondary" onClick={ () => handleClose() }>Discard changes</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
};

export default SaveChanges;