import React, {useEffect, useState} from 'react';
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
import Grid from "@material-ui/core/Grid/Grid";
import SaveChanges from "../../Modals/SaveChanges";
import {KeyboardDatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import SelectStakeHolders from "../../Activities/Modals/SelectStakeHolders";
import DateFnsUtils from "@date-io/date-fns";
import {withTracker} from "meteor/react-meteor-data";
import {Companies} from "../../../../api/companies/companies";
import {Peoples} from "../../../../api/peoples/peoples";
import {withRouter} from "react-router";


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
    marginLeft: 15,
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

function AddValue(props) {
  let {open, handleModalClose, project, indexBenefits, editValue, stakeHoldersBenefits, localBenefits} = props;
  const [name, setName] = React.useState('');
  const [expectedDateOpen, setExpectedDateOpen] = useState(false);
  const [peoples, setPeoples] = useState([]);
  const [showModalDialog, setShowModalDialog] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);
  const [benefits, setBenefits] = useState([]);
  const [expectedDate, setExpectedDate] = useState(null);

  useEffect(() => {
    setBenefits(project.benefits)
  }, [project.benefits]);

  const classes = useStyles();
  const modalName = 'benefits';

  const handleClose = () => {
    handleModalClose(modalName);
    setName('');
    setExpectedDate(null);
    updateFilter('localStakeHoldersBenefits', 'changed', false);
    setShowModalDialog(false);
    setIsUpdated(false);
  };

  const handleOpenModalDialog = () => {
    if (isUpdated) {
      setShowModalDialog(true);
    }
  };

  const closeModalDialog = () => {
    setShowModalDialog(false);
  };

  const handleExpectedDate = date => {
    setExpectedDate(date);
    setIsUpdated(true);
    setExpectedDateOpen(false);
  };

  const openExpectedDatePicker = () => {
    setExpectedDateOpen(true)
  };

  const updateValues = () => {
    if (indexBenefits!== '') {
      const newStakeholders = benefits && benefits[indexBenefits].stakeholders;
      localBenefits.changed || updateFilter('localStakeHoldersBenefits', 'ids', newStakeholders);
      if (localBenefits.changed) {
        setIsUpdated(true)
      }
      const newExpectedDate = benefits && benefits[indexBenefits].expectedDate;
      setExpectedDate(newExpectedDate);
      let updatedStakeHolders = localBenefits.changed ? localBenefits.ids : newStakeholders;
      setPeoples(updatedStakeHolders);
    } else {
      let updatedStakeHolders = localBenefits.changed ? localBenefits.ids : [];
      setPeoples(updatedStakeHolders);
      updateFilter('localStakeHoldersBenefits', 'ids', updatedStakeHolders);
    }
  };

  useEffect(() => {
    updateValues();
  }, [indexBenefits, stakeHoldersBenefits]);

  const createBenefits = () => {
    if (!(name)) {
      props.enqueueSnackbar('Please fill the required Field', {variant: 'error'});
      return false;
    }
    let benefitsObj = {
      expectedDate,
      description: name,
      stakeholders: peoples,
    };

    let newBenefits = benefits;
    if (indexBenefits !== '') {
      newBenefits[indexBenefits] = benefitsObj;
      setBenefits(newBenefits);
    } else {
      newBenefits = project.benefits ? project.benefits.concat(benefitsObj) : [benefitsObj];
      setBenefits(newBenefits);
    }

    delete project.changeManagerDetails;
    delete project.managerDetails;
    delete project.peoplesDetails;
    let params = {
      ...project,
      benefits: newBenefits,
    };

    Meteor.call('projects.update', {project: params}, (err, res) => {
      if (err) {
        props.enqueueSnackbar(err.reason, {variant: 'error'})
      } else {
        handleClose();
        setName('');
        setExpectedDate(null);
        props.enqueueSnackbar('Project Updated Successfully.', {variant: 'success'})
      }
    })
  };

  const handleChange = (e) => {
    setName(e.target.value);
    setIsUpdated(true);
  };

  useEffect(() => {
    setName(editValue.description)
  }, [editValue]);

  return (
    <div className={classes.createNewProject}>
      <Dialog onClose={isUpdated ? handleOpenModalDialog : handleClose} aria-labelledby="customized-dialog-title"
              open={open} maxWidth="md" fullWidth={true}>
        <DialogTitle id="customized-dialog-title" onClose={isUpdated ? handleOpenModalDialog : handleClose}>
          Add a Project Benefits
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <br/>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  fullWidth
                  disableToolbar
                  variant="inline"
                  format="MM/dd/yyyy"
                  margin="normal"
                  id="date-picker-inline"
                  label="Expected Date"
                  value={expectedDate}
                  autoOk={false}
                  open={expectedDateOpen}
                  onClick={openExpectedDatePicker}
                  onChange={handleExpectedDate}
                  KeyboardButtonProps={{
                    'aria-label': 'change date',
                  }}
                />
              </MuiPickersUtilsProvider>
              <br/>
              <br/>
              <br/>
            </Grid>
            <Grid item xs={6}>
              <br/>
              <Typography className={classes.heading}>Stakeholders</Typography>
              <Typography className={classes.secondaryHeading}>
                {peoples && peoples.length || 0} of {stakeHoldersBenefits.length}
              </Typography>
              <SelectStakeHolders rows={stakeHoldersBenefits} local={localBenefits} isImpacts={false} isBenefits={true}/>
              <br/>
              <br/>
              <br/>
            </Grid>
            <Grid item xs={12}>
              <br/>
              <TextField
                id="name"
                label="Description"
                value={name}
                onChange={handleChange}
                required={true}
                type="text"
                fullWidth={true}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={createBenefits} color="primary">
            Save
          </Button>
        </DialogActions>
        <SaveChanges
          handleClose={handleClose}
          showModalDialog={showModalDialog}
          handleSave={createBenefits}
          closeModalDialog={closeModalDialog}
        />
      </Dialog>
    </div>
  );
}

const AddActivityPage = withTracker(props => {
  let localBenefits = LocalCollection.findOne({
    name: 'localStakeHoldersBenefits'
  });
  Meteor.subscribe('companies');
  let company = Companies.findOne() || {};
  let companyId = company._id || {};
  Meteor.subscribe('peoples', companyId);
  return {
    stakeHoldersBenefits: Peoples.find().fetch(),
    localBenefits,
    company
  };
})(withRouter(AddValue));

export default withSnackbar(AddActivityPage)
