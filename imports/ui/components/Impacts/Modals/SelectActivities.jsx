import Table from "@material-ui/core/Table";
import Paper from "@material-ui/core/Paper";
import {makeStyles, TableCell, TableHead, TableRow, TableBody} from "@material-ui/core";
import clsx from "clsx";
import PropTypes from "prop-types";
import Checkbox from "@material-ui/core/Checkbox";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import moment from "moment";
import React, {useState} from "react";
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import SaveChanges from "../../Modals/SaveChanges";
import {getPhase} from "../../../../utils/utils";

const tableHeadStyle = makeStyles(theme => ({
  root: {
    background: '#f5f5f5',
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
  {id: 'dueDate', numeric: true, disablePadding: true, label: 'Due date'},
  {id: 'phase', numeric: false, disablePadding: true, label: 'Phase'},
  {id: 'type', numeric: true, disablePadding: false, label: 'Type'},
  {id: 'time', numeric: true, disablePadding: false, label: 'Time away from BAU'},
  {id: 'deliverer', numeric: true, disablePadding: false, label: 'Deliverer'},
  {id: 'description', numeric: true, disablePadding: false, label: 'Description'},
];

function EnhancedTableHead(props) {
  const tableHeadClasses = tableHeadStyle();
  const {classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort} = props;
  const createSortHandler = property => event => {
    onRequestSort(event, property);
  };

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
          <TableCell
            key={headCell.id}
            align={'left'}
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
  title: {
    flex: '1 1 100%',
  },
}));

const EnhancedTableToolbar = props => {
  const classes = useToolbarStyles();

  return (
    <Toolbar className={clsx(classes.root)}></Toolbar>
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
  selectButton: {
    color: '#3f51b5',
  },
  appBar: {
    position: 'relative',
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  buttonSelect: {
    padding: '0px',
    '&:hover': {
      backgroundColor: '#ffffff',
      borderColor: '#ffffff',
      boxShadow: 'none',
    },
  },
}));

const ListActivities = (props) => {
  let {activities, selectActivities, update, selectedActivities, company} = props;
  const classes = useStyles();
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('calories');
  const [selected, setSelected] = React.useState(selectedActivities || []);
  const page = 0;
  const dense = false;
  const rowsPerPage = 10;

  const handleRequestSort = (event, property) => {
    const isDesc = orderBy === property && order === 'desc';
    setOrder(isDesc ? 'asc' : 'desc');
    setOrderBy(property);
  };

  const handleSelectAllClick = event => {
    update();
    if (event.target.checked) {
      const newSelecteds = activities.map(n => n._id);
      setSelected(newSelecteds);
      selectActivities(newSelecteds);
      return;
    }
    setSelected([]);
    selectActivities([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    setSelected(newSelected);
    selectActivities(newSelected);
    update();
  };

  const isSelected = name => selected.indexOf(name) !== -1;
  const emptyRows = rowsPerPage - Math.min(rowsPerPage, activities.length - page * rowsPerPage);

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <div className={classes.tableWrapper}>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              classes={classes}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={activities.length}
              stakeHolders={props.stakeHolders}
            />
            <TableBody>
              {stableSort(activities, getSorting(order, orderBy))
                .map((row, index) => {
                  const isItemSelected = isSelected(row._id);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={event => handleClick(event, row._id)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row._id}
                      selected={isItemSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isItemSelected}
                          inputProps={{'aria-labelledby': labelId}}
                          color="default"
                        />
                      </TableCell>
                      <TableCell align="left">{moment(row.dueDate).format('MM-DD-YYYY')}</TableCell>
                      <TableCell align="left">{getPhase(row.step, company)}</TableCell>
                      <TableCell align="left">{row.name}</TableCell>
                      <TableCell align="left">{row.time}</TableCell>
                      <TableCell align="left">{row.personResponsible ? `${row.personResponsible.profile.firstName} ${row.personResponsible.profile.lastName}` : '-'}</TableCell>
                      <TableCell align="left">{row.description}</TableCell>
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
      </Paper>
    </div>
  )
};

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function SelectActivities(props) {
  let {
    activities, selectedActivities, handleClose, open, handleChange, company,
  } = props;
  const classes = useStyles();
  const [selActivities, setSelActivities] = React.useState(selectedActivities || []);
  const [showModalDialog, setShowModalDialog] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);

  const handleOpenModalDialog = () => {
    if (isUpdated) {
      setShowModalDialog(true);
    } else {
      handleClose();
    }
  };

  const closeModalDialog = () => {
    setShowModalDialog(false);
    setIsUpdated(false);
  };

  const updateValue = () => {
    setIsUpdated(true);
  };

  const updateActivities = () => {
    handleChange(selActivities);
    closeModalDialog(isUpdated);
    handleClose();
  };

  const selectActivities = (ids) => {
    setSelActivities(ids);
  };

  return (
    <div>

      <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
        <AppBar className={classes.appBar} color="default">
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={isUpdated ? handleOpenModalDialog : handleClose}
                        aria-label="close">
              <CloseIcon/>
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              Select Activities
            </Typography>
            <Typography variant="h6" className={classes.title}>
              Selected {selActivities && selActivities.length}
            </Typography>
              <Button autoFocus color="inherit" onClick={updateActivities}>
                save
              </Button>
          </Toolbar>
        </AppBar>
        <ListActivities activities={activities} company={company}
                         selectActivities={selectActivities}
                        selectedActivities={selectedActivities} update={updateValue}/>
        <SaveChanges closeModalDialog={closeModalDialog}
                     handleClose={handleClose}
                     showModalDialog={showModalDialog}
                     handleSave={updateActivities}
        />
      </Dialog>
    </div>
  );
}