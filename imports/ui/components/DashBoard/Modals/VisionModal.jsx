import React, {useEffect, useState} from "react";
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import { withSnackbar } from 'notistack';
import 'date-fns';
import Grid from "@material-ui/core/Grid/Grid";
import SaveChanges from "../../Modals/SaveChanges";

const styles = theme => ({
    root: {
        margin: 0,
        padding: theme.spacing(2),
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
});

const useStyles = makeStyles(theme => ({
    createNewProject: {
        flex: 1,
        marginLeft: 15,
    }
}));

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

function AddValue(props) {
    let { open, handleModalClose, project, index, editValue } = props;
    const [name, setName] = React.useState(editValue);
    const [showModalDialog, setShowModalDialog] = useState(false);
    const [isUpdated, setIsUpdated] = useState(false);

    const classes = useStyles();
    const modalName = 'vision';

    const handleClose = () => {
        handleModalClose(modalName);
        setName('');
        setShowModalDialog(false);
        setIsUpdated(false);
    };

    const handleOpenModalDialog = () => {
        if (isUpdated) {
            setShowModalDialog(true);
        }
    };

    const closeModalDialog = () => {
        setShowModalDialog(false);
    };

    const createProject = () => {
        if(!(name)){
            props.enqueueSnackbar('Please fill the required Field', {variant: 'error'});
            return false;
        }
        if(index !== '' ){
            project.vision[index] = name;
        }
        else{
            project.vision.push(name);
        }

        delete project.changeManagerDetails;
        delete project.managerDetails;
        delete project.peoplesDetails;
        let params = {
            project

        };
        Meteor.call('projects.update', params, (err, res) => {
            if(err){
                props.enqueueSnackbar(err.reason, {variant: 'error'})
            }
            else{
                handleClose();
                setName('');
                props.enqueueSnackbar('Project Updated Successfully.', {variant: 'success'})
            }

        })

    };

    const handleChange = (e) => {
        setName(e.target.value);
        setIsUpdated(true);
    };

    useEffect(() => {
        setName(editValue)
    }, [editValue]);

    return (
        <div className={classes.createNewProject}>
            <Dialog onClose={isUpdated ? handleOpenModalDialog : handleClose} aria-labelledby="customized-dialog-title" open={open} maxWidth="md" fullWidth={true}>
                <DialogTitle id="customized-dialog-title" onClose={isUpdated ? handleOpenModalDialog : handleClose}>
                    Add a Project Vision
                </DialogTitle>
                <DialogContent dividers>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                autoFocus
                                // margin="dense"
                                id="value"
                                label="Value"
                                value={name}
                                onChange={handleChange}
                                required={true}
                                type="text"
                                fullWidth={true}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={createProject} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
            <SaveChanges
              handleClose={handleClose}
              showModalDialog={showModalDialog}
              handleSave={createProject}
              closeModalDialog={closeModalDialog}
            />
        </div>
    );
}

export default withSnackbar(AddValue)