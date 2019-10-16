import { Companies } from '/imports/api/companies/companies'
import { Peoples } from '/imports/api/peoples/peoples'
import { Activities } from '/imports/api/activities/activities'
import { Projects } from '/imports/api/projects/projects'
import { Roles } from 'meteor/alanning:roles'

let companyId, projectId, stackHolderId;

let superAdmin = Meteor.users.findOne({
    'emails.address': 'raza2022@gmail.com'
});

let superAdmin1 = Meteor.users.findOne({
    'emails.address': 'gavin.wedell@changeactivation.com'
});

if(superAdmin1 && superAdmin1._id) {
    Roles.addUsersToRoles(superAdmin1._id, 'superAdmin', Roles.GLOBAL_GROUP);
}
//
if(superAdmin && superAdmin._id) {
    Roles.addUsersToRoles(superAdmin._id, 'superAdmin', Roles.GLOBAL_GROUP);

    if(!Companies.findOne()){
        console.log("No Companies Exists");
        companyId = Companies.insert({
            owner: superAdmin._id,
            name: "AppBakerZ",
            peoples: [superAdmin._id]
        })
    }
    // if(!Projects.findOne()){
    //     console.log("No Projects Exists");
    //     projectId = Projects.insert({
    //         owner: superAdmin._id,
    //         name: 'Change Plan Development',
    //         companyId: companyId,
    //         peoples: [superAdmin._id],
    //         startingDate: new Date(),
    //         endingDate: new Date()
    //     })
    // }

    // if(!Activities.findOne()){
    //     console.log("No Activities Exists");
    //     projectId = Activities.insert({
    //         owner: superAdmin._id,
    //         activityOwner: superAdmin._id,
    //         startingDate: new Date(),
    //         endingDate: new Date(),
    //         name: 'email',
    //         type: 'email',
    //         description: 'email',
    //         projectId: projectId,
    //     })
    // }
    // if(!Peoples.findOne()){
    //     console.log("No StackHolders Exists");
    //     stackHolderId = Peoples.insert({
    //         company: companyId,
    //         businessUnit: 'Development Department',
    //         name: "Abdul Hameed",
    //         role: 'Project Manager',
    //         email: 'raza2022@gmail.com',
    //         supportLevel: 5,
    //         influenceLevel: 3
    //     })
    // }
}

createSampleUsers = () => {
    let data = [
        {
            email: 'a@a.com',
            password: 'g1superadmin',
            profile: {
                firstName: 'Super',
                lastName: 'Admin'
            }
        },
        {
            email: 'b@b.com',
            password: 'g1admin',
            profile: {
                firstName: 'Admin',
                lastName: 'Admin'
            }
        },
        {
            email: 'c@c.com',
            password: 'g1changemanger',
            profile: {
                firstName: 'Change',
                lastName: 'Manager'
            }
        },
        {
            email: 'd@d.com',
            password: 'g1manager',
            profile: {
                firstName: 'Manager',
                lastName: 'Manager'
            }
        },
    ];

    data.forEach(user => {
        Accounts.createUser({
            email : user.email,
            password : user.password,
            profile  : user.profile
        });
    })
};

// if(!(superAdmin2 && superAdmin2._id)){
//     createSampleUsers()
// }
