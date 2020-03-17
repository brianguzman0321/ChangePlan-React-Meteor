import React, {useEffect, useState} from "react";
import {withTracker} from "meteor/react-meteor-data";
import {withSnackbar} from "notistack";
import {Companies} from "../../../../api/companies/companies";
import Grid from "@material-ui/core/Grid";
import OrganizationSettings from "./FieldsSettings/OrganizationSettings";
import FunctionSettings from "./FieldsSettings/FunctionSettings";
import {makeStyles, Typography} from "@material-ui/core";
import Switch from "@material-ui/core/Switch";
import {Meteor} from "meteor/meteor";

const useStyles = makeStyles({
  gridItem: {
    padding: '10px'
  }
});

const GeneralSettings = (props) => {
  const {currentCompany} = props;
  const classes = useStyles();
  const [organizationField, setOrganizationField] = useState(false);
  const [functionField, setFunctionField] = useState(false);

  useEffect(() => {
    if (currentCompany) {
      setOrganizationField(currentCompany.organizationField);
      setFunctionField(currentCompany.functionField);
    }
  }, [currentCompany]);

  const handleSwitchChange = (e, type) => {
    let company = {};
    if (type === "organization") {
      setOrganizationField(e.target.checked);
      company = {
        _id: currentCompany._id,
        organizationField: e.target.checked
      };
    } else if (type === "function") {
      setFunctionField(e.target.checked);
      company = {
        _id: currentCompany._id,
        functionField: e.target.checked
      };
    }

    Meteor.call('companies.update', {
      company
    }, (err, res) => {
      if (err) {
        props.enqueueSnackbar(err.reason, {variant: 'error'});
        return false;
      } else {
        props.enqueueSnackbar('Function Settings Updated Successfully.', {variant: 'success'})
      }
    })
  };

  return (
    <Grid container direction={"row"} alignItems={"center"} justify={"space-between"}>
      <Grid item xs={6}>
        <Typography>{`Organization field ${organizationField ? 'on' : 'off'}`}</Typography>
        <Switch checked={organizationField} onChange={(e) => handleSwitchChange(e, 'organization')}
                value={organizationField}
                color={"primary"}/>
      </Grid>
      <Grid item xs={6}>
        <Typography>{`Function field ${functionField ? 'on' : 'off'}`}</Typography>
        <Switch checked={functionField} onChange={(e) => handleSwitchChange(e, 'function')} value={functionField}
                color={"primary"}/>
      </Grid>

      {organizationField && <Grid item xs={functionField ? 6 : 12} className={classes.gridItem}>
        <OrganizationSettings company={currentCompany} {...props}/>
      </Grid>}
      {functionField && <Grid item xs={organizationField ? 6 : 12} className={classes.gridItem}>
        <FunctionSettings company={currentCompany} {...props}/>
      </Grid>}

    </Grid>
  )
};

const GeneralSettingsPage = withTracker(props => {
  const userId = Meteor.userId();
  Meteor.subscribe('companies');
  return {
    currentCompany: Companies.findOne({peoples: userId})
  }
})(GeneralSettings);

export default withSnackbar(GeneralSettingsPage)