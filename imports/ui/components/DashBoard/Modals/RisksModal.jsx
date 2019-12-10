import React, {useEffect, useState} from 'react';
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
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
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
    let { company, open, handleModalClose, project, index, editValue } = props;
    const [description, setDescription] = React.useState('');
    const [type, setType] = React.useState('');
    const [level, setLevel] = React.useState('');
    const [levelOpen, setLevelOpen] = React.useState(false);
    const [showModalDialog, setShowModalDialog] = useState(false);
    const [isUpdated, setIsUpdated] = useState(false);

    const classes = useStyles();
    const modalName = 'risk';

    const handleClose = () => {
        handleModalClose(modalName);
        setDescription('');
        setType('');
        setLevel('');
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
        if(!(description && level)){
            props.enqueueSnackbar('Please fill the required Field', {variant: 'error'});
            return false;
        }
        let riskObj = {
            level,
            description: description
        };
        if(index !== '' ){
            project.risks[index] = riskObj;
        }
        else{
            project.risks.push(riskObj);
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
                setDescription('');
                props.enqueueSnackbar('Project Updated Successfully.', {variant: 'success'})
            }

        })

    };

    const handleChange = (e) => {
        setDescription(e.target.value);
        setIsUpdated(true);
    };

    function handleLevelChange(event) {
        setLevel(event.target.value);
        setIsUpdated(true);
    }


    function handleLevelOpen() {
        setLevelOpen(true);
    }

    function handleLevelClose() {
        setLevelOpen(false);
    }

    useEffect(() => {
        setType(editValue.type);
        setLevel(editValue.level);
        setDescription(editValue.description)
    }, [editValue]);

    return (
        <div className={classes.createNewProject}>
            <Dialog onClose={isUpdated ? handleOpenModalDialog : handleClose} aria-labelledby="customized-dialog-title" open={open} maxWidth="md" fullWidth={true}>
                <DialogTitle id="customized-dialog-title" onClose={isUpdated ? handleOpenModalDialog : handleClose}>
                    Add a Project Risk
                </DialogTitle>
                <DialogContent dividers>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                // margin="dense"
                                id="description"
                                label="Description"
                                value={description}
                                onChange={handleChange}
                                required={true}
                                type="text"
                                fullWidth={true}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <br/>
                            <FormControl className={classes.formControl} maxWidth="md" fullWidth={true}>
                                <InputLabel htmlFor="demo-controlled-open-select">Level</InputLabel>
                                <Select
                                    id="level"
                                    label="level"
                                    fullWidth={true}
                                    open={levelOpen}
                                    onClose={handleLevelClose}
                                    onOpen={handleLevelOpen}
                                    value={level}
                                    onChange={handleLevelChange}
                                    inputProps={{
                                        name: 'level',
                                        id: 'demo-controlled-open-select',
                                    }}
                                >
                                    <MenuItem value='high'>High</MenuItem>
                                    <MenuItem value='medium'>Medium</MenuItem>
                                    <MenuItem value='low'>Low</MenuItem>
                                </Select>
                            </FormControl>
                            <br/>
                            <br/>
                            <br/>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={createProject} color="primary">
                        Save
                    </Button>
                </DialogActions>
                <SaveChanges
                  handleClose={handleClose}
                  showModalDialog={showModalDialog}
                  handleSave={createProject}
                  closeModalDialog={closeModalDialog}
                />
            </Dialog>
        </div>
    );
}

export default withSnackbar(AddValue)