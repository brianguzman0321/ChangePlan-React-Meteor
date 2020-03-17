import React, {useEffect, useState} from "react";
import {Meteor} from "meteor/meteor";
import MaterialTable from "material-table";
import {withTracker} from "meteor/react-meteor-data";
import {withSnackbar} from 'notistack';
import {Companies} from "../../../../../api/companies/companies";
import Switch from "@material-ui/core/Switch";
import Grid from "@material-ui/core/Grid";
import {Typography} from "@material-ui/core";

function FunctionSettings(props) {
  let {company, companies} = props;
  const [currentCompany, setCurrentCompany] = useState({});

  const [state, setState] = React.useState({
    columns: [
      {title: 'Function', field: 'func'},
    ],
    data: []
  });

  useEffect(() => {
    if (company) {
      let data = [...state.data];
      setCurrentCompany(company);
      data = company.function && company.function.map(func => {
        if (func) {
          return {
            func: func,
          }
        }
        return company
      });
      setState({...state, data});
    }
  }, [company]);

  return (
    <div>
      <Grid container direction={'row'} alignItems={'flex-start'} justify={'flex-start'}>
        <Grid item xs={12}>
          {
            company ?
              <MaterialTable
                title="Function Settings"
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
                      const newFunction = currentCompany.function;
                      newFunction.push(...new Set([newData.func]));
                      let company = {
                        _id: currentCompany._id,
                        function: newFunction
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
                          props.enqueueSnackbar('New Function Added Successfully.', {variant: 'success'})
                        }

                      })
                    })
                  },

                  onRowUpdate: (newData, oldData) => {
                    return new Promise((resolve, reject) => {
                      const index = currentCompany.function.indexOf(oldData.func);
                      const editedFunction = currentCompany.function;
                      editedFunction[index] = newData.func;
                      let company = {
                        _id: currentCompany._id,
                        function: editedFunction,
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
                          props.enqueueSnackbar('Function Updated Successfully.', {variant: 'success'})
                        }
                      })
                    })
                  },
                  onRowDelete: oldData => {
                    return new Promise((resolve, reject) => {
                      const index = currentCompany.function.indexOf(oldData.func);
                      const editedFunction = currentCompany.function;
                      editedFunction.splice(index, 1);
                      let company = {
                        _id: currentCompany._id,
                        function: editedFunction,
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
                          props.enqueueSnackbar('Function Removed Successfully.', {variant: 'success'})
                        }
                      })

                    })
                  }
                }}
              /> : null
          }
        </Grid>
      </Grid>
    </div>
  );
}


const FunctionSettingsPage = withTracker(props => {
  Meteor.subscribe('companies');
  return {
    companies: Companies.find().fetch(),
  };
})(FunctionSettings);

export default withSnackbar(FunctionSettingsPage)