import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TopNavBar from '/imports/ui/components/App/App'
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import ViewColumnIcon from '@material-ui/icons/ViewColumn';
import ListIcon from '@material-ui/icons/List';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import config from '/imports/utils/config';
import { withRouter } from 'react-router';

const useStyles = makeStyles({
  activityTabs: {
    wrapper: {
      flexDirection:'row',
    },
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
    marginLeft: 24,
  },
  gridContainer: {
    overFlow: 'hidden'
  },
  topBar: {
    marginTop: 13,
  }
});
function Timeline(props){
  const classes = useStyles();
  const [value, setIndex] = React.useState(0);

  const handleChange = (event, newValue) => {
    setIndex(newValue);
  };
  let menus = config.menus;
  return (
    <div>
      <TopNavBar menus={menus} {...props} />
      <Grid
        container
        direction="row"
        justify="space-between"
        alignItems="center"
        className={classes.gridContainer}
        spacing={0}
      >
        <Grid
          container
          className={classes.topBar}
          direction="row"
          justify="space-between"
        >
          <Grid item xs={3} md={7}>
            <Typography color="textSecondary" variant="h4" className={classes.topHeading}>
              Timeline
            </Typography>
          </Grid>
          <Grid item xs={6} md={3}>
            <Tabs
              value={value}
              onChange={handleChange}
              indicatorColor="primary"
              textColor="primary"
              aria-label="icon tabs example"
            >
              <Tab className={classes.activityTab} label={<><div className={classes.iconTab}><ViewColumnIcon/>&nbsp; Gantt</div></>}/>
              <Tab className={classes.activityTab} label={<><div className={classes.iconTab}><ListIcon/>&nbsp; List</div></>}/>
            </Tabs>
          </Grid>
        </Grid>
      </Grid>
    </div>
  )
}

export default withRouter(Timeline)