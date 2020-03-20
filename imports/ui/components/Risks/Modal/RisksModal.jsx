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
import {withSnackbar} from 'notistack';
import 'date-fns';
import moment from 'moment';
import Grid from "@material-ui/core/Grid/Grid";
import SaveChanges from "../../Modals/SaveChanges";
import {withTracker} from "meteor/react-meteor-data";
import {withRouter} from "react-router";
import {Projects} from "../../../../api/projects/projects";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import {DatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import TextField from "@material-ui/core/TextField";
import SelectActivities from "../../Impacts/Modals/SelectActivities/SelectActivities";
import Table from "@material-ui/core/Table";
import {TableCell, TableHead, TableRow} from "@material-ui/core";
import {getPhase} from "../../../../utils/utils";
import {Activities} from "../../../../api/activities/activities";
import AutoComplete from "../../utilityComponents/AutoCompleteInline";
import AddNewPerson from "../../Activities/Modals/AddNewPerson";
import TableBody from "@material-ui/core/TableBody";

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
  createNewRisk: {
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
  datePicker: {
    display: 'flex',
    alignItems: 'center',
    paddingTop: '22px'
  },
  input: {
    backgroundColor: '#f5f5f5',
    border: '1px solid #f5f5f5',
    borderRadius: '4px',
  },
  containerStakeholders: {
    padding: '8px',
  },
  buttonActivities: {
    padding: '0px',
    '&:hover': {
      backgroundColor: '#ffffff',
      borderColor: '#ffffff',
      boxShadow: 'none',
    },
    '&:active': {
      boxShadow: 'none',
      backgroundColor: '#ffffff',
      borderColor: '#fffff',
    },
  },
  buttonContainer: {
    textAlign: 'right',
    paddingRight: '20px',
  },
  formControl: {},
  gridSelect: {
    paddingRight: '20px'
  },
  gridTextField: {
    paddingRight: '20px',
    paddingTop: '14px'
  }
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

function AddRisk(props) {
  let {
    open, handleModalClose, isNew, company, projectId, risk, project, isActivityOwner, isActivityDeliverer,
    isSuperAdmin, isAdmin, isChangeManager, isManager, match, allActivities, currentChangeManager
  } = props;
  const classes = useStyles();
  const template = {};
  const [showModalDialog, setShowModalDialog] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');
  const [raisedDate, setRaisedDate] = useState(new Date());
  const [description, setDescription] = useState('');
  const [probability, setProbability] = useState('');
  const [impact, setImpact] = useState('');
  const [rating, setRating] = useState('');
  const [activities, setActivities] = useState([]);
  const [showActivities, setShowActivities] = useState(false);
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [residualRating, setResidualRating] = useState('');
  const [residualImpact, setResidualImpact] = useState('');
  const [residualProbability, setResidualProbability] = useState('');
  const [users, setUsers] = useState([]);
  const [changeManager, setChangeManager] = useState(currentChangeManager);
  const [owner, setOwner] = useState(null);
  const [comments, setComments] = useState('');
  const disabled = (isManager && !isSuperAdmin && !isChangeManager && !isAdmin);

  useEffect(() => {
    if (!isNew && risk && allActivities) {
      setCategory(risk.category);
      setStatus(risk.status);
      setRaisedDate(risk.raisedDate);
      setDescription(risk.description);
      setProbability(risk.probability);
      setImpact(risk.impact);
      setRating(risk.rating);
      setActivities(risk.activities);
      setSelectedActivities(risk.activities);
      setResidualImpact(risk.residualImpact);
      setResidualProbability(risk.residualProbability);
      setResidualRating(risk.residualRating);
      setComments(risk.comments);
      setOwner(risk.owner);
      updateActivities(risk.activities);
      updateUsersList();
    } else if (isNew) {
      resetValues();
      updateUsersList();
      getProjectManager();
    }
  }, [risk, isNew]);

  const resetValues = () => {
    if (isNew) {
      setCategory('');
      setStatus('');
      setRaisedDate(new Date());
      setDescription('');
      setProbability('');
      setImpact('');
      setRating('');
      setActivities([]);
      setSelectedActivities([]);
      setResidualImpact('');
      setResidualProbability('');
      setResidualRating('');
      setComments('')
      setUsers([]);
      setOwner(null);
    }
  };

  const handleClose = () => {
    handleModalClose();
    resetValues();
    setIsUpdated(false);
  };

  const handleOpenModalDialog = () => {
    if (isUpdated) {
      handleModalClose();
      resetValues();
    }
  };

  const closeModalDialog = () => {
    setShowModalDialog(false);
  };


  const createRisk = () => {
    if (!(category || raisedDate || description || probability || impact || residualImpact || residualProbability)) { ////////////////////////////////!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      props.enqueueSnackbar('Please fill the required Field', {variant: 'error'});
      return false;
    }
    let methodName = 'risks.insert';
    let params = {
      risk: {
        projectId: projectId,
        status: status,
        category: category,
        raisedDate: raisedDate,
        description: description,
        probability: probability,
        impact: impact,
        rating: rating,
        activities: selectedActivities,
        residualProbability: residualProbability,
        residualImpact: residualImpact,
        residualRating: residualRating,
        owner: owner && owner.value,
        comments: comments,
      }
    };

    if (!isNew) {
      methodName = 'risks.update';
      params.risk._id = risk._id;
    }
    Meteor.call(methodName, params, (err, res) => {
      if (err) {
        props.enqueueSnackbar(err.reason, {variant: 'error'})
      } else {
        resetValues();
        handleClose();
        props.enqueueSnackbar(isNew ? 'Risk Saving Successfully' : 'Risk Updating Successfully', {variant: 'success'})
      }
    })
  };

  const handleChangeCategory = (e) => {
    setCategory(e.target.value);
  };

  const onCalendarClick = (id) => {
    document.getElementById(id).click();
  };

  const handleChangeRaisedDate = (date) => {
    setRaisedDate(date);
  };

  const handleChangeDescription = (e) => {
    setDescription(e.target.value)
  };

  const handleChangeProbability = (e) => {
    setProbability(e.target.value)
  };

  const handleChangeImpact = (e) => {
    setImpact(e.target.value)
  };

  const handleShowActivities = () => {
    setShowActivities(true);
  };

  const handleCloseActivities = () => {
    setShowActivities(false);
  };

  const handleSelectActivities = (newSelectedActivities) => {
    setSelectedActivities(newSelectedActivities);
    updateActivities(newSelectedActivities);
  };

  const updateActivities = (newSelectedActivities) => {
    const newActivities = [];
    newSelectedActivities.forEach(_activity => {
      const newActivity = allActivities.find(activity => activity._id === _activity);
      newActivities.push(newActivity);
    });
    setActivities(newActivities);
  };

  const handleChangeResidualProbability = (e) => {
    setResidualProbability(e.target.value);
  };

  const handleChangeResidualImpact = (e) => {
    setResidualImpact(e.target.value);
  };

  const getProjectManager = () => {
    const curProject = Projects.find({_id: projectId}).fetch()[0];
    if (curProject) {
      if (curProject.changeManagers) {
        const newChangeManager = users.find(user => curProject.changeManagers.includes(user.value));
        setChangeManager(newChangeManager);
        setOwner(newChangeManager);
      }
    }
  };

  const updateUsersList = () => {
    Meteor.call(`users.getAllUsersInCompany`, {company: company}, (err, res) => {
      if (err) {
        props.enqueueSnackbar(err.reason, {variant: 'error'});
      }
      if (res && res.length) {
        setUsers(res.map(user => {
          return {
            label: `${user.profile.firstName} ${user.profile.lastName}`,
            firstName: user.profile.firstName,
            value: user._id,
            role: user.roles,
            email: user.emails
          }
        }))
      } else {
        setUsers([])
      }
    })
  };

  const updateOwner = (value) => {
    console.log('-value--', value);
    setOwner(value);
  };

  const handleChangeComments = (e) => {
    setComments(e.target.value);
  };

  const handleChangeStatus = (e) => {
    setStatus(e.target.value)
  };

  useEffect(() => {
    const totalRating = getRating(probability, impact);
    setRating(totalRating);
  }, [probability, impact]);

  useEffect(() => {
    const totalRating = getRating(residualProbability, residualImpact);
    setResidualRating(totalRating);
  }, [residualProbability, residualImpact]);

  const getRating = (probability, impact) => {
    let rating = 'Low';
    switch (impact) {
      case 'Insignificant':
        if (probability === 'Almost Certain (96-100%)' || probability === 'Likely (66-95%)') {
          rating = 'Medium'
        }
        break;
      case 'Minor':
        if (probability === 'Almost certain (96-100%)') {
          rating = 'High';
        }
        if (probability === 'Likely (66-95%)' || probability === 'Possible (36-65%)') {
          rating = 'Medium';
        }
        break;
      case 'Moderate':
        if (probability === 'Almost Certain (96-100%)' || probability === 'Likely (66-95%)') {
          rating = 'High';
        }
        if (probability === 'Possible (36-65%)' || probability === 'Unlikely (6-35%)') {
          rating = 'Medium';
        }
        break;
      case 'Major':
        if (probability === 'Almost certain (96-100%)') {
          rating = 'Extreme'
        }
        if (probability === 'Likely (66-95%)' || probability === 'Possible (36-65%)') {
          rating = 'High'
        }
        if (probability === 'Unlikely (6-35%)' || probability === 'Rare (1-5%)') {
          rating = 'Medium'
        }
        break;
      case 'Catastrophic':
        if (probability === 'Almost Certain (96-100%)' || probability === 'Likely (66-95%)') {
          rating = 'Extreme'
        }
        if (probability === 'Possible (36-65%)' || probability === 'Unlikely (6-35%)') {
          rating = 'High'
        }
        if (probability === 'Rare (1-5%)') {
          rating = 'Medium'
        }
        break;
      default:
        break;
    }
    return !impact || !probability ? '' : rating;

  };

  return (
    <div className={classes.createNewRisk}>
      <Dialog onClose={isUpdated ? handleOpenModalDialog : handleClose} aria-labelledby="customized-dialog-title"
              open={open} maxWidth="md" fullWidth={true}>
        <DialogTitle id="customized-dialog-title" onClose={isUpdated ? handleOpenModalDialog : handleClose}>
          Risk
        </DialogTitle>
        <DialogContent dividers>
          <Grid container direction={"row"} alignItems={'center'} justify={'flex-start'}>
            <Grid item xs={2}>
              <FormControl className={classes.formControl} fullWidth={true}>
                <InputLabel id={'select-status'}
                            required={true}>Status</InputLabel>
                <Select
                  id="select-status"
                  label="Status"
                  fullWidth={true}
                  disabled={disabled}
                  value={status}
                  onChange={handleChangeStatus}
                >
                  {['Open', 'Closed'].map((status, index) => {
                    return <MenuItem value={status} key={index}>{status}</MenuItem>
                  })
                  }
                </Select>
              </FormControl>
            </Grid>
            <Grid container direction={"row"} alignItems={'center'} justify={'space-between'}>
              <Grid item xs={6} className={classes.gridSelect}>
                <FormControl className={classes.formControl} fullWidth={true}>
                  <InputLabel id={'select-category'}
                              required={true}>Category</InputLabel>
                  <Select
                    id="select-category"
                    label="Category"
                    fullWidth={true}
                    disabled={disabled}
                    value={category}
                    onChange={handleChangeCategory}
                  >
                    {['Operational', 'Financial and Prudential', 'Leadership, Culture and Values', 'People',
                      'Information Technology', 'Corporate Governance, Legal amd compliance',
                      'External Stakeholders and environment'].map((category, index) => {
                      return <MenuItem value={category} key={index}>{category}</MenuItem>
                    })
                    }
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <Grid item xs={12} className={classes.datePicker}>
                    <Grid item xs={10}>
                      <DatePicker
                        disableToolbar
                        fullWidth
                        variant="inline"
                        margin="normal"
                        id="date-picker-dialog"
                        disabled={disabled}
                        label="Date raised*"
                        format="MM/dd/yyyy"
                        value={raisedDate}
                        autoOk={true}
                        onChange={handleChangeRaisedDate}
                      />
                    </Grid>
                    <Grid item xs={2}>
                      <IconButton aria-label="close" className={classes.closeButton}
                                  disabled={disabled}
                                  onClick={() => onCalendarClick("date-picker-dialog")}>
                        <CalendarTodayIcon/>
                      </IconButton>
                    </Grid>
                  </Grid>
                </MuiPickersUtilsProvider>
                <br/>
                <br/>
              </Grid>
            </Grid>

            <Grid item xs={12} className={classes.gridSelect}>
              <TextField
                value={description}
                multiline
                placeholder="Description*"
                onChange={handleChangeDescription}
                type="text"
                fullWidth
                className={classes.input}
              />
              <br/>
              <br/>
              <br/>
            </Grid>
            <Grid item xs={12}>
              <Typography variant={"h6"}>Inherent Risk</Typography>
            </Grid>
            <Grid container direction={"row"} alignItems={'center'} justify={'space-between'}>
              <Grid item xs={4} className={classes.gridSelect}>
                <FormControl className={classes.formControl} fullWidth={true}>
                  <InputLabel id={'select-probability'}
                              required={true}>Inherent Probability</InputLabel>
                  <Select
                    id="select-probability"
                    label="Probability"
                    fullWidth={true}
                    disabled={disabled}
                    value={probability}
                    onChange={handleChangeProbability}
                  >
                    {['Rare (1-5%)', 'Unlikely (6-35%)', 'Possible (36-65%)', 'Likely (66-95%)',
                      'Almost Certain (96-100%)'].map((probability, index) => {
                      return <MenuItem value={probability} key={index}>{probability}</MenuItem>
                    })
                    }
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={4} className={classes.gridSelect}>
                <FormControl className={classes.formControl} fullWidth={true}>
                  <InputLabel id={'select-impact'}
                              required={true}>Inherent Impact</InputLabel>
                  <Select
                    id="select-impact"
                    label="Impact"
                    fullWidth={true}
                    disabled={disabled}
                    value={impact}
                    onChange={handleChangeImpact}
                  >
                    {['Insignificant', 'Minor', 'Moderate', 'Major',
                      'Catastrophic'].map((impact, index) => {
                      return <MenuItem value={impact} key={index}>{impact}</MenuItem>
                    })
                    }
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={4} className={classes.gridTextField}>
                <TextField
                  value={rating}
                  multiline
                  disabled={true}
                  placeholder="Inherent Risk Rating*"
                  type="text"
                  fullWidth
                  className={classes.input}
                />
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <br/>
              <br/>
              <br/>
              <Typography variant={"h6"}>Mitigating activities</Typography>
            </Grid>
            <Grid item xs={12} className={classes.buttonContainer}>
              <Button color="primary" className={classes.buttonActivities} onClick={handleShowActivities}>
                Select Activities
              </Button>
              <SelectActivities handleClose={handleCloseActivities} handleChange={handleSelectActivities}
                                company={company} projectId={projectId} project={project} template={template}
                                isSuperAdmin={isSuperAdmin} isAdmin={isAdmin} match={match} isOneImpact={true}
                                isChangeManager={isChangeManager} isManager={isManager} isOneCreate={false}
                                open={showActivities} activities={allActivities}
                                selectedActivities={selectedActivities}/>
            </Grid>
            <Grid item xs={12} className={classes.gridSelect}>
              <Table size={"small"}>
                <TableHead>
                  <TableRow>
                    <TableCell align={"left"}>Date Due/Completed</TableCell>
                    <TableCell align={"left"}>Type</TableCell>
                    <TableCell align={"left"}>Phase</TableCell>
                    <TableCell align={"left"}>Time away from BAU</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {activities.map((activity, index) => {
                    return <TableRow key={index}>
                      <TableCell>{activity && activity.completedAt && moment(activity.completedAt).format('MM-DD-YYYY')
                      || activity && activity.dueDate && moment(activity.dueDate).format('MM-DD-YYYY')}</TableCell>
                      <TableCell>{activity && activity.name}</TableCell>
                      <TableCell>{activity && company && getPhase(activity.step, company)}</TableCell>
                      <TableCell>{activity && activity.time}</TableCell>
                    </TableRow>
                  })}
                </TableBody>
              </Table>
            </Grid>


            <Grid item xs={12}>
              <br/>
              <br/>
              <br/>
              <Typography variant={"h6"}>Residual Risk</Typography>
            </Grid>
            <Grid container direction={"row"} alignItems={'center'} justify={'space-between'}>
              <Grid item xs={4} className={classes.gridSelect}>
                <FormControl className={classes.formControl} fullWidth={true}>
                  <InputLabel id={'select-residual-probability'}
                              required={true}>Residual Probability</InputLabel>
                  <Select
                    id="select-residual-probability"
                    label="Residual probability"
                    fullWidth={true}
                    disabled={disabled}
                    value={residualProbability}
                    onChange={handleChangeResidualProbability}
                  >
                    {['Rare (1-5%)', 'Unlikely (6-35%)', 'Possible (36-65%)', 'Likely (66-95%)',
                      'Almost Certain (96-100%)'].map((residualProbability, index) => {
                      return <MenuItem value={residualProbability} key={index}>{residualProbability}</MenuItem>
                    })
                    }
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={4} className={classes.gridSelect}>
                <FormControl className={classes.formControl} fullWidth={true}>
                  <InputLabel id={'select-residual-impact'}
                              required={true}>Residual Impact</InputLabel>
                  <Select
                    id="select-residual-impact"
                    label="Residual Impact"
                    fullWidth={true}
                    disabled={disabled}
                    value={residualImpact}
                    onChange={handleChangeResidualImpact}
                  >
                    {['Insignificant', 'Minor', 'Moderate', 'Major',
                      'Catastrophic'].map((residualImpact, index) => {
                      return <MenuItem value={residualImpact} key={index}>{residualImpact}</MenuItem>
                    })
                    }
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={4} className={classes.gridTextField}>
                <TextField
                  value={residualRating}
                  multiline
                  disabled={true}
                  placeholder="Residual Risk Rating*"
                  type="text"
                  fullWidth
                  className={classes.input}
                />
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <br/>
              <br/>
              <br/>
              <Typography variant={"h6"}>Options</Typography>
            </Grid>
            <Grid item={true} xs={4}>
              <AutoComplete updateUsers={updateOwner} data={users} selectedValue={owner}
                            currentChangeManager={changeManager} isActivity={true} isManager={isManager}
                            isSuperAdmin={isSuperAdmin} isAdmin={isAdmin} isChangeManager={isChangeManager}
                            isActivityDeliverer={isActivityDeliverer} isActivityOwner={isActivityOwner}/>
            </Grid>
            <Grid item xs={3}>
              <Button variant="text" color="primary" className={classes.buttonAsLink}
                      disabled={true}>
                Notify/Remind by email
              </Button>
            </Grid>
            <Grid item xs={2}>
              <AddNewPerson company={company} isActivity={true} isManager={isManager}
                            isActivityDeliverer={isActivityDeliverer} isActivityOwner={isActivityOwner}
                            isSuperAdmin={isSuperAdmin} isAdmin={isAdmin} isChangeManager={isChangeManager}/>
            </Grid>
            <Grid item xs={12} className={classes.gridSelect}>
              <br/>
              <br/>
              <TextField
                value={comments}
                multiline
                placeholder="Comments"
                onChange={handleChangeComments}
                type="text"
                fullWidth
                className={classes.input}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={createRisk} disabled={disabled} color="primary">
            Save
          </Button>
        </DialogActions>
        <SaveChanges
          handleClose={handleClose}
          showModalDialog={showModalDialog}
          handleSave={createRisk}
          closeModalDialog={closeModalDialog}
        />
      </Dialog>
    </div>
  );
}

const AddRiskPage = withTracker(props => {
  let {match} = props;
  let {projectId} = match.params;
  Meteor.subscribe('compoundProject', projectId);
  Meteor.subscribe('compoundActivities', projectId);
  return {
    allActivities: Activities.find({projectId: projectId}).fetch(),
  };
})(withRouter(AddRisk));

export default withSnackbar(AddRiskPage)