import React from 'react';
import {DialogContent} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import { makeStyles } from '@material-ui/core/styles';
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import StakeHolder from "../StakeHolder";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";


const useStyles = makeStyles(theme => ({
  dialogPaper: {
    minHeight: '80vh',
    maxHeight: '80vh',
    minWidth: '80vw',
  },
  dialogContent: {
    padding: theme.spacing(3, 3),
  },
  root: {
    width: '100%',
    margin: theme.spacing(3),
  },
  head: {
    background : 'red'
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

const tableHeadStyle = makeStyles(theme => ({
  root: {
    background: '#92A1AF',
  },
}));
const EnhancedTableHead = () => {
  const headCells = ['NAME', 'EMAIL ADDRESS', 'ROLE', 'BUSINESS UNIT'];
  const tableHeadClasses = tableHeadStyle();

  return (
    <TableHead classes={tableHeadClasses}>
      <TableRow>
        {headCells.map((headCell, i) => (
          <TableCell style={{color: 'white'}}
                     key={i}
                     align='left'
          > { headCell }
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

const AddStakeHoldersResults = ({showModalDialog, tableData, closeModalDialog }) => {
  const styles = useStyles();
  const tableRows = Object.values(tableData);
  let stakeHolders = [];

  tableRows.forEach(holders => stakeHolders = stakeHolders.concat(holders));

  return (
    <div>
      <Dialog
        open={ showModalDialog }
        classes={{paper: styles.dialogPaper}}
        aria-labelledby="customized-dialog-title"
        aria-describedby="customized-dialog-description"
        onClose={ () => closeModalDialog() }>
        <DialogTitle id="customized-dialog-title" onClose={() => closeModalDialog()}>
          { tableData.new.length ? `${tableData.new.length} new stakeholders added \n` : ''}
          { tableData.attached.length ? `${tableData.attached.length} Stakeholders added that are also attached to other projects: \n` : ''}
        </DialogTitle>
        <DialogContent id="customized-dialog-description" className={styles.dialogContent}>
          <Table
            className={styles.table}
            aria-labelledby="tableTitle"
            aria-label="enhanced table"
          >
            {EnhancedTableHead()}
            <TableBody>
              {stakeHolders.map((row, index) => {
                  return (
                    <StakeHolder
                      key={index}
                      smallTable={true}
                      row={row}
                      hideSelected={true}
                    />
                  );
                })}
            </TableBody>
          </Table>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={closeModalDialog}>Ok</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
};

export default AddStakeHoldersResults;