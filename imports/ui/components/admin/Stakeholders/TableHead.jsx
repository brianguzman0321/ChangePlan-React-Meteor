import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Checkbox from "@material-ui/core/Checkbox";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import PropTypes from "prop-types";
import React from "react";
import {makeStyles} from "@material-ui/core";
import Toolbar from "@material-ui/core/Toolbar";
import clsx from "clsx";
import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";
import DeleteStakeHolder from "../../StakeHolders/Modals/DeleteStakeHolder";

const headCells = [
  {id: 'projectName', numeric: false, disablePadding: false, label: 'PROJECTS'},
  {id: 'name', numeric: false, disablePadding: true, label: 'NAME'},
  {id: 'email', numeric: false, disablePadding: false, label: 'EMAIL'},
  {id: 'location', numeric: false, disablePadding: false, label: 'LOCATION'},
  {id: 'jobTitle', numeric: false, disablePadding: false, label: 'JOB TITLE'},
  {id: 'team', numeric: false, disablePadding: false, label: 'TEAM'},
  {id: 'businessUnit', numeric: false, disablePadding: false, label: 'BUSINESS UNIT'},
  {id: 'totalTime', numeric: true, disablePadding: false, label: 'TIME AWAY FROM BAU'},
  {id: 'action', numeric: true, disablePadding: false, label: 'ACTIONS'},
];

const tableHeadStyle = makeStyles(theme => ({
  root: {
    background: '#92A1AF',
  },
}));

export function EnhancedTableHead(props) {
  const tableHeadClasses = tableHeadStyle();
  const {classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort} = props;
  const createSortHandler = property => event => {
    onRequestSort(event, property);
  };

  const selectAlign = (id) => (['influenceLevel', 'supportLevel', 'action'].includes(id) ? 'center' : 'left');

  return (
    <TableHead classes={tableHeadClasses}>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{'aria-label': 'select all desserts'}}
            color="default"
          />
        </TableCell>
        {headCells.map(headCell => (
          <TableCell style={{color: 'white'}}
                     key={headCell.id}
                     className={classes.tableCell}
                     align={selectAlign(headCell.id)}
                     sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={order}
              onClick={headCell.id === 'action' ? null : createSortHandler(headCell.id)}
              hideSortIcon={headCell.id === 'action'}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                              </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const useToolbarStyles = makeStyles(theme => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
    minHeight: 50
  },
  highlight:
    theme.palette.type === 'light'
      ? {
        color: 'white',
        backgroundColor: '#465563',
      }
      : {
        backgroundColor: '#465563',
      },
  title: {
    flex: '1 1 100%',
  },
}));

export const EnhancedTableToolbar = props => {
  const classes = useToolbarStyles();
  const {numSelected, selected, type, project, template, projects, isChangeManager, isAdmin, isSuperAdmin} = props;

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: false,
      })}
    >
      <Typography className={classes.title} variant="subtitle1">
        {numSelected} selected
      </Typography>
      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <DeleteStakeHolder stakeholder={selected} multiple={true} type={type} project={project} template={template}
                             projects={projects}  isChangeManager={isChangeManager} isAdmin={isAdmin} isSuperAdmin={isSuperAdmin}/>
        </Tooltip>
      ) : ''
      }
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};