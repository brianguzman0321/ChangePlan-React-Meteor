import React, {useEffect} from "react";
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
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
import {withTracker} from "meteor/react-meteor-data";
import { Companies } from "/imports/api/companies/companies";

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
    },
    addStakeHolder: {
        background: '#92a1af',
        '&:hover': {
            background: '#92a1af'
        }
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

function EditStakeHolder(props) {
    let { company, handleModalClose, stakeholder } = props;

    const [name, setName] = React.useState('');
    const [firstName, setFirstName] = React.useState(stakeholder.firstName);
    const [lastName, setLastName] = React.useState(stakeholder.lastName);
    const [role, setRole] = React.useState(stakeholder.role);
    const [businessUnit, setBusinessUnit] = React.useState(stakeholder.businessUnit);
    const [email, setEmail] = React.useState(stakeholder.email);
    const [loS, setLos] = React.useState(stakeholder.influenceLevel);
    const [loI, setLoi] = React.useState(stakeholder.supportLevel);
    const [selectOpen, setSelectOpen] = React.useState(false);
    const [selectOpen1, setSelectOpen1] = React.useState(false);
    const [notes, setNotes] = React.useState(stakeholder.notes);

    const [open, setOpen] = React.useState(false);
    const classes = useStyles();
    const modalName = 'share';

    const handleClickOpen = () => {
        setName('');
        setTimeout(() => {
            setFirstName(stakeholder.firstName);
            setLastName(stakeholder.lastName);
            setRole(stakeholder.role);
            setBusinessUnit(stakeholder.businessUnit);
            setEmail(stakeholder.email);
            setLos(stakeholder.supportLevel);
            setLoi(stakeholder.influenceLevel);
            setNotes(stakeholder.notes);
        }, 500);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleChange = (e) => {
        setName(e.target.value)
    };
    const handleEmailChange = (e) => {
        setEmail(e.target.value)
    };

    const onSubmit = (e) => {
        event.preventDefault();
        if(!(loI && loS)){
            props.enqueueSnackbar('Please fill all required Fields', {variant: 'error'});
            return false;
        }
        let params = {
            people: {
                _id: stakeholder._id,
                firstName,
                lastName,
                role,
                businessUnit,
                email,
                notes,
                influenceLevel: loI,
                supportLevel: loS,

            }
        };
        Meteor.call('peoples.update', params, (err, res) => {
            if(err){
                props.enqueueSnackbar(err.reason, {variant: 'error'})
            }
            else{
                setOpen(false);
                setName('');
                props.enqueueSnackbar('StakeHolder Updated Successfully.', {variant: 'success'})
            }

        })
    };

    function handleSelectChange(event) {
        setRole(event.target.value);
    }

    function handleSelectClose() {
        setSelectOpen(false);
    }

    function handleSelectOpen() {
        setSelectOpen(true);
    }
    function handleSelectClose1() {
        setSelectOpen1(false);
    }

    function handleSelectOpen1() {
        setSelectOpen1(true);
    }

    return (
        <>
        <IconButton aria-label="edit" onClick={handleClickOpen}>
            <EditIcon />
        </IconButton>
        <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open} maxWidth="md" fullWidth={true}>
            <DialogTitle id="customized-dialog-title" onClose={handleClose}>
                Edit Stakeholder
            </DialogTitle>
            <form onSubmit={onSubmit}>
                <DialogContent dividers>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <TextField
                                autoFocus
                                // margin="dense"
                                id="firstName"
                                label="First Name"
                                value={firstName}
                                onChange={(e)=> {setFirstName(e.target.value)}}
                                required={true}
                                type="text"
                                fullWidth={true}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                // margin="dense"
                                id="lastName"
                                label="Last Name"
                                value={lastName}
                                onChange={(e)=> {setLastName(e.target.value)}}
                                required={true}
                                type="text"
                                fullWidth={true}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                // margin="dense"
                                id="role"
                                label="Role"
                                value={role}
                                onChange={(e)=> {setRole(e.target.value)}}
                                required={true}
                                type="text"
                                fullWidth={true}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                // margin="dense"
                                id="businessUnit"
                                label="Business Unit"
                                value={businessUnit}
                                onChange={(e)=> {setBusinessUnit(e.target.value)}}
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
                                value={email}
                                onChange={handleEmailChange}
                                required={true}
                                type="email"
                                fullWidth={true}
                            />
                        </Grid>
                        <Grid item xs={6} />
                        <Grid item xs={12}>
                            <TextField
                                // margin="dense"
                                id="notes"
                                label="Notes"
                                value={notes}
                                onChange={(e)=> {setNotes(e.target.value)}}
                                type="text"
                                fullWidth={true}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl className={classes.formControl} fullWidth={true} required>
                                <InputLabel htmlFor="demo-controlled-open-select">Level Of Support</InputLabel>
                                <Select
                                    id="role"
                                    label="role"
                                    fullWidth={true}
                                    open={selectOpen}
                                    onClose={handleSelectClose}
                                    onOpen={handleSelectOpen}
                                    value={loS}
                                    onChange={(e)=> {setLos(e.target.value)}}
                                    inputProps={{
                                        name: 'role',
                                        id: 'demo-controlled-open-select',
                                    }}
                                >
                                    <MenuItem value={1}>1</MenuItem>
                                    <MenuItem value={2}>2</MenuItem>
                                    <MenuItem value={3}>3</MenuItem>
                                    <MenuItem value={4}>4</MenuItem>
                                    <MenuItem value={5}>5</MenuItem>
                                </Select>
                            </FormControl>
                            <br/>
                            <br/>
                            <br/>
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl className={classes.formControl} fullWidth={true} required>
                                <InputLabel htmlFor="demo-controlled-open-select">Level Of Influence</InputLabel>
                                <Select
                                    id="role"
                                    label="role"
                                    fullWidth={true}
                                    open={selectOpen1}
                                    onClose={handleSelectClose1}
                                    onOpen={handleSelectOpen1}
                                    value={loI}
                                    onChange={(e)=> {setLoi(e.target.value)}}
                                    inputProps={{
                                        name: 'role',
                                        id: 'demo-controlled-open-select',
                                    }}
                                >
                                    <MenuItem value={1}>1</MenuItem>
                                    <MenuItem value={2}>2</MenuItem>
                                    <MenuItem value={3}>3</MenuItem>
                                    <MenuItem value={4}>4</MenuItem>
                                    <MenuItem value={5}>5</MenuItem>
                                </Select>
                            </FormControl>
                            <br/>
                            <br/>
                            <br/>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="secondary">
                        Cancel
                    </Button>
                    <Button color="primary" type="submit">
                        Update
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
        </>
    );
}

const EditStakeHolderPage = withTracker(props => {
    return {
        company: Companies.findOne(),
        // projects: sortingFunc(Projects.find({}).fetch(), local),
    };
})(EditStakeHolder);

export default withSnackbar(EditStakeHolderPage)