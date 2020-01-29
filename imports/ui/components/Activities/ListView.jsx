import React, {useEffect} from "react";
import PropTypes from 'prop-types';
import clsx from 'clsx';
import moment from 'moment'
import {withTracker} from "meteor/react-meteor-data";
import {withSnackbar} from 'notistack';
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
import AddActivities from "./Modals/AddActivities";
import AddActivity from '/imports/ui/components/Activities/Modals/AddActivity';
import AddActivity2 from '/imports/ui/components/Activities/Modals/AddActivity2';
import AddActivity3 from '/imports/ui/components/Activities/Modals/AddActivity3';
import AWARENESSCard from "./step1";
import EditProject from "../Projects/Models/EditProject";

var sActivity = {};

const tableHeadStyle = makeStyles(theme => ({
  root: {
    background: '#92A1AF',
  },
}));

function desc(a, b, orderBy) {
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
  {id: 'completed', numeric: true, disablePadding: false, label: 'MARK COMPLETE'},
  {id: 'dueDate', numeric: false, disablePadding: true, label: 'DUE DATE'},
  {id: 'completedAt', numeric: false, disablePadding: true, label: 'DATE COMPLETED'},
  {id: 'name', numeric: true, disablePadding: false, label: 'ACTIVITY'},
  {id: 'description', numeric: true, disablePadding: false, label: 'DESCRIPTION'},
  {id: 'activityOwner', numeric: false, disablePadding: false, label: 'ACTIVITY OWNER'},
];

function EnhancedTableHead(props) {
  const tableHeadClasses = tableHeadStyle();
  const {classes, order, orderBy, onRequestSort} = props;
  const createSortHandler = property => event => {
    onRequestSort(event, property);
  };

  return (
    <TableHead classes={tableHeadClasses}>
      <TableRow>
        {headCells.map(headCell => (
          <TableCell style={{color: 'white'}}
                     key={headCell.id}
                     align={headCell.id === 'name' || headCell.id === 'description' || headCell.id === 'activityOwner' ? 'left' : 'center'}
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

const EnhancedTableToolbar = props => {
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
        /*(
         <Typography className={classes.title} variant="h6" id="tableTitle">
         Nutrition
         </Typography>
         )*/
      }

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          {/*<DeleteStakeHolder stakeholder={selected} multiple={true}/>*/}
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
    width: '98%',
    margin: theme.spacing(3),
  },
  head: {
    background: 'red'
  },
  paper: {
    width: '99%',
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

function StakeHolderList(props) {
  let {rows, addNew, type, isSuperAdmin, template, companyId, isAdmin, isChangeManager, isManager, isActivityOwner, projectId, match} = props;
  const classes = useStyles();
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('calories');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [edit, setEdit] = React.useState(addNew || false);
  const [step, setStep] = React.useState(0);
  const disabled = (!(isAdmin && template && (template.companyId === companyId) || isSuperAdmin) && (projectId === undefined) || (isManager || isActivityOwner));

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

  function completeActivity(activity) {
    activity.completed = !activity.completed;
    delete activity.personResponsible;
    if (activity.completed) {
      activity.completedAt = activity.dueDate;
    } else {
      activity.completedAt = null;
    }
    delete activity.activityOwner;
    let params = {
      activity
    };
    Meteor.call('activities.update', params, (err, res) => {
    })
  }

  const editActivity = (activity) => {
    sActivity = activity;
    setEdit(true);
    setStep(activity.step);
    // setSelectedActivity(selectedActivity);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {

  }, [addNew]);

  const isSelected = name => selected.indexOf(name) !== -1;

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);
  rows.forEach(row => {
    if (row.activityOwner) {
      row.activityOwner = `${row.personResponsible.profile.firstName} ${row.personResponsible.profile.lastName}`;
    } else {
      row.activityOwner = '';
    }
  });
  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        {selected.length ? <EnhancedTableToolbar numSelected={selected.length} selected={selected}/> : ''}
        <div className={classes.tableWrapper}>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
            aria-label="enhanced table"
          >
            <EnhancedTableHead
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
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      style={{cursor: 'pointer'}}
                      hover
                      key={row._id}
                      onClick={event => editActivity(row)}
                    >
                      <TableCell align="center">
                        <Checkbox
                          disabled={disabled}
                          checked={row.completed}
                          onClick={(e) => {
                            e.stopPropagation();
                            completeActivity(row)
                          }}
                          color="default"
                        />
                      </TableCell>
                      <TableCell align="center" component="th" id={labelId} scope="row">
                        {moment(row.dueDate).format('MMM DD YYYY')}
                      </TableCell>
                      <TableCell align="center" component="th" id={labelId} scope="row">
                        {row.completedAt ? moment(row.completedAt).format('MMM DD YYYY') : ''}
                      </TableCell>
                      <TableCell align="left">{row.name}</TableCell>
                      <TableCell align="left">{row.description}</TableCell>
                      <TableCell
                        align="left">{row.personResponsible ? `${row.personResponsible.profile.firstName} ${row.personResponsible.profile.lastName}` : ''}</TableCell>

                      {/*<TableCell align="center" onClick={event => deleteCell(event, row)}>*/}
                    </TableRow>
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
      <AddActivities edit={edit} activity={sActivity} newActivity={() => setEdit(false)} list={true} isOpen={addNew}
                     type={type} template={template} match={match} step={step}
                     expandAccordian={true} isSuperAdmin={isSuperAdmin} isAdmin={isAdmin} isManager={isManager}
                     isActivityOwner={isActivityOwner} isChangeManager={isChangeManager}
                     color={step === 1 ? '#f1753e' : step === 2 ? '#53cbd0' : step === 3 ? '#bbabd2' : step === 4 ? '#8BC34A' : step === 5 ? '#03A9F4' : null}/>
      {/*<AddActivity edit={edit} activity={sActivity} newActivity={() => setEdit(false)} list={true} isOpen={addNew}
                     type={type} template={template} match={match}/>
        <AddActivity2 edit={edit2} activity={sActivity} newActivity={() => setEdit2(false)} list={true} type={type}
                      template={template} match={match}/>
        <AddActivity3 edit={edit3} activity={sActivity} newActivity={() => setEdit3(false)} list={true}
                      type={type} template={template} match={match}/>*/}
    </div>
  );
}

const ActivityListComponent = withTracker(props => {
  let local = LocalCollection.findOne({
    name: 'localProjects'
  });
  return {
    local
  };
})(StakeHolderList);

export default withSnackbar(ActivityListComponent)