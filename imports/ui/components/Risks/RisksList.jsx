import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {makeStyles} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import Tooltip from '@material-ui/core/Tooltip';
import Grid from "@material-ui/core/Grid";
import {withSnackbar} from "notistack";
import DeleteRiskModal from "./Modal/DeleteRiskModal";
import Risk from "./Risk";

const tableHeadStyle = makeStyles(theme => ({
  root: {
    background: '#92A1AF',
  },
}));

function desc(a, b, orderBy) {
  switch (orderBy) {
    case 'activities': {
      a[orderBy] = a[orderBy].length;
      b[orderBy] = b[orderBy].length;
      break;
    }
    case 'owner': {
      a[orderBy] = a.ownerLastName;
      b[orderBy] = b.ownerLastName;
      break;
    }
    default:
      break;
  }
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function stableSort(array, cmp) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
  return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}

const headCells = [
  {id: 'description', numeric: false, disablePadding: true, label: 'DESCRIPTION'},
  {id: 'raisedDate', numeric: false, disablePadding: true, label: 'RAISED DATE'},
  {id: 'category', numeric: false, disablePadding: false, label: 'RISK CATEGORY'},
  {id: 'probability', numeric: false, disablePadding: false, label: 'PROBABILITY'},
  {id: 'impact', numeric: false, disablePadding: false, label: 'IMPACT'},
  {id: 'rating', numeric: false, disablePadding: false, label: 'RATING'},
  {id: 'owner', numeric: false, disablePadding: false, label: 'OWNER'},
  {id: 'activities', numeric: true, disablePadding: false, label: 'MITIGATING ACTIVITIES'},
  {id: 'comments', numeric: false, disablePadding: false, label: 'COMMENTS'},
  {id: 'residualProbability', numeric: false, disablePadding: false, label: 'RESIDUAL PROBABILITY'},
  {id: 'residualImpact', numeric: false, disablePadding: false, label: 'RESIDUAL IMPACT'},
  {id: 'residualRating', numeric: false, disablePadding: false, label: 'RESIDUAL RATING'},
  {id: 'status', numeric: false, disablePadding: false, label: 'STATUS'},
  {id: 'actions', numeric: false, disablePadding: false, label: 'ACTIONS'},
];

export function EnhancedTableHead(props) {
  const tableHeadClasses = tableHeadStyle();
  const {classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort, disabled} = props;
  const createSortHandler = property => event => {
    onRequestSort(event, property);
  };

  return (
    <TableHead classes={tableHeadClasses}>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            disabled={disabled}
            checked={numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{'aria-label': 'select all desserts'}}
            color="default"
          />
        </TableCell>
        {headCells.map(headCell => (
          <TableCell style={{color: 'white'}}
                     key={headCell.id}
                     align={'left'}
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

const EnhancedTableToolbar = props => {
  const classes = useToolbarStyles();
  const {
    numSelected, selected, type,
  } = props;

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: false,
      })}
    >
      <Grid container direction={'row'} alignItems={'center'} justify={'space-between'}>
        <Grid item xs={6}>
          <Typography className={classes.title} variant="subtitle1">
            {numSelected} selected
          </Typography>
        </Grid>
        {numSelected > 0 ? (
          <Tooltip title="Delete">
            <DeleteRiskModal risk={selected} multiple={true} type={type}/>
          </Tooltip>
        ) : ''
        }
      </Grid>
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

const useStyles = makeStyles(theme => ({
  root: {
    width: '100vw',
  },
  head: {
    background: 'red'
  },
  paper: {
    width: '90vw',
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
  tableCell: {
    whiteSpace: 'nowrap',
    padding: '10px 5px 10px 5px'
  },
  tableCellPadding: {
    padding: '10px 5px 10px 5px'
  }
}));

const RisksList = (props) => {
  const classes = useStyles();
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('calories');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const dense = false;
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  let {
    rows, match, isAdmin, isSuperAdmin, isManager, isChangeManager, isActivityDeliverer, isActivityOwner,
    company, projectId, project,
  } = props;
  const disabled = (!(isAdmin || isSuperAdmin))
    || ((isManager || isActivityDeliverer || isActivityOwner) && !isChangeManager && !isAdmin && !isSuperAdmin);

  const handleRequestSort = (event, property) => {
    const isDesc = orderBy === property && order === 'desc';
    setOrder(isDesc ? 'asc' : 'desc');
    setOrderBy(property);
  };

  const handleSelectAllClick = event => {
    if (event.target.checked) {
      const newSelecteds = rows.map(n => n._id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  useEffect(() => {
    setSelected([]);
  }, [project]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const deleteCell = (e, row) => {
    e.stopPropagation();
  };

  const setRowSelected = (newSelected) => {
    setSelected(newSelected);
  };

  const isSelected = name => selected.indexOf(name) !== -1;

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <EnhancedTableToolbar numSelected={selected.length} selected={selected}
                              company={company} projectId={projectId} project={project} impacts={rows}
                              enqueueSnackbar={props.enqueueSnackbar}
                              isSuperAdmin={isSuperAdmin} isAdmin={isAdmin} match={match} isManager={isManager}
                              isChangeManager={isChangeManager}/>
        <div className={classes.tableWrapper}>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              disabled={disabled}
              classes={classes}
              style={{color: 'white'}}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
              stakeHolders={props.stakeHolders}
            />
            <TableBody>
              {stableSort(rows, getSorting(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row._id);
                  const labelId = `enhanced-table-checkbox-${index}`;
                  return (
                    <Risk
                      row={row} key={index}
                      isItemSelected={isItemSelected}
                      labelId={labelId}
                      classes={classes}
                      setRowSelected={setRowSelected}
                      deleteCell={deleteCell}
                      selected={selected}
                      projectId={projectId}
                      project={project}
                      match={match}
                      company={company} isChangeManager={isChangeManager}
                      isActivityOwner={isActivityOwner}
                      isSuperAdmin={isSuperAdmin} isAdmin={isAdmin} isManager={isManager}
                      isActivityDeliverer={isActivityDeliverer}
                    />
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{height: (dense ? 33 : 53) * emptyRows}}>
                  <TableCell colSpan={6}/>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          backIconButtonProps={{
            'aria-label': 'previous page',
          }}
          nextIconButtonProps={{
            'aria-label': 'next page',
          }}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
};

export default withSnackbar(RisksList);