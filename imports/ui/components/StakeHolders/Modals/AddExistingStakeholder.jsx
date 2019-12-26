import React from 'react';
import {DialogContentText} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  dialogContent: {
    padding: theme.spacing(3, 3),
  },
}));

const AddExistingStakeholder = ({showModalDialog, stakeholder, handleSave, closeModalDialog, isMulti, count}) => {
  const styles = useStyles();

  return (
    <div>
      <Dialog
        open={showModalDialog}
        aria-labelledby="customized-dialog-title"
        aria-describedby="customized-dialog-description"
        onClose={() => closeModalDialog()}>
        <DialogTitle id="customized-dialog-title" onClose={() => closeModalDialog()}>
          {"Add already existing Stakeholder?"}
        </DialogTitle>
        {isMulti ? <DialogContentText id="customized-dialog-description" className={styles.dialogContent}>
          {count.new.length > 0 ? `${count.new.length} new Stakeholders added. ${count.attached.length} Stakeholders added that are also attached to other projects. Add these stakeholders to the project?` :
            `${count.attached.length} Stakeholders added that are also attached to other projects. Add these stakeholders to the project?`}
        </DialogContentText> : <DialogContentText id="customized-dialog-description" className={styles.dialogContent}>
        {stakeholder && `There is a record for the stakeholder ${stakeholder.firstName} ${stakeholder.lastName} (${stakeholder.email}) already in the system. Add this stakeholder to the project?`}
      </DialogContentText>}
        <DialogActions>
          <Button type="submit" color="primary" onClick={() => handleSave()}>Yes</Button>
          <Button color="secondary" onClick={() => closeModalDialog()}>No</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
};

export default AddExistingStakeholder;