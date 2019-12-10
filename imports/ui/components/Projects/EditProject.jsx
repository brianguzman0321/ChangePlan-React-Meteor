import React from 'react';
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
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';

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

function NewProject(props) {
    const [open, setOpen] = React.useState(false);
    const [name, setName] = React.useState('');
    const [startingDate, setStartingDate] = React.useState(new Date());
    const [startingDateOpen, setStartingDateOpen] = React.useState(false);
    const [endingDate, setEndingDate] = React.useState(new Date());
    const [endingDateOpen, setEndingDateOpen] = React.useState(false);
    let { company } = props;
    const classes = useStyles();

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
        setName('');
    };
    const createProject = () => {
        if(!(name && startingDate && endingDate)){
            props.enqueueSnackbar('Please fill all required Fields', {variant: 'error'});
            return false;
        }
        else if(endingDate <= startingDate){
            props.enqueueSnackbar('Please fix the date error', {variant: 'error'});
            return false;
        }
        let params = {
            project: {
                name,
                startingDate,
                endingDate,
                companyId: company._id

            }
        };
        Meteor.call('projects.insert', params, (err, res) => {
            if(err){
                props.enqueueSnackbar(err.reason, {variant: 'error'})
            }
            else{
                setOpen(false);
                setName('');
                props.enqueueSnackbar('New Project Created Successfully.', {variant: 'success'})
            }

        })

    };

    const handleStartingDate = date => {
        setStartingDate(date);
        setStartingDateOpen(false)
    };

    const handleEndingDate = date => {
        if(!(endingDate <= startingDate)){
            setEndingDateOpen(false)
        }
        setEndingDate(date);

    };

    const openStarting = (e) => {
        setStartingDateOpen(true)
    };

    const openEnding = (e) => {
        setEndingDateOpen(true)
    };

    const handleChange = (e) => {
        setName(e.target.value)
    };

    return (
        <div className={classes.createNewProject}>
            <Button variant="outlined" color="primary" onClick={handleClickOpen}>
                Create New Project
            </Button>
            <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open} maxWidth="md" fullWidth={true}>
                <DialogTitle id="customized-dialog-title" onClose={handleClose}>
                    Create New Project
                </DialogTitle>
                <DialogContent dividers>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Project Name"
                        value={name}
                        onChange={handleChange}
                        required={true}
                        type="text"
                        fullWidth
                    />
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <Grid container justify="space-around">
                            <KeyboardDatePicker
                                disableToolbar
                                variant="inline"
                                format="MM/dd/yyyy"
                                margin="normal"
                                id="date-picker-inline"
                                label="Start Date"
                                value={startingDate}
                                open={startingDateOpen}
                                onOpen={openStarting}
                                onChange={handleStartingDate}
                                KeyboardButtonProps={{
                                    'aria-label': 'change date',
                                }}
                            />
                            <KeyboardDatePicker
                                disableToolbar
                                variant="inline"
                                // open={true}
                                margin="normal"
                                id="date-picker-dialog"
                                label="Due Date"
                                format="MM/dd/yyyy"
                                value={endingDate}
                                minDate={startingDate}
                                open={endingDateOpen}
                                onOpen={openEnding}
                                onChange={handleEndingDate}
                                KeyboardButtonProps={{
                                    'aria-label': 'change date',
                                }}
                            />
                        </Grid>
                    </MuiPickersUtilsProvider>
                </DialogContent>
                <DialogActions>
                    <Button onClick={createProject} color="primary">
                        Create Project
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default withSnackbar(NewProject)