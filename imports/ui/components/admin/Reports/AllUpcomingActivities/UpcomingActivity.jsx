import TableCell from "@material-ui/core/TableCell";
import Checkbox from "@material-ui/core/Checkbox";
import moment from "moment";
import TableRow from "@material-ui/core/TableRow";
import React from "react";
import {getPhase, getTotalStakeholders} from "../../../../../utils/utils";
import {makeStyles} from "@material-ui/core";

const useStyles = makeStyles(() => ({
  dueDate: {
    color: 'red',
  },
}));

export default function UpcomingActivity(props) {
  const {row, editActivity, completeActivity, labelId, company, allStakeholders, type} = props;
  const classes = useStyles();

  return (
    <TableRow
      style={{cursor: 'pointer'}}
      hover
      key={row._id}
      onClick={() => editActivity(row)}
    >
      <TableCell align="center">
        <Checkbox
          checked={row.completed}
          onClick={(e) => {
            e.stopPropagation();
            completeActivity(row)
          }}
          color="default"
        />
      </TableCell>
      <TableCell align="center" className={type === 'overdue' && classes.dueDate} component="th" id={labelId} scope="row">
        {moment(row.dueDate).format('DD-MMM-YYYY')}
      </TableCell>
      <TableCell align="left" style={{whiteSpace: 'nowrap'}}>{row.project && row.project}</TableCell>
      <TableCell align="left">{row.name}</TableCell>
      <TableCell align="left">{getPhase(row.step, company)}</TableCell>
      <TableCell align="left">{row.time}</TableCell>
      <TableCell
        align="left">{row.personResponsible ? `${row.personResponsible.profile.firstName} ${row.personResponsible.profile.lastName}` : '-'}</TableCell>
      <TableCell
        align="left">{row.ownerInfo ? `${row.ownerInfo.profile.firstName} ${row.ownerInfo.profile.lastName}` : '-'}</TableCell>
      <TableCell align="left">{getTotalStakeholders(allStakeholders, row.stakeHolders)}</TableCell>
      <TableCell align="left">{row.impacts && row.impacts}</TableCell>
      <TableCell align="left">{row.stakeholdersFeedback ? 'Yes' : 'No'}</TableCell>
      <TableCell align="left">{row.cost}</TableCell>
      <TableCell align="left">{row.changeManagers && row.changeManagers.map(changeManager => {
        return `${changeManager.profile.firstName} ${changeManager.profile.lastName}`
      }).join(', ')}</TableCell>
    </TableRow>
  )
}