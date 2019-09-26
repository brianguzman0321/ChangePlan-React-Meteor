import React, {useEffect} from "react";
import {Meteor} from "meteor/meteor";
import MaterialTable from "material-table";
import {withTracker} from "meteor/react-meteor-data";
import { Projects } from "../../../../api/projects/projects";
import { withSnackbar } from 'notistack';

function ProjectsSettings(props) {
    if (!props.currentProject){
        return <div></div>
    }
    const [project, setProject] = React.useState({});
    const [state, setState] = React.useState({
        columns: [
            {title: 'FirstName', field: 'firstName', editable: 'onAdd'},
            {title: 'LastName', field: 'lastName', editable: 'onAdd'},
            {title: 'Email', field: 'email', editable: 'onAdd'},
            {title: 'CurrentRole', field: 'currentRole', editable: 'never'},
            {
                title: 'Assign Role',
                field: 'role',
                lookup: {
                    changeManager: 'Change Manager',
                    manager: 'Manager',
                    noRole: 'No Role',
                },
            },
        ],
        data: props.currentProject.peoplesDetails.map(user => {
            return {
                _id: user._id,
                firstName: user.profile.firstName,
                lastName: user.profile.lastName,
                email: user.emails[0].address,
                role: getRole(props.currentProject, user._id),
                currentRole: getRole(props.currentProject, user._id)
            }
        })
    });
    useEffect(() => {
        if(props.currentProject._id !== project._id){
            setProject(props.currentProject)
            let data = [...state.data];
            data = props.currentProject.peoplesDetails.map(user => {
                return {
                    _id: user._id,
                    firstName: user.profile.firstName,
                    lastName: user.profile.lastName,
                    email: user.emails[0].address,
                    role: getRole(props.currentProject, user._id),
                    currentRole: getRole(props.currentProject, user._id)
                }
            })
            setState({...state, data});
        }


    });


    return (
        <div>
            {
                props.currentProject ?
                    <MaterialTable
                        title="Control Panel"
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
                                            newData.currentRole = newData.role;
                                            newData._id = res;
                                            data.push(newData);
                                            setState({...state, data});
                                            props.enqueueSnackbar('New User Added Successfully.', {variant: 'success'})
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
                                            newData.currentRole = newData.role;
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

function getRole(project, userId){
    if(project.changeManagers.includes(userId)){
        return 'changeManager'
    }
    else if(project.managers.includes(userId)){
        return 'manager'
    }
    return 'noRole'
}



const ProjectsSettingsPage = withTracker(props => {
    Meteor.subscribe('compoundProjects', props.currentCompany && props.currentCompany._id);
    let local1 = LocalCollection.findOne({
        name: 'localProjects'
    });

    const currentProject = Projects.findOne({_id: local1.projectId});

    return {
        currentProject
    };
})(ProjectsSettings);

export default withSnackbar(ProjectsSettingsPage)