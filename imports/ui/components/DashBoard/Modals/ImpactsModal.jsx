import React, {useEffect} from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import DialogContentText from '@material-ui/core/DialogContentText';
import TextField from '@material-ui/core/TextField';
import { withSnackbar } from 'notistack';
import 'date-fns';
import Grid from "@material-ui/core/Grid/Grid";
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';

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
        marginTop: 2,
        marginLeft: 15
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
    const [name, setName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [role, setRole] = React.useState('changeManager');
    const [type, setType] = React.useState('process');
    const [level, setLevel] = React.useState('high');
    const [typeOpen, seTypeOpen] = React.useState(false);
    const [levelOpen, setLevelOpen] = React.useState(false);

    const classes = useStyles();
    const modalName = 'impact';

    const handleClose = () => {
        handleModalClose(modalName);
        setName('');
    };
    const createProject = () => {
        if(!(name && type && process)){
            props.enqueueSnackbar('Please fill the required Field', {variant: 'error'});
            return false;
        }
        let impactObj = {
            type,
            level,
            description: name
        }
        if(index !== '' ){
            project.impacts[index] = impactObj;
        }
        else{
            project.impacts.push(impactObj);
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
        setName(e.target.value)
    };
    const handleEmailChange = (e) => {
        setEmail(e.target.value)
    };

    function handleLevelChange(event) {
        setLevel(event.target.value);
    }

    function handleTypeChange(event) {
        setType(event.target.value);
    }

    function handleTypeClose() {
        seTypeOpen(false);
    }

    function handleTypeOpen() {
        seTypeOpen(true);
    }


    function handleLevelOpen() {
        setLevelOpen(true);
    }

    function handleLevelClose() {
        setLevelOpen(false);
    }

    useEffect(() => {
        setType(editValue.type)
        setLevel(editValue.level)
        setName(editValue.description)
    }, [editValue]);

    return (
        <div className={classes.createNewProject}>
            <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open} maxWidth="sm" fullWidth={true}>
                <DialogTitle id="customized-dialog-title" onClose={handleClose}>
                    Project Impact
                </DialogTitle>
                <DialogContent dividers>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <br/>
                            <FormControl className={classes.formControl} fullWidth={true}>
                                <InputLabel htmlFor="demo-controlled-open-select">Type</InputLabel>
                                <Select
                                    id="type"
                                    label="type"
                                    fullWidth={true}
                                    open={typeOpen}
                                    onClose={handleTypeClose}
                                    onOpen={handleTypeOpen}
                                    value={type}
                                    onChange={handleTypeChange}
                                    inputProps={{
                                        name: 'type',
                                        id: 'demo-controlled-open-select',
                                    }}
                                >
                                    <MenuItem value='process'>Process</MenuItem>
                                    <MenuItem value='technology'>Technology</MenuItem>
                                    <MenuItem value='people'>People</MenuItem>
                                    <MenuItem value='organization'>Organization</MenuItem>
                                </Select>
                            </FormControl>
                            <br/>
                            <br/>
                            <br/>
                        </Grid>
                        <Grid item xs={6}>
                            <br/>
                            <FormControl className={classes.formControl} fullWidth={true}>
                                <InputLabel htmlFor="demo-controlled-open-select">Role</InputLabel>
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
                        <Grid item xs={12}>
                            <TextField
                                autoFocus
                                // margin="dense"
                                id="name"
                                label="Description"
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
        </div>
    );
}

export default withSnackbar(AddValue)