import React, {useEffect} from "react";
import { withTracker } from "meteor/react-meteor-data";
import { Companies } from "/imports/api/companies/companies";
import { Projects } from "/imports/api/projects/projects";
import ControlledOpenSelect from './selectionModal'
import ProjectsSettingsPage from './projects'

function ProjectsControlPanel(props) {
    let {projects, currentCompany} = props;

    useEffect(()=> {
        if (projects && currentCompany) {
            projects.filter(project => project.companyId === currentCompany._id)
        }
    }, [currentCompany]);

    if (!props.currentCompany){
        return <div/>
    }

    return (
        <div>
            {
                props.currentCompany ?
                    <ControlledOpenSelect {...props} title="Projects" entity="Project" entities={props.projects} localCollection="localProjects" id="projectId"/> : ''
            }
            <br/>
            <ProjectsSettingsPage {...props} projects={projects} />
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
    const allProjects = Projects.find({}).fetch();
    let projects = {};
    if (currentCompany) {
        projects = allProjects.filter(project => project.companyId === currentCompany._id);
    }
    return {
        companies: Companies.find({}).fetch(),
        projects,
        currentCompany,
        currentProject
    };
})(ProjectsControlPanel);

export default ProjectsControlPanelPage