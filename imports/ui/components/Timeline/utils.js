
import { makeStyles } from '@material-ui/core/styles';

export const styles = theme => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  title: {
    color: "rgb(70,86,100)",
    fontWidth: 400,
    fontSize: "30px !important"
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

export const useStyles = makeStyles(theme => ({
  inline: {
    display:"inline",
  },
  activityTabs: {
    wrapper: {
      flexDirection:'row',
    },
    color: "black",
  },
  iconTab: {
    display: 'flex',
    alignItems: 'center'
  },
  activityTab: {
    border: '0.5px solid #c5c6c7',
    minWidth: 101,
    '&:selected': {
      backgroundColor: '#3f51b5',
      color: '#ffffff'
    }
  },
  topHeading: {
    fontSize: '1.8rem',
    fontWeight: 500,
    lineHeight: 1.5,
    letterSpacing: '-0.015em',
    color: '#465563',
    marginRight: "20px",
  },
  gridContainer: {
    overFlow: 'hidden',
    padding: "0 20px",
  },
  topBar: {
    marginTop: 13,
  },
  selectExportType: {
    width: "200px",
    marginLeft: "20px",
  },
  exportDialog: {
    padding: "20px 30px",
    width: "800px !important",
  },
  flexBox: {
    display: "flex",
  }
}));

export function changeManagersNames({ changeManagerDetails }) {
  if (changeManagerDetails) {
    let changeManagers = changeManagerDetails.map(({ profile: { firstName, lastName } }) => `${firstName} ${lastName}`);
    if (changeManagers.length) {
      return changeManagers.join(", ")
    }
    return "-";
  }
}
