import React, {useEffect} from "react";
import {Meteor} from "meteor/meteor";
import MaterialTable from "material-table";
import {withTracker} from "meteor/react-meteor-data";
import {Companies} from "../../../../api/companies/companies";
import {Projects} from "../../../../api/projects/projects";
import ControlledOpenSelect from './selectionModal'
import ProjectsSettingsPage from './projects'

function ProjectsControlPanel(props) {
    // if (!props.currentCompany){
    //     return <div></div>
    // }
    // else if(props.currentCompany && props.currentProject){
    //     const [companies, setCompanies] = React.useState({});
    //     const [state, setState] = React.useState({
    //         columns: [
    //             {title: 'FirstName', field: 'firstName', editable: 'onAdd'},
    //             {title: 'LastName', field: 'lastName', editable: 'onAdd'},
    //             {title: 'Email', field: 'email', editable: 'onAdd'},
    //             {title: 'CurrentRole', field: 'currentRole', editable: 'never'},
    //             {
    //                 title: 'Assign Role',
    //                 field: 'role',
    //                 lookup: {
    //                     admin: 'Admin',
    //                     noRole: 'No Role',
    //                 },
    //             },
    //         ],
    //         data: props.currentProject.peoplesDetails.map(user => {
    //             return {
    //                 _id: user._id,
    //                 firstName: user.profile.firstName,
    //                 lastName: user.profile.lastName,
    //                 email: user.emails[0].address,
    //                 role: props.currentProject.admins.includes(user._id) ? 'admin' :  'noRole',
    //                 currentRole: props.currentProject.admins.includes(user._id) ? 'admin' :  'noRole'
    //             }
    //         })
    //     });
    //
    // }


    useEffect(() => {
    });


    return (
        <div>
            {
                props.currentCompany ?
                    <ControlledOpenSelect {...props} title="Projects" entity="Project" entities={props.projects} localCollection="localProjects" id="projectId"/> : ''
            }
            <br/>
            <ProjectsSettingsPage {...props} />
        </div>

    );
}


const ProjectsControlPanelPage = withTracker(props => {
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