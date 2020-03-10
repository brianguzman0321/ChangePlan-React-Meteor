import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TablePagination from "@material-ui/core/TablePagination";
import React, {useState} from "react";
import UpcomingActivity from "./UpcomingActivity";
import {EnhancedTableHead, EnhancedTableToolbar} from "./TableHeadActivities";
import AddActivities from "../../../Activities/Modals/AddActivities";

function desc(a, b, orderBy) {
  if (orderBy === 'activityDeliverer') {
    if (b.personResponsible.profile.lastName < a.personResponsible.profile.lastName) {
      return -1;
    }
    if (b.personResponsible.profile.lastName > a.personResponsible.profile.lastName) {
      return 1;
    }
    return 0;
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

export default function UpcomingActivitiesList(props) {
  let {classes, rows, addNew, type, isAdmin, isChangeManager, match, company, allStakeholders} = props;
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('calories');
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [selectedActivity, setSelectedActivity] = useState({});
  const [dense, setDense] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [edit, setEdit] = useState(addNew || false);
  const [step, setStep] = useState(0);

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

  const completeActivity = (activity) => {
    activity.completed = !activity.completed;
    delete activity.personResponsible;
    if (activity.completed) {
      activity.completedAt = activity.dueDate;
    } else {
      activity.completedAt = null;
    }
    delete activity.activityDeliverer;
    let params = {
      activity
    };
    Meteor.call('activities.update', params, (err, res) => {
    })
  };

  const editActivity = (activity) => {
    setSelectedActivity(activity);
    setEdit(true);
    setStep(activity.step);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

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
                    <UpcomingActivity key={index} row={row} company={company} labelId={labelId}
                                      editActivity={editActivity} completeActivity={completeActivity} allStakeholders={allStakeholders}/>
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
        <AddActivities edit={edit} activity={selectedActivity} newActivity={() => setEdit(false)} list={true} isOpen={false}
                       type={'project'} template={undefined} match={match} step={step}
                       isSuperAdmin={false} isAdmin={isAdmin} isManager={false}
                       isActivityDeliverer={false} isChangeManager={isChangeManager}/>
      </Paper>
    </div>
  )
}