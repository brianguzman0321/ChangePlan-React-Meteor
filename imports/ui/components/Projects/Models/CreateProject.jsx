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
import TextField from '@material-ui/core/TextField';
import { withSnackbar } from 'notistack';
import 'date-fns';
import Grid from '@material-ui/core/Grid';
import {withTracker} from "meteor/react-meteor-data";
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { data } from "/imports/activitiesContent.json";
import { Peoples } from '/imports/api/peoples/peoples'
import { Companies } from '/imports/api/companies/companies'
import  AutoComplete from '/imports/ui/components/utilityComponents/AutoCompleteInline'
import { withRouter } from 'react-router'

const styles = theme => ({
    root: {
        margin: 0,
        padding: theme.spacing(3, 3),
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
});

const gridStyles = makeStyles(theme => ({
    root: {
        cursor: 'pointer',
        textAlign: 'center',
        '&:hover': {
            background: '#dae0e5;'
        },
        '&:selected': {
            background: '#dae0e5;'
        }
    },
    item: {
        // background: '#dae0e5'
    }
}));

const useStyles = makeStyles(theme => ({
    AddNewActivity: {
        flex: 1,
        marginTop: 2,
        marginLeft: 15
    },
    button: {
        background: '#f1753e',
        color: 'white',
        '&:hover': {
            background: '#f1753e',
            color: 'white'
        }
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        flexBasis: '33.33%',
        flexShrink: 0,
    },
    secondaryHeading: {
        fontSize: theme.typography.pxToRem(15),
        color: theme.palette.text.secondary,
    },
    gridText: {
        fontSize: theme.typography.pxToRem(12),
        color: theme.palette.text.secondary,
    },
    avatar: {
        position: 'absolute',
        top: theme.spacing(1),
        left: theme.spacing(1),
        width: 15,
        height: 15
    },
    panelSummary: {
        background: 'red',
        root: {
            background: 'red'
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

function AddActivity(props) {
    let { company, stakeHolders, local, match, edit, activity, isOpen } = props;
    const [open, setOpen] = React.useState(edit || isOpen || false);
    const [deleteModal, setDeleteModal] = React.useState(false);
    const [age, setAge] = React.useState(5);
    const [isNew, setIsNew] = React.useState(false);
    const [users, setUsers] = React.useState([]);
    const [name, setName] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [person, setPerson] = React.useState('');
    const [peoples, setPeoples] = React.useState(stakeHolders.map(item => item._id));
    const [activityType, setActivityType] = React.useState({});
    const [startingDate, setStartingDate] = React.useState(new Date());
    const [dueDate, setDueDate] = React.useState(new Date());
    const [startingDateOpen, setStartingDateOpen] = React.useState(false);
    const [endingDate, setEndingDate] = React.useState(new Date());
    const [endingDateOpen, setEndingDateOpen] = React.useState(false);
    const [selectOpen, setSelectOpen] = React.useState(false);
    const [role, setRole] = React.useState('changeManager');
    const [expanded, setExpanded] = React.useState('panel1');

    let { projectId } = match.params;
    const classes = useStyles();
    const classes1 = gridStyles();

    const updateValues = () => {
        if(isNew){
            resetValues();
            return false;
        }
        let selectedActivity = data.find(item => item.name === activity.type) || {};
        setActivityType(selectedActivity);
        setDueDate(activity.dueDate);
        setDescription(activity.description);
        let obj = {
            label: `${activity.personResponsible.profile.firstName} ${activity.personResponsible.profile.lastName}`,
            value: activity.personResponsible._id
        };
        setPerson(obj);
        setAge(activity.time);
        local.changed || updateFilter('localStakeHolders', 'ids', activity.stakeHolders);
        let updatedStakeHolders = local.changed ? local.ids : activity.stakeHolders;
        setPeoples(updatedStakeHolders);

    };

    const resetValues = () => {
        setActivityType({});
        setDueDate(new Date());
        setDescription('');
        setPerson(null);
        setAge(5);
        setPeoples(stakeHolders.map(item => item._id));
        updateFilter('localStakeHolders', 'ids', stakeHolders.map(item => item._id));

    };

    const createProject = (e) => {
        e.preventDefault();
        if(!(description && startingDate && endingDate)){
            props.enqueueSnackbar('Please fill all required Fields', {variant: 'error'});
            return false;
        }
        else if(endingDate < startingDate){
            props.enqueueSnackbar('Please fix the date error', {variant: 'error'});
            return false;
        }
        let params = {
            project: {
                name: description,
                startingDate,
                endingDate,
                companyId: company._id,
                managers: person && person.map(p => p.value) || []

            }
        };
        Meteor.call('projects.insert', params, (err, res) => {
            if(err){
                props.enqueueSnackbar(err.reason, {variant: 'error'})
            }
            else{
                setOpen(false);
                setName('');
                resetValues();
                props.enqueueSnackbar('New Project Created Successfully.', {variant: 'success'})
            }

        })

    };

    const updateUsersList = () => {
        Meteor.call(`users.getPersons`, {company: company}, (err, res) => {
            if(err){
                props.enqueueSnackbar(err.reason, {variant: 'error'});
            }
            if(res && res.length){
                setUsers(res.map(user => {
                    return {
                        label: `${user.profile.firstName} ${user.profile.lastName}`,
                        value: user._id
                    }
                }))
            }
            else {
                setUsers([])
            }
        })
    };

    useEffect(() => {
        setOpen(edit || open);
        updateUsersList();
        if(isNew){
            let updatedStakeHolders = local.changed ? local.ids : stakeHolders.map(item => item._id);
            setPeoples(updatedStakeHolders);
        }
        if(edit && activity && activity.name){
            setExpanded('panel1');
            updateValues();
        }


    }, [props.company, stakeHolders, company, props.edit, props.activity, isNew, local]);

    const handleChangePanel = panel => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    const handleClickOpen = () => {
        setIsNew(true);
        setExpanded('panel1');
        setOpen(true);
    };
    const handleClose = () => {
        setName('');
        setOpen(false);
        setIsNew(false);
        // props.newActivity();
        updateFilter('localStakeHolders', 'changed', false);
        resetValues()
    };

    const handleDueDate = date => {
        setDueDate(date)
    };

    const handleEndingDate = date => {
        if(!(endingDate < startingDate)){
            setEndingDateOpen(false)
        }
        setEndingDate(date);

    };

    const updateUsers = (value) => {
        setPerson(value)
    };
    const handleDescriptionChange = (e) => {
        setDescription(e.target.value)
    };

    function deleteActivity() {
        setDeleteModal(true);
    }



    return (
        <div className={classes.AddNewActivity}>
            <Button variant="outlined" color="primary" onClick={handleClickOpen} >
                Create New Project
            </Button>
            <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open} maxWidth="md" fullWidth={true}>
                <DialogTitle id="customized-dialog-title" onClose={handleClose}>
                    Create New Project
                </DialogTitle>
                <form onSubmit={createProject} noValidate>
                    <DialogContent dividers>
                        <div className={classes.root}>
                            <ExpansionPanel expanded={expanded === 'panel1'} onChange={handleChangePanel('panel1')}>
                                <ExpansionPanelSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel4bh-content"
                                    id="panel4bh-header"
                                >
                                    <Typography className={classes.heading}>Project Name</Typography>
                                    <Typography className={classes.secondaryHeading}>
                                    </Typography>
                                </ExpansionPanelSummary>
                                <ExpansionPanelDetails>
                                    <TextField
                                        autoFocus
                                        margin="dense"
                                        id="description"
                                        label="Project Name"
                                        value={description}
                                        onChange={handleDescriptionChange}
                                        required={true}
                                        type="text"
                                        fullWidth
                                    />
                                </ExpansionPanelDetails>
                            </ExpansionPanel>
                            <ExpansionPanel expanded={expanded === 'panel2'} onChange={handleChangePanel('panel2')}>
                                <ExpansionPanelSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1bh-content"
                                    id="panel1bh-header"
                                >
                                    <Typography className={classes.heading}>Date</Typography>
                                    <Typography className={classes.secondaryHeading}>Start and estimated due dates</Typography>
                                </ExpansionPanelSummary>
                                <ExpansionPanelDetails>
                                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                        <Grid container justify="space-between" spacing={4}>
                                            <Grid item xs={6}>
                                                <KeyboardDatePicker
                                                    fullWidth
                                                    disableToolbar
                                                    variant="inline"
                                                    format="MM/dd/yyyy"
                                                    margin="normal"
                                                    id="date-picker-inline"
                                                    label="Start Date"
                                                    value={dueDate}
                                                    autoOk={true}
                                                    onChange={handleDueDate}
                                                    KeyboardButtonProps={{
                                                        'aria-label': 'change date',
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={6}>
                                                <KeyboardDatePicker
                                                    disableToolbar
                                                    fullWidth
                                                    variant="inline"
                                                    margin="normal"
                                                    id="date-picker-dialog"
                                                    label="Estimated Due Date"
                                                    format="MM/dd/yyyy"
                                                    value={endingDate}
                                                    minDate={startingDate}
                                                    autoOk={true}
                                                    onChange={handleEndingDate}
                                                    KeyboardButtonProps={{
                                                        'aria-label': 'change date',
                                                    }}
                                                />
                                            </Grid>
                                        </Grid>
                                    </MuiPickersUtilsProvider>
                                </ExpansionPanelDetails>
                            </ExpansionPanel>
                            <ExpansionPanel expanded={expanded === 'panal3'} onChange={handleChangePanel('panal3')}>
                                <ExpansionPanelSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panal5bh-content"
                                    id="panal5bh-header"
                                >
                                    <Typography className={classes.heading}>Managers</Typography>
                                    <Typography className={classes.secondaryHeading}>Can View project Information</Typography>
                                </ExpansionPanelSummary>
                                <ExpansionPanelDetails>
                                    <Grid container justify="space-between" spacing={2}>
                                        <Grid item={true} xs={12}>
                                            <AutoComplete updateUsers={updateUsers} data={users} selectedValue={person} multiple={true}/>
                                        </Grid>
                                    </Grid>
                                </ExpansionPanelDetails>
                            </ExpansionPanel>
                        </div>
                    </DialogContent>
                    <DialogActions>
                        {isNew ? <Button onClick={handleClose} color="secondary">
                                cancel
                            </Button> :
                            <Button onClick={deleteActivity} color="secondary">
                                Delete
                            </Button>}

                        <Button type="submit" color="primary">
                            Create Project
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </div>
    );
}

const AddActivityPage = withTracker(props => {
    let local = LocalCollection.findOne({
        name: 'localStakeHolders'
    });
    Meteor.subscribe('companies');
    let company = Companies.findOne() || {};
    let companyId = company._id || {};
    Meteor.subscribe('peoples', companyId );
    return {
        stakeHolders: Peoples.find().fetch(),
        local,
        company
    };
})(withRouter(AddActivity));

export default withSnackbar(AddActivityPage)