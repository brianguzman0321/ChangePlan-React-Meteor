import Brightness1Icon from '@material-ui/icons/Brightness1';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import PropTypes from "prop-types";
import React from "react";
import {makeStyles, StepConnector, withStyles} from "@material-ui/core";

const useCustomStepIconStyles = makeStyles({
  root: {
    color: '#eaeaf0',
  },
  active: {
    width: '40px',
    height: '40px',
  },
  completed: {
    color: '#93cdff',
    zIndex: 1,
    width: '40px',
    height: '40px',
  },
});

export const CustomStepConnector = withStyles({
  vertical: {
    paddingTop: '-1px',
    marginLeft: '19px'
  },
  line: {
    borderColor: '#bdbdbd',
    borderTopWidth: 6,
    borderRadius: 1,
  },
})(StepConnector);


export const CustomStepIcon = (props) => {
  const classes = useCustomStepIconStyles();
  const {active, completed} = props;

  return (
    <div className={classes.root}>
      {active && !completed && <Brightness1Icon className={classes.active}/>}
      {active && completed && <CheckCircleIcon className={classes.completed}/>}
    </div>
  )
};

CustomStepIcon.propsTypes = {
  active: PropTypes.bool,
  completed: PropTypes.bool,
};