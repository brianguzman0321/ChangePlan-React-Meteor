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
      <TableCell align={"left"} padding={"checkbox"} className={classes.tableCellPadding}
                 onClick={() => getProjectPage(row._id)}>{row.status[0].toUpperCase() + row.status.slice(1)}</TableCell>
      <TableCell align="left" padding={"checkbox"} className={classes.tableCellPadding} component="th" id={labelId}
                 scope="row" onClick={() => getProjectPage(row._id)}>
        {moment(row.startingDate).format('DD/M/YY')}
      </TableCell>
      <TableCell align="left" padding={"checkbox"} className={classes.tableCellPadding}
                 onClick={() => getProjectPage(row._id)}>{row.name}</TableCell>
      {company.organizationField &&
      <TableCell align="left" padding={"checkbox"} className={classes.tableCellPadding}
                 onClick={() => getProjectPage(row._id)}>{row.organization}</TableCell>}
      {company.functionField &&
      <TableCell align="left" padding={"checkbox"} className={classes.tableCellPadding}
                 onClick={() => getProjectPage(row._id)}>{row.function}</TableCell>}
      <TableCell align="center" padding={"checkbox"} onClick={() => getProjectPage(row._id)}
                 className={row.people === '-' ? classes.zeroCell : classes.tableCellPadding}>{row.people === '-' ? 0 : row.people}</TableCell>
      <TableCell align="center" padding={"checkbox"} onClick={() => getProjectPage(row._id)}
                 className={row.impacts === 0 ? classes.zeroCell : classes.tableCellPadding}>{row.impacts}</TableCell>
      <TableCell align="center" padding={"checkbox"} onClick={() => getProjectPage(row._id)}
                 className={row.activities === '0 scheduled' ? classes.zeroCell : classes.tableCellPadding}>{row.activities}</TableCell>
      <TableCell align="center" padding={"checkbox"} className={row.overdue === '-' ? classes.tableCellPadding : classes.zeroCell}
                 onClick={() => getProjectPage(row._id)}>{row.overdue}</TableCell>
      <TableCell align="center" padding={"checkbox"} className={classes.tableCellPadding}
                 onClick={() => getProjectPage(row._id)}>{row.timeConsumed}</TableCell>
      <TableCell align="center" padding={"checkbox"} className={classes.tableCellPadding}
                 onClick={() => getProjectPage(row._id)}>{`${parseFloat(row.adoption).toFixed(2)}%`}</TableCell>
      <TableCell align="left" padding={"checkbox"} className={classes.tableCellPadding}
                 onClick={() => getProjectPage(row._id)}>{row.changeManagersNames}</TableCell>
      <TableCell align="left" padding={"checkbox"} className={classes.tableCellPadding}
                 onClick={() => getProjectPage(row._id)}>{moment(row.lastLogin).format('DD/M/YY')}</TableCell>
      <TableCell className={classes.tableCellPadding}>
        <ProjectMenus project={row} company={company}
                      activities={activities}
                      isManager={isManager}
                      isChangeManager={isChangeManager} isAdmin={isAdmin}
                      isSuperAdmin={isSuperAdmin}
                      isActivityOwner={isActivityOwner}
                      isActivityDeliverer={isActivityDeliverer}/>
      </TableCell>
    </TableRow>
  )
};

export default Project;