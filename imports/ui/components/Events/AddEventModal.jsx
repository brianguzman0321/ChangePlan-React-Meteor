import React, {useState} from "react";
import {withStyles, makeStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import {withSnackbar} from 'notistack';
import 'date-fns';
import Grid from '@material-ui/core/Grid';
import {withTracker} from "meteor/react-meteor-data";
import DateFnsUtils from '@date-io/date-fns';
import {
  DatePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import {withRouter} from 'react-router'
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';

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
  AddNewEvent: {
    flex: 1,
    marginTop: 2,
    marginLeft: 15
  },
  datePicker: {
    display: 'flex',
    alignItems: 'center',
  },
}));

const DialogTitle = withStyles(styles)(props => {
  const {children, classes, onClose} = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon/>
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

function AddEvent(props) {
  let {match, open, handleClose, isNew = true} = props;
  let {projectId} = match.params;
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const classes = useStyles();

  const createEvent = (e) => {
    e.preventDefault();
    if (!(name && startDate && endDate)) {
      props.enqueueSnackbar('Please fill all required fields', {variant: 'error'});
      return false;
    } else if (endDate < startDate) {
      props.enqueueSnackbar('Please fix the date error', {variant: 'error'});
      return false;
    }
    let params = {
      projectEvent: {
        name: name,
        projectId: projectId,
        startDate,
        endDate,
      }
    };
    Meteor.call('projectEvents.insert', params, (err, res) => {
      if (err) {
        props.enqueueSnackbar(err.reason, {variant: 'error'})
      } else {
        props.enqueueSnackbar('New Project Event Created Successfully.', {variant: 'success'});
        resetValues();
        handleClose();
      }
    })
  };

  const resetValues = () => {
    setName('');
    setStartDate(new Date());
    setEndDate(new Date());
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleStartDate = (date) => {
    setStartDate(date)
  };

  const handleEndDate = (date) => {
    setEndDate(date)
  };

  const onCalendarClick = (id) => {
    document.getElementById(id).click();
  };

  const deleteEvent = () => {

  };

  return (
    <div className={classes.AddNewEvent}>
      <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open} maxWidth="md"
              fullWidth={true}>
        <DialogTitle id="customized-dialog-title" onClose={() => handleClose()}>
          Add project event
        </DialogTitle>
        <form onSubmit={createEvent} noValidate>
          <DialogContent dividers>
            <div className={classes.root}>
              <Grid container>
                <Grid item xs={5}>
                  <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Name"
                    value={name}
                    onChange={handleNameChange}
                    required={true}
                    type="text"
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12}>
                  <br />
                  <br />
                  <Grid container>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <Grid item xs={6} className={classes.datePicker}>
                        <Grid container>
                          <Grid item xs={10}>
                            <DatePicker
                              fullWidth
                              disableToolbar
                              variant="inline"
                              margin="dense"
                              autoOk={true}
                              format="MM/dd/yyyy"
                              id="start-date-picker-inline"
                              label="Start Date*"
                              value={startDate}
                              onChange={handleStartDate}
                            />
                          </Grid>
                          <Grid item xs={2}>
                            <IconButton aria-label="close" className={classes.closeButton}
                                        onClick={() => onCalendarClick("start-date-picker-inline")}>
                              <CalendarTodayIcon/>
                            </IconButton>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={6} className={classes.datePicker}>
                        <Grid container>
                          <Grid item xs={10}>
                            <DatePicker
                              disableToolbar
                              fullWidth
                              autoOk={true}
                              variant="inline"
                              margin="dense"
                              id="end-date-picker-dialog"
                              label="End Date*"
                              format="MM/dd/yyyy"
                              value={endDate}
                              minDate={startDate}
                              onChange={handleEndDate}
                            />
                          </Grid>
                          <Grid item xs={2}>
                            <IconButton aria-label="close" className={classes.closeButton}
                                        onClick={() => onCalendarClick("end-date-picker-dialog")}>
                              <CalendarTodayIcon/>
                            </IconButton>
                          </Grid>
                        </Grid>
                      </Grid>
                    </MuiPickersUtilsProvider>
                  </Grid>
                </Grid>
              </Grid>
              <br />
            </div>
          </DialogContent>
          <DialogActions>
            {isNew ? <Button onClick={() => handleClose()} color="secondary">
                cancel
              </Button> :
              <Button onClick={deleteEvent} color="secondary">
                Delete
              </Button>}
            <Button type="submit" color="primary">
              Save
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  )
    ;
}

const AddEventModal = withTracker(props => {
  return {};
})(withRouter(AddEvent));

export default withSnackbar(AddEventModal)