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

function ShareProject(props) {
    const [name, setName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [role, setRole] = React.useState('changeManager');
    const [selectOpen, setSelectOpen] = React.useState(false);

    let { company, open, handleModalClose, project } = props;
    const classes = useStyles();
    const modalName = 'share';

    const handleClose = () => {
        handleModalClose(modalName);
        setName('');
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
        <div className={classes.createNewProject}>
            <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open} maxWidth="md" fullWidth={true}>
                <DialogTitle id="customized-dialog-title" onClose={handleClose}>
                    Share Project
                </DialogTitle>
                <DialogContent dividers>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <TextField
                                autoFocus
                                // margin="dense"
                                id="name"
                                label="Name"
                                value={name}
                                onChange={handleChange}
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
                        <Grid item xs={12}>
                            <br/>
                            <FormControl className={classes.formControl} fullWidth={true}>
                                <InputLabel htmlFor="demo-controlled-open-select">Role</InputLabel>
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
                                    <MenuItem value='changeManager'>Change Manager (view and edit)</MenuItem>
                                    <MenuItem value='manager'>Manager (view only)</MenuItem>
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
                        Share
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default withSnackbar(ShareProject)