import React from 'react';
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Checkbox from "@material-ui/core/Checkbox";
import EditStakeHolderPage from './Modals/EditStakeHolder';
import DeleteStakeHolder from './Modals/DeleteStakeHolder';

const StakeHolder = (props) => {
  const {row, isItemSelected, labelId, setRowSelected, deleteCell, selected, hideSelected = false, smallTable = false, index, isAdmin, isSuperAdmin, template, company, projectId} = props;
  const [showEditModalDialog, setShowEditModalDialog] = React.useState(false);

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
      {!hideSelected && <TableCell padding="checkbox">
        <Checkbox disabled={(!(isAdmin && template && (template.companyId === company._id)) && (projectId === undefined))}
                  checked={isItemSelected}
                  onChange={event => handleClick(event, row._id)}
                  inputProps={{'aria-labelledby': labelId}}
                  color="default"
        />
      </TableCell>}
      <TableCell align="left" component="th" id={labelId} scope="row" onClick={handleOpenModalDialog}>
        {row.firstName}
      </TableCell>
      <TableCell align="left" component="th" id={labelId} scope="row" onClick={handleOpenModalDialog}>
        {row.lastName}
      </TableCell>
      {smallTable && <TableCell align="left" onClick={handleOpenModalDialog}>{row.email}</TableCell>}
      <TableCell align="left" onClick={handleOpenModalDialog}>{row.role}</TableCell>
      <TableCell align="left" onClick={handleOpenModalDialog}>{row.businessUnit}</TableCell>
      {!smallTable && <TableCell align="center" onClick={handleOpenModalDialog}>{row.influenceLevel}</TableCell>}
      {!smallTable && <TableCell align="center" onClick={handleOpenModalDialog}>{row.supportLevel}</TableCell>}
      {!smallTable && <TableCell align="center" onClick={event => deleteCell(event, row)}>
        {/*<IconButton aria-label="edit" onClick={handleOpenModalDialog}>*/}
        {/*    <EditIcon />*/}
        {/*</IconButton>*/}
        <EditStakeHolderPage projectId={projectId} stakeholder={row} open={showEditModalDialog} close={handleCloseModalDialog} isAdmin={isAdmin} isSuperAdmin={isSuperAdmin} template={template} company={company}/>
        {((isAdmin && template && (template.companyId === company._id)) || isSuperAdmin || projectId !== undefined) ?
        <DeleteStakeHolder stakeholder={row}/> : ''}
      </TableCell>}
    </TableRow>
  )
};

export default StakeHolder;