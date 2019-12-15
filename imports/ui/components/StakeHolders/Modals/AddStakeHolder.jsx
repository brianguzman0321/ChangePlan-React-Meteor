import React, { useEffect } from "react";
import { withStyles, makeStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import Divider from '@material-ui/core/Divider';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import Papa from 'papaparse'
import TextField from '@material-ui/core/TextField';
import { withSnackbar } from 'notistack';
import 'date-fns';
import Grid from "@material-ui/core/Grid/Grid";
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import { withTracker } from "meteor/react-meteor-data";
import { Companies } from "/imports/api/companies/companies";
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import { useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import { Peoples } from '../../../../api/peoples/peoples';
import AddExistingStakeholder from "./AddExistingStakeholder";
import { Projects } from '../../../../api/projects/projects'
import AddStakeHoldersResults from "./AddStakeholdersResults";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      <Box p={3}>{children}</Box>
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

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
  dialogPaper: {
    minHeight: '80vh',
    maxHeight: '80vh',
  },
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
    padding: 0
  }
}))(MuiDialogContent);

const DialogActions = withStyles(theme => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

function AddStakeHolder(props) {
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [role, setRole] = React.useState('');
  const [businessUnit, setBusinessUnit] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [supportLevel, setSupportLevel] = React.useState(null);
  const [influenceLevel, setInfluenceLevel] = React.useState(null);
  const [selectOpen, setSelectOpen] = React.useState(false);
  const [selectOpen1, setSelectOpen1] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(0);
  const [csvfile, setCsvfile] = React.useState(undefined);
  const [loading, setLoading] = React.useState(false);
  const [notes, setNotes] = React.useState('');
  const [agreedToAddModal, setAgreedToAddModal] = React.useState(false);
  const theme = useTheme();
  const [stakeholder, setNewStakeholder] = React.useState(null);
  const [addConfirmation, setAddConfirmation] = React.useState(false);
  const [stakeHolderId, setStakeHolderId] = React.useState();
  const [tableData, setTableData] = React.useState({
    new: [],
    attached: [],
  });
  const [openResultTable, setOpenResultTable] = React.useState(false);

  let { company, match } = props;
  let { projectId } = match.params;
  let both = false;

  const classes = useStyles();

  const handleClickOpen = () => {
    setFirstName('');
    setLastName('');
    setRole('');
    setBusinessUnit('');
    setEmail('');
    setSupportLevel(null);
    setInfluenceLevel(null);
    setOpen(true);
    setCsvfile('');
    setNotes('');
  };

  const handleChangeValue = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = index => {
    setValue(index);
  };

  const handleClose = () => {
    setOpen(false);
    setLoading(false);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    checkEmail(e.target.value);
  };

  const checkEmail = (stakeholderEmail) => {
    const newStakeholder = Peoples.find({ email: stakeholderEmail, company: company._id }).fetch()[0];
    setNewStakeholder({ ...newStakeholder });
    if (newStakeholder) {
      setAgreedToAddModal(true);
    }
  };

  const checkManyEmail = (stakeholderEmail) => {
    const newStakeholder = Peoples.find({ email: stakeholderEmail, company: company._id }).fetch();

    setNewStakeholder({ ...newStakeholder });
    if (newStakeholder) {
      setAgreedToAddModal(true);
    }
  };

  const closeAgreedToAddModal = () => {
    setAgreedToAddModal(false);
  };

  const handleChangecsv = event => {
    let file = event.target.files[0];
    let ext;
    try {
      ext = file.name.match(/\.([^\.]+)$/)[1];
    } catch (e) {
      props.enqueueSnackbar(`Unsupported file type. CSV only.`, { variant: 'error' });
      setCsvfile(undefined);
      return false;
    }

    switch (ext) {
      case 'csv':
        setCsvfile(event.target.files[0]);
        break;
      default:
        props.enqueueSnackbar(`Unsupported file type (${ext}). CSV only.`, { variant: 'error' });
        setCsvfile(undefined);
    }

  };

  const updateData = (result) => {
    var data = result.data;

    if (!(data && data.length)) {
      props.enqueueSnackbar('No Valid Data Found', { variant: 'error' });
      return false;
    }

    data.pop();

    let csvUploadErrorMessage = '';
    console.log('data before mpa', data);

    let data1 = data.map((doc) => {
      if (!doc['First Name']) {
        csvUploadErrorMessage = 'First Name Value is empty or Invalid'
      }
      if (!doc['Last Name']) {
        csvUploadErrorMessage = 'Last Name Value is empty or Invalid'
      }
      if (!doc['Role']) {
        csvUploadErrorMessage = 'Role Value is empty or Invalid'
      }
      if (!doc['Business Unit']) {
        csvUploadErrorMessage = 'Business Unit Value is empty or Invalid'
      }
      if (!(doc['Email'] && (/^\S+@\S+$/.test(doc['Email'])))) {
        csvUploadErrorMessage = 'Email Value is empty or Invalid'
      }
      if (doc['Level of Influence'] && isNaN(Number(doc['Level of Influence']))) {
        csvUploadErrorMessage = 'Level of Influence Value is Invalid'
      }
      if (doc['Level of support'] && isNaN(Number(doc['Level of support']))) {
        csvUploadErrorMessage = 'Level of support Value is Invalid'
      }
      let paramsObj = {
        firstName: doc['First Name'],
        lastName: doc['Last Name'],
        role: doc['Role'],
        businessUnit: doc['Business Unit'],
        email: doc['Email'],
        notes: doc['Notes'],
        company: company._id,
        projectId
      };
      doc['Level of Influence'] && (paramsObj.influenceLevel = Number(doc['Level of Influence']));
      doc['Level of support'] && (paramsObj.supportLevel = Number(doc['Level of support']));
      return paramsObj
    });
    console.log('data1', data1);

    const importedEmails = data1.map(csvRow => csvRow.email) || [];
    console.log('importedEmails', importedEmails);
    console.log('company', company);

    if (importedEmails.length && company) {
      const peoples = Peoples.find({
        company: company._id
      }).fetch();
      const peoplesEmails = peoples.map(people => people.email);
      console.log('peoplesEmails', peoplesEmails);

      const currentProject = Projects.findOne({ _id: projectId });
      console.log('currentProject', currentProject);

      const addToProject = peoples.filter(people => (importedEmails.includes(people.email) && !currentProject.stakeHolders.includes(people._id)));
      const addToBoth = data1.filter(({ email }) => !peoplesEmails.includes(email));
      let tempTableDate = { attached: [], new: [] };
      console.log('addToProject', addToProject);
      console.log('addToBoth', addToBoth);

      currentProject.stakeHolders = [...currentProject.stakeHolders, ...addToProject.map(people => people._id)];

      setStakeHolderId(currentProject);

      if (addToProject.length) {
        tempTableDate = { ...tempTableDate, attached: addToProject };
        console.log('addToProject works', tempTableDate);
        setTableData(tempTableDate);
        setAddConfirmation(true);
      }

      if (addToBoth.length) {
        tempTableDate = { ...tempTableDate, new: addToBoth };
        setTableData(tempTableDate);
        console.log('addToBoth works', addToBoth);
        console.log('addToBoth works tempTableDate', tempTableDate);

        insertManyStakeholders({ peoples: addToBoth }, tempTableDate);
      }

      if (!addToBoth.length && !addToProject.length) {
        props.enqueueSnackbar(`Nothing to add from this file.`, { variant: 'warning' });
        setLoading(false);
      }
    }

    if (csvUploadErrorMessage) {
      props.enqueueSnackbar(`Upload Failed! ${csvUploadErrorMessage}`, { variant: 'error' });
      return false
    }
  };

  const insertManyStakeholders = (params, tempTableDate) => {
    Meteor.call('peoples.insertMany', params, (err, res) => {
      setLoading(false);
      if (err) {
        props.enqueueSnackbar(`Upload Aborted! ${err.reason}`, { variant: 'error' })
      } else {
        setOpen(false);
        setCsvfile(null);
        props.enqueueSnackbar('StakeHolders Added Successfully.', { variant: 'success' });
        if (!tempTableDate.attached.length) {
          setOpenResultTable(true);
        }
      }
    });
  }

  const importCSV = () => {
    if (!csvfile) {
      props.enqueueSnackbar('No File Selected', { variant: 'error' });
      return false;
    }
    Papa.parse(csvfile, {
      complete: updateData,
      header: true,
      skipEmptyLines: true,
    });
  };


  const onSubmit = (e) => {
    e.preventDefault();
    const newStakeholder = Peoples.find({ email, company: company._id }).fetch()[0];
    setNewStakeholder({ ...newStakeholder });
    if (newStakeholder) {
      setAgreedToAddModal(true);
    } else {
      let params = {
        people: {
          firstName,
          lastName,
          role,
          businessUnit,
          email,
          notes,
          projectId,
          company: company._id
        }
      };
      influenceLevel && (params.people.influenceLevel = influenceLevel);
      supportLevel && (params.people.supportLevel = supportLevel);
      Meteor.call('peoples.insert', params, (err, res) => {
        if (err) {
          props.enqueueSnackbar(err.reason, { variant: 'error' })
        } else {
          setOpen(false);
          props.enqueueSnackbar('StakeHolder Added Successfully.', { variant: 'success' })
        }

      })
    }
  };

  const addExistingStakeholder = (isMulti = false) => {
    console.log('addExistingStakeholder call');
    if (isMulti) {
      console.log('isMulti', isMulti);
      const params = {
        project: stakeHolderId,
      };
      console.log('params', params);
      Meteor.call('projects.update', params, (error, result) => {
        if (error) {
          props.enqueueSnackbar(err.reason, { variant: 'error' })
        } else {
          props.enqueueSnackbar('StakeHolder Added Successful.', { variant: 'success' });
          setAddConfirmation(false);
          setOpen(false);
          console.log('RESULT data', tableData);
          setOpenResultTable(true);
        }
      });

    } else {
      const currentProject = Projects.find({ _id: projectId }).fetch();
      console.log('isMulti', isMulti);
      console.log('currentProject', currentProject);

      if (currentProject[0].stakeHolders.includes(stakeholder._id)) {
        console.log('exist in proejct');
        props.enqueueSnackbar('This StakeHolder was already added to current project.', { variant: 'warning' })
        closeAgreedToAddModal();
      } else {
        currentProject[0].stakeHolders.push(stakeholder._id);
        const params = {
          project: currentProject[0]
        };
        Meteor.call('projects.update', params, (error, result) => {
          if (error) {
            props.enqueueSnackbar(err.reason, { variant: 'error' })
          } else {
            props.enqueueSnackbar('StakeHolder Added Successful.', { variant: 'success' });
            closeAgreedToAddModal();
            setOpen(false);
          }
        })
      }
    }
  };


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
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        ADD/IMPORT
      </Button>
      <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open} maxWidth="md" fullWidth={true}
        classes={{ paper: classes.dialogPaper }}>
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          Add/Import Stakeholders
        </DialogTitle>
        <DialogContent dividers>
          <AppBar position="static" color="default">
            <Tabs
              value={value}
              onChange={handleChangeValue}
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
              aria-label="full width tabs example"
            >
              <Tab label="INDIVIDUAL" {...a11yProps(0)} />
              <Tab label="MULTIPLE VIA CSV" {...a11yProps(1)} />
            </Tabs>
          </AppBar>
          <SwipeableViews
            index={value}
            onChangeIndex={handleChangeIndex}
          >
            <form onSubmit={onSubmit}>
              <TabPanel value={value} index={0}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      autoFocus
                      // margin="dense"
                      id="firstName"
                      label="First Name"
                      value={firstName}
                      onChange={(e) => {
                        setFirstName(e.target.value)
                      }}
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
                      onChange={(e) => {
                        setLastName(e.target.value)
                      }}
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
                      onChange={(e) => {
                        setRole(e.target.value)
                      }}
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
                      onChange={(e) => {
                        setBusinessUnit(e.target.value)
                      }}
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
                      onChange={(e) => {
                        setNotes(e.target.value)
                      }}
                      type="text"
                      fullWidth={true}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl className={classes.formControl} fullWidth={true}>
                      <InputLabel htmlFor="demo-controlled-open-select">Level Of Support</InputLabel>
                      <Select
                        id="role"
                        label="role"
                        fullWidth={true}
                        open={selectOpen}
                        onClose={handleSelectClose}
                        onOpen={handleSelectOpen}
                        value={supportLevel}
                        onChange={(e) => {
                          setSupportLevel(e.target.value)
                        }}
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
                    <br />
                    <br />
                    <br />
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl className={classes.formControl} fullWidth={true}>
                      <InputLabel htmlFor="demo-controlled-open-select">Level Of Influence</InputLabel>
                      <Select
                        id="role"
                        label="role"
                        fullWidth={true}
                        open={selectOpen1}
                        onClose={handleSelectClose1}
                        onOpen={handleSelectOpen1}
                        value={influenceLevel}
                        onChange={(e) => {
                          setInfluenceLevel(e.target.value)
                        }}
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
                    <br />
                    <br />
                    <br />
                  </Grid>

                </Grid>
                <Divider />
                <DialogActions>

                  <Button onClick={handleClose} color="secondary">
                    Cancel
                  </Button>
                  <Button color="primary" type="submit">
                    Save
                  </Button>
                </DialogActions>
              </TabPanel>
            </form>
            <TabPanel value={value} index={1}>
              <div className="App">
                <input
                  accept="/csv/*"
                  className={classes.input}
                  style={{ display: 'none' }}
                  ref={input => {
                    this.filesInput = input;
                  }}
                  id="raised-button-file"
                  type="file"
                  name="file"
                  placeholder={null}
                  onChange={handleChangecsv}
                />
                <label htmlFor="raised-button-file">
                  <Button variant="raised" component="span" className={classes.button}>
                    Choose File
                  </Button>
                  <Typography variant="h6">
                    &nbsp;&nbsp;{csvfile && csvfile.name}
                  </Typography>

                </label>
                <p />
                <Button onClick={importCSV} disabled={loading} color="primary" variant="contained"> Upload </Button>
              </div>
            </TabPanel>
          </SwipeableViews>
        </DialogContent>
      </Dialog>
      <AddStakeHoldersResults tableData={tableData} showModalDialog={openResultTable}
        closeModalDialog={() => setOpenResultTable(false)} />
      <AddExistingStakeholder showModalDialog={agreedToAddModal}
        stakeholder={stakeholder}
        closeModalDialog={() => setAgreedToAddModal(false)}
        handleSave={() => addExistingStakeholder(false)} />
      <AddExistingStakeholder showModalDialog={addConfirmation}
        isMulti={true}
        stakeholder={stakeholder}
        closeModalDialog={() => setAddConfirmation(false)}
        handleSave={() => addExistingStakeholder(true)} />
    </div>
  );
}

const AddStakeHolderPage = withTracker(props => {
  const { email } = props;
  Meteor.subscribe('peoples', { email });
  return {
    people: Peoples.find({ email }).fetch(),
    company: Companies.findOne(),
  };
})(withRouter(AddStakeHolder));

export default withSnackbar(AddStakeHolderPage)