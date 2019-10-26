import React from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
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
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { data } from "/imports/activitiesContent.json";
import SvgIcon from '@material-ui/core/SvgIcon';
import SVG from 'react-inlinesvg';

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
    heading: {
        fontSize: theme.typography.pxToRem(15),
        flexBasis: '33.33%',
        flexShrink: 0,
    },
    secondaryHeading: {
        fontSize: theme.typography.pxToRem(15),
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
    const [open, setOpen] = React.useState(false);
    const [name, setName] = React.useState('');
    const [startingDate, setStartingDate] = React.useState(new Date());
    const [startingDateOpen, setStartingDateOpen] = React.useState(false);
    const [endingDate, setEndingDate] = React.useState(new Date());
    const [endingDateOpen, setEndingDateOpen] = React.useState(false);
    const [selectOpen, setSelectOpen] = React.useState(false);
    const [role, setRole] = React.useState('changeManager');
    const [expanded, setExpanded] = React.useState('panel1');
    let { company } = props;
    const classes = useStyles();



    const handleChangePanel = panel => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    const handleClickOpen = () => {
        setExpanded('panel1');
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

    const onSubmit = (event) => {}

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
            <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open} maxWidth="md" fullWidth={true}>
                <DialogTitle id="customized-dialog-title" onClose={handleClose}>
                    Add Activity
                </DialogTitle>
                <form onSubmit={onSubmit}>
                <DialogContent dividers>
                    <div className={classes.root}>
                        <ExpansionPanel expanded={expanded === 'panel1'} onChange={handleChangePanel('panel1')}>
                            <ExpansionPanelSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1bh-content"
                                id="panel1bh-header"
                            >
                                <Typography className={classes.heading}>Date</Typography>
                                <Typography className={classes.secondaryHeading}>Due Date 26-08-20</Typography>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails>
                                <Typography>
                                    Nulla facilisi. Phasellus sollicitudin nulla et quam mattis feugiat. Aliquam eget
                                    maximus est, id dignissim quam.
                                </Typography>
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
                                    Presentation
                                </Typography>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails>
                                {
                                    data.map(item => {
                                        return <SVG src={item.iconSVG} />;


                                    })
                                }
                                {/*<Typography>*/}
                                    {/*Donec placerat, lectus sed mattis semper, neque lectus feugiat lectus, varius pulvinar*/}
                                    {/*diam eros in elit. Pellentesque convallis laoreet laoreet.*/}
                                {/*</Typography>*/}
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
                                    67 of 67
                                </Typography>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails>
                                <Typography>
                                    Nunc vitae orci ultricies, auctor nunc in, volutpat nisl. Integer sit amet egestas eros,
                                    vitae egestas augue. Duis vel est augue.
                                </Typography>
                            </ExpansionPanelDetails>
                        </ExpansionPanel>
                        <ExpansionPanel expanded={expanded === 'panel4'} onChange={handleChangePanel('panel4')}>
                            <ExpansionPanelSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel4bh-content"
                                id="panel4bh-header"
                            >
                                <Typography className={classes.heading}>Description</Typography>
                                <Typography className={classes.secondaryHeading}>Add Notes or Instructions for the person responsible</Typography>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails>
                                <Typography>
                                    Add Notes or Instructions for the person responsible
                                </Typography>
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
                                <Typography>
                                    Assign Activity Owner
                                </Typography>
                            </ExpansionPanelDetails>
                        </ExpansionPanel>
                    </div>
                </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="secondary">
                            cancel
                        </Button>
                        <Button type="submit" color="primary">
                            Save
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </div>
    );
}

export default withSnackbar(AddActivity)