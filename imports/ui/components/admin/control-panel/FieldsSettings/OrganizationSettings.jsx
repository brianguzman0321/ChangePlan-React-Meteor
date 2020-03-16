import React, {useEffect, useState} from "react";
import {Meteor} from "meteor/meteor";
import MaterialTable from "material-table";
import {withTracker} from "meteor/react-meteor-data";
import {withSnackbar} from 'notistack';
import {Companies} from "../../../../../api/companies/companies";
import Switch from "@material-ui/core/Switch";
import Grid from "@material-ui/core/Grid";
import {Typography} from "@material-ui/core";

function OrganizationSettings(props) {
  let {company, companies} = props;
  const [currentCompany, setCurrentCompany] = useState({});
  const [organizationField, setOrganizationField] = useState(false);

  const [state, setState] = React.useState({
    columns: [
      {title: 'Organization', field: 'organization'},
    ],
    data: []
  });

  useEffect(() => {
    if (company) {
      let data = [...state.data];
      setCurrentCompany(company);
      setOrganizationField(company.organizationField);
      data = company.organization && company.organization.map(organization => {
        if (organization) {
          return {
            organization: organization,
          }
        }
        return company
      });
      setState({...state, data});
    }
  }, [company]);

  const handleSwitchChange = (e) => {
    setOrganizationField(e.target.checked);
    let company = {
      _id: currentCompany._id,
      organizationField: e.target.checked
    };

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
    <div>
      <Grid container direction={'row'} alignItems={'flex-start'} justify={'flex-start'}>
        <Grid item xs={12}>
          <Typography>{`Organization field ${organizationField ? 'on' : 'off'}`}</Typography>
        </Grid>
        <Grid item xs={12}>
          <Switch checked={organizationField} onChange={handleSwitchChange} value={organizationField}
                  color={"primary"}/>
        </Grid>
        <Grid item xs={12}>
          {
            company && company.organizationField ?
              <MaterialTable
                title="Organization Settings"
                columns={state.columns}
                options={{
                  actionsColumnIndex: -1,
                  search: false,
                  draggable: false,
                }}
                data={state.data}
                editable={{
                  onRowAdd: newData => {
                    return new Promise((resolve, reject) => {
                      const newOrganization = currentCompany.organization;
                      newOrganization.push(...new Set([newData.organization]));
                      let company = {
                        _id: currentCompany._id,
                        organization: newOrganization
                      };

                      Meteor.call('companies.update', {
                        company
                      }, (err, res) => {
                        if (err) {
                          props.enqueueSnackbar(err.reason, {variant: 'error'});
                          reject();
                          return false;
                        } else {
                          resolve();
                          const data = [...state.data];
                          newData._id = res;
                          data.push(newData);
                          setState({...state, data});
                          props.enqueueSnackbar('New Organization Added Successfully.', {variant: 'success'})
                        }

                      })
                    })
                  },

                  onRowUpdate: (newData, oldData) => {
                    return new Promise((resolve, reject) => {
                      const index = currentCompany.organization.indexOf(oldData.organization);
                      const editedOrganization = currentCompany.organization;
                      editedOrganization[index] = newData.organization;
                      let company = {
                        _id: currentCompany._id,
                        organization: editedOrganization,
                      };
                      Meteor.call('companies.update', {company}, (err, res) => {
                        if (err) {
                          props.enqueueSnackbar(err.reason, {variant: 'error'});
                          reject();
                          return false;
                        } else {
                          resolve();
                          const data = [...state.data];
                          data[data.indexOf(oldData)] = newData;
                          setState({...state, data});
                          props.enqueueSnackbar('Organization Updated Successfully.', {variant: 'success'})
                        }
                      })
                    })
                  },
                  onRowDelete: oldData => {
                    return new Promise((resolve, reject) => {
                      const index = currentCompany.organization.indexOf(oldData.organization);
                      const editedOrganization = currentCompany.organization;
                      editedOrganization.splice(index, 1);
                      let company = {
                        _id: currentCompany._id,
                        organization: editedOrganization,
                      };
                      Meteor.call('companies.update', {company}, (err, res) => {
                        if (err) {
                          props.enqueueSnackbar(err.reason, {variant: 'error'});
                          reject();
                          return false;
                        } else {
                          resolve();
                          const data = [...state.data];
                          data.splice(data.indexOf(oldData), 1);
                          setState({...state, data});
                          props.enqueueSnackbar('Organization Removed Successfully.', {variant: 'success'})
                        }
                      })

                    })
                  }
                }}
              /> : ''
          }
        </Grid>
      </Grid>
    </div>
  );
}


const OrganizationSettingsPage = withTracker(props => {
  Meteor.subscribe('companies');
  return {
    companies: Companies.find().fetch(),
  };
})(OrganizationSettings);

export default withSnackbar(OrganizationSettingsPage)