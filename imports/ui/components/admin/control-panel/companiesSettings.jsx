import React, {useEffect} from "react";
import {Meteor} from "meteor/meteor";
import MaterialTable from "material-table";
import {withTracker} from "meteor/react-meteor-data";
import {Companies} from "../../../../api/companies/companies";
import {Projects} from "../../../../api/projects/projects";
import {Accounts} from "meteor/accounts-base";

function CompaniesControlPanel(props) {
    if (!props.currentCompany){
        return <div></div>
    }
    const [companies, setCompanies] = React.useState({});
    const [state, setState] = React.useState({
        columns: [
            {title: 'FirstName', field: 'firstName', editable: 'onAdd'},
            {title: 'LastName', field: 'lastName', editable: 'onAdd'},
            {title: 'Email', field: 'email', editable: 'onAdd'},
            {title: 'CurrentRole', field: 'currentRole', editable: 'never'},
            {
                title: 'Role',
                field: 'role',
                lookup: {
                    admin: 'Admin',
                    noRole: 'No Role',
                },
            },
        ],
        data: props.currentCompany.peoplesDetails.map(user => {
            return {
                _id: user._id,
                firstName: user.profile.firstName,
                lastName: user.profile.lastName,
                email: user.emails[0].address,
                role: props.currentCompany.admins.includes(user._id) ? 'admin' :  'noRole',
                currentRole: props.currentCompany.admins.includes(user._id) ? 'admin' :  'noRole'
            }
        })
    });


    // const getUsers = () => {
    //     Meteor.call('users.getAllusers', (err, res) => {
    //         if(res){
    //             let data = [...state.data];
    //             data = res.map(user => {
    //                 return {
    //                     firstName: user.profile.firstName,
    //                     lastName: user.profile.lastName,
    //                     email: user.emails[0].address,
    //                     role: 'admin',
    //                     company: 'PTXYQkJd6qwJdRYYD'
    //                 }
    //
    //             });
    //             setState({ ...state, data });
    //         }
    //     })
    // };

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
                // onRowAdd: newData =>
                //     new Promise(resolve => {
                //         setTimeout(() => {
                //             resolve();
                //             const data = [...state.data];
                //             data.push(newData);
                //             setState({ ...state, data });
                //         }, 600);
                //     }),
                onRowAdd: newData => {
                    return new Promise((resolve, reject) => {
                        let profile = {
                            firstName: newData.firstName,
                            lastName: newData.lastName
                        };
                        Meteor.call('users.inviteNewUser', {profile, email: newData.email}, (err, res) => {
                            if(err){
                                reject("Email already exists");
                                return false;
                            }
                            else{
                                resolve();
                                const data = [...state.data];
                                data.push(newData);
                                setState({...state, data});
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
                        }
                        Meteor.call('users.updateRole', params, (err, res) => {
                            if (err) {
                                reject("Email already exists");
                                return false;
                            }
                            else {
                                resolve();
                                const data = [...state.data];
                                data[data.indexOf(oldData)] = newData;
                                setState({...state, data});
                            }

                        })
                    })
                },
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


const CompaniesControlPanelPage = withTracker(props => {
    console.log(props.companies, "in companies")
    // Do all your reactive data access in this method.
    // Note that this subscription will get cleaned up when your component is unmounted
    // const handle = Meteor.subscribe('todoList', props.id);
    Meteor.subscribe('compoundCompanies');
    Meteor.subscribe('projects');
    // let { parentProps } = props;
    let local = LocalCollection.findOne({
        name: 'localCompanies'
    });

    const currentCompany = Companies.findOne({_id: local.id});

    return {
        companies: Companies.find({}).fetch(),
        projects: Projects.find({}).fetch(),
        currentCompany,
    };
})(CompaniesControlPanel);

export default CompaniesControlPanelPage