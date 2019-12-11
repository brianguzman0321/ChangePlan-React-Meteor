import React, {useEffect} from "react";
import {Meteor} from "meteor/meteor";
import MaterialTable from "material-table";
import { withTracker } from "meteor/react-meteor-data";
import { withSnackbar } from 'notistack';
import { Companies } from "../../../../api/companies/companies";
import TopNavBar from '/imports/ui/components/App/App';
import Divider from "@material-ui/core/Divider/Divider";

function CompaniesList(props) {
    let { companies } = props;
    let lookup = {};
    if (!Roles.userIsInRole(Meteor.userId(), 'superAdmin')) {
        props.history.push('/')
    }

    lookup.manager = 'Manager';
    lookup.noRole = 'No Role';
    const [state, setState] = React.useState({
        columns: [
            {title: 'Company Name', field: 'name'},
            {title: 'ID', field: '_id', editable: 'never'},
            {title: 'Stakeholder Count', field: 'count', editable: 'never'},
            {title: 'Total Projects', field: 'projectsCount', editable: 'never'},
        ],
        data: []
    });

    useEffect(() => {
        if(props.companies){
            let data = [...state.data];
            data = companies.map(company => {
                if(company){
                    return {
                        _id: company._id,
                        name: company.name,
                        count: company.peoples.length,
                        projectsCount: company.projects.length,
                    }
                }
                return company
            });
            setState({...state, data});
        }
    }, [props.companies]);


    return (
        <div>
            <TopNavBar {...props}/>
            <Divider />
            {
                companies ?
                    <MaterialTable
                        title="Companies"
                        columns={state.columns}
                        options={{
                            actionsColumnIndex: -1
                        }}
                        data={state.data}
                        editable={{
                            onRowAdd: newData => {
                                return new Promise((resolve, reject) => {
                                    let company = {
                                        name: newData.name
                                    };

                                    Meteor.call('companies.insert', {
                                        company
                                    }, (err, res) => {
                                        if (err) {
                                            props.enqueueSnackbar(err.reason, {variant: 'error'});
                                            reject();
                                            return false;
                                        }
                                        else {
                                            resolve();
                                            const data = [...state.data];
                                            newData._id = res;
                                            data.push(newData);
                                            setState({...state, data});
                                            props.enqueueSnackbar('New Company Added Successfully.', {variant: 'success'})
                                        }

                                    })
                                })
                            },

                            onRowUpdate: (newData, oldData) => {
                                return new Promise((resolve, reject) => {
                                    let company = {
                                        _id: newData._id,
                                        name: newData.name
                                    };
                                    Meteor.call('companies.update', {company}, (err, res) => {
                                        if (err) {
                                            props.enqueueSnackbar(err.reason, {variant: 'error'});
                                            reject();
                                            return false;
                                        }
                                        else {
                                            resolve();
                                            const data = [...state.data];
                                            data[data.indexOf(oldData)] = newData;
                                            setState({...state, data});
                                            props.enqueueSnackbar('Company Updated Successfully.', {variant: 'success'})
                                        }

                                    })
                                })
                            },
                            onRowDelete: oldData => {
                                return new Promise((resolve, reject) => {
                                    let company = {
                                        _id: oldData._id
                                    };
                                    Meteor.call('companies.remove', {company}, (err, res) => {
                                        if (err) {
                                            props.enqueueSnackbar(err.reason, {variant: 'error'});
                                            reject();
                                            return false;
                                        }
                                        else {
                                            resolve();
                                            const data = [...state.data];
                                            data.splice(data.indexOf(oldData), 1);
                                            setState({...state, data});
                                            props.enqueueSnackbar('Company Removed Successfully.', {variant: 'success'})
                                        }

                                    })
                                })
                            }
                        }}
                    /> : ''
            }
        </div>
    );
}


const CompaniesListPage = withTracker(props => {
    Meteor.subscribe('companies');

    return {
        companies: Companies.find().fetch()
    };
})(CompaniesList);

export default withSnackbar(CompaniesListPage)