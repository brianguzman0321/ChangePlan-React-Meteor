import React, {useEffect} from 'react';
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
import DeleteImpactModal from "./Modals/DeleteImpactModal";
import Impact from "./Impact";

const tableHeadStyle = makeStyles(theme => ({
  root: {
    background: '#92A1AF',
  },
}));

function desc(a, b, orderBy) {
  if (orderBy === 'activities' || orderBy === 'stakeholders') {
    if (b[orderBy].length < a[orderBy].length) {
      return -1;
    }
    if (b[orderBy].length > a[orderBy].length) {
      return 1;
    }
    return 0
  } else {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }
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
  {id: 'type', numeric: false, disablePadding: true, label: 'TYPE'},
  {id: 'change', numeric: false, disablePadding: true, label: 'CHANGE'},
  {id: 'impact', numeric: false, disablePadding: false, label: 'IMPACT'},
  {id: 'level', numeric: false, disablePadding: false, label: 'LEVEL'},
  {id: 'activities', numeric: true, disablePadding: false, label: 'MITIGATING ACTIVITIES'},
  {id: 'stakeholders', numeric: true, disablePadding: false, label: 'STAKEHOLDERS IMPACTED'},
  {id: 'action', numeric: true, disablePadding: false, label: 'ACTIONS'},
];

export function EnhancedTableHead(props) {
  const tableHeadClasses = tableHeadStyle();
  const {classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort, disabled} = props;
  const createSortHandler = property => event => {
    onRequestSort(event, property);
  };

  const selectClassName = (cell) => {
    switch (cell) {
      case 'type':
        return classes.cellType;
      case 'change':
        return classes.cellChange;
      case 'impact':
        return classes.cellImpact;
      case 'level':
        return classes.cellLevel;
      case 'activities':
        return classes.cellStakeholders;
      case 'stakeholders':
        return classes.cellStakeholders;
      case 'actions':
        return classes.cellChange;
      default:
        break;
    }
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
                     className={selectClassName(headCell.id)}
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
  const {numSelected, selected, type} = props;

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
          <DeleteImpactModal impact={selected} multiple={true} type={type}/>
        </Tooltip>
      ) : ''
      }
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    margin: theme.spacing(3),
  },
  head: {
    background: 'red'
  },
  paper: {
    width: '100%',
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
  cellType: {
    width: '10%',
    padding: '14px 6px 14px 6px',
  },
  cellChange: {
    width: '25%',
    padding: '14px 6px 14px 6px',
  },
  cellImpact: {
    width: '25%',
    padding: '14px 6px 14px 6px',
  },
  cellLevel: {
    width: '10%',
    padding: '14px 6px 14px 6px',
  },
  cellActivities: {
    width: '5%',
    padding: '14px 6px 14px 6px',
  },
  cellStakeholders: {
    width: '5%',
    padding: '14px 6px 14px 6px',
  },
}));

export default function ImpactsList(props) {
  const classes = useStyles();
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('calories');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const dense = false;
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  let {rows, match, isAdmin, isSuperAdmin, isManager, isChangeManager, isActivityDeliverer, isActivityOwner, template,
    company, projectId, templateId, project, type, allStakeholders} = props;
  const disabled = (!(isAdmin && template && (template.companyId === company._id) || isSuperAdmin) && (projectId === undefined))
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
        <EnhancedTableToolbar numSelected={selected.length} selected={selected} type={type} project={project}
                              template={template}/>
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
                    <Impact
                      row={row}
                      allStakeholders={allStakeholders}
                      isItemSelected={isItemSelected}
                      labelId={labelId}
                      setRowSelected={setRowSelected}
                      deleteCell={deleteCell}
                      selected={selected}
                      projectId={projectId}
                      templateId={templateId}
                      project={project}
                      match={match}
                      type={type}
                      template={template} company={company} isChangeManager={isChangeManager}
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
}