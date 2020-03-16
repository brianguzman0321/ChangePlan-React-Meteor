import React from "react";
import {withTracker} from "meteor/react-meteor-data";
import {withSnackbar} from "notistack";
import {Companies} from "../../../../api/companies/companies";
import Grid from "@material-ui/core/Grid";
import OrganizationSettings from "./FieldsSettings/OrganizationSettings";
import FunctionSettings from "./FieldsSettings/FunctionSettings";
import {makeStyles} from "@material-ui/core";

const useStyles = makeStyles( {
  gridItem: {
    padding: '10px'
  }
});

const GeneralSettings = (props) => {
  const {company} = props;
  const classes = useStyles();

  return (
    <Grid container direction={"row"} alignItems={"center"} justify={"space-between"}>
      <Grid item xs={6} className={classes.gridItem}>
        <OrganizationSettings company={company} {...props}/>
      </Grid>
      <Grid item xs={6} className={classes.gridItem}>
        <FunctionSettings company={company} {...props}/>
      </Grid>
    </Grid>
  )
};

const GeneralSettingsPage = withTracker(props => {
  const userId = Meteor.userId();
  Meteor.subscribe('companies');
  return {
    company: Companies.findOne({peoples: userId})
  }
})(GeneralSettings);

export default withSnackbar(GeneralSettingsPage)