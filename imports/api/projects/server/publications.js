import { Meteor } from 'meteor/meteor';
import { Projects } from '../projects.js';
import { Companies } from "../../companies/companies";
import { Activities } from "/imports/api/activities/activities";

Meteor.publish('projects', function (company) {
    if(Roles.userIsInRole(this.userId, 'superAdmin')){
        return Projects.find({})
    }
    if(company && company.admins.includes(this.userId)){
        return Projects.find({
            companyId: company._id
        })
    }
    return Projects.find({
        $or: [{
            owner: this.userId
        }, {
            changeManagers:{
                $in: [this.userId]
            }
        }]
    });
});

Meteor.publish('projectExists', function () {
    //superAdmin
    if(Roles.userIsInRole(this.userId, 'superAdmin')){
        return Projects.find({})
    }
    let company = Companies.findOne({
        admins:{
            $in: [this.userId]
        }
    });
    //admin
    if(company && company._id){
        return Projects.find({
            companyId: company._id
        })
    }
    //owner or changeManager
    return Projects.find({
        $or: [{
            owner: this.userId
        }, {
            changeManagers:{
                $in: [this.userId]
            }
        }]
    });
});

Meteor.publishTransformed('compoundProjects', function (company) {
    let query = {};
    company && (query.companyId = company._id);
    if(company && company.admins.includes(this.userId)){
        // query.companyId = company._id
    }
    else if(!Roles.userIsInRole(this.userId, 'superAdmin')){
        // if user Not Super Admin then return only own projects
        query = {
            changeManagers:{
                $in: [this.userId]
            }
        }
    }
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


Meteor.publishTransformed('myProjects', function (company) {
    if(!(company && company._id)){
        company = Companies.findOne({
            peoples:{
                $in: [this.userId]
            }
        })
    }
    let query = {};
    company && (query.companyId = company._id);
    if(company && company.admins.includes(this.userId)){
        // query.companyId = company._id
    }
    else if(!Roles.userIsInRole(this.userId, 'superAdmin')){
        // if user Not Super Admin then return only own projects
        query = {
            peoples:{
                $in: [this.userId]
            }
        }
    }
    return Projects.find(query).serverTransform({
        'changeManagerDetails': function (doc) {
            let peoples = [];
            _(doc.changeManagers).each(function (PeopleId) {
                peoples.push(Meteor.users.findOne({_id: PeopleId}, {
                    fields: {
                        services: 0, roles: 0
                    }
                }));
            });

            return peoples;
        },
        'totalActivities': function (doc) {
            return Activities.find({
                projectId: doc._id
            }).fetch().length
        },
    });
});