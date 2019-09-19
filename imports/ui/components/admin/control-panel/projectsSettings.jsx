import React, {useEffect} from "react";
import {Meteor} from "meteor/meteor";
import MaterialTable from "material-table";

export default function ProjectsControlPanel(props) {
    const [projects, setProjects] = React.useState({});
    const [state, setState] = React.useState({
        columns: [
            { title: 'FirstName', field: 'firstName', editable: 'onAdd' },
            { title: 'LastName', field: 'lastName', editable: 'onAdd'},
            { title: 'Email', field: 'email', editable: 'onAdd'},
            {
                title: 'Project',
                field: 'project',
                lookup: {},
            },
            {
                title: 'Role',
                field: 'role',
                lookup: {
                    manager: 'Manager',
                    changeManager: 'Change Manager',
                    activityOwner: 'Activity Owner',
                },
            },
        ],
        data: [],
    });


    const getUsers = () => {
        Meteor.call('users.getAllusers', (err, res) => {
            if(res){
                let data = [...state.data];
                data = res.map(user => {
                    return {
                        firstName: user.profile.firstName,
                        lastName: user.profile.lastName,
                        email: user.emails[0].address,
                        role: 'manager',
                        project: 'PTXYQkJd6qwJdRYYD'
                    }

                });
                setState({ ...state, data });
            }
        })
    };

    const updateColumns = (projects) => {
        setProjects(projects);
        let columns = [...state.columns];
        if(!Object.keys(columns[columns.length - 2].lookup).length){
            columns[columns.length - 2].lookup = projects;
            setState({...state, columns});
        }

    };

    useEffect(() => {
        if(!state.data.length){
            getUsers();
            if(!Object.keys(projects).length){
                if(props.projects && props.projects.length){
                    let projects1 = props.projects.reduce(function(acc, cur, i) {
                        acc[cur._id] = cur.name;
                        return acc;
                    }, {});
                    updateColumns(projects1);
                }
            }
        }
    });


    return (
        <MaterialTable
            title="Control Panel"
            columns={state.columns}
            options={{
                actionsColumnIndex: -1
            }}
            data={state.data}
            editable={{
                onRowAdd: newData =>
                    new Promise(resolve => {
                        setTimeout(() => {
                            resolve();
                            const data = [...state.data];
                            data.push(newData);
                            setState({ ...state, data });
                        }, 600);
                    }),
                onRowUpdate: (newData, oldData) =>
                    new Promise(resolve => {
                        setTimeout(() => {
                            resolve();
                            const data = [...state.data];
                            data[data.indexOf(oldData)] = newData;
                            setState({ ...state, data });
                        }, 600);
                    }),
                onRowDelete: oldData =>
                    new Promise(resolve => {
                        setTimeout(() => {
                            resolve();
                            const data = [...state.data];
                            data.splice(data.indexOf(oldData), 1);
                            setState({ ...state, data });
                        }, 600);
                    }),
            }}
        />
    );
}