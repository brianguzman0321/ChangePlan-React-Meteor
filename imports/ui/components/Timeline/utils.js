import {makeStyles} from '@material-ui/core/styles';

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
  root: {
    display: 'flex',
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  inline: {
    display: "inline",
  },
  activityTabs: {
    wrapper: {
      flexDirection: 'row',
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
    alignItems: 'end',
    paddingLeft: 20,
  },
  flexBox: {
    display: "flex",
  },
  container: {
    display: "flex",
    paddingRight: 10,
  },
  containerButton: {
    paddingBottom: 10,
  },
  sampleCsv: {
    textDecoration: 'none',
    color: '#303f9f',
  },
  instructionText: {
    marginLeft: 50,
    display: 'flex',
    flexDirection: 'column',
  },
  instructionTextExport: {
    marginLeft: 50,
  },
  uploadButton: {
    width: 200,
    marginBottom: 20,
  },
  uploadButtonExport: {
    width: 200,
    marginBottom: 20,
    marginLeft: 50,
  },
  addEventContainer: {
    paddingLeft: '10px',
    paddingTop: '6px',
  },
  addEventButton: {
    background: '#9e9e9e',
    color: 'white',
    '&:hover': {
      background: '#9e9e9e',
      color: 'white'
    },
    boxShadow: 'none',
    fontWeight: 300,
  },
  formControl: {
    marginTop: '-20px',
    margin: theme.spacing(1),
    minWidth: 120,
  },
  placeholder: {
    marginLeft: '20px'
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  button: {
    textAlign: "right",
  },
  selectedButton: {
    background: '#ffffff',
    textTransform: 'none',
    border: '1px #92a1af solid',
    borderRadius: 1,
    width: 100,
    marginRight: 10,
    marginTop: 10,
  },
  viewButton: {
    color: '#92a1af',
    textTransform: 'none',
    border: '1px #92a1af solid',
    borderRadius: 1,
    width: 100,
    marginRight: 10,
    marginTop: 10,
  },
  svg: {
    paddingRight: 5,
    width: 20,
    height: 20,
  }
}));

export function changeManagersNames({changeManagerDetails}) {
  if (changeManagerDetails) {
    let changeManagers = changeManagerDetails.map(({profile: {firstName, lastName}}) => `${firstName} ${lastName}`);
    if (changeManagers.length) {
      return changeManagers.join(", ")
    }
    return "-";
  }
}
