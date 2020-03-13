import React from 'react';
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Checkbox from "@material-ui/core/Checkbox";
import DeleteStakeHolder from '../../StakeHolders/Modals/DeleteStakeHolder';
import EditStakeHolderPage from "../../StakeHolders/Modals/EditStakeHolder";

const Stakeholder = (props) => {
  const {
    row, isItemSelected, labelId, setRowSelected, deleteCell, selected,
    index, isAdmin, isSuperAdmin, isChangeManager, company, type, projects, project
  } = props;
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
      <TableCell padding="checkbox">
        <Checkbox
          checked={isItemSelected}
          onChange={event => handleClick(event, row._id)}
          inputProps={{'aria-labelledby': labelId}}
          color="default"
        />
      </TableCell>
      <TableCell align={"left"} onClick={handleOpenModalDialog}>{row.projectName.join(', ')}</TableCell>
      <TableCell align="left" component="th" id={labelId} scope="row">
        {row.firstName ? `${row.firstName} ${row.lastName}` : row.groupName}
      </TableCell>
      <TableCell align="left" onClick={handleOpenModalDialog}>{row.email}</TableCell>
      <TableCell align="left" onClick={handleOpenModalDialog}>{row.location}</TableCell>
      <TableCell align="left" onClick={handleOpenModalDialog}>{row.jobTitle ? row.jobTitle : row.role}</TableCell>
      <TableCell align="left" onClick={handleOpenModalDialog}>{row.team}</TableCell>
      <TableCell align="left" onClick={handleOpenModalDialog}>{row.businessUnit}</TableCell>
      <TableCell align="left" onClick={handleOpenModalDialog}>{row.totalTime}</TableCell>
      <TableCell align="center" onClick={event => deleteCell(event, row)}>
        <DeleteStakeHolder stakeholder={row} type={type} project={project} projects={projects} isAdmin={isAdmin}
                           isSuperAdmin={isSuperAdmin} isChangeManager={isChangeManager}/>
      </TableCell>
      <EditStakeHolderPage stakeholder={row} open={showEditModalDialog}
                           isChangeManager={isChangeManager} isManager={false}
                           close={handleCloseModalDialog} isAdmin={isAdmin} isSuperAdmin={isSuperAdmin}
                           disabled={false} company={company} type={'project'}/>
    </TableRow>
  )
};

export default Stakeholder;