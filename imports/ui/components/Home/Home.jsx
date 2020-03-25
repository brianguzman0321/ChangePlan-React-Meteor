import React from 'react';
import ProjectCard from '/imports/ui/components/Projects/Projects'
import config from "../../../utils/config";
import SideMenu from "../App/SideMenu";
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
}));

export default function Home(props) {
  let {params} = props.match;
  const classes = useStyles();
  let menus = config.menus;
  if (!params.projectId) {
    menus = []
  }
  return (
    <div className={classes.root}>
      <SideMenu {...props}/>
      <ProjectCard {...props}/>
    </div>
  )
}
