import React, {useEffect, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Grid from "@material-ui/core/Grid/Grid";
import {withSnackbar} from "notistack";
import {Paper, Table, TableBody, TableCell} from "@material-ui/core";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import {_} from 'meteor/underscore';
import {calculationLevels} from "../../../utils/utils";

const useStyles = makeStyles(theme => ({
  root: {
    width: '100vw',
  },
  paper: {
    width: '90vw',
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

function ImpactReport(props) {
  const classes = useStyles();
  const {match, allImpacts, allStakeholders} = props;
  const projectId = match.params.projectId;
  const [tableData, setTableData] = useState([]);
  const [selectedTab, setSelectedTab] = useState(0);
  const [nameTableHead, setNameTableHead] = useState('STAKEHOLDER');

  useEffect(() => {
    if (allStakeholders && allImpacts) {
      let stakeholders = [];
      switch (selectedTab) {
        case 0:
          stakeholders = getStakeholdersGroup(allStakeholders.filter(stakeholder => !!stakeholder.groupName), true);
          setNameTableHead('GROUP');
          break;
        case 1:
          stakeholders = getTableData(allStakeholders.filter(stakeholder => !!stakeholder.team), 'team');
          setNameTableHead('TEAM');
          break;
        case 2:
          stakeholders = getTableData(allStakeholders.filter(stakeholder => !!stakeholder.location), 'location');
          setNameTableHead('LOCATION');
          break;
        case 3:
          stakeholders = getTableData(allStakeholders.filter(stakeholder => !!stakeholder.businessUnit), 'businessUnit');
          setNameTableHead('BUSINESS UNIT');
          break;
        case 4:
          stakeholders = getStakeholdersGroup(allStakeholders.filter(stakeholder => !!stakeholder.firstName));
          setNameTableHead('STAKEHOLDER');
          break;
        default:
          break;
      }
      setTableData(stakeholders);
    }
  }, [allStakeholders, allImpacts, projectId, selectedTab]);

  const getTableData = (stakeholders, type) => {
    let names = [];
    stakeholders.forEach(stakeholder => {
      names.push(stakeholder[type])
    });
    names = [...new Set(names)];
    return names.map(name => {
      const ids = stakeholders.filter(stakeholder => stakeholder[type] === name).map(stakeholder => stakeholder._id);
      const impacts = allImpacts.filter(impact => !_.isEmpty(_.intersection(ids, impact.stakeholders)));
      let calculationLevel = [];
      ['ORGANIZATION', 'PEOPLE', 'PROCESS', 'TECHNOLOGY'].forEach(type => {
        calculationLevel.push(calculationLevels(type, impacts));
      });
      return {name: name, impactLevels: calculationLevel};
    });
  };

  const getStakeholdersGroup = (stakeholders, isGroup = false) => {
    return stakeholders.map(stakeholder => {
      const calculationLevel = [];
      const impactsStakeholder = allImpacts.filter(impact => impact.stakeholders.includes(stakeholder._id));
      ['ORGANIZATION', 'PEOPLE', 'PROCESS', 'TECHNOLOGY'].forEach(type => {
        const currentImpacts = impactsStakeholder.filter(impact => impact.type.toUpperCase() === type);
        calculationLevel.push(calculationLevels(type, currentImpacts));
      });
      stakeholder.impactLevels = calculationLevel;
      stakeholder.name = isGroup ? stakeholder.groupName : `${stakeholder.firstName} ${stakeholder.lastName}`;
      return stakeholder;
    })
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
          <Grid container direction="row" justify="space-between" alignItems="center">
            <Grid item xs={6}>
              <Typography color="textSecondary" variant="h4" className={classes.topHeading}>
                Impact heat map
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Tabs centered value={selectedTab} variant="fullWidth"
                    onChange={(e, newValue) => setSelectedTab(newValue)} indicatorColor="primary"
                    textColor="primary" className={classes.tabs}>
                <Tab value={0} label="GROUP" className={classes.tab}/>
                <Tab value={1} label="TEAM" className={classes.tab}/>
                <Tab value={2} label="LOCATION" className={classes.tab}/>
                <Tab value={3} label="BUSINESS UNIT" className={classes.tab}/>
                <Tab value={4} label="STAKEHOLDER" className={classes.tab}/>
              </Tabs>
            </Grid>
          </Grid>
          <Grid item xs={12} className={classes.gridTable}>
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell size="small" className={classes.tableHead} align="left">{nameTableHead}</TableCell>
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
                               key={index}>{data.name}</TableCell>
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

export default withSnackbar(ImpactReport);
