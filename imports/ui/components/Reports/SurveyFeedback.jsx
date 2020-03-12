import React, {useEffect, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Grid from "@material-ui/core/Grid/Grid";
import {withSnackbar} from "notistack";
import {Paper, Table, TableBody, TableCell} from "@material-ui/core";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import moment from "moment";
import {getPhase} from "../../../utils/utils";

const useStyles = makeStyles(theme => ({
  root: {
    width: '98%',
    margin: theme.spacing(3),
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  table: {
    width: '100%',
  },
  tableCell: {
    border: '1px solid rgba(224, 224, 224, 1)',
    padding: '14px 30px 14px 30px',
  },
  tableHead: {
    border: '1px solid rgba(224, 224, 224, 1)',
    color: 'black',
    fontSize: '14px',
    letterSpacing: '0.001rem',
    whiteSpace: 'nowrap',
  },
  tableQuestion: {
    border: '1px solid rgba(224, 224, 224, 1)',
    color: 'black',
    fontSize: '14px',
    letterSpacing: '0.001rem',
    whiteSpace: 'normal',
  },
  topHeading: {
    fontSize: '1.8rem',
    fontWeight: 500,
    lineHeight: 1.5,
    letterSpacing: '-0.015em',
    color: '#465563',
    marginLeft: 24,
    paddingTop: '10px',
  },
  gridTable: {
    padding: '10px 24px 20px 24px',
    overflowX: 'auto',
  },
}));

function SurveyFeedback(props) {
  const classes = useStyles();
  const {match, allActivities, allStakeholders, company, allStakeholdersSurveys, allDeliverersSurveys, type} = props;
  const projectId = match.params.projectId;
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    if ((allStakeholdersSurveys.length > 0 || allDeliverersSurveys.length > 0) && allStakeholders.length > 0 && allActivities.length > 0) {
      let surveys = [];
      if (type === 'isStakeholders') {
        surveys = allStakeholdersSurveys.map(survey => {
          const newSurvey = {...survey};
          newSurvey.activity = allActivities.find(activity => activity._id === survey.activityId);
          newSurvey.stakeholder = allStakeholders.find(stakeholder => stakeholder._id === survey.stakeholderId);
          return newSurvey
        }).filter(survey => survey.activity);
      } else if (type === 'isActivityDeliverers') {
        surveys = allDeliverersSurveys.map(survey => {
          const newSurvey = {...survey};
          newSurvey.activity = allActivities.find(activity => activity._id === survey.activityId);
          return newSurvey
        }).filter(survey => survey.activity);
      }
      setTableData(surveys);
    }
  }, [allStakeholdersSurveys, allDeliverersSurveys, allStakeholders, allActivities, projectId]);

  const getAnswer = (answer) => {
    switch (answer) {
      case 1:
        return 'Strongly disagree';
      case 2:
        return 'Disagree';
      case 3:
        return 'Neither agree or disagree';
      case 4:
        return 'Agree';
      case 5:
        return 'Strongly agree';
      default:
        break;
    }
  };

  return (
    <Grid className={classes.root}>
      <Paper className={classes.paper}>
        <Grid container direction="row" justify="center" alignItems="center">
          <Grid item xs={12}>
            <Typography color="textSecondary" variant="h4" className={classes.topHeading}>
              {type === 'isStakeholders' ? 'Stakeholders survey feedback' : 'Activity deliverers survey feedback'}
            </Typography>
          </Grid>
          <Grid item xs={12} className={classes.gridTable}>
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell size="small" className={classes.tableHead} align="center">ACTIVITY TYPE</TableCell>
                  <TableCell size="small" className={classes.tableHead} align="center">DUE DATE</TableCell>
                  <TableCell size="small" className={classes.tableHead} align="center">CHANGE PHASE</TableCell>
                  {type === 'isStakeholders' &&
                  <TableCell size="small" className={classes.tableHead} align="center">STAKEHOLDER</TableCell>}
                  {type === 'isActivityDeliverers' &&
                  <TableCell size="small" className={classes.tableHead} align="center">DELIVERER</TableCell>}
                  {type === 'isStakeholders' &&
                  <TableCell size="small" className={classes.tableQuestion} align="center">Answer to the question
                    "ACTIVITY TYPE boosted my CHANGE PHASE toward the project"</TableCell>}
                  {type === 'isStakeholders' &&
                  <TableCell size="small" className={classes.tableQuestion} align="center">Answer to the question "Is
                    there anything you want the change team to know?
                    Do you have a concern that you think needs to be brought to senior management's
                    attention?"</TableCell>}
                  {type === 'isActivityDeliverers' &&
                  <TableCell size="small" className={classes.tableQuestion} align="center">Today's activity was
                    successful?</TableCell>}
                  {type === 'isActivityDeliverers' &&
                  <TableCell size="small" className={classes.tableQuestion} align="center">Any issues that might need to
                    be added to the project risk register or escalated to senior management?</TableCell>}
                  {type === 'isActivityDeliverers' &&
                  <TableCell size="small" className={classes.tableQuestion} align="center">Any comments about the
                    stakeholders targeted?</TableCell>}
                  {type === 'isActivityDeliverers' &&
                  <TableCell size="small" className={classes.tableQuestion} align="center">Any other
                    comments?</TableCell>}
                </TableRow>

              </TableHead>
              <TableBody>
                {tableData.map((survey, index) => {
                  return <TableRow key={index}>
                    <TableCell size="small" className={classes.tableCell}
                               align="center">{survey.activity.name}</TableCell>
                    <TableCell className={classes.tableCell} align="center" padding="none"
                               key={index}>{moment(survey.activity.dueDate).format('DD-MMM-YY')}</TableCell>
                    <TableCell size="small" className={classes.tableCell}
                               align="center">{getPhase(survey.activity.step, company)}</TableCell>
                    {type === 'isStakeholders' && <TableCell size="small" className={classes.tableCell} align="center">
                      {survey.stakeholder.firstName ? `${survey.stakeholder.firstName} ${survey.stakeholder.lastName}` : survey.stakeholder.groupName}
                    </TableCell>}
                    {type === 'isStakeholders' && <TableCell size="small" className={classes.tableCell}
                                                             align="center">{getAnswer(survey.question1)}</TableCell>}
                    {type === 'isStakeholders' && <TableCell size="small" className={classes.tableCell}
                                                             align="center">{survey.question2 || '-'}</TableCell>}
                    {type === 'isActivityDeliverers' &&
                    <TableCell size="small" className={classes.tableCell} align="center">
                      {survey.activity.personResponsible ? `${survey.activity.personResponsible.profile.firstName} ${survey.activity.personResponsible.profile.lastName}` : ''}
                    </TableCell>}
                    {type === 'isActivityDeliverers' && <TableCell size="small" className={classes.tableCell}
                                                                   align="center">{getAnswer(survey.question1)}</TableCell>}
                    {type === 'isActivityDeliverers' && <TableCell size="small" className={classes.tableCell}
                                                                   align="center">{survey.question2 || '-'}</TableCell>}
                    {type === 'isActivityDeliverers' && <TableCell size="small" className={classes.tableCell}
                                                                   align="center">{survey.question3 || '-'}</TableCell>}
                    {type === 'isActivityDeliverers' && <TableCell size="small" className={classes.tableCell}
                                                                   align="center">{survey.question4 || '-'}</TableCell>}
                  </TableRow>
                })}
              </TableBody>
            </Table>
          </Grid>
        </Grid>
      </Paper>
    </Grid>
  )
}

export default withSnackbar(SurveyFeedback);
