import React, {useEffect, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Grid from "@material-ui/core/Grid/Grid";
import {withRouter} from "react-router";
import {withSnackbar} from "notistack";
import {withTracker} from "meteor/react-meteor-data";
import {Impacts} from "../../../api/impacts/impacts";
import {Peoples} from "../../../api/peoples/peoples";
import {Paper, Table, TableBody, TableCell} from "@material-ui/core";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import {Projects} from "../../../api/projects/projects";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    margin: theme.spacing(3),
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: '80vw'
  },
  tableHead: {
    border: '1px solid rgba(224, 224, 224, 1)',
    color: 'black',
    fontSize: '14px',
    letterSpacing: '0.001rem',
  },
  tableCell: {
    border: '1px solid rgba(224, 224, 224, 1)',
    padding: '14px 30px 14px 30px',
  },
  nameTableCell: {
    border: '1px solid rgba(224, 224, 224, 1)',
    padding: '14px 24px 14px 16px',
  },
  lowLevelTableCell: {
    border: '1px solid rgba(224, 224, 224, 1)',
    padding: '14px 40px 14px 40px',
    background: 'yellowgreen',
    color: 'white',
  },
  mediumLevelTableCell: {
    border: '1px solid rgba(224, 224, 224, 1)',
    padding: '14px 30px 14px 30px',
    background: 'yellow',
    color: 'black',
  },
  highLevelTableCell: {
    border: '1px solid rgba(224, 224, 224, 1)',
    padding: '14px 30px 14px 30px',
    background: 'red',
    color: 'white',
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
  },
}));

function ImpactReport(props) {
  const classes = useStyles();
  const {match, allImpacts, allStakeholders} = props;
  const projectId = match.params.projectId;
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    if (allStakeholders && allImpacts) {
      const stakeholders = allStakeholders.filter(stakeholder => !!stakeholder.firstName);
      stakeholders.map(stakeholder => {
        stakeholder.impactLevels = [];
        const calculationLevel = [];
        const impactsStakeholder = allImpacts.filter(impact => impact.stakeholders.includes(stakeholder._id));
        ['ORGANIZATION', 'PEOPLE', 'PROCESS', 'TECHNOLOGY'].forEach(type => {
          calculationLevel.push(calculationLevels(type, impactsStakeholder));
        });
        stakeholder.impactLevels = calculationLevel;
        return stakeholder;
      });
      setTableData(stakeholders);
    }
  }, [allStakeholders, allImpacts, projectId]);

  const calculationLevels = (type, impactLevel) => {
    let level = '';
    const currentImpacts = impactLevel.filter(impact => impact.type.toUpperCase() === type);
    if (currentImpacts.length > 1) {
      const highImpacts = currentImpacts.filter(currentImpact => currentImpact.level.toUpperCase() === 'HIGH');
      const mediumImpacts = currentImpacts.filter(currentImpact => currentImpact.level.toUpperCase() === 'MEDIUM');
      const lowImpacts = currentImpacts.filter(currentImpact => currentImpact.level.toUpperCase() === 'LOW');
      if (highImpacts.length > 0) {
        level = 'H'
      } else if (mediumImpacts.length > 0) {
        level = 'M'
      } else if (lowImpacts.length > 0) {
        level = 'L'
      }
    } else if (currentImpacts.length === 1) {
      level = currentImpacts[0].level.toUpperCase().slice(0, 1)
    }
    return {type: type, level: level}
  };

  const getClassName = (level) => {
    switch (level) {
      case 'H':
        return classes.highLevelTableCell;
      case 'M':
        return classes.mediumLevelTableCell;
      case 'L':
        return classes.lowLevelTableCell;
      case '':
        return classes.tableCell;
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
              Impact heat map
            </Typography>
          </Grid>
          <Grid item xs={12} className={classes.gridTable}>
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell size="small" className={classes.tableHead} align="left">STAKEHOLDER</TableCell>
                  <TableCell size="small" className={classes.tableHead} align="center">ORGANIZATION</TableCell>
                  <TableCell size="small" className={classes.tableHead} align="center">PEOPLE</TableCell>
                  <TableCell size="small" className={classes.tableHead} align="center">PROCESS</TableCell>
                  <TableCell size="small" className={classes.tableHead} align="center">TECHNOLOGY</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tableData.map((data, index) => {
                  return <TableRow key={index}>
                    <TableCell className={classes.nameTableCell} align="left" padding="none"
                               key={index}>{`${data.firstName} ${data.lastName}`}</TableCell>
                    {data.impactLevels.map((impactLevel, index) => {
                      return <TableCell padding="none" className={getClassName(impactLevel.level)} align="center"
                                        key={index}>{impactLevel.type && impactLevel.level}</TableCell>
                    })}
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

const ImpactReportPage = withTracker(props => {
  let {match} = props;
  let {projectId} = match.params;
  Meteor.subscribe('impacts.findAll');
  Meteor.subscribe('findAllPeoples');
  Meteor.subscribe('projects.notLoggedIn');
  const allImpacts = Impacts.find({}).fetch();
  const project = Projects.findOne({_id: projectId});
  return {
    allImpacts,
    allStakeholders: Peoples.find({
      _id: {
        $in: project && project.stakeHolders || []
      }
    }).fetch(),
  };
})(withRouter(ImpactReport));

export default withSnackbar(ImpactReportPage);
