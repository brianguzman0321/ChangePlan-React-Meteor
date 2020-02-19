import React, {useEffect, useState} from "react";
import {Impacts} from '../../../../api/impacts/impacts';
import {Projects} from '../../../../api/projects/projects';
import {Activities} from '../../../../api/activities/activities';
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
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import {withTracker} from "meteor/react-meteor-data";
import {Companies} from "/imports/api/companies/companies";
import SaveChanges from "../../Modals/SaveChanges";
import moment from "moment";
import {SurveysStakeholders} from "../../../../api/surveysStakeholders/surveysStakeholders";
import Input from "@material-ui/core/Input";
import Checkbox from "@material-ui/core/Checkbox";
import ListItemText from "@material-ui/core/ListItemText";
import Table from "@material-ui/core/Table";
import {TableCell, TableHead, TableRow} from "@material-ui/core";
import TableBody from "@material-ui/core/TableBody";
import {AdditionalStakeholderInfo} from "../../../../api/additionalStakeholderInfo/additionalStakeholderInfo";

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
  addStakeHolder: {
    background: '#92a1af',
    '&:hover': {
      background: '#92a1af'
    }
  },
  stakeholderDetails: {
    background: '#f4f5f7',
    '&:hover': {
      background: '#f4f5f7'
    }
  },
  columnHeadings: {
    color: '#465563',
    fontSize: '0.75rem',
    fontWeight: 500
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

function EditStakeHolder(props) {
  let {
    stakeholder, open, close, isAdmin, isSuperAdmin, isManager, isChangeManager, project, template, type, company,
    projectId, disabled, additionalInfo
  } = props;
  const [firstName, setFirstName] = React.useState(stakeholder.firstName || '');
  const [lastName, setLastName] = React.useState(stakeholder.lastName || '');
  const [jobTitle, setJobTitle] = React.useState(stakeholder.jobTitle ? stakeholder.jobTitle : stakeholder.role);
  const [businessUnit, setBusinessUnit] = React.useState(stakeholder.businessUnit);
  const [email, setEmail] = React.useState(stakeholder.email);
  const [supportLevel, setSupportLevel] = React.useState('');
  const [loI, setInfluenceLevel] = React.useState('');
  const [notes, setNotes] = React.useState('');
  const [impacts, setImpacts] = useState([]);
  const [roles, setRoles] = useState(stakeholder.roleTags || []);
  const roleTags = ['SME', 'Sponsor', 'Leader', 'Business', 'SteerCo', 'ExecCo', 'Change champion/Ambassador', 'Customer'];
  const [team, setTeam] = useState(stakeholder.team);
  const [customTag, setCustomTag] = React.useState('');
  const [showInput, setShowInput] = React.useState(false);
  const [location, setLocation] = useState(stakeholder.location);
  const [showModalDialog, setShowModalDialog] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);
  const [upcomingActivities, setUpcomingActivities] = useState([]);
  const [completedActivities, setCompletedActivities] = useState([]);
  const [stakeholderProjects, setStakeholderProjects] = useState(false);
  const [projects, setProjects] = useState([]);
  const [totalTimeAwayBAU, setTotalTimeAwayBAU] = useState(false);
  const [responseOnSurveys, setResponseOnSurveys] = useState([]);
  const [groupName, setGroupName] = useState(stakeholder.groupName || '');
  const [numberOfPeople, setNumberOfPeople] = useState(Number(stakeholder.numberOfPeople) || null);
  const classes = useStyles();

  const resetChanges = () => {
    setFirstName('');
    setLastName('');
    setJobTitle('');
    setBusinessUnit('');
    setLocation('');
    setTeam('');
    setEmail('');
    setRoles([]);
    setSupportLevel(0);
    setGroupName('');
    setNumberOfPeople(null);
    setInfluenceLevel(0);
    setNotes('');
  };

  useEffect(() => {
    if (roles) {
      const customRole = roles.filter(role =>
        !roleTags.some(tag => tag === role));
      if (customRole) {
        setCustomTag(customRole);
      }
    }
  }, [roles]);

  const fetchStakeholderData = () => {
    setFirstName(stakeholder.firstName || '');
    setLastName(stakeholder.lastName || '');
    setJobTitle(stakeholder.jobTitle ? stakeholder.jobTitle : stakeholder.role);
    setBusinessUnit(stakeholder.businessUnit);
    setLocation(stakeholder.location);
    setTeam(stakeholder.team);
    setRoles(stakeholder.roleTags || []);
    setEmail(stakeholder.email || '');
    setGroupName(stakeholder.groupName || '');
    let params = {
      activity: {
        stakeholderId: stakeholder._id
      }
    };
    Meteor.call('activities.getStakeholderActivities', params, (err, res) => {
      if (err) {
        props.enqueueSnackbar(err.reason, {variant: 'error'})
      } else {
        const allActivities = res.activities;
        allActivities.map(activity => {
          const activityProject = Projects.findOne({_id: activity.projectId});
          activity.projectName = activityProject.name;
        });
        setUpcomingActivities(allActivities.filter(activity => activity.completed === false));
        setCompletedActivities(allActivities.filter(activity => activity.completed === true));
        let totalTime = res.totalTime;
        totalTime = totalTime < 60 ? totalTime + " mins" : parseFloat(totalTime / 60).toFixed(2) + " hrs";
        setTotalTimeAwayBAU(totalTime);
      }
    });

    getLevelsInfo();
    getNotes();

    let projectPrams = {
      project: {
        stakeholderId: stakeholder._id
      }
    };

    Meteor.call('projects.getStakeholderProjects', projectPrams, (err, res) => {
      if (err) {
        props.enqueueSnackbar(err.reason, {variant: 'error'})
      } else {
        setStakeholderProjects(res);
      }
    });

    const surveys = SurveysStakeholders.find({stakeholderId: stakeholder._id}).fetch();
    surveys.map(survey => {
      const activity = Activities.findOne({_id: survey.activityId});
      const activityProject = Projects.findOne({_id: activity.projectId});
      survey.projectName = activityProject.name;
    });
    setResponseOnSurveys(surveys);

    const allImpacts = Impacts.find({stakeholders: {$in: [stakeholder._id]}}).fetch();
    allImpacts.map(impact => {
      const impactProject = Projects.findOne({_id: impact.projectId});
      impact.projectName = impactProject.name;
    });
    setImpacts(allImpacts);

    const allProjects = Projects.find({stakeHolders: {$in: [stakeholder._id]}}).fetch();
    setProjects(allProjects);
  };

  const getLevelsInfoForProject = (currentProjectId, isLevelOfSupport = false) => {
    const currentInfo = additionalInfo.find(info => info.projectId === currentProjectId && info.stakeholderId === stakeholder._id);
    if (currentInfo && isLevelOfSupport) {
      let levelOfSupport = currentInfo.levelOfSupport;
      return levelOfSupport;
    }
    if (currentInfo && !isLevelOfSupport) {
      let levelOfInfluence = currentInfo.levelOfInfluence;
      return levelOfInfluence;
    }
  };

  const getLevelsInfo = () => {
    const currentInfo = additionalInfo.find(info => info.projectId === projectId && info.stakeholderId === stakeholder._id);
    if (currentInfo) {
      setSupportLevel(currentInfo.levelOfSupport === 0 ? '' : currentInfo.levelOfSupport);
      setInfluenceLevel(currentInfo.levelOfInfluence === 0 ? '' : currentInfo.levelOfInfluence);
    }
  };

  const getNotes = () => {
    const currentInfo = additionalInfo.find(info => info.projectId === projectId && info.stakeholderId === stakeholder._id);
    if (!!currentInfo) {
      setNotes(currentInfo.notes || '')
    }
  };

  const handleClose = () => {
    setShowModalDialog(false);
    setIsUpdated(false);
    resetChanges();
    close();
  };

  const handleOpenModalDialog = () => {
    if (isUpdated) {
      setShowModalDialog(true);
    }
  };

  const closeModalDialog = () => {
    setShowModalDialog(false);
  };


  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setIsUpdated(true);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    let params = {
      people: {
        _id: stakeholder._id,
        location: location,
        businessUnit: businessUnit,
        team: team,
      }
    };
    if (firstName) {
      params.people.firstName = firstName;
      params.people.lastName = lastName;
      params.people.email = email;
      if (stakeholder.role) {
        params.people.role = jobTitle;
      } else {
        params.people.jobTitle = jobTitle;
      }
      params.people.roleTags = roles;
    }
    if (groupName) {
      params.people.groupName = groupName;
      params.people.numberOfPeople = Number(numberOfPeople);
    }
    Meteor.call('peoples.update', params, (err, res) => {
      if (err) {
        props.enqueueSnackbar(err.reason, {variant: 'error'})
      } else {
        const _additionalInfo = additionalInfo.find(info => info.projectId === projectId && info.stakeholderId === stakeholder._id);
        let methodName = 'additionalStakeholderInfo.insert';
        const paramsInfo = {
          additionalStakeholderInfo: {
            projectId: projectId,
            stakeholderId: stakeholder._id,
            levelOfSupport: supportLevel || 0,
            levelOfInfluence: loI || 0,
            notes: notes || '',
          }
        };
        if (!!_additionalInfo) {
          paramsInfo.additionalStakeholderInfo._id = _additionalInfo._id;
          methodName = 'additionalStakeholderInfo.update';
        }
        Meteor.call(methodName, paramsInfo, (err, res) => {
          if (err) {
            props.enqueueSnackbar(err.reason, {variant: 'error'});
          } else {
            handleClose();
            props.enqueueSnackbar('Stakeholder Updated Successfully.', {variant: 'success'})
          }
        });
      }
    })
  };

  const handleChangeSelect = (e) => {
    setRoles(e.target.value);
  };

  const handleChangeInput = (newCustom) => {
    const newRoles = roleTags.filter(tag => {
      !roles.some(role => tag === role)
    });
    newRoles.push(newCustom);
    setRoles(newRoles);
    setShowInput(false);
  };

  const selectPhase = (phase) => {
    switch (phase) {
      case 1:
        return '1';
      case 2:
        return '4';
      case 3:
        return '5';
      case 4:
        return '2';
      case 5:
        return '3';
      default:
        break;
    }
  };

  const getFeedbackReceived = (id) => {
    const response = responseOnSurveys.filter(response => response.activityId === id);
    if (response.length > 0) {
      return "Yes"
    } else {
      return "No"
    }
  };

  useEffect(() => {
    if (open) {
      fetchStakeholderData();
    }
  }, [open, stakeholder, additionalInfo]);

  return (
    <>
      <Dialog onClose={isUpdated ? handleOpenModalDialog : () => close()} aria-labelledby="customized-dialog-title"
              open={open} maxWidth="md" fullWidth={true}>
        <DialogTitle id="customized-dialog-title" onClose={isUpdated ? handleOpenModalDialog : () => close()}>
          Stakeholder details
        </DialogTitle>
        <form onSubmit={onSubmit}>
          <DialogContent>
            <Grid container spacing={2}>
              {stakeholder && stakeholder.firstName &&
              <Grid item xs={12}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      disabled={disabled}
                      autoFocus
                      id="firstName"
                      label="First Name"
                      value={firstName}
                      onChange={(e) => {
                        setFirstName(e.target.value);
                        setIsUpdated(true);
                      }}
                      required={true}
                      type="text"
                      fullWidth={true}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      disabled={disabled}
                      id="lastName"
                      label="Last Name"
                      value={lastName}
                      onChange={(e) => {
                        setLastName(e.target.value);
                        setIsUpdated(true);
                      }}
                      required={true}
                      type="text"
                      fullWidth={true}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      disabled={disabled}
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
                      disabled={disabled}
                      id="job-title"
                      label="Job Title"
                      value={jobTitle}
                      onChange={(e) => {
                        setJobTitle(e.target.value);
                        setIsUpdated(true);
                      }}
                      type="text"
                      fullWidth={true}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      disabled={disabled}
                      id="businessUnit"
                      label="Business Unit"
                      value={businessUnit}
                      onChange={(e) => {
                        setBusinessUnit(e.target.value);
                        setIsUpdated(true);
                      }}
                      type="text"
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      disabled={disabled}
                      id="team"
                      label="Team"
                      value={team}
                      onChange={(e) => {
                        setTeam(e.target.value);
                        setIsUpdated(true);
                      }}
                      type="text"
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      disabled={disabled}
                      id="location"
                      label="Location"
                      value={location}
                      onChange={(e) => {
                        setLocation(e.target.value);
                        setIsUpdated(true);
                      }}
                      type="text"
                      fullWidth
                    />
                  </Grid>
                </Grid>
              </Grid>
              }

              {stakeholder && stakeholder.groupName &&
              <Grid item xs={12}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      disabled={disabled}
                      id="name"
                      label="Name"
                      value={groupName}
                      onChange={(e) => {
                        setGroupName(e.target.value);
                        setIsUpdated(true);
                      }}
                      required={true}
                      type="text"
                      fullWidth={true}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      disabled={disabled}
                      id="number-of-people"
                      label="Number of people"
                      value={numberOfPeople}
                      onChange={(e) => setNumberOfPeople(e.target.value)}
                      required={true}
                      type="number"
                      fullWidth={true}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      disabled={disabled}
                      id="businessUnit"
                      label="Business Unit"
                      value={businessUnit}
                      onChange={(e) => {
                        setBusinessUnit(e.target.value);
                        setIsUpdated(true);
                      }}
                      type="text"
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      disabled={disabled}
                      id="team"
                      label="Team"
                      value={team}
                      onChange={(e) => {
                        setTeam(e.target.value);
                        setIsUpdated(true);
                      }}
                      type="text"
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      disabled={disabled}
                      id="location"
                      label="Location"
                      value={location}
                      onChange={(e) => {
                        setLocation(e.target.value);
                        setIsUpdated(true);
                      }}
                      type="text"
                      fullWidth
                    />
                  </Grid>
                </Grid>
              </Grid>
              }


              {(!isAdmin && !isSuperAdmin) &&
              <Grid item xs={12}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1">PROJECT: {project.name.toUpperCase()}</Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <FormControl className={classes.formControl} fullWidth={true}>
                      <InputLabel id="role-tags">Role Tags</InputLabel>
                      <Select
                        id="role-tags"
                        fullWidth={true}
                        value={roles}
                        multiple
                        onChange={handleChangeSelect}
                        input={<Input/>}
                        renderValue={selected => selected.join(', ')}
                      >
                        {roleTags.map(tag => {
                          return <MenuItem key={tag} value={tag}>
                            <Checkbox checked={roles && roles.indexOf(tag) > -1}/>
                            <ListItemText primary={tag}/>
                          </MenuItem>
                        })}

                        {!showInput && <MenuItem value={customTag}>
                          <Checkbox checked={customTag.length > 0}/>
                          <ListItemText primary={customTag.length > 0 ? customTag : 'Other'}
                                        onClick={() => setShowInput(true)}/>
                        </MenuItem>}

                        {showInput && <MenuItem>
                          <TextField
                            placeholder={"Enter role tag"}
                            autoFocus
                            fullWidth type={"text"}
                            onKeyPress={(e) => {
                              (e.key === 'Enter' ? handleChangeInput(e.target.value) : null)
                            }}
                          />
                        </MenuItem>}
                      </Select>
                    </FormControl>
                    <br/>
                    <br/>
                    <br/>
                  </Grid>
                  <Grid item xs={6}/>
                  <Grid item xs={6}>
                    <FormControl className={classes.formControl} fullWidth={true}>
                      <InputLabel id="level-of-support">Level Of Support</InputLabel>
                      <Select
                        disabled={disabled}
                        id="level-of-support"
                        fullWidth={true}
                        value={supportLevel}
                        onChange={(e) => {
                          setSupportLevel(e.target.value);
                          setIsUpdated(true);
                        }}
                      >
                        <MenuItem key={1} value={1}>1 = Very low level of support</MenuItem>
                        <MenuItem key={2} value={2}>2 = Low level of support</MenuItem>
                        <MenuItem key={3} value={3}>3 = Moderate level of support</MenuItem>
                        <MenuItem key={4} value={4}>4 = High level of support</MenuItem>
                        <MenuItem key={5} value={5}>5 = Engaged and supportive</MenuItem>
                      </Select>
                    </FormControl>
                    <br/>
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl className={classes.formControl} fullWidth={true}>
                      <InputLabel id="level-of-influence">Level Of Influence</InputLabel>
                      <Select
                        disabled={disabled}
                        id="level-of-influence"
                        fullWidth={true}
                        value={loI}
                        onChange={(e) => {
                          setInfluenceLevel(e.target.value);
                          setIsUpdated(true);
                        }}
                      >
                        <MenuItem key={1} value={1}>1 = Little influence over outcomes</MenuItem>
                        <MenuItem key={2} value={2}>2 = Some influence over outcomes</MenuItem>
                        <MenuItem key={3} value={3}>3 = Moderate influence over outcomes</MenuItem>
                        <MenuItem key={4} value={4}>4 = Major influence over outcomes</MenuItem>
                        <MenuItem key={5} value={5}>5 = Project will not succeed without their support</MenuItem>
                      </Select>
                    </FormControl>
                    <br/>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      disabled={disabled}
                      id="notes"
                      label="Notes"
                      value={notes}
                      onChange={(e) => {
                        setNotes(e.target.value);
                        setIsUpdated(true);
                      }}
                      type="text"
                      fullWidth
                    />
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                  </Grid>
                </Grid>
              </Grid>
              }

              {(isAdmin || isSuperAdmin) &&
              <Grid item xs={12}>
                <Grid item xs={12}>
                  <Typography gutterBottom variant={"subtitle1"}>
                    ALL PROJECTS
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Table size={"small"}>
                    <TableHead>
                      <TableRow>
                        <TableCell align={"left"}>Project name</TableCell>
                        <TableCell align={"left"}>Role tags</TableCell>
                        <TableCell align={"left"}>Support</TableCell>
                        <TableCell align={"left"}>Influence</TableCell>
                        <TableCell align={"left"}>Notes</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {projects.map((project, index) => {
                        return <TableRow key={index}>
                          <TableCell>{project.name.toUpperCase()}</TableCell>
                          <TableCell>{stakeholder.roles}</TableCell>
                          <TableCell>{getLevelsInfoForProject(project._id, true)}</TableCell>
                          <TableCell>{getLevelsInfoForProject(project._id)}</TableCell>
                          <TableCell>{stakeholder.notes && stakeholder.notes}</TableCell>
                        </TableRow>
                      })}
                    </TableBody>
                  </Table>
                  <br/>
                  <br/>
                </Grid>
              </Grid>
              }
            </Grid>
            <Grid item xs={12}>
              <Typography gutterBottom variant={"subtitle1"}>
                Total time away from BAU (this project): &nbsp;&nbsp;&nbsp; {totalTimeAwayBAU}
              </Typography>
              <br/>
              <br/>
            </Grid>
            <Grid item xs={12}>
              <Typography gutterBottom variant={"subtitle1"}>
                Upcoming Activities
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Table size={"small"}>
                <TableHead>
                  <TableRow>
                    {(isAdmin || isSuperAdmin) && <TableCell align={"left"}>Project name</TableCell>}
                    <TableCell align={"left"}>Due date</TableCell>
                    <TableCell align={"left"}>Phase</TableCell>
                    <TableCell align={"left"}>Type</TableCell>
                    <TableCell align={"left"}>Time away from BAU</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {upcomingActivities.map((activity, index) => {
                    return <TableRow key={index}>
                      {(isAdmin || isSuperAdmin) &&
                      <TableCell>{activity.projectName && activity.projectName.toUpperCase()}</TableCell>}
                      <TableCell>{moment(activity.dueDate).format('DD-MMM-YY')}</TableCell>
                      <TableCell>{activity && selectPhase(activity.step)}</TableCell>
                      <TableCell>{activity && activity.type[0].toUpperCase() + activity.type.slice(1)}</TableCell>
                      <TableCell>{activity && activity.time}</TableCell>
                    </TableRow>
                  })}
                </TableBody>
              </Table>
              <br/>
              <br/>
            </Grid>
            <Grid item xs={12}>
              <Typography gutterBottom variant={"subtitle1"}>
                Completed Activities
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Table size={"small"}>
                <TableHead>
                  <TableRow>
                    {(isAdmin || isSuperAdmin) && <TableCell align={"left"}>Project name</TableCell>}
                    <TableCell align={"left"}>Due date</TableCell>
                    <TableCell align={"left"}>Phase</TableCell>
                    <TableCell align={"left"}>Type</TableCell>
                    <TableCell align={"left"}>Time away from BAU</TableCell>
                    <TableCell align={"left"}>Attendance?</TableCell>
                    <TableCell align={"left"}>Feedback requested</TableCell>
                    <TableCell align={"left"}>Feedback received</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {completedActivities.map((activity, index) => {
                    return <TableRow key={index}>
                      {(isAdmin || isSuperAdmin) &&
                      <TableCell>{activity.projectName && activity.projectName.toUpperCase()}</TableCell>}
                      <TableCell>{moment(activity.dueDate).format('DD-MMM-YY')}</TableCell>
                      <TableCell>{activity && selectPhase(activity.step)}</TableCell>
                      <TableCell>{activity && activity.type[0].toUpperCase() + activity.type.slice(1)}</TableCell>
                      <TableCell>{activity && activity.time}</TableCell>
                      <TableCell>Yes</TableCell>
                      <TableCell>{activity && activity.sentEmail ? 'Yes' : 'No'}</TableCell>
                      <TableCell>{getFeedbackReceived(activity._id)}</TableCell>
                    </TableRow>
                  })}
                </TableBody>
              </Table>
              <br/>
              <br/>
            </Grid>
            <Grid item xs={12}>
              <Typography gutterBottom variant={"subtitle1"}>
                Impacts
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Table size={"small"}>
                <TableHead>
                  <TableRow>
                    {(isAdmin || isSuperAdmin) && <TableCell align={"left"}>Project name</TableCell>}
                    <TableCell align={"left"}>Level</TableCell>
                    <TableCell align={"left"}>Change</TableCell>
                    <TableCell align={"left"}>Impact type</TableCell>
                    <TableCell align={"left"}>How does it impact?</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {impacts.map((impact, index) => {
                    return <TableRow key={index}>
                      {(isAdmin || isSuperAdmin) &&
                      <TableCell>{impact.projectName && impact.projectName.toUpperCase()}</TableCell>}
                      <TableCell>{impact && impact.level[0].toUpperCase() + impact.level.slice(1)}</TableCell>
                      <TableCell>{impact && impact.change}</TableCell>
                      <TableCell>{impact && impact.type[0].toUpperCase() + impact.type.slice(1)}</TableCell>
                      <TableCell>{impact && impact.impact}</TableCell>
                    </TableRow>
                  })}
                </TableBody>
              </Table>
              <br/>
              <br/>
            </Grid>
            <Grid item xs={12}>
              <Typography gutterBottom variant={"subtitle1"}>
                Survey responses
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Table size="small" aria-label="a dense table">
                <TableHead>
                  <TableRow>
                    {(isAdmin || isSuperAdmin) && <TableCell align={"left"}>Project name</TableCell>}
                    <TableCell align={"left"}>Date</TableCell>
                    <TableCell align={"left"}>Survey type</TableCell>
                    <TableCell align={"left"}>Response</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {responseOnSurveys && responseOnSurveys.map((response, index) => {
                    return <TableRow key={index}>
                      {(isAdmin || isSuperAdmin) &&
                      <TableCell>{response.projectName && response.projectName.toUpperCase()}</TableCell>}
                      <TableCell component="th"
                                 scope="row">{response && moment(response.createdAt).format('DD-MMM-YY')}</TableCell>
                      <TableCell>Stakeholder feedback</TableCell>
                      <TableCell>{response && response.question2}</TableCell>
                    </TableRow>
                  })}
                </TableBody>
              </Table>
              <br/>
              <br/>
            </Grid>
          </DialogContent>
          <DialogActions>
            {(isAdmin && template && (template.companyId === company._id)) || isSuperAdmin || (type === 'project' && (project && !isManager)) ?
              <Button onClick={isUpdated ? handleOpenModalDialog : () => close()} color="secondary">
                Cancel
              </Button> :
              <Button onClick={() => close()} color="secondary">
                OK
              </Button>}
            {(isAdmin && template && (template.companyId === company._id)) || isSuperAdmin || (type === 'project' && (project && !isManager && (isChangeManager || isAdmin))) ?
              <Button color="primary" type="submit">
                Update
              </Button> : null}
          </DialogActions>
          <SaveChanges
            handleClose={handleClose}
            showModalDialog={showModalDialog}
            handleSave={onSubmit}
            closeModalDialog={closeModalDialog}
          />
        </form>
      </Dialog>
    </>
  );
}

const EditStakeHolderPage = withTracker(props => {
  Meteor.subscribe('surveysStakeholders');
  Meteor.subscribe('impacts.findAll');
  Meteor.subscribe('projects.notLoggedIn');
  Meteor.subscribe('activities.notLoggedIn');
  Meteor.subscribe('additionalStakeholderInfo.findAll');
  return {
    company: Companies.findOne(),
    additionalInfo: AdditionalStakeholderInfo.find({}).fetch(),
  };
})(EditStakeHolder);

export default withSnackbar(EditStakeHolderPage)