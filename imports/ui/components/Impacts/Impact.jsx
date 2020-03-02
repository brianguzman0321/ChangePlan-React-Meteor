import React from 'react';
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Checkbox from "@material-ui/core/Checkbox";
import ImpactsModal from "./Modals/ImpactsModal";
import DeleteImpactModal from "./Modals/DeleteImpactModal";
import {stringHelpers} from "../../../helpers/stringHelpers";
import {makeStyles} from "@material-ui/core";
import {getTotalStakeholders} from "../../../utils/utils";

const useStyles = makeStyles(theme => ({
  cellInfo: {
    padding: '14px 6px 14px 6px',
  },
}));

const Impact = (props) => {
  const {
    row, isItemSelected, labelId, setRowSelected, deleteCell, selected, index, isAdmin, isSuperAdmin, match, allStakeholders,
    isManager, isChangeManager, isActivityOwner, isActivityDeliverer, template, company, projectId, templateId, project, type
  } = props;
  const classes = useStyles();
  const [showEditModalDialog, setShowEditModalDialog] = React.useState(false);
  const disabled = (!(isAdmin && template && (template.companyId === company._id)
    || isSuperAdmin) && (projectId === undefined))
    || ((isManager || isActivityDeliverer || isActivityOwner) && !isSuperAdmin && !isAdmin && !isChangeManager);

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
      <TableCell className={classes.cellInfo} align="left" component="th" id={labelId} scope="row" onClick={handleOpenModalDialog}>
        {row.type[0].toUpperCase() + row.type.slice(1)}
      </TableCell>
      <TableCell align="left" component="th" id={labelId} scope="row" onClick={handleOpenModalDialog}>
        {stringHelpers.limitCharacters(row.change, 112)}
      </TableCell>
      <TableCell align="left" className={classes.cellInfo} onClick={handleOpenModalDialog}>{stringHelpers.limitCharacters(row.impact, 112)}</TableCell>
      <TableCell align="left" className={classes.cellInfo} onClick={handleOpenModalDialog}>{row.level[0].toUpperCase() + row.level.slice(1)}</TableCell>
      <TableCell align="left" className={classes.cellInfo} onClick={handleOpenModalDialog}>{row.activities.length || 0}</TableCell>
      <TableCell align="left" className={classes.cellInfo} onClick={handleOpenModalDialog}>{getTotalStakeholders(allStakeholders, row.stakeholders)}</TableCell>
      <TableCell align="left" className={classes.cellInfo} onClick={event => deleteCell(event, row)}>
        <ImpactsModal isNew={false} projectId={projectId} impact={row} open={showEditModalDialog} match={match}
                             isChangeManager={isChangeManager} currentType={type} handleModalClose={handleCloseModalDialog} templateId={templateId}
                             isAdmin={isAdmin} isSuperAdmin={isSuperAdmin}
                             isManager={isManager} disabled={disabled}/>
        {(isAdmin && template && (template.companyId === company._id)) || isSuperAdmin || (type === 'project' && (project && (isAdmin || isChangeManager))) ?
          <DeleteImpactModal impact={row} type={type} /> : null}
      </TableCell>
    </TableRow>
  )
};

export default Impact;