import React, {useEffect, useState} from "react";
import {withStyles, makeStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import MuiDialogActions from '@material-ui/core/DialogActions';
import TextField from '@material-ui/core/TextField';
import {withSnackbar} from 'notistack';
import 'date-fns';
import Grid from "@material-ui/core/Grid/Grid";
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';

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

function AddGroupStakeholders(props) {
  const [name, setName] = useState('');
  const [businessUnit, setBusinessUnit] = useState('');
  const [numberOfPeople, setNumberOfPeople] = useState(0);
  const [team, setTeam] = useState('');
  const [location, setLocation] = useState('');
  const [supportLevel, setSupportLevel] = useState(0);
  const [influenceLevel, setInfluenceLevel] = useState(0);
  const [notes, setNotes] = useState('');

  let {type, projectId, templateId, project, template, handleCloseModal} = props;
  const classes = useStyles();

  const createStakeholderGroup = (e) => {
    e.preventDefault();
    if (!name || !numberOfPeople) {
      props.enqueueSnackbar('Please fill all required fields', {variant: "error"});
      return false
    }
    let params = {
      people: {
        groupName: name,
        numberOfPeople: Number(numberOfPeople),
        location: location,
        team: team,
        businessUnit: businessUnit,
        notes: notes,
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
        const paramsInfo = {
          additionalStakeholderInfo: {
            projectId: projectId,
            stakeholderId: res,
            levelOfSupport: supportLevel || 0,
            levelOfInfluence: influenceLevel || 0,
            notes: notes || '',
          }
        };
        Meteor.call('additionalStakeholderInfo.insert', paramsInfo, (err, res) => {
          if (err) {
            props.enqueueSnackbar(err.reason, {variant: 'error'});
          } else {
            props.enqueueSnackbar('Stakeholder Added Successfully.', {variant: 'success'});
            handleCloseModal();
          }
        });
      }
    })
  };

  return (
    <div className={classes.createNewProject}>
      <form onSubmit={createStakeholderGroup}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              autoFocus
              id="name"
              label="Name"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
              }}
              required={true}
              type="text"
              fullWidth={true}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              id="number=of-people"
              label="Number of people"
              value={numberOfPeople}
              required={true}
              onChange={(e) => {
                setNumberOfPeople(e.target.value)
              }}
              type="number"
              fullWidth={true}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              id="team-group"
              label="Team"
              value={team}
              onChange={(e) => {
                setTeam(e.target.value)
              }}
              type="text"
              fullWidth={true}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              id="business-unit"
              label="Business Unit"
              value={businessUnit}
              onChange={(e) => {
                setBusinessUnit(e.target.value)
              }}
              type="text"
              fullWidth={true}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              id="location-group"
              label="Location"
              value={location}
              onChange={(e) => {
                setLocation(e.target.value)
              }}
              type="text"
              fullWidth={true}
            />
            <br/>
          </Grid>
          <Grid item xs={6}/>
          <Grid item xs={6}>
            <FormControl className={classes.formControl} fullWidth={true}>
              <InputLabel id="select-level">Level Of Support</InputLabel>
              <Select
                id="select-level"
                fullWidth={true}
                value={supportLevel}
                onChange={(e) => {
                  setSupportLevel(e.target.value)
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
          </Grid>

          <Grid item xs={6}>
            <FormControl className={classes.formControl} fullWidth={true}>
              <InputLabel id="select">Level Of Influence</InputLabel>
              <Select
                id="select"
                fullWidth={true}
                value={influenceLevel}
                onChange={(e) => {
                  setInfluenceLevel(e.target.value)
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
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="notesGroup"
              label="Notes"
              value={notes}
              onChange={(e) => {
                setNotes(e.target.value)
              }}
              type="text"
              fullWidth={true}
            />
          </Grid>
        </Grid>
        <br/>
        <Button color="primary" type="submit">
          Add Stakeholder
        </Button>
      </form>
    </div>
  );
}

export default withSnackbar(AddGroupStakeholders)