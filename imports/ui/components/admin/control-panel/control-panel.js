import React, {useEffect} from 'react';
import MaterialTable from 'material-table';

export default function ProjectsControlPanel() {
    const [state, setState] = React.useState({
        columns: [
            { title: 'FirstName', field: 'firstName', editable: 'onAdd' },
            { title: 'LastName', field: 'lastName', editable: 'onAdd'},
            { title: 'Email', field: 'email', editable: 'onAdd'},
            {
                title: 'Role',
                field: 'role',
                lookup: {
                    admin: 'Admin',
                    manager: 'Manager',
                    changeManager: 'Change Manager',
                    activityOwner: 'Activity Owner',
                },
            },
        ],
        data: [],
        dataFetched: false
    });

    useEffect((props) => {
        if(!state.data.length){
            Meteor.call('users.getAllusers', (err, res) => {
                console.log(err);
                if(res){
                    let data = [...state.data];
                    data = res.map(user => {
                        return {
                            firstName: user.profile.firstName,
                            lastName: user.profile.lastName,
                            email: user.emails[0].address,
                            role: 'manager'
                        }

                    });
                    setState({ ...state, data });
                }
            })
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