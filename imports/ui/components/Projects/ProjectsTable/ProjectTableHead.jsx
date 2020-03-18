import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import PropTypes from "prop-types";
import React from "react";
import {makeStyles} from "@material-ui/core";

const headCells = [
  {id: 'status', numeric: false, disablePadding: false, label: 'STATUS'},
  {id: 'dueDate', numeric: false, disablePadding: false, label: 'DUE DATE'},
  {id: 'name', numeric: false, disablePadding: true, label: 'NAME'},
  {id: 'organization', numeric: false, disablePadding: false, label: 'ORGANIZATION'},
  {id: 'function', numeric: false, disablePadding: false, label: 'FUNCTION'},
  {id: 'people', numeric: true, disablePadding: false, label: 'PEOPLE'},
  {id: 'impacts', numeric: true, disablePadding: false, label: 'IMPACTS'},
  {id: 'activities', numeric: false, disablePadding: false, label: 'ACTIVITIES'},
  {id: 'overdue', numeric: true, disablePadding: false, label: 'OVERDUE'},
  {id: 'timeConsumed', numeric: true, disablePadding: false, label: 'TIME CONSUMED'},
  {id: 'adoption', numeric: true, disablePadding: false, label: 'ADOPTION'},
  {id: 'changeManagers', numeric: false, disablePadding: false, label: 'CHANGE MANAGER/S'},
  {id: 'lastLogin', numeric: false, disablePadding: false, label: 'LAST LOGIN'},
  {id: 'action', numeric: false, disablePadding: false, label: ''},
];

const tableHeadStyle = makeStyles(theme => ({
  root: {
    background: '#92A1AF',
  },
}));

export function EnhancedTableHead(props) {
  const tableHeadClasses = tableHeadStyle();
  const {classes, order, orderBy, onRequestSort, company} = props;
  const createSortHandler = property => event => {
    onRequestSort(event, property);
  };

  return (
    <TableHead classes={tableHeadClasses}>
      <TableRow>
        {headCells.map(headCell => {
          if ((headCell.id === 'organization' && !company.organizationField)
            || (headCell.id === 'function' && !company.functionField)) {
            return null;
          } else {
            return <TableCell style={{color: 'white', whiteSpace: 'nowrap'}}
                              key={headCell.id}
                              align={"left"}
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
          }
        })}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};
