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
        return new Counter('projectExists', Meteor.users.find({}))
    }
    let company = Companies.findOne({
        admins:{
            $in: [this.userId]
        }
    });
    // //admin
    if(company && company._id){
        return new Counter('projectExists', Companies.find({
            _id: company._id
        }))
    }
    //owner or changeManager
    new Counter('projectExists', Projects.find({
        $or: [{
            owner: this.userId
        }, {
            changeManagers:{
                $in: [this.userId]
            }
        }]
    }));
});

Meteor.publishTransformed('compoundProjects', function (company) {
    let query = {};
    company && (query.companyId = company._id);
    if(Roles.userIsInRole(this.userId, 'superAdmin')){

    }
    else if(company && company.admins.includes(this.userId)){
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

Meteor.publishTransformed('compoundProject', function (projectId) {
    let query = {};
    projectId && (query._id = projectId);
    if(Roles.userIsInRole(this.userId, 'superAdmin')){

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
        'managerDetails': function (doc) {
            let peoples = [];
            _(doc.managers).each(function (PeopleId) {
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


Meteor.publishTransformed('myProjects', function (company, parameters) {
    let options = {
        sort: {
            name: -1
        }
    };
    // if(parameters.sort){
    //     options.sort = {};
    //     options.sort[parameters.sort] = 1
    // }
    if(!(company && company._id)){
        company = Companies.findOne({
            peoples:{
                $in: [this.userId]
            }
        })
    }
    let query = {};
    //add Search By Project Name
    if(parameters.name){
        query.name = {
            $regex: parameters.name,
            $options : 'i'
        }
    }
    company && (query.companyId = company._id);
    if(company && company.admins.includes(this.userId)){
        // query.companyId = company._id
    }
    else if(!Roles.userIsInRole(this.userId, 'superAdmin')){
        // if user Not Super Admin then return only own projects
        query = Object.assign(query, {
            peoples:{
                $in: [this.userId]
            }
        })
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
        'managerDetails': function (doc) {
            let peoples = [];
            _(doc.managers).each(function (PeopleId) {
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