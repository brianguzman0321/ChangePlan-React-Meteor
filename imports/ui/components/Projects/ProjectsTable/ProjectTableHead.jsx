import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import PropTypes from "prop-types";
import React from "react";
import {makeStyles} from "@material-ui/core";

const headCells = [
  {id: 'status', numeric: false, disablePadding: true, label: 'STATUS'},
  {id: 'startingDate', numeric: false, disablePadding: true, label: 'DUE DATE'},
  {id: 'name', numeric: false, disablePadding: true, label: 'NAME'},
  {id: 'organization', numeric: false, disablePadding: true, label: 'ORGANIZATION'},
  {id: 'function', numeric: false, disablePadding: true, label: 'FUNCTION'},
  {id: 'people', numeric: true, disablePadding: true, label: 'PEOPLE'},
  {id: 'impacts', numeric: true, disablePadding: true, label: 'IMPACTS'},
  {id: 'activities', numeric: false, disablePadding: true, label: 'ACTIVITIES'},
  {id: 'overdue', numeric: true, disablePadding: true, label: 'OVERDUE'},
  {id: 'timeConsumed', numeric: true, disablePadding: true, label: 'TIME CONSUMED'},
  {id: 'adoption', numeric: true, disablePadding: true, label: 'ADOPTION'},
  {id: 'changeManagers', numeric: false, disablePadding: true, label: 'CHANGE MANAGER/S'},
  {id: 'lastLogin', numeric: false, disablePadding: true, label: 'LAST LOGIN'},
  {id: 'action', numeric: false, disablePadding: true, label: ''},
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
                              className={classes.tableCellPadding}
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
