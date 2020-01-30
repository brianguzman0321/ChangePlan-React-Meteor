import React, {useEffect, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import {withTracker} from "meteor/react-meteor-data";
import {Button, FormControlLabel, Paper, Radio, RadioGroup, TextField} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import {withRouter} from "react-router";
import FormControl from "@material-ui/core/FormControl";
import {withSnackbar} from "notistack";
import {Activities} from "../../../../api/activities/activities";
import {Meteor} from "meteor/meteor";
import {Projects} from "../../../../api/projects/projects";


const useStyles = makeStyles(theme => ({
  gridContainer: {
    paddingTop: '57px',
  },
  paperContainer: {
    margin: '5px',
    padding: '20px',
  },
  topText: {
    color: '#465663',
    textAlign: 'center',
  },
  textField: {
    backgroundColor: '#f5f5f5',
  },
  questionTypography: {
    marginBottom: '5px',
    marginTop: '5px'
  },
  buttonSave: {
    marginTop: '10px',
  },
}));

function SurveyActivityDeliverer(props) {
  let {match, history: {push}, activity} = props;
  const [value, setValue] = useState(1);
  const [issue, setIssue] = useState('');
  const [comments, setComments] = useState('');
  const [commentsStakeholders, setCommentsStakeholders] = useState('');
  const [isUpdatedActivity, setIsUpdatedActivity] = useState(false);
  const [survey, setSurvey] = useState({});
  const classes = useStyles();

  const handleChangeQuestion = event => {
    setValue(Number(event.target.value));
  };

  const handleChangeIssue = (e) => {
    setIssue(e.target.value);
  };

  const handleChangeComments = (e) => {
    setComments(e.target.value);
  };

  const handleChangeCommentsStakeholders = (e) => {
    setCommentsStakeholders(e.target.value);
  };

  useEffect(() => {
    if (activity && !isUpdatedActivity) {
      activityComplete();
    }
  }, [activity]);

  const activityComplete = () => {
    if (Number(match.params.response) === 1) {
      activity.completed = true;
      activity.completedAt = new Date();
      if (!activity.stakeholdersFeedback) {
        activity.stakeholdersFeedback = true;
      }
      const params = {
        activity
      };
      Meteor.call('activities.update', params, (err, res) => {
        if (err) {
          props.enqueueSnackbar(err.reason, {variant: 'error'})
        } else if (res) {
          setIsUpdatedActivity(true);
        }
      });
      const paramsSurvey = {
        surveyActivityDeliverer: {
          activityId: match.params.activityId,
          activityDelivererId: match.params.activityDelivererId,
          question1: Number(match.params.response),
        }
      };
      Meteor.call('surveysActivityDeliverers.insert', paramsSurvey, (err, res) => {
        if (err) {
          props.enqueueSnackbar(err.reason, {variant: 'error'});
        } else if (res) {
          setSurvey(res);
        }
      });
    } else if (Number(match.params.response) === 2) {
      const activity = Activities.findOne({_id: match.params.activityId});
      const project = Projects.findOne({_id: activity.projectId});
      const changeManagers = project.changeManagers;
      changeManagers.forEach(_changeManager => {
        const changeManager = Meteor.users.findOne({_id: _changeManager});
        const email = changeManager.emails[0];
        const activityDelivererInformation = Meteor.users.find({_id: match.params.activityDelivererId}).fetch()[0];
        const activityDeliverer = `${activityDelivererInformation.profile.firstName} ${activityDelivererInformation.profile.lastName}`;
        const activityName = activity.name;
        const projectName = project.name;
        Meteor.call('sendReportToChangeManager', email, activityDeliverer, activityName, projectName, (err, res) => {
          if (err) {
            props.enqueueSnackbar(err.reason, {variant: 'error'});
          }
        })
      })
    }
  };

  const saveSurvey = () => {
    const params = {
      surveyActivityDeliverers: {
        _id: survey,
        activityId: match.params.activityId,
        activityDelivererId: match.params.activityDelivererId,
        question1: Number(match.params.response),
        question2: value,
        question3: issue,
        question4: commentsStakeholders,
        question5: comments,
      }
    };
    Meteor.call('surveysActivityDeliverers.update', params, (err, res) => {
      if (err) {
        props.enqueueSnackbar(err.reason, {variant: 'error'})
      } else if (res) {
        props.enqueueSnackbar('Survey Responses Save Successfully. Thanks for your attention', {variant: 'success'});
        push('/');
      }
    })
  };

  return (
    <div>
      <Grid
        container
        direction="column"
        justify="center"
        alignItems="center"
        className={classes.gridContainer}
        spacing={0}
      >
        <Grid item xs={12}>
          <a href="/">
            <img src={`/branding/logo-long.png`}/>
          </a>
        </Grid>
        <Grid item xs={12}>
          <h1 className={classes.topText}>Survey!</h1>
          <h3 className={classes.topText}>Please complete the survey by answering additional questions</h3>
        </Grid>
        <Paper className={classes.paperContainer}>
          <Grid item>
            <Typography>
              Today's activity was successful?
            </Typography>
            <FormControl component={"fieldset"}>
              <RadioGroup name="question2" value={value} onChange={handleChangeQuestion}>
                <FormControlLabel value={1} control={<Radio color={"primary"} size={"small"}/>}
                                  label={"Strongly disagree"}/>
                <FormControlLabel value={2} control={<Radio color={"primary"} size={"small"}/>} label={"Disagree"}/>
                <FormControlLabel value={3} control={<Radio color={"primary"} size={"small"}/>}
                                  label={"Neither agree or disagree"}/>
                <FormControlLabel value={4} control={<Radio color={"primary"} size={"small"}/>} label={"Agree"}/>
                <FormControlLabel value={5} control={<Radio color={"primary"} size={"small"}/>}
                                  label={"Strongly agree"}/>
              </RadioGroup>
            </FormControl>
          </Grid>

          <Grid>
            <Typography className={classes.questionTypography}>
              Any issues that might need to be added to the project risk register or escalated to senior management?
            </Typography>
            <TextField type="text" fullWidth variant={"outlined"} value={issue} className={classes.textField}
                       onChange={handleChangeIssue} label={"Response"} multiline/>
          </Grid>

          <Grid>
            <Typography className={classes.questionTypography}>
              Any comments about the stakeholders targeted?
            </Typography>
            <TextField type="text" fullWidth variant={"outlined"} className={classes.textField} label={"Response"}
                       value={commentsStakeholders} onChange={handleChangeCommentsStakeholders} multiline/>
          </Grid>

          <Grid>
            <Typography className={classes.questionTypography}>
              Any other comments?
            </Typography>
            <TextField type="text" fullWidth variant={"outlined"} className={classes.textField} label={"Response"}
                       value={comments} onChange={handleChangeComments} multiline/>
          </Grid>

          <Button variant="contained" color="primary" fullWidth type="button" className={classes.buttonSave}
                  onClick={saveSurvey}>
            Save
          </Button>
        </Paper>

      </Grid>
    </div>
  );
}


const SurveyActivityDeliverers = withTracker(props => {
  Meteor.subscribe('surveysActivityDeliverers');
  Meteor.subscribe('activities.notLogin');
  Meteor.subscribe('projects.notLogin');
  Meteor.subscribe('users.notLogin');
  return {
    activity: Activities.findOne({_id: props.match.params.activityId})
  };
})(withRouter(withSnackbar(SurveyActivityDeliverer)));

export default SurveyActivityDeliverers;
