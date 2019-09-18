import { Companies } from '/imports/api/companies/companies'
import { Peoples } from '/imports/api/peoples/peoples'
import { Activities } from '/imports/api/activities/activities'
import { Projects } from '/imports/api/projects/projects'
import { Roles } from 'meteor/alanning:roles'

let companyId, projectId, stackHolderId;

let superAdmin = Meteor.users.findOne({
    'emails.address': 'raza2022@gmail.com'
});

//
if(superAdmin && superAdmin._id) {
    Roles.addUsersToRoles(superAdmin._id, 'superAdmin', Roles.GLOBAL_GROUP);

    if(!Companies.findOne()){
        console.log("No Companies Exists");
        companyId = Companies.insert({
            owner: superAdmin._id,
            name: "AppBakerZ"
        })
    }
    if(!Projects.findOne()){
        console.log("No Projects Exists");
        projectId = Projects.insert({
            owner: superAdmin._id,
            companyId: companyId,
            startingDate: new Date(),
            endingDate: new Date()
        })
    }

    if(!Activities.findOne()){
        console.log("No Activities Exists");
        projectId = Activities.insert({
            owner: superAdmin._id,
            startingDate: new Date(),
            endingDate: new Date(),
            name: 'email',
            type: 'email',
            description: 'email',
            projectId: projectId,
        })
    }
    if(!Peoples.findOne()){
        console.log("No StackHolders Exists");
        stackHolderId = Peoples.insert({
            company: companyId,
            businessUnit: 'Development Department',
            name: "Abdul Hameed",
            role: 'Project Manager',
            email: 'raza2022@gmail.com',
            supportLevel: 5,
            influenceLevel: 3
        })
    }
}