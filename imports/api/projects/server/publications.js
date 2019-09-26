import { Meteor } from 'meteor/meteor';
import { Projects } from '../projects.js';

Meteor.publish('projects', function (company) {
    if(Roles.userIsInRole(this.userId, 'superAdmin')){
        return Projects.find({})
    }
    return Projects.find({
        $or: [{
            owner: this.userId
        }, {
            peoples:{
                $in: [this.userId]
            }
        }]
    });
});

Meteor.publishTransformed('compoundProjects', function (companyId) {
    let query = {};
    companyId && (query.companyId = companyId);
    // if(!Roles.userIsInRole(this.userId, 'superAdmin')){
        //if user Not Super Admin then return only own projects
        // query = {
        //     peoples:{
        //         $in: [this.userId]
        //     }
        // }
    // }
    return Projects.find(query).serverTransform({
        'peoplesDetails': function (doc) {
            let peoples = [];
            _(doc.peoples).each(function (PeopleId) {
                peoples.push(Meteor.users.findOne({_id: PeopleId}, {
                    fields: {
                        services: 0, roles: 0
                    }
                }));
            });

            return peoples;
        },
    });
});

Meteor.publish('projects.single', function (id) {
    return Projects.find({
        owner: this.userId,
        _id: id
    });
});