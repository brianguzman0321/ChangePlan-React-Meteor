import React from 'react';
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import moment from "moment";
import ProjectMenus from "../ProjectMenus";

const Project = (props) => {
  const {
    row, isItemSelected, labelId, classes, activities,
    index, isAdmin, isSuperAdmin, isChangeManager, company, getProjectPage, isManager, isActivityOwner, isActivityDeliverer,
  } = props;

  return (
    <TableRow
      className={classes.tableCell}
      hover
      role="checkbox"
      aria-checked={isItemSelected}
      tabIndex={-1}
      key={row._id || index}
      selected={isItemSelected}
    >
      <TableCell align={"left"} onClick={() => getProjectPage(row._id)}>{row.status}</TableCell>
      <TableCell align="left" component="th" id={labelId} scope="row" onClick={() => getProjectPage(row._id)}>
        {moment(row.startingDate).format('DD/M/YY')}
      </TableCell>
      <TableCell align="left" onClick={() => getProjectPage(row._id)}>{row.name}</TableCell>
      {company.organizationField &&
      <TableCell align="left" onClick={() => getProjectPage(row._id)}>{row.organization}</TableCell>}
      {company.functionField &&
      <TableCell align="left" onClick={() => getProjectPage(row._id)}>{row.function}</TableCell>}
      <TableCell align="center" onClick={() => getProjectPage(row._id)}>{row.people}</TableCell>
      <TableCell align="center" onClick={() => getProjectPage(row._id)}>{row.impacts}</TableCell>
      <TableCell align="center" onClick={() => getProjectPage(row._id)}>{row.activities}</TableCell>
      <TableCell align="center" className={row.overdue !== '-' && classes.overdue}
                 onClick={() => getProjectPage(row._id)}>{row.overdue}</TableCell>
      <TableCell align="center" onClick={() => getProjectPage(row._id)}>{row.timeConsumed}</TableCell>
      <TableCell align="center"
                 onClick={() => getProjectPage(row._id)}>{`${parseFloat(row.adoption).toFixed(2)}%`}</TableCell>
      <TableCell align="left" onClick={() => getProjectPage(row._id)}>{row.changeManagersNames}</TableCell>
      <TableCell align="left"
                 onClick={() => getProjectPage(row._id)}>{moment(row.lastLogin).format('DD/M/YY')}</TableCell>
      <TableCell><ProjectMenus project={row} company={company} activities={activities}
                               isManager={isManager}
                               isChangeManager={isChangeManager} isAdmin={isAdmin} isSuperAdmin={isSuperAdmin}
                               isActivityOwner={isActivityOwner} isActivityDeliverer={isActivityDeliverer}/></TableCell>
    </TableRow>
  )
};

export default Project;