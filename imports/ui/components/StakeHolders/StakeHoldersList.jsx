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
import DeleteStakeHolder from './Modals/DeleteStakeHolder';
import StakeHolder from "./StakeHolder";

const tableHeadStyle = makeStyles(theme => ({
  root: {
    background: '#92A1AF',
  },
}));

function desc(a, b, orderBy) {
  let orderByA, orderByB = '';
  switch (orderBy) {
    case "name":
      if (!a.groupName) {
        orderByA = "lastName";
      }
      if (!b.groupName) {
        orderByB = "lastName";
      }
      if (!a.lastName) {
        orderByA = "groupName";
      }
      if (!b.lastName) {
        orderByB = "groupName"
      }
      break;
    case "jobTitle":
      if (!a.jobTitle) {
        orderByA = "role";
      }
      if (!b.jobTitle) {
        orderByB = "role";
      }
      if (!a.role) {
        orderByA = "jobTitle";
      }
      if (!b.role) {
        orderByB = "jobTitle"
      }
      break;
    default:
      orderByA = orderByB = orderBy;
      break;
  }
  if (b[orderByB] < a[orderByA]) {
    return -1;
  }
  if (b[orderByB] > a[orderByA]) {
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
  {id: 'name', numeric: false, disablePadding: true, label: 'NAME'},
  {id: 'jobTitle', numeric: false, disablePadding: false, label: 'JOB TITLE'},
  {id: 'businessUnit', numeric: false, disablePadding: false, label: 'BUSINESS UNIT'},
  {id: 'team', numeric: false, disablePadding: false, label: 'TEAM'},
  {id: 'roleTags', numeric: false, disablePadding: false, label: 'ROLE TAGS'},
  {id: 'location', numeric: false, disablePadding: false, label: 'LOCATION'},
  {id: 'totalTime', numeric: true, disablePadding: false, label: 'TIME AWAY FROM BAU'},
  {id: 'influenceLevel', numeric: true, disablePadding: false, label: 'INFLUENCE'},
  {id: 'supportLevel', numeric: true, disablePadding: false, label: 'SUPPORT'},
  {id: 'action', numeric: true, disablePadding: false, label: 'ACTIONS'},
];

export function EnhancedTableHead(props) {
  const tableHeadClasses = tableHeadStyle();
  const {classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort, disabled} = props;
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

const EnhancedTableToolbar = props => {
  const classes = useToolbarStyles();
  const {numSelected, selected, type, project, template} = props;

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
          <DeleteStakeHolder stakeholder={selected} multiple={true} type={type} project={project} template={template}/>
        </Tooltip>
      ) : ''
        /*(
         <Tooltip title="Filter list">
         <IconButton aria-label="filter list">
         <FilterListIcon />
         </IconButton>
         </Tooltip>
         )*/
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
}));

export default function StakeHolderList(props) {
  const classes = useStyles();
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('calories');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [showEditModalDialog, setShowEditModalDialog] = React.useState(false);
  let {rows, isAdmin, isSuperAdmin, isManager, isChangeManager, isActivityDeliverer, isActivityOwner, template, company, projectId, project, type} = props;
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
    // e.preventDefault();
    // e.stopImmediatePropagation();
    e.stopPropagation();
  };
  const handleOpenModalDialog = () => {
    setShowEditModalDialog(true)
  };
  const handleCloseModalDialog = () => {
    setShowEditModalDialog(false)
  };

  const setRowSelected = (newSelected) => {
    setSelected(newSelected);
  };

  const isSelected = name => selected.indexOf(name) !== -1;

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <EnhancedTableToolbar numSelected={selected.length} selected={selected} type={type} project={project} template={template}/>
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
                    <StakeHolder
                      index={index}
                      row={row}
                      isItemSelected={isItemSelected}
                      labelId={labelId}
                      setRowSelected={setRowSelected}
                      deleteCell={deleteCell}
                      selected={selected}
                      projectId={projectId}
                      project={project}
                      type={type}
                      template={template} company={company} isChangeManager={isChangeManager} isActivityOwner={isActivityOwner}
                      isSuperAdmin={isSuperAdmin} isAdmin={isAdmin} isManager={isManager} isActivityDeliverer={isActivityDeliverer}
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