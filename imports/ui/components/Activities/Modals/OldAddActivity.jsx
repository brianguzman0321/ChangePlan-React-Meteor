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
import MenuItem from '@material-ui/core/MenuItem';
import 'date-fns';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
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

const useStyles = makeStyles(theme => ({
    AddNewActivity: {
        flex: 1,
        // marginTop: 2,
        // marginLeft: 15
    },
    button: {
        background: '#f1753e',
        color: 'white',
        '&:hover': {
            background: '#f1753e',
            color: 'white'
        }
    },
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

function AddActivity(props) {
    const [open, setOpen] = React.useState(false);
    const [name, setName] = React.useState('');
    const [startingDate, setStartingDate] = React.useState(new Date());
    const [startingDateOpen, setStartingDateOpen] = React.useState(false);
    const [endingDate, setEndingDate] = React.useState(new Date());
    const [endingDateOpen, setEndingDateOpen] = React.useState(false);
    const [selectOpen, setSelectOpen] = React.useState(false);
    const [role, setRole] = React.useState('changeManager');
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
        else if(endingDate < startingDate){
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
        if(!(endingDate < startingDate)){
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

    const onSubmit = (event) => {};

    function handleSelectChange(event) {
        setRole(event.target.value);
    }

    function handleSelectClose() {
        setSelectOpen(false);
    }

    function handleSelectOpen() {
        setSelectOpen(true);
    }

    return (
        <div className={classes.AddNewActivity}>
            <Button variant="contained" className={classes.button} fullWidth={true} onClick={handleClickOpen}>
                Add Activity
            </Button>
            <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open} maxWidth="sm" fullWidth={true}>
                <DialogTitle id="customized-dialog-title" onClose={handleClose}>
                    Add Activity
                </DialogTitle>
                <form onSubmit={onSubmit}>
                <DialogContent dividers>
                    <FormControl className={classes.formControl} fullWidth={true}>
                        <InputLabel htmlFor="demo-controlled-open-select">Stake Holder targeted</InputLabel>
                        <Select
                            id="role"
                            label="role"
                            fullWidth={true}
                            open={selectOpen}
                            onClose={handleSelectClose}
                            onOpen={handleSelectOpen}
                            value={role}
                            onChange={handleSelectChange}
                            inputProps={{
                                name: 'role',
                                id: 'demo-controlled-open-select',
                            }}
                        >
                            <MenuItem value='changeManager'>All Project StakeHolders</MenuItem>
                            <MenuItem value='manager'>Customize</MenuItem>
                        </Select>
                    </FormControl>
                    <br/>
                    <br/>
                    <FormControl className={classes.formControl} fullWidth={true}>
                        <InputLabel htmlFor="demo-controlled-open-select">Activity Type</InputLabel>
                        <Select
                            id="role"
                            label="role"
                            fullWidth={true}
                            open={selectOpen}
                            onClose={handleSelectClose}
                            onOpen={handleSelectOpen}
                            value={role}
                            onChange={handleSelectChange}
                            inputProps={{
                                name: 'role',
                                id: 'demo-controlled-open-select',
                            }}
                        >
                            <MenuItem value='changeManager'>Select Activity Type</MenuItem>
                            <MenuItem value='manager'>Customize</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Description"
                        value={name}
                        onChange={handleChange}
                        required={true}
                        type="text"
                        fullWidth
                    />
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <Grid container justify="space-between">
                            <KeyboardDatePicker
                                disableToolbar
                                variant="inline"
                                format="MM/dd/yyyy"
                                margin="normal"
                                id="date-picker-inline"
                                label="Due Date"
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
                                label="Date Completed"
                                format="MM/dd/yyyy"
                                value={null}
                                // minDate={startingDate}
                                open={endingDateOpen}
                                onOpen={openEnding}
                                onChange={handleEndingDate}
                                disabled={true}
                                KeyboardButtonProps={{
                                    'aria-label': 'change date',
                                }}
                            />
                        </Grid>
                    </MuiPickersUtilsProvider>
                    <br />
                    <Typography>
                        Person Responsible
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <TextField
                                autoFocus
                                // margin="dense"
                                id="name"
                                label="Name"
                                // value={name}
                                // onChange={handleChange}
                                required={true}
                                type="text"
                                fullWidth={true}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                // margin="dense"
                                id="email"
                                label="Email"
                                // value={email}
                                // onChange={handleEmailChange}
                                required={true}
                                type="email"
                                fullWidth={true}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                    <DialogActions>
                        <Grid container justify="space-around">
                            <Button onClick={createProject} color="secondary">
                                Delete
                            </Button>
                            <Button onClick={createProject} color="primary">
                                Notify Person Responsible
                            </Button>
                            <Button type="submit" color="primary">
                                Save
                            </Button>
                        </Grid>
                    </DialogActions>
                </form>
            </Dialog>
        </div>
    );
}

export default withSnackbar(AddActivity)