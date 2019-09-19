import React, {useEffect} from "react";
import {Meteor} from "meteor/meteor";
import MaterialTable from "material-table";

export default function CompaniesControlPanel(props) {
    const [companies, setCompanies] = React.useState({});
    const [state, setState] = React.useState({
        columns: [
            { title: 'FirstName', field: 'firstName', editable: 'onAdd' },
            { title: 'LastName', field: 'lastName', editable: 'onAdd'},
            { title: 'Email', field: 'email', editable: 'onAdd'},
            {
                title: 'Company',
                field: 'company',
                lookup: {},
            },
            {
                title: 'Role',
                field: 'role',
                lookup: {
                    admin: 'Admin',
                    remove: 'Remove Admin',
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
                        role: 'admin',
                        company: 'PTXYQkJd6qwJdRYYD'
                    }

                });
                setState({ ...state, data });
            }
        })
    };

    const updateColumns = (companies) => {
        setCompanies(companies);
        let columns = [...state.columns];
        if(!Object.keys(columns[columns.length - 2].lookup).length){
            columns[columns.length - 2].lookup = companies;
            setState({...state, columns});
        }

    };

    useEffect(() => {
        if(!state.data.length){
            getUsers();
            if(!Object.keys(companies).length){
                if(props.companies && props.companies.length){
                    let companies1 = props.companies.reduce(function(acc, cur, i) {
                        acc[cur._id] = cur.name;
                        return acc;
                    }, {});
                    updateColumns(companies1);
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