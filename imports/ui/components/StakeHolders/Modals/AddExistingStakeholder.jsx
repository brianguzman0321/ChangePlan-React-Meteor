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

const AddExistingStakeholder = ({ showModalDialog, stakeholder, handleSave, closeModalDialog, isMulti }) => {
  const styles = useStyles();

  return (
    <div>
      <Dialog
        open={ showModalDialog }
        aria-labelledby="customized-dialog-title"
        aria-describedby="customized-dialog-description"
        onClose={ () => closeModalDialog() }>
        <DialogTitle id="customized-dialog-title" onClose={() => closeModalDialog()}>
          { "Add already existing Stakeholder?" }
        </DialogTitle>
        <DialogContentText id="customized-dialog-description" className={styles.dialogContent}>
          {isMulti ? `There are a records for the stakeholders already in the system. Add this stakeholders to the project?` :
            stakeholder && `There is a record for the stakeholder ${stakeholder.firstName} ${stakeholder.lastName} (${stakeholder.email}) already in the system. Add this stakeholder to the project?`}
        </DialogContentText>
        <DialogActions>
          <Button type="submit" color="primary" onClick={ () => handleSave() }>Yes</Button>
          <Button color="secondary" onClick={ () => closeModalDialog() }>No</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
};

export default AddExistingStakeholder;