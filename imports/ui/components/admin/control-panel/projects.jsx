import React, {useEffect} from "react";
import {Meteor} from "meteor/meteor";
import MaterialTable from "material-table";
import {withTracker} from "meteor/react-meteor-data";
import { Projects } from "../../../../api/projects/projects";
import { withSnackbar } from 'notistack';
import UserSelectionModal from "../../utilityComponents/userSelectionModal";


function ProjectsSettings(props) {
    if (!props.currentProject){
        return <div></div>
    }
    let userId = Meteor.userId();
    let filterIds = [userId];
    let lookup = {};
    if(Roles.userIsInRole(Meteor.userId(), 'superAdmin')){
        lookup.changeManager = 'Change Manager'
    }
    else if(props.currentCompany && props.currentCompany.admins.includes(Meteor.userId())){
        lookup.changeManager = 'Change Manager'
    }
    lookup.manager = 'Manager';
    lookup.noRole = 'No Role';
    const [project, setProject] = React.useState({});
    const [users, setUsers] = React.useState([]);
    const [state, setState] = React.useState({
        columns: [
            {title: 'FirstName', field: 'firstName', editable: 'onAdd'},
            {title: 'LastName', field: 'lastName', editable: 'onAdd'},
            {title: 'Email', field: 'email', editable: 'onAdd'},
            {
                title: 'Role',
                field: 'role',
                lookup,
            },
        ],
        data: []
    });
    if(props.currentCompany && props.currentProject){
        if(!Roles.userIsInRole(Meteor.userId(), 'superAdmin')){
            let admins = props.currentCompany.admins;
            let changeManagers = props.currentProject.changeManagers;
            if(admins.includes(userId)){
                filterIds = admins.concat(filterIds)
            }
            else if(changeManagers.includes(userId)){
                filterIds = admins.concat(changeManagers).concat(filterIds)
            }
        }

    }

    const updateUsersList = () => {
        if(props.currentCompany && props.currentProject){
            Meteor.call(`users.getUsers`, {
                company: props.currentCompany,
                project: props.currentProject
            }, (err, res) => {
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
        }
    };
    useEffect(() => {
        updateUsersList();
        setProject(props.currentProject);
        if(props.currentProject.peoplesDetails){
            let data = [...state.data];
            data = removeCurrentUserRoles(props.currentProject.peoplesDetails, filterIds).map(user => {
                if(user){
                    return {
                        _id: user._id,
                        firstName: user.profile.firstName,
                        lastName: user.profile.lastName,
                        email: user.emails[0].address,
                        role: getRole(props.currentProject, user._id),
                    }
                }
                return user
            });
            setState({...state, data});
        }
    }, [props.currentCompany, props.currentProject]);


    return (
        <div>
            <UserSelectionModal options={users} {...props} updateUsersList={updateUsersList} title="Project"/>
            <br />
            {
                props.currentProject ?
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
                                    let company = {
                                        _id : props.currentCompany._id
                                    };
                                    let project = {
                                        _id : props.currentProject._id
                                    };
                                    newData.role === 'changeManager' && (project.role = 'changeManager');
                                    newData.role === 'manager' && (project.role = 'manager');
                                    let profile = {
                                        firstName: newData.firstName,
                                        lastName: newData.lastName
                                    };
                                    Meteor.call('users.inviteNewProjectUser', {
                                        profile, email: newData.email,
                                        company, project
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
                                            props.enqueueSnackbar('New User Added Successfully. User will be notified by email.', {variant: 'success'})
                                        }

                                    })
                                })
                            },

                            onRowUpdate: (newData, oldData) => {
                                return new Promise((resolve, reject) => {
                                    let params = {
                                        projectId: props.currentProject._id,
                                        userId: newData._id,
                                        role: newData.role
                                    };
                                    Meteor.call('users.updateProjectRole', params, (err, res) => {
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
                                        projectId: props.currentProject._id,
                                        userId: oldData._id,
                                    };
                                    Meteor.call('users.removeProject', params, (err, res) => {
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
                                            props.enqueueSnackbar('User Removed From Project Successfully.', {variant: 'success'})
                                        }

                                    })
                                })
                            }
                        }}
                    /> : ''
            }
        </div>)
}


function removeCurrentUserRoles(users, filteredIds){
    if(Array.isArray(users) && Array.isArray(filteredIds)){
        return users.filter(user => {
            if(user){
                return !filteredIds.includes(user._id)
            }
            return user;
        })
    }
    return users;

}
function getRole(project, userId){
    if(project && project.managers) {
        if(project.changeManagers.includes(userId)){
            return 'changeManager'
        }
        else if(project.managers.includes(userId)){
            return 'manager'
        }
        return 'noRole'
    }
}



const ProjectsSettingsPage = withTracker(props => {
    Meteor.subscribe('compoundProjects', props.currentCompany);
    let local1 = LocalCollection.findOne({
        name: 'localProjects'
    });

    const currentProject = Projects.findOne({_id: local1.projectId});

    return {
        currentProject
    };
})(ProjectsSettings);

export default withSnackbar(ProjectsSettingsPage)