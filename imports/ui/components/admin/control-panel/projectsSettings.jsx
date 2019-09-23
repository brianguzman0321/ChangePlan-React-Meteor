import React, {useEffect} from "react";
import {Meteor} from "meteor/meteor";
import MaterialTable from "material-table";
import {withTracker} from "meteor/react-meteor-data";
import {Companies} from "../../../../api/companies/companies";
import {Projects} from "../../../../api/projects/projects";
import ControlledOpenSelect from './selectionModal'

function ProjectsControlPanel(props) {
    if (!props.currentCompany){
        return <div></div>
    }
    else if(props.currentCompany && props.currentProject){
        const [companies, setCompanies] = React.useState({});
        const [projects, setProjects] = React.useState({});
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
                        admin: 'Admin',
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
                    role: props.currentProject.admins.includes(user._id) ? 'admin' :  'noRole',
                    currentRole: props.currentProject.admins.includes(user._id) ? 'admin' :  'noRole'
                }
            })
        });

    }


    useEffect(() => {
    });


    return (
        <div>
            <br/>
            {
                props.currentCompany ?
                    <ControlledOpenSelect {...props} title="Projects" entity="Project" entities={props.projects} localCollection="localProjects" id="projectId"/> : ''
            }
            <br/>
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
                                    newData.role === 'admin' && (company.role = 'admin');
                                    let profile = {
                                        firstName: newData.firstName,
                                        lastName: newData.lastName
                                    };
                                    Meteor.call('users.inviteNewUser', {
                                        profile, email: newData.email,
                                        company, project
                                    }, (err, res) => {
                                        if(err){
                                            reject("Email already exists");
                                            return false;
                                        }
                                        else{
                                            resolve();
                                            const data = [...state.data];
                                            newData.currentRole = newData.role;
                                            newData._id = res;
                                            data.push(newData);
                                            setState({...state, data});
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
                                    Meteor.call('users.updateRole', params, (err, res) => {
                                        if (err) {
                                            reject("Email already exists");
                                            return false;
                                        }
                                        else {
                                            resolve();
                                            const data = [...state.data];
                                            newData.currentRole = newData.role;
                                            data[data.indexOf(oldData)] = newData;
                                            setState({...state, data});
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
                                    Meteor.call('users.removeCompany', params, (err, res) => {
                                        if (err) {
                                            reject("No User Found");
                                            return false;
                                        }
                                        else {
                                            resolve();
                                            const data = [...state.data];
                                            data.splice(data.indexOf(oldData), 1);
                                            setState({ ...state, data });
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


const ProjectsControlPanelPage = withTracker(props => {
    // Do all your reactive data access in this method.
    // Note that this subscription will get cleaned up when your component is unmounted
    // const handle = Meteor.subscribe('todoList', props.id);
    Meteor.subscribe('compoundCompanies');
    Meteor.subscribe('compoundProjects');
    // let { parentProps } = props;
    let local = LocalCollection.findOne({
        name: 'localCompanies'
    });
    let local1 = LocalCollection.findOne({
        name: 'localProjects'
    });

    const currentCompany = Companies.findOne({_id: local.companyId});
    const currentProject = Projects.findOne({_id: local1.projectId});

    return {
        companies: Companies.find({}).fetch(),
        projects: Projects.find({}).fetch(),
        currentCompany,
        currentProject
    };
})(ProjectsControlPanel);

export default ProjectsControlPanelPage