import React from 'react';
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Checkbox from "@material-ui/core/Checkbox";
import {stringHelpers} from "../../../helpers/stringHelpers";
import RisksModal from "./Modal/RisksModal";
import DeleteRiskModal from "./Modal/DeleteRiskModal";
import moment from "moment";

const Risk = (props) => {
  const {
    row, isItemSelected, labelId, setRowSelected, deleteCell, selected, index, isAdmin, isSuperAdmin, match,
    isManager, isChangeManager, isActivityOwner, isActivityDeliverer, company, project, classes,
  } = props;
  const [showEditModalDialog, setShowEditModalDialog] = React.useState(false);
  const disabled = (!(isAdmin || isSuperAdmin) || ((isManager || isActivityDeliverer || isActivityOwner) && !isSuperAdmin && !isAdmin && !isChangeManager));

  const handleOpenModalDialog = () => {
    setShowEditModalDialog(true)
  };
  const handleCloseModalDialog = () => {
    setShowEditModalDialog(false)
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
    setRowSelected(newSelected);
  };

  return (
    <TableRow
      hover
      role="checkbox"
      aria-checked={isItemSelected}
      tabIndex={-1}
      key={row._id || index}
      selected={isItemSelected}
    >
      <TableCell padding="checkbox">
        <Checkbox
          disabled={disabled}
          checked={isItemSelected}
          onChange={event => handleClick(event, row._id)}
          inputProps={{'aria-labelledby': labelId}}
          color="default"
        />
      </TableCell>
      <TableCell className={classes.tableCell} align="left" component="th" id={labelId} scope="row"
                 onClick={handleOpenModalDialog}>
        {stringHelpers.limitCharacters(row.description, 112)}
      </TableCell>
      <TableCell align="left" className={classes.tableCell} onClick={handleOpenModalDialog}>
        {moment(row.raisedDate).format('DD-MMM-YY')}
      </TableCell>
      <TableCell align="left" className={classes.tableCell} onClick={handleOpenModalDialog}>{row.category}</TableCell>
      <TableCell align="left" className={classes.tableCell} onClick={handleOpenModalDialog}>{row.probability}</TableCell>
      <TableCell align="left" className={classes.tableCell} onClick={handleOpenModalDialog}>{row.impact}</TableCell>
      <TableCell align="left" className={classes.tableCell} onClick={handleOpenModalDialog}>{row.rating}</TableCell>
      <TableCell align="left" className={classes.tableCell} onClick={handleOpenModalDialog}>{row.ownerName && row.ownerName}</TableCell>
      <TableCell align="left" className={classes.tableCell}
                 onClick={handleOpenModalDialog}>{row.activities.length}</TableCell>
      <TableCell align="left" className={classes.tableCell}
                 onClick={handleOpenModalDialog}>{stringHelpers.limitCharacters(row.comments, 112)}</TableCell>
      <TableCell align="left" className={classes.tableCell}
                 onClick={handleOpenModalDialog}>{row.residualProbability}</TableCell>
      <TableCell align="left" className={classes.tableCell}
                 onClick={handleOpenModalDialog}>{row.residualImpact}</TableCell>
      <TableCell align="left" className={classes.tableCell}
                 onClick={handleOpenModalDialog}>{row.residualRating}</TableCell>
      <TableCell align="left" className={classes.tableCell} onClick={handleOpenModalDialog}>{row.status}</TableCell>
      <TableCell align="left" className={classes.tableCell} onClick={event => deleteCell(event, row)}>
        <RisksModal isNew={false} risk={row} open={showEditModalDialog} match={match} company={company}
                    isChangeManager={isChangeManager} handleModalClose={handleCloseModalDialog}
                    isAdmin={isAdmin} isSuperAdmin={isSuperAdmin} project={project}
                    isManager={isManager} disabled={disabled}/>
        {isAdmin || isSuperAdmin || (project && (isAdmin || isChangeManager)) ?
          <DeleteRiskModal risk={row}/> : null}
      </TableCell>
    </TableRow>
  )
};

export default Risk;