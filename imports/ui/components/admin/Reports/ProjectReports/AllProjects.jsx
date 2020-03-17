import React, {useEffect, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Grid from "@material-ui/core/Grid/Grid";
import {Paper, Table, TableBody, TableCell} from "@material-ui/core";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import {changeManagersNames, getTotalStakeholders} from "../../../../../utils/utils";
import {Meteor} from "meteor/meteor";

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

function AllProjectsReport(props) {
  const classes = useStyles();
  const {
    allProjects, company, allImpacts, allActivities, allStakeholders,
    isSuperAdmin, isAdmin, isChangeManager, isManager, isActivityDeliverer, isActivityOwner
  } = props;
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    if (allProjects && company) {
      let projects = [];
      if (isAdmin) {
        projects = allProjects.filter(project => project.companyId === company._id);
      }
      if (isChangeManager && !isAdmin) {
        projects = allProjects.filter(project => project.changeManagers.includes(Meteor.userId()));
      }
      setTableData(projects);
    }
  }, [allProjects, company, isAdmin, isChangeManager]);

  const getImpacts = (projectId) => {
    const impacts = allImpacts.filter(impact => impact.projectId === projectId).length;
    return impacts !== 0 ? impacts : '-';
  };

  const getActivities = (projectId) => {
    const activities = allActivities.filter(activity => activity.projectId === projectId).length;
    return activities !== 0 ? activities : '-';
  };

  const getPercentageComplete = (projectId) => {
    const projectActivities = allActivities.filter(activity => activity.projectId === projectId);
    if (projectActivities.length > 0) {
      return parseFloat(100 * (projectActivities.length - projectActivities.filter(activity => activity.completed).length) / (projectActivities.length)).toFixed(2);
    }
    return 0;
  };

  const getTimeConsumed = (projectId) => {
    let allTime = 0;
    let consumedTime = 0;
    const projectActivities = allActivities.filter(activity => activity.projectId === projectId);
    if (projectActivities.length > 0) {
      projectActivities.forEach(activity => {
        allTime = allTime + activity.time;
      });
      const completedActivities = projectActivities.filter(activity => activity.completed);
      completedActivities.forEach(activity => {
        consumedTime = consumedTime + activity.time;
      });
      return parseFloat((100 * consumedTime) / allTime).toFixed(2);
    }
    return 0;
  };

  const getProjectPage = (projectId) => {
    props.history.push(`/projects/${projectId}`);
  };

  return (
    <Grid className={classes.root}>
      <Paper className={classes.paper}>
        <Grid container direction="row" justify="center" alignItems="center">
          <Grid item xs={12}>
            <Typography color="textSecondary" variant="h4" className={classes.topHeading}>
              Projects
            </Typography>
          </Grid>
          <Grid item xs={12} className={classes.gridTable}>
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell size="small" className={classes.tableHead} align="center">STATUS</TableCell>
                  <TableCell size="small" className={classes.tableHead} align="center">NAME</TableCell>
                  {company && company.organizationField &&
                  <TableCell size="small" className={classes.tableHead} align="center">ORGANIZATION</TableCell>}
                  {company && company.functionField &&
                  <TableCell size="small" className={classes.tableHead} align="center">FUNCTION</TableCell>}
                  <TableCell size="small" className={classes.tableHead} align="center">CHANGE MANAGER/S</TableCell>
                  <TableCell size="small" className={classes.tableHead} align="center">STAKEHOLDERS</TableCell>
                  <TableCell size="small" className={classes.tableHead} align="center">IMPACTS</TableCell>
                  <TableCell size="small" className={classes.tableHead} align="center">ACTIVITIES</TableCell>
                  <TableCell size="small" className={classes.tableHead} align="center">PERCENTAGE COMPLETE</TableCell>
                  <TableCell size="small" className={classes.tableHead} align="center">TIME CONSUMED</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tableData.map((project, index) => {
                  return <TableRow key={index} onClick={() => getProjectPage(project._id)}>
                    <TableCell className={classes.tableCell} align="center" padding="none"
                               key={index}>{project.status}</TableCell>
                    <TableCell size="small" className={classes.tableCell} align="center">{project.name}</TableCell>
                    {company && company.organizationField &&
                    <TableCell size="small" className={classes.tableCell} align="center">
                      {project.organization ? project.organization : '-'}
                    </TableCell>}
                    {company && company.functionField &&
                    <TableCell size="small" className={classes.tableCell}
                               align="center">{project.function ? project.function : '-'}</TableCell>}
                    <TableCell size="small" className={classes.tableCell}
                               align="center">{changeManagersNames(project)}</TableCell>
                    <TableCell size="small" className={classes.tableCell}
                               align="center">{getTotalStakeholders(allStakeholders, project.stakeHolders)}</TableCell>
                    <TableCell size="small" className={classes.tableCell}
                               align="center">{getImpacts(project._id)}</TableCell>
                    <TableCell size="small" className={classes.tableCell}
                               align="center">{getActivities(project._id)}</TableCell>
                    <TableCell size="small" className={classes.tableCell}
                               align="center">{`${getPercentageComplete(project._id)}%`}</TableCell>
                    <TableCell size="small" className={classes.tableCell}
                               align="center">{`${getTimeConsumed(project._id)}%`}</TableCell>
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

export default AllProjectsReport;
