import React, {useEffect} from "react";
import {withStyles, makeStyles} from '@material-ui/core/styles';
import {withRouter} from 'react-router';
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
import {withSnackbar} from 'notistack';
import 'date-fns';
import Grid from "@material-ui/core/Grid/Grid";
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import {withTracker} from "meteor/react-meteor-data";
import {Companies} from "/imports/api/companies/companies";
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import {useTheme} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import {Peoples} from '../../../../api/peoples/peoples';
import AddExistingStakeholder from "./AddExistingStakeholder";
import {Projects} from '../../../../api/projects/projects'
import AddStakeHoldersResults from "./AddStakeholdersResults";
import {Templates} from "../../../../api/templates/templates";

function TabPanel(props) {
  const {children, value, index, ...other} = props;

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
  menuItem: {
    color: 'lightgray',
  },
  sampleCsv: {
    marginLeft: '50px',
    marginBottom: 20,
    textDecoration: 'none',
    color: '#303f9f',
  },
  uploadButton: {
    width: 200,
    marginBottom: 20,
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
  const [supportLevel, setSupportLevel] = React.useState(0);
  const [influenceLevel, setInfluenceLevel] = React.useState(0);
  const [selectOpen, setSelectOpen] = React.useState(false);
  const [selectOpen1, setSelectOpen1] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(0);
  const [csvfile, setCsvfile] = React.useState(undefined);
  const [loading, setLoading] = React.useState(true);
  const [notes, setNotes] = React.useState('');
  const [agreedToAddModal, setAgreedToAddModal] = React.useState(false);
  const theme = useTheme();
  const [stakeholder, setNewStakeholder] = React.useState(null);
  const [addConfirmation, setAddConfirmation] = React.useState(false);
  const [stakeHolderId, setStakeHolderId] = React.useState();
  const [stakeholdersToBoth, setStakeholdersToBoth] = React.useState([]);
  const [tableData, setTableData] = React.useState({
    new: [],
    attached: [],
  });
  const [openResultTable, setOpenResultTable] = React.useState(false);

  let {company, type, projectId, templateId, project, template} = props;
  let both = false;

  const classes = useStyles();

  const handleClickOpen = () => {
    setFirstName('');
    setLastName('');
    setRole('');
    setBusinessUnit('');
    setEmail('');
    setSupportLevel(0);
    setInfluenceLevel(0);
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
    const allPeoples = Peoples.find({}).fetch();
    const checkAllPeoples = allPeoples.find(people => people.email === stakeholderEmail);
    const newStakeholder = Peoples.findOne({email: stakeholderEmail, company: project.companyId});
    if (checkAllPeoples && newStakeholder) {
      setNewStakeholder({...newStakeholder});
      if (newStakeholder) {
        setAgreedToAddModal(true);
      }
    }
    if (checkAllPeoples && !newStakeholder) {
      props.enqueueSnackbar(`This Stakeholder already exists in another company`, {variant: 'warning'});
    }
  };

  const closeAgreedToAddModal = () => {
    setAgreedToAddModal(false);
  };

  const handleChangecsv = event => {
    let file = event.target.files[0];
    setLoading(false);
    let ext;
    try {
      ext = file.name.match(/\.([^\.]+)$/)[1];
    } catch (e) {
      props.enqueueSnackbar(`Unsupported file type. CSV only.`, {variant: 'error'});
      setCsvfile(undefined);
      return false;
    }

    switch (ext) {
      case 'csv':
        setCsvfile(event.target.files[0]);
        break;
      default:
        props.enqueueSnackbar(`Unsupported file type (${ext}). CSV only.`, {variant: 'error'});
        setCsvfile(undefined);
    }

  };

  const updateData = (result) => {
    var data = result.data;
    if (!(data && data.length)) {
      props.enqueueSnackbar('No Valid Data Found', {variant: 'error'});
      return false;
    }

    let csvUploadErrorMessage = '';

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
        // company: project.companyId,
      };
      doc['Level of Influence'] && (paramsObj.influenceLevel = Number(doc['Level of Influence']));
      doc['Level of support'] && (paramsObj.supportLevel = Number(doc['Level of support']));
      return paramsObj
    });


    const importedEmails = data1.map(csvRow => csvRow.email) || [];

    if (importedEmails.length && (project.companyId || template)) {
      let peoples = {};
      let currentProject = {};
      if (type === 'project') {
        peoples = Peoples.find({
          company: project.companyId
        }).fetch();
      } else if (type === 'template') {
        peoples = Peoples.find({
          company: template.companyId || ''
        }).fetch();
      }

      const allPeoples = Peoples.find({}).fetch();
      const peoplesEmails = peoples.map(people => people.email);

      if (type === 'project') {
        currentProject = Projects.findOne({_id: projectId});
        delete currentProject.peoplesDetails;
        delete currentProject.changeManagerDetails;
        delete currentProject.managerDetails;
      } else if (type === 'template') {
        currentProject = Templates.findOne({_id: templateId});
      }

      const addToProject = peoples.filter(people => (importedEmails.includes(people.email) && !currentProject.stakeHolders.includes(people._id)));

      const addToBoth = data1.filter(({email}) => !peoplesEmails.includes(email))
        .filter(people => {
          return allPeoples.find((_people) => _people.email === people.email) === undefined
        });

      let tempTableDate = {attached: [], new: []};

      currentProject.stakeHolders = [...currentProject.stakeHolders, ...addToProject.map(people => people._id)];
      setStakeHolderId(currentProject);

      if (!csvUploadErrorMessage) {
        if (addToProject.length && !addToBoth.length) {
          tempTableDate = {...tempTableDate, attached: addToProject};
          setTableData(tempTableDate);
          setAddConfirmation(true);
        }
        if (addToBoth.length && !addToProject.length) {
          tempTableDate = {...tempTableDate, new: addToBoth};
          setTableData(tempTableDate);
          insertManyStakeholders({peoples: addToBoth}, tempTableDate);
        }
        if (addToProject.length && addToBoth.length) {
          tempTableDate = {...tempTableDate, attached: addToProject, new: addToBoth};
          setTableData(tempTableDate);
          setStakeholdersToBoth(addToBoth);
          setAddConfirmation(true);
        }

        if (!addToBoth.length && !addToProject.length) {
          props.enqueueSnackbar(`Nothing to add from this file.`, {variant: 'warning'});
          setLoading(false);
        }
      }
    }

    if (csvUploadErrorMessage) {
      props.enqueueSnackbar(`Upload Failed! ${csvUploadErrorMessage}`, {variant: 'error'});
      return false
    }
  };

  const insertManyStakeholders = (params, tempTableDate = {}) => {
    if (type === 'project') {
      params.peoples.map(people => {
        return people['projectId'] = projectId
      });
      params.peoples.map(people => {
        return people['company'] = project.companyId
      });
    } else if (type === 'template') {
      params.peoples.map(people => {
        return people['templateId'] = templateId
      });
      params.peoples.map(people => {
        return people['company'] = template && template.companyId || ''
      });
    }
    Meteor.call('peoples.insertMany', params, (err, res) => {
      setLoading(true);
      if (err) {
        props.enqueueSnackbar(`Upload Aborted! ${err.reason}`, {variant: 'error'})
      } else {
        setOpen(false);
        setCsvfile(null);
        if (tempTableDate.attached && !tempTableDate.attached.length) {
          setOpenResultTable(true);
          props.enqueueSnackbar('StakeHolders Added Successfully.', {variant: 'success'});
        }
      }
    });
  };

  const importCSV = () => {
    if (!csvfile) {
      props.enqueueSnackbar('No File Selected', {variant: 'error'});
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
    const allPeoples = Peoples.find({}).fetch();
    const checkAllPeoples = allPeoples.find(people => people.email === email);
    const newStakeholder = Peoples.findOne({email, company: project.companyId});
    if (checkAllPeoples && newStakeholder) {
      setNewStakeholder({...newStakeholder});
      if (newStakeholder) {
        setAgreedToAddModal(true);
      }
    } else if (checkAllPeoples && !newStakeholder) {
      props.enqueueSnackbar(`This Stakeholder already exists in another company`, {variant: 'warning'});
    } else {
      let params = {
        people: {
          firstName,
          lastName,
          role,
          businessUnit,
          email,
          notes,
          [type === 'project' ? 'projectId' : 'templateId']: type === 'project' ? projectId : templateId,
          company: type === 'project' ? project.companyId : (template.companyId || '')
        }
      };
      project && project.companyId && (params.people.company = project.companyId);
      if (template && template.companyId) {
        params.people.company = template.companyId
      } else if (!project && template && !template.companyId) {
        params.people.company = '';
      }
      influenceLevel && (params.people.influenceLevel = influenceLevel);
      supportLevel && (params.people.supportLevel = supportLevel);
      Meteor.call('peoples.insert', params, (err, res) => {
        if (err) {
          props.enqueueSnackbar(err.reason, {variant: 'error'})
        } else {
          setOpen(false);
          props.enqueueSnackbar('Stakeholder Added Successfully.', {variant: 'success'})
        }
      })
    }
  };

  const addExistingStakeholder = (isMulti = false) => {
    if (isMulti) {
      let params = {};
      let methodName = '';
      if (type === 'project') {
        params = {
          project: stakeHolderId,
        };
        methodName = 'projects.update';
      } else if (type === 'template') {
        params = {
          template: stakeHolderId,
        };
        methodName = 'templates.update';
      }
      Meteor.call(methodName, params, (error, result) => {
        if (error) {
          props.enqueueSnackbar(err.reason, {variant: 'error'})
        } else {
          insertManyStakeholders({peoples: stakeholdersToBoth});
          props.enqueueSnackbar('Stakeholder Added Successful.', {variant: 'success'});
          setAddConfirmation(false);
          setOpen(false);
          setOpenResultTable(true);
        }
      });
    } else {
      if (type === 'project') {
        const currentProject = Projects.findOne({_id: projectId});

        delete currentProject.peoplesDetails;
        delete currentProject.changeManagerDetails;
        delete currentProject.managerDetails;

        if (currentProject.stakeHolders.includes(stakeholder._id)) {
          props.enqueueSnackbar('This Stakeholder was already added to current project.', {variant: 'warning'})
          closeAgreedToAddModal();
        } else {
          currentProject.stakeHolders.push(stakeholder._id);
          const params = {
            project: currentProject
          };
          Meteor.call('projects.update', params, (error, result) => {
            if (error) {
              props.enqueueSnackbar(err.reason, {variant: 'error'})
            } else {
              props.enqueueSnackbar('Stakeholder Added Successful.', {variant: 'success'});
              closeAgreedToAddModal();
              setOpen(false);
            }
          })
        }
      } else if (type === 'template') {
        const currentTemplate = Templates.findOne({_id: templateId});
        if (currentTemplate.stakeHolders.includes(stakeholder._id)) {
          props.enqueueSnackbar('This Stakeholder was already added to current project.', {variant: 'warning'})
          closeAgreedToAddModal();
        } else {
          currentTemplate.stakeHolders.push(stakeholder._id);
          const params = {
            template: currentTemplate
          };
          Meteor.call('templates.update', params, (error, result) => {
            if (error) {
              props.enqueueSnackbar(err.reason, {variant: 'error'})
            } else {
              props.enqueueSnackbar('Stakeholder Added Successful.', {variant: 'success'});
              closeAgreedToAddModal();
              setOpen(false);
            }
          });
        }
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
              classes={{paper: classes.dialogPaper}}>
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
                      id="email"
                      label="Email"
                      value={email}
                      onChange={handleEmailChange}
                      required={true}
                      type="email"
                      fullWidth={true}
                    />
                  </Grid>
                  <Grid item xs={6}/>
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
                        className={influenceLevel === 0 && classes.menuItem}
                      >
                        <MenuItem value={0}>Select</MenuItem>
                        <MenuItem value={1}>1 = Very low level of support</MenuItem>
                        <MenuItem value={2}>2 = Low level of support</MenuItem>
                        <MenuItem value={3}>3 = Moderate level of support</MenuItem>
                        <MenuItem value={4}>4 = High level of support</MenuItem>
                        <MenuItem value={5}>5 = Engaged and supportive</MenuItem>
                      </Select>
                    </FormControl>
                    <br/>
                    <br/>
                    <br/>
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
                        className={influenceLevel === 0 && classes.menuItem}
                      >
                        <MenuItem value={0}>Select</MenuItem>
                        <MenuItem value={1}>1 = Little influence over outcomes</MenuItem>
                        <MenuItem value={2}>2 = Some influence over outcomes</MenuItem>
                        <MenuItem value={3}>3 = Moderate influence over outcomes</MenuItem>
                        <MenuItem value={4}>4 = Major influence over outcomes</MenuItem>
                        <MenuItem value={5}>5 = Project will not succeed without their support</MenuItem>
                      </Select>
                    </FormControl>
                    <br/>
                    <br/>
                    <br/>
                  </Grid>
                </Grid>
                <Divider/>
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
                  style={{display: 'none'}}
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
                  <Button color="primary"
                          variant="outlined" component="span" className={classes.uploadButton}>
                    Choose File
                  </Button>
                  <a href="/branding/stakeholder_list.csv" download="stakeholder_list.csv"
                     className={classes.sampleCsv}>Template.csv</a>
                  <Typography variant="h6">
                    &nbsp;&nbsp;{csvfile && csvfile.name}
                  </Typography>

                </label>
                <p/>
                <Button onClick={importCSV} disabled={loading} color="primary" variant="contained" className={classes.uploadButton}> Upload </Button>
              </div>
            </TabPanel>
          </SwipeableViews>
        </DialogContent>
      </Dialog>
      <AddStakeHoldersResults tableData={tableData} showModalDialog={openResultTable}
                              closeModalDialog={() => setOpenResultTable(false)}/>
      <AddExistingStakeholder showModalDialog={agreedToAddModal}
                              stakeholder={stakeholder} count={{}}
                              closeModalDialog={() => setAgreedToAddModal(false)}
                              handleSave={() => addExistingStakeholder(false)}/>
      <AddExistingStakeholder showModalDialog={addConfirmation}
                              isMulti={true} count={tableData}
                              stakeholder={stakeholder}
                              closeModalDialog={() => setAddConfirmation(false)}
                              handleSave={() => addExistingStakeholder(true)}/>
    </div>
  );
}

const AddStakeHolderPage = withTracker(props => {
  const {email, project} = props;
  Meteor.subscribe('findByEmail', email);
  Meteor.subscribe('findAllPeoples');
  Meteor.subscribe('peoples', project.companyId);
  return {
    people: Peoples.find({email}).fetch(),
  };
})(withRouter(AddStakeHolder));

export default withSnackbar(AddStakeHolderPage)