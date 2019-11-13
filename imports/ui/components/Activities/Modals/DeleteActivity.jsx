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
import DialogContentText from '@material-ui/core/DialogContentText';
import { withSnackbar } from 'notistack';
import 'date-fns';

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

function DeleteProject(props) {
    const [name, setName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [role, setRole] = React.useState('changeManager');
    const [selectOpen, setSelectOpen] = React.useState(false);

    let { company, open, handleModalClose, activity } = props;
    const classes = useStyles();
    const modalName = 'delete';

    const handleClose = (value) => {
        handleModalClose(value);
        setName('');
    };
    const removeProject = () => {
        let params = {
            activity: {
                _id: activity._id,

            }
        };
        Meteor.call('activities.remove', params, (err, res) => {
            if(err){
                props.enqueueSnackbar(err.reason, {variant: 'error'})
            }
            else{
                handleClose(true);
                setName('');
                setEmail('');
                props.enqueueSnackbar('Activity Removed Successfully.', {variant: 'success'})
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
            <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open} maxWidth="sm" fullWidth={true}>
                <DialogTitle id="customized-dialog-title" onClose={handleClose}>
                    Remove Activity
                </DialogTitle>
                <DialogContent dividers>
                    <DialogContentText>
                        Are you sure? It's means to remove <strong>{activity.name}</strong>.
                        this action can's be reversed.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={removeProject} color="secondary">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default withSnackbar(DeleteProject)