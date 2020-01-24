import React, {useEffect, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import {withTracker} from "meteor/react-meteor-data";
import {withRouter} from "react-router";
import {Button, Paper, TextField} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import {Meteor} from "meteor/meteor";
import {Peoples} from "../../../../api/peoples/peoples";
import {withSnackbar} from "notistack";


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

function SurveyStakeholder(props) {
  let {match, stakeholder, history: {push}} = props;
  const [answer, setAnswer] = useState('');
  const [isSurveyResponseCreated, setIsSurveyResponseCreated] = useState(false);
  const [survey, setSurvey] = useState({});

  const classes = useStyles();

  useEffect(() => {
    if (stakeholder && !isSurveyResponseCreated) {
      surveyResponseCreate();
    }
  }, [stakeholder]);

  const surveyResponseCreate = () => {
    const params = {
      surveyStakeholder: {
        activityId: match.params.activityId,
        stakeholderId: match.params.stakeholderId,
        question1: Number(match.params.response),
      }
    };
    Meteor.call('surveysStakeholders.insert', params, (err, res) => {
      if (err) {
        props.enqueueSnackbar(err.reason, {variant: 'error'})
      } else if (res) {
        props.enqueueSnackbar('Survey Responses Save Successfully', {variant: 'success'});
        setSurvey(res);
        setIsSurveyResponseCreated(true);
      }
    })
  };

  const handleChangeAnswer = (e) => {
    setAnswer(e.target.value);
  };

  const saveSurvey = () => {
    const params = {
      surveyStakeholder: {
        _id: survey,
        activityId: match.params.activityId,
        stakeholderId: match.params.stakeholderId,
        question1: Number(match.params.response),
        question2: answer,
      }
    };
    Meteor.call('surveysStakeholders.update', params, (err, res) => {
      if (err) {
        props.enqueueSnackbar(err.reason, {variant: 'error'})
      } else if (res) {
        props.enqueueSnackbar('Survey Responses Save Successfully. Thanks for your attention', {variant: 'success'});
        push('/');
      }
    })
  };

  return (
    <Grid>
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

          <Grid>
            <Typography className={classes.questionTypography} paragraph>
              Is there anything you want the change team to know?
            </Typography>
            <Typography className={classes.questionTypography} paragraph>
              Do you have a concern that you think needs to be brought to senior management's attention?
            </Typography>
            <TextField type="text" fullWidth variant={"outlined"} value={answer} className={classes.textField}
                       onChange={handleChangeAnswer} label={"Response"} multiline/>
          </Grid>

          <Button variant="contained" color="primary" fullWidth type="button" className={classes.buttonSave}
                  onClick={saveSurvey}>
            Save
          </Button>
        </Paper>

      </Grid>
    </Grid>
  );
}


const SurveyStakeholders = withTracker(props => {
  let id = props.match.params.stakeholderId;
  Meteor.subscribe('surveysStakeholders');
  Meteor.subscribe('peoples.find');
  return {
    stakeholder: Peoples.findOne({_id: id}),
  };
})(withRouter(withSnackbar(SurveyStakeholder)));

export default SurveyStakeholders;
