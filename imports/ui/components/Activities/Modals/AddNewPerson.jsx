import React, {useEffect} from "react";
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { withSnackbar } from 'notistack';


import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import MuiDialogContent from '@material-ui/core/DialogContent';



const useToolbarStyles = makeStyles(theme => ({
    root: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(1),
    },
    highlight:
        theme.palette.type === 'light'
            ? {
        }
            : {
            // backgroundColor: '#f5f5f5',
        },
    title: {
        flex: '1 1 100%',
    },
}));

const EnhancedTableToolbar = props => {
    const classes = useToolbarStyles();
    const { numSelected } = props;

    return (
        <Toolbar
            className={clsx(classes.root, {
                [classes.highlight]: numSelected > 0,
            })}
        >
            }
        </Toolbar>
    );
};

EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired,
};

const useStyles = makeStyles(theme => ({
    appBar: {
        position: 'relative',
    },
    title: {
        marginLeft: theme.spacing(2),
        flex: 1,
    },
    addNewPerson: {
        marginTop: 17
    }
}));

const DialogContent = withStyles(theme => ({
    root: {
        padding: theme.spacing(2),
    }
}))(MuiDialogContent);

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function AddNewPerson(props) {
    let { company } = props;
    const [firstName, setFirstName] = React.useState('');
    const [lastName, setLastName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const updateStakeHolders = () => {
        let params = {
            firstName,
            lastName,
            email,
            companyId: company._id

        };
        Meteor.call('roles.addNewPerson', params, (err, res) => {
            if(err){
                props.enqueueSnackbar(err.reason, {variant: 'error'})
            }
            else{
                setFirstName('');
                setLastName('');
                setEmail('');
                props.enqueueSnackbar('New Person Added Successfully.', {variant: 'success'});
                setOpen(false);
            }

        })
    };


    return (
        <div>
            <Button variant="outlined" color="primary" onClick={handleClickOpen} fullWidth={true} className={classes.addNewPerson}>
                Add New Person
            </Button>
            <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
                <AppBar className={classes.appBar} color="default">
                    <Toolbar>
                        <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                            <CloseIcon />
                        </IconButton>
                        <Typography variant="h6" className={classes.title}>
                            Add New Person
                        </Typography>
                        <Button autoFocus color="inherit" onClick={updateStakeHolders}>
                            Add
                        </Button>
                    </Toolbar>
                </AppBar>
                <DialogContent dividers>
                    <Grid container justify="space-between" spacing={4}>
                        <Grid item={true} xs={6} >
                            <TextField
                                autoFocus
                                margin="dense"
                                id="firstName"
                                label="First Name"
                                value={firstName}
                                onChange={(e)=> {setFirstName(e.target.value)}}
                                required={true}
                                type="text"
                                fullWidth
                            />
                        </Grid>
                        <Grid item={true} xs={6} >
                            <TextField
                                margin="dense"
                                id="lastName"
                                label="Last Name"
                                value={lastName}
                                onChange={(e)=> {setLastName(e.target.value)}}
                                required={true}
                                type="text"
                                fullWidth
                            />
                        </Grid>
                    </Grid>
                    <TextField
                        margin="dense"
                        id="email"
                        label="Email"
                        value={email}
                        onChange={(e)=> {setEmail(e.target.value)}}
                        required={true}
                        type="email"
                        fullWidth
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default withSnackbar(AddNewPerson)