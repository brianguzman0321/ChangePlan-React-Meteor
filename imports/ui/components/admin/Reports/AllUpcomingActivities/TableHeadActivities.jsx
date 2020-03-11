import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import PropTypes from "prop-types";
import {makeStyles} from "@material-ui/core";
import Toolbar from "@material-ui/core/Toolbar";
import clsx from "clsx";
import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";
import React from "react";

const tableHeadStyle = makeStyles(theme => ({
  root: {
    background: '#92A1AF',
  },
}));

const headCells = [
  {id: 'completed', numeric: true, disablePadding: false, label: 'MARK COMPLETE'},
  {id: 'dueDate', numeric: false, disablePadding: true, label: 'DUE DATE'},
  {id: 'project', numeric: false, disablePadding: false, label: 'Project'},
  {id: 'name', numeric: false, disablePadding: false, label: 'ACTIVITY'},
  {id: 'phase', numeric: false, disablePadding: false, label: 'CHANGE PHASE'},
  {id: 'time', numeric: true, disabledPadding: false, label: 'TIME AWAY FROM BAU'},
  {id: 'deliverer', numeric: false, disablePadding: false, label: 'DELIVERER'},
  {id: 'owner', numeric: false, disabledPadding: false, label: 'OWNER'},
  {id: 'stakeholders', numeric: true, disabledPadding: false, label: 'STAKEHOLDERS'},
  {id: 'impacts', numeric: true, disabledPadding: false, label: 'IMPACTS ADDRESSED'},
  {id: 'stakeholdersFeedback', numeric: false, disablePadding: false, label: 'FEEDBACK'},
  {id: 'cost', numeric: true, disablePadding: false, label: 'COST'},
  {id: 'changeManager', numeric: false, disablePadding: false, label: 'CHANGE MANAGER/S'},
];

export function EnhancedTableHead(props) {
  const tableHeadClasses = tableHeadStyle();
  const {classes, order, orderBy, onRequestSort} = props;
  const createSortHandler = property => event => {
    onRequestSort(event, property);
  };

  return (
    <TableHead classes={tableHeadClasses}>
      <TableRow>
        {headCells.map(headCell => (
          <TableCell className={classes.tableCell}
                     key={headCell.id}
                     align={headCell.id === 'name' || headCell.id === 'activityDeliverer' ? 'left' : 'center'}
                     sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={order}
              onClick={createSortHandler(headCell.id)}
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
  const {numSelected} = props;

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      {numSelected > 0 ? (
        <Typography className={classes.title} variant="subtitle1">
          {numSelected} selected
        </Typography>
      ) : ''
      }

      {numSelected > 0 ? (
        <Tooltip title="Delete">
        </Tooltip>
      ) : ''
      }
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};
