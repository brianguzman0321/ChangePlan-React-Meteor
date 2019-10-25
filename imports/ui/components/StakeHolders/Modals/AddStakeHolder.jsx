import React, {useEffect} from "react";
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

function AddStakeHolder(props) {
    const [name, setName] = React.useState('');
    const [firstName, setFirstName] = React.useState('');
    const [lastName, setLastName] = React.useState('');
    const [role, setRole] = React.useState('');
    const [businessUnit, setBusinessUnit] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [loS, setLos] = React.useState('');
    const [loI, setLoi] = React.useState('');
    const [selectOpen, setSelectOpen] = React.useState(false);
    const [selectOpen1, setSelectOpen1] = React.useState(false);
    const [open, setOpen] = React.useState(false);

    let { company, handleModalClose, project } = props;
    const classes = useStyles();
    const modalName = 'share';

    const handleClickOpen = () => {
        setName('');
        setFirstName('');
        setLastName('');
        setRole('');
        setBusinessUnit('');
        setEmail('');
        setLos('');
        setLoi('');
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const createProject = () => {
        if(!(name && email && role)){
            props.enqueueSnackbar('Please fill all required Fields', {variant: 'error'});
            return false;
        }
        else{
            if(!(/^\S+@\S+$/.test(email))){
                props.enqueueSnackbar('Please Enter Valid Email Address', {variant: 'error'});
                return false;
            }
        }
        let params = {
            name,
            email,
            role,
            project

        };
        Meteor.call('roles.assignRole', params, (err, res) => {
            if(err){
                props.enqueueSnackbar(err.reason, {variant: 'error'})
            }
            else{
                handleClose();
                setName('');
                setEmail('');
                props.enqueueSnackbar('Project Shared Successfully.', {variant: 'success'})
            }

        })

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
                firstName,
                lastName,
                role,
                businessUnit,
                email,
                influenceLevel: loI,
                supportLevel: loS,
                company: company._id

            }
        };
        Meteor.call('peoples.insert', params, (err, res) => {
            if(err){
                props.enqueueSnackbar(err.reason, {variant: 'error'})
            }
            else{
                setOpen(false);
                setName('');
                props.enqueueSnackbar('StakeHolder Added Successfully.', {variant: 'success'})
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
        <div className={classes.createNewProject}>
            <Button variant="contained" color="primary" onClick={handleClickOpen} className={classes.addStakeHolder}>
                Add
            </Button>
            <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open} maxWidth="sm" fullWidth={true}>
                <DialogTitle id="customized-dialog-title" onClose={handleClose}>
                    Add Stakeholder
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
                        Save
                    </Button>
                </DialogActions>
                </form>
            </Dialog>
        </div>
    );
}

const AddStakeHolderPage = withTracker(props => {
    return {
        company: Companies.findOne(),
        // projects: sortingFunc(Projects.find({}).fetch(), local),
    };
})(AddStakeHolder);

export default withSnackbar(AddStakeHolderPage)