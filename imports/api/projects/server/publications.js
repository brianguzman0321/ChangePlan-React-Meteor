import { Meteor } from 'meteor/meteor';
import { Projects } from '../projects.js';
import {Companies} from "../../companies/companies";

Meteor.publish('projects', function () {
    return Projects.find({
        owner: this.userId
    }, {sort: {}});
});

Meteor.publishTransformed('compoundProjects', function () {
    return Companies.find({

    }).serverTransform({
        'managersDetails': function (doc) {
            let managers = [];
            _(doc.managers).each(function (PeopleId) {
                peoples.push(Meteor.users.findOne({_id: PeopleId}, {
                    fields: {
                        services: 0, roles: 0
                    }
                }));
            });

            return managers;
        },
        'changeManagersDetails': function (doc) {
            let changeManagers = [];
            _(doc.changeManagers).each(function (PeopleId) {
                changeManagers.push(Meteor.users.findOne({_id: PeopleId}, {
                    fields: {
                        services: 0, roles: 0
                    }
                }));
            });

            return changeManagers;
        },
    });
});

Meteor.publish('projects.single', function (id) {
    return Projects.find({
        owner: this.userId,
        _id: id
    });
});