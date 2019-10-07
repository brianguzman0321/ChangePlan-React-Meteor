import React from 'react';
import { withStyles } from '@material-ui/core/styles';
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
import 'date-fns';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardTimePicker,
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
    },
}))(MuiDialogContent);

const DialogActions = withStyles(theme => ({
    root: {
        margin: 0,
        padding: theme.spacing(1),
    },
}))(MuiDialogActions);

export default function CustomizedDialogs(props) {
    const [open, setOpen] = React.useState(false);
    const [name, setName] = React.useState('');
    const [startingDate, setStartingDate] = React.useState(new Date());
    const [endingDate, setEndingDate] = React.useState(new Date());
    let { company } = props;

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    const createProject = () => {
        let params = {
            project: {
                name,
                startingDate,
                endingDate,
                companyId: company._id

            }
        };
        Meteor.call('projects.insert', params, (err, res) => {
            setOpen(false);
        })

    };

    const handleStartingDate = date => {
        setStartingDate(date);
    };

    const handleEndingDate = date => {
        setEndingDate(date);
    };

    const handleChange = (e) => {
        setName(e.target.value)
    };

    return (
        <div>
            <Button variant="contained" onClick={handleClickOpen}>
                Create New Project
            </Button>
            {/*<Button variant="outlined" color="secondary" >*/}
                {/*Open dialog*/}
            {/*</Button>*/}
            <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open} fullWidth="md">
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
                                onChange={handleStartingDate}
                                KeyboardButtonProps={{
                                    'aria-label': 'change date',
                                }}
                            />
                            <KeyboardDatePicker
                                disableToolbar
                                variant="inline"
                                margin="normal"
                                id="date-picker-dialog"
                                label="Due Date"
                                format="MM/dd/yyyy"
                                value={endingDate}
                                onChange={handleEndingDate}
                                KeyboardButtonProps={{
                                    'aria-label': 'change date',
                                }}
                            />
                            {/*<KeyboardTimePicker*/}
                                {/*margin="normal"*/}
                                {/*id="time-picker"*/}
                                {/*label="Time picker"*/}
                                {/*value={selectedDate}*/}
                                {/*onChange={handleDateChange}*/}
                                {/*KeyboardButtonProps={{*/}
                                    {/*'aria-label': 'change time',*/}
                                {/*}}*/}
                            {/*/>*/}
                        </Grid>
                    </MuiPickersUtilsProvider>
                    {/*<Typography gutterBottom>*/}
                        {/*Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis*/}
                        {/*in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.*/}
                    {/*</Typography>*/}
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