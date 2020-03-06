import React, {useEffect, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Grid from "@material-ui/core/Grid/Grid";
import {Paper, Table, TableBody, TableCell} from "@material-ui/core";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import moment from "moment";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import {_} from 'meteor/underscore';

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
  tab: {
    color: '#465563',
    fontWeight: 700,
    borderRight: '0.1em solid #eaecef',
    padding: 0,
    cursor: 'pointer',
    '&:selected': {
      color: '#1890ff',
      fontWeight: theme.typography.fontWeightMedium,
    },
    whiteSpace: 'nowrap',
    minWidth: '50px',
    minHeight: '10px'
  },
  tabs: {
    minHeight: '25px',
  },
}));

function TimeAndActivitiesReport(props) {
  const classes = useStyles();
  const {match, allStakeholders, allActivities, type} = props;
  const projectId = match.params.projectId;
  const [tableData, setTableData] = useState([]);
  const [selectedTab, setSelectedTab] = useState(0);
  const [nameTableHead, setNameTableHead] = useState('STAKEHOLDER');
  const [tableHeadData, setTableHeadData] = useState([]);

  useEffect(() => {
    if (allStakeholders && allActivities) {
      let stakeholders = [];
      let weeks = getTableHead();
      if (weeks.length > 0) {
        switch (selectedTab) {
          case 0:
            stakeholders = getTableDataGroup(weeks, allStakeholders.filter(stakeholder => !!stakeholder.firstName));
            setNameTableHead('STAKEHOLDER');
            break;
          case 1:
            stakeholders = getTableData(weeks, allStakeholders.filter(stakeholder => !!stakeholder.team), 'team');
            setNameTableHead('TEAM');
            break;
          case 2:
            stakeholders = getTableData(weeks, allStakeholders.filter(stakeholder => !!stakeholder.location), 'location');
            setNameTableHead('LOCATION');
            break;
          case 3:
            stakeholders = getTableData(weeks, allStakeholders.filter(stakeholder => !!stakeholder.businessUnit), 'businessUnit');
            setNameTableHead('BUSINESS UNIT');
            break;
          case 4:
            stakeholders = getTableDataGroup(weeks, allStakeholders.filter(stakeholder => !!stakeholder.groupName), true);
            setNameTableHead('GROUP');
            break;
          default:
            break;
        }
      }
      setTableData(stakeholders);
    }
  }, [allStakeholders, allActivities, projectId, selectedTab]);

  const getTableHead = () => {
    const today = new Date();
    const currentActivities = allActivities.filter(activity => activity.dueDate >= today && !activity.completed);
      const sortActivities = _.sortBy(currentActivities, 'dueDate');
      let date = {
        weeks: []
      };
      sortActivities.forEach(activity => {
        date.weeks.push({
          startDate: moment(moment(activity.dueDate)).startOf('isoWeek').toDate(),
          endDate: moment(moment(activity.dueDate)).endOf('isoWeek').toDate()
        })
      });
      const noRepeatingDate = [];
      date.weeks.map(week => noRepeatingDate.filter(noRepeatingWeek => moment(noRepeatingWeek.startDate).format('DD-MM-YYYY') === moment(week.startDate).format('DD-MM-YYYY')
        && moment(noRepeatingWeek.endDate).format('DD-MM-YYYY') === moment(week.endDate).format('DD-MM-YYYY')).length > 0 ? null : noRepeatingDate.push(week));
      setTableHeadData(noRepeatingDate);
      return noRepeatingDate;
  };

  const getTableData = (weeks, stakeholders, selectedType) => {
    let names = [];
    if (weeks) {
      stakeholders.forEach(stakeholder => {
        names.push(stakeholder[selectedType])
      });
      names = [...new Set(names)];
      return names.map(name => {
        const ids = stakeholders.filter(stakeholder => stakeholder[selectedType] === name).map(stakeholder => stakeholder._id);
        const activities = allActivities.filter(activity => !_.isEmpty(_.intersection(ids, activity.stakeHolders)));
        const calculationActivity = [];
        weeks.forEach(week => {
          calculationActivity.push(calculationActivities(week, activities))
        });
        return {name: name, info: calculationActivity};
      })
    }
  };

  const getTableDataGroup = (weeks, stakeholders, isGroup) => {
    let names = [];
    if (weeks) {
      stakeholders.forEach(stakeholder => {
        names.push(isGroup ? stakeholder.groupName : `${stakeholder.firstName} ${stakeholder.lastName}`)
      });
      names = [...new Set(names)];
      return names.map(name => {
        let ids = [];
        if (isGroup) {
          ids = stakeholders.filter(stakeholder => stakeholder.groupName === name).map(stakeholder => stakeholder._id);
        } else {
          ids = stakeholders.filter(stakeholder => `${stakeholder.firstName} ${stakeholder.lastName}` === name).map(stakeholder => stakeholder._id);
        }
        const activities = allActivities.filter(activity => !_.isEmpty(_.intersection(ids, activity.stakeHolders)));
        const calculationActivity = [];
        weeks.forEach(week => {
          calculationActivity.push(calculationActivities(week, activities))
        });
        return {name: name, info: calculationActivity};
      })
    }
  };

  const calculationActivities = (week, activities) => {
    let weekActivities = 0;
    if (type === 'activities') {
      weekActivities = activities.filter(activity => moment(moment(activity.dueDate).format()).isBetween(moment(week.startDate).format(), moment(week.endDate).format())).length;
    } else if (type === 'time') {
      const currentActivities = activities.filter(activity => moment(moment(activity.dueDate).format()).isBetween(moment(week.startDate).format(), moment(week.endDate).format()));
      let totalTime = 0;
      currentActivities.forEach(activity => {
        totalTime = weekActivities + activity.time;
      });
      weekActivities = totalTime < 60 ? totalTime + " mins" : parseFloat(totalTime / 60).toFixed(2) + " hrs";
    }
    return {week: week, activities: weekActivities}
  };

  return (
    <Grid className={classes.root}>
      <Paper className={classes.paper}>
        <Grid container direction="row" justify="center" alignItems="center">
          <Grid container direction="row" justify="space-between" alignItems="center">
            <Grid item xs={5}>
              <Typography color="textSecondary" variant="h4" className={classes.topHeading}>
                {type === "time" ? "Time away from BAU" : "Activities"}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Tabs centered value={selectedTab} variant="fullWidth"
                    onChange={(e, newValue) => setSelectedTab(newValue)} indicatorColor="primary"
                    textColor="primary" className={classes.tabs}>
                <Tab value={0} label="STAKEHOLDER" className={classes.tab}/>
                <Tab value={1} label="TEAM" className={classes.tab}/>
                <Tab value={2} label="LOCATION" className={classes.tab}/>
                <Tab value={3} label="BUSINESS UNIT" className={classes.tab}/>
                <Tab value={4} label="GROUP" className={classes.tab}/>
              </Tabs>
            </Grid>
          </Grid>
          <Grid item xs={12} className={classes.gridTable}>
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell size="small" className={classes.tableHead} align="left">{nameTableHead}</TableCell>
                  {tableHeadData.length > 0 && tableHeadData.map((week, index) => {
                    return <TableCell className={classes.nameTableCell} align="center"
                      key={index}>{`${moment(week.startDate).format('DD MMM')} - ${moment(week.endDate).format('DD MMM')}`}</TableCell>
                  })}
                </TableRow>
              </TableHead>
              <TableBody>
                {tableData.length > 0 && tableData.map((data, index) => {
                  return <TableRow key={index}>
                    <TableCell className={classes.nameTableCell} align="left" padding="none"
                               key={index}>{data.name}</TableCell>
                    {data.info.map((info, index) => {
                      return <TableCell padding="none" align="center" className={classes.tableCell}
                                        key={index}>{info.week && ((info.activities !== 0 && info.activities !== '0 mins') ? info.activities : '-')}</TableCell>
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

export default TimeAndActivitiesReport;
