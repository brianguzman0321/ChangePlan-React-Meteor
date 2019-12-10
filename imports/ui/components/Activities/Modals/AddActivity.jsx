import React, {useEffect, useState} from "react";
import moment from 'moment';
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
import Tooltip from '@material-ui/core/Tooltip';
import SVGInline from "react-svg-inline";
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
import SelectStakeHolders from './SelectStakeHolders';
import { Peoples } from '/imports/api/peoples/peoples'
import { Companies } from '/imports/api/companies/companies'
import { stringHelpers } from '/imports/helpers/stringHelpers';
import  AutoComplete from '/imports/ui/components/utilityComponents/AutoCompleteInline'
import AddNewPerson from './AddNewPerson';
import { withRouter } from 'react-router'
import DeleteActivity from './DeleteActivity';
import SaveChanges from "../../Modals/SaveChanges";

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
const styles2 = {
    root: {
        cursor: 'pointer',
        textAlign: 'center',
        '&:hover': {
            background: '#dae0e5;'
        },
        '&:selected': {
        }
    },
    item: {
        // background: '#dae0e5'
    }
};

const useStyles = makeStyles(theme => ({
    AddNewActivity: {
        flex: 1,
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
    },
    dialogPaper: {
        minHeight: '90vh',
        maxHeight: '90vh',
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

function createData(name, calories, fat, carbs, protein) {
    return { _id: name, calories, fat, carbs, protein };
}

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
    let { company, stakeHolders, local, match, edit, activity, list, isOpen } = props;
    const [open, setOpen] = useState(edit || isOpen || false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [time, setTime] = useState(5);
    const [isNew, setIsNew] = useState(false);
    const [users, setUsers] = useState([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [person, setPerson] = useState('');
    const [peoples, setPeoples] = useState(stakeHolders.map(item => item._id));
    const [activityType, setActivityType] = useState({});
    const [startingDate, setStartingDate] = useState(new Date());
    const [dueDate, setDueDate] = useState(new Date());
    const [startingDateOpen, setStartingDateOpen] = useState(false);
    const [endingDate, setEndingDate] = useState(new Date());
    const [endingDateOpen, setEndingDateOpen] = useState(false);
    const [selectOpen, setSelectOpen] = useState(false);
    const [role, setRole] = useState('changeManager');
    const [expanded, setExpanded] = useState('panel1');
    const [showModalDialog, setShowModalDialog] = useState(false);
    const [isUpdated, setIsUpdated] = useState(false);


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
        setTime(activity.time);
        local.changed || updateFilter('localStakeHolders', 'ids', activity.stakeHolders);
        let updatedStakeHolders = local.changed ? local.ids : activity.stakeHolders;
        setPeoples(updatedStakeHolders);

    };

    const resetValues = () => {
        let selectedActivity = data.find(item => item.name === activity.type) || {};
        setActivityType({});
        setDueDate(new Date());
        setDescription('');
        setPerson(null);
        setTime(5);
        setPeoples(stakeHolders.map(item => item._id));
        updateFilter('localStakeHolders', 'ids', stakeHolders.map(item => item._id));

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
            updateFilter('localStakeHolders', 'ids', updatedStakeHolders);
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
        props.newActivity();
        updateFilter('localStakeHolders', 'changed', false);
        resetValues();
        setShowModalDialog(false);
        setIsUpdated(false);
    };

    const handleOpenModalDialog = () => {
        if (isUpdated && !isNew) {
            setShowModalDialog(true);
        } else {
            handleClose();
        }
    };

    const closeModalDialog = () => {
        setShowModalDialog(false);
    };

    const createProject = (e) => {
        e.preventDefault();
        if(!(description && person && dueDate && time)){
            props.enqueueSnackbar('Please fill all required Fields', {variant: 'error'});
            return false;
        }
        else if(!(activityType && activityType.name) && Array.isArray(stakeHolders)){
            props.enqueueSnackbar('Please fill all required Fields', {variant: 'error'});
            return false;
        }
        let params = {
            activity: {
                name: activityType.buttonText,
                type: activityType.name,
                description,
                owner: person.value,
                dueDate,
                stakeHolders: peoples,
                projectId,
                step: 1,
                time: Number(time)
            }
        };

        let methodName = isNew ? 'activities.insert' : 'activities.update';
        !isNew && (params.activity._id = activity._id);
        Meteor.call(methodName, params, (err, res) => {
            if(err){
                props.enqueueSnackbar(err.reason, {variant: 'error'})
            }
            else{
                handleClose();
                props.enqueueSnackbar(`Activity ${isNew ? 'Added' : 'Updated'} Successfully.`, {variant: 'success'})
            }

        })

    };

    const handleDueDate = date => {
        setDueDate(date);
        setIsUpdated(true);
    };

    const handleEndingDate = date => {
        if(!(endingDate < startingDate)){
            setEndingDateOpen(false)
        }
        setEndingDate(date);
        setIsUpdated(true);
    };

    const openEnding = (e) => {
        setEndingDateOpen(true)
    };

    const handleTimeChange = (e) => {
        setTime(Number(e.target.value));
        setIsUpdated(true);
    };

    const updateUsers = (value) => {
        setPerson(value);
        setIsUpdated(true);
    };
    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
        setIsUpdated(true);
    };

    function deleteActivity() {
        setDeleteModal(true);
    }

    function deleteActivityClose(deleted) {
        setDeleteModal(false);
        deleted === true && handleClose();
    }



    return (
        <div className={classes.AddNewActivity}>
            {
                !list ? <Button variant="contained" className={classes.button} fullWidth={true} onClick={handleClickOpen}>
                    Add Activity
                </Button> : ''
            }
            <Dialog onClose={handleOpenModalDialog} aria-labelledby="customized-dialog-title" open={open} maxWidth="md" fullWidth={true} classes={{ paper: classes.dialogPaper }}>
                <DialogTitle id="customized-dialog-title" onClose={handleOpenModalDialog}>
                    { isNew ? 'Add' : 'Edit' } Activity
                </DialogTitle>
                <form onSubmit={createProject} noValidate>
                    <DialogContent dividers>
                        <div className={classes.root}>
                            <ExpansionPanel expanded={expanded === 'panel1'} onChange={handleChangePanel('panel1')}>
                                <ExpansionPanelSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1bh-content"
                                    id="panel1bh-header"
                                >
                                    <Typography className={classes.heading}>Date</Typography>
                                    <Typography className={classes.secondaryHeading}>Due Date: {moment(dueDate).format('DD-MMM-YY')}</Typography>
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
                                                    label="Due Date"
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
                                            <Grid item xs={6}>
                                                <TextField
                                                    margin="dense"
                                                    id="time"
                                                    label="Time Away from BAU (Minutes)"
                                                    value={time}
                                                    onChange={handleTimeChange}
                                                    required={true}
                                                    type="number"
                                                    fullWidth
                                                />
                                            </Grid>
                                        </Grid>
                                    </MuiPickersUtilsProvider>
                                </ExpansionPanelDetails>
                            </ExpansionPanel>
                            <ExpansionPanel expanded={expanded === 'panel2'} onChange={handleChangePanel('panel2')}>
                                <ExpansionPanelSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel2bh-content"
                                    id="panel2bh-header"
                                >
                                    <Typography className={classes.heading}>Activity Type</Typography>
                                    <Typography className={classes.secondaryHeading}>
                                        {activityType.buttonText || 'Select Activity type'}
                                        {activityType.iconSVG ? <SVGInline
                                            style={{position: 'absolute', marginTop: -8}}
                                            width="35px"
                                            height="35px"
                                            fill='#f1753e'
                                            svg={activityType.iconSVG}
                                        /> : ''
                                        }
                                    </Typography>
                                </ExpansionPanelSummary>
                                <ExpansionPanelDetails>
                                    <Grid container justify="space-between" spacing={4}>
                                        {
                                            data.map((item, index) => {
                                                return <Tooltip title={item.helpText} key={index}>
                                                    <Grid item={true} xs={2} classes={classes1} style={{background : activityType.name === item.name ? '#dae0e5' : '' }} onClick={(e) => { setActivityType(item); }}>

                                                        <SVGInline
                                                            width="35px"
                                                            height="35px"
                                                            fill='#f1753e'
                                                            svg={item.iconSVG}
                                                        />
                                                        <Typography className={classes.gridText}>
                                                            {item.buttonText}
                                                        </Typography>
                                                    </Grid>
                                                </Tooltip>
                                            })
                                        }
                                    </Grid>
                                </ExpansionPanelDetails>
                            </ExpansionPanel>
                            <ExpansionPanel expanded={expanded === 'panel3'} onChange={handleChangePanel('panel3')}>
                                <ExpansionPanelSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel3bh-content"
                                    id="panel3bh-header"
                                >
                                    <Typography className={classes.heading}>Stakeholders</Typography>
                                    <Typography className={classes.secondaryHeading}>
                                        {peoples.length} of {stakeHolders.length}
                                    </Typography>
                                </ExpansionPanelSummary>
                                <ExpansionPanelDetails>
                                    <Grid container justify="center">
                                        <SelectStakeHolders rows={stakeHolders} local={local}/>
                                    </Grid>
                                </ExpansionPanelDetails>
                            </ExpansionPanel>
                            <ExpansionPanel expanded={expanded === 'panel4'} onChange={handleChangePanel('panel4')}>
                                <ExpansionPanelSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel4bh-content"
                                    id="panel4bh-header"
                                >
                                    <Typography className={classes.heading}>Description</Typography>
                                    <Typography className={classes.secondaryHeading}>{
                                        stringHelpers.limitCharacters(description, 36) || 'Add Notes or Instructions for the person responsible'
                                    }</Typography>
                                </ExpansionPanelSummary>
                                <ExpansionPanelDetails>
                                    <TextField
                                        autoFocus
                                        margin="dense"
                                        id="description"
                                        label="Description"
                                        value={description}
                                        onChange={handleDescriptionChange}
                                        required={true}
                                        type="text"
                                        fullWidth
                                    />
                                </ExpansionPanelDetails>
                            </ExpansionPanel>
                            <ExpansionPanel expanded={expanded === 'panal5'} onChange={handleChangePanel('panal5')}>
                                <ExpansionPanelSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panal5bh-content"
                                    id="panal5bh-header"
                                >
                                    <Typography className={classes.heading}>Person Responsible</Typography>
                                    <Typography className={classes.secondaryHeading}>Assign Activity Owner</Typography>
                                </ExpansionPanelSummary>
                                <ExpansionPanelDetails>
                                    <Grid container justify="space-between" spacing={2}>
                                        <Grid item={true} xs={7}>
                                            <AutoComplete updateUsers={updateUsers} data={users} selectedValue={person}/>
                                        </Grid>
                                        <Grid item={true} xs={5}>
                                            <AddNewPerson company={company}/>
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
                            Save
                        </Button>
                    </DialogActions>
                    <SaveChanges
                      handleClose={handleClose}
                      showModalDialog={showModalDialog}
                      handleSave={createProject}
                      closeModalDialog={closeModalDialog}
                    />
                </form>
            </Dialog>
            <DeleteActivity open={deleteModal} handleModalClose={deleteActivityClose} activity={activity}/>
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