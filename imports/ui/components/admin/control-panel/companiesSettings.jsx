import React, {useEffect} from "react";
import {Meteor} from "meteor/meteor";
import MaterialTable from "material-table";
import {withTracker} from "meteor/react-meteor-data";
import {Companies} from "../../../../api/companies/companies";
import {Projects} from "../../../../api/projects/projects";
import { withSnackbar } from 'notistack';
import UserSelectionModal from '/imports/ui/components/utilityComponents/userSelectionModal'

function CompaniesControlPanel(props) {
    let userId = Meteor.userId();
    if (!props.currentCompany){
        return <div></div>
    }
    const [companies, setCompanies] = React.useState({});
    const [users, setUsers] = React.useState([]);
    const [state, setState] = React.useState({
        columns: [
            {title: 'FirstName', field: 'firstName', editable: 'onAdd'},
            {title: 'LastName', field: 'lastName', editable: 'onAdd'},
            {title: 'Email', field: 'email', editable: 'onAdd'},
            {
                title: 'Admin',
                field: 'role',
                lookup: {
                    yes: 'Yes',
                    no: 'No',
                },
            },
        ],
        data: []
    });

    const updateUsersList = () => {
        Meteor.call(`users.getUsers`, {company: props.currentCompany}, (err, res) => {
            if(err){
                props.enqueueSnackbar(err.reason, {variant: 'error'});
            }
            if(res && res.length){
                setUsers(res.map(user => {
                    return {
                        label: `${user.profile.firstName} ${user.profile.lastName}`,
                        value: user._id
                    }
                }))
            }
            else {
                setUsers([])
            }
        })
    };

    useEffect(() => {
        updateUsersList();
        let data = [...state.data];
        data = props.currentCompany.peoplesDetails.map(user => {
            return {
                _id: user._id,
                firstName: user.profile.firstName,
                lastName: user.profile.lastName,
                email: user.emails[0].address,
                role: props.currentCompany.admins.includes(user._id) ? 'yes' :  'no',
            }
        }).filter(user => {
            return user._id !== userId
        });
        setState({...state, data});
    }, [props.currentCompany]);


    return (
        <div>
            <UserSelectionModal options={users} {...props} updateUsersList={updateUsersList} title="Company"/>
            <br/>
            <MaterialTable
                title="Users"
                columns={state.columns}
                options={{
                    actionsColumnIndex: -1
                }}
                data={state.data}
                editable={{
                    onRowAdd: newData => {
                        return new Promise((resolve, reject) => {
                            let company ={
                                _id : props.currentCompany._id
                            };
                            newData.role === 'yes' && (company.role = 'yes');
                            let profile = {
                                firstName: newData.firstName,
                                lastName: newData.lastName
                            };
                            Meteor.call('users.inviteNewUser', {
                                profile, email: newData.email,
                                company
                            }, (err, res) => {
                                if(err){
                                    props.enqueueSnackbar(err.reason, {variant: 'error'});
                                    reject();
                                    return false;
                                }
                                else{
                                    resolve();
                                    const data = [...state.data];
                                    newData._id = res;
                                    data.push(newData);
                                    setState({...state, data});
                                    props.enqueueSnackbar('New User Added Successfully. User will be notified by email.', {variant: 'success'});
                                    updateUsersList();
                                }

                            })
                        })
                    },

                    onRowUpdate: (newData, oldData) => {
                        return new Promise((resolve, reject) => {
                            let params = {
                                companyId: props.currentCompany._id,
                                userId: newData._id,
                                role: newData.role
                            };
                            Meteor.call('users.updateRole', params, (err, res) => {
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
                                    props.enqueueSnackbar('User Role Updated Successfully.', {variant: 'success'})
                                }

                            })
                        })
                    },
                    onRowDelete: oldData => {
                        return new Promise((resolve, reject) => {
                            let params = {
                                companyId: props.currentCompany._id,
                                userId: oldData._id,
                            };
                            Meteor.call('users.removeCompany', params, (err, res) => {
                                if (err) {
                                    props.enqueueSnackbar(err.reason, {variant: 'error'});
                                    reject();
                                    return false;
                                }
                                else {
                                    resolve();
                                    const data = [...state.data];
                                    data.splice(data.indexOf(oldData), 1);
                                    setState({ ...state, data });
                                    props.enqueueSnackbar('User Removed From Company Successfully.', {variant: 'success'});
                                    updateUsersList();
                                }

                            })
                        })
                    }
                }}
            />
        </div>
    );
}


const CompaniesControlPanelPage = withTracker(props => {
    // Do all your reactive data access in this method.
    // Note that this subscription will get cleaned up when your component is unmounted
    // const handle = Meteor.subscribe('todoList', props.id);
    Meteor.subscribe('compoundCompanies');
    // Meteor.subscribe('projects');
    // let { parentProps } = props;
    let local = LocalCollection.findOne({
        name: 'localCompanies'
    });

    const currentCompany = Companies.findOne({_id: local.companyId});

    return {
        companies: Companies.find({}).fetch(),
        projects: Projects.find({}).fetch(),
        currentCompany,
    };
})(CompaniesControlPanel);
export default withSnackbar(CompaniesControlPanelPage);