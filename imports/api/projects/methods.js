// methods related to companies

import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import SimpleSchema from 'simpl-schema';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';
import { LoggedInMixin } from 'meteor/tunifight:loggedin-mixin';

import { Projects } from './projects.js';

export const insert = new ValidatedMethod({
    name: 'projects.insert',
    mixins : [LoggedInMixin],
    checkLoggedInError: {
        error: 'notLogged',
        message: 'You need to be logged in to create project'
    },
    validate: new SimpleSchema({
        'project': {
            type: Object
        },
        'project.owner': {
            type: String,
        },
        'project.companyId': {
            type: String,
        },
        'project.stakeHolders': {
            type: Array,
        },
        'project.stakeHolders.$': {
            type: String
        },
        'project.admins': {
            type: Array,
        },
        'project.admins.$': {
            type: String
        },
        'project.managers': {
            type: Array,
        },
        'project.managers.$': {
            type: String
        },
        'project.startingDate': {
            type: Date,
        },
        'project.peopleCount': {
            type: Number,
        },
        'project.endingDate': {
            type: Date,
        },
    }).validator(),
    run({ project }) {
        return Projects.insert(project);
    }
});




export const update = new ValidatedMethod({
    name: 'projects.update',
    mixins: [LoggedInMixin],
    checkLoggedInError: {
        error: 'notLogged',
        message: 'You need to be logged in to update project'
    },
    validate: new SimpleSchema({
        'project': {
            type: Object
        },
        'project.owner': {
            type: String,
        },
        'project.companyId': {
            type: String,
        },
        'project.stakeHolders': {
            type: Array,
        },
        'project.stakeHolders.$': {
            type: String
        },
        'project.admins': {
            type: Array,
        },
        'project.admins.$': {
            type: String
        },
        'project.managers': {
            type: Array,
        },
        'project.managers.$': {
            type: String
        },
        'project.startingDate': {
            type: Date,
        },
        'project.peopleCount': {
            type: Number,
        },
        'project.endingDate': {
            type: Date,
        },
    }).validator(),
    run({ project }) {
        return Projects.update(_id, {$set: project});
    }
});



export const remove = new ValidatedMethod({
    name: 'projects.remove',
    mixins : [LoggedInMixin],
    checkLoggedInError: {
        error: 'notLogged',
        message: 'You need to be logged in to remove project'
    },
    validate: new SimpleSchema({
        'project': {
            type: Object
        },
        'project._id': {
            type: String
        }
    }).validator(),
    run({ project }) {
        const {_id} = project;
        return Projects.remove(_id);
    }
});

// Get list of all method names on Companies
const PROJECTS_METHODS = _.pluck([
    insert,
    update,
    remove
], 'name');

if (Meteor.isServer) {
    DDPRateLimiter.addRule({
        name(name) {
            return _.contains(PROJECTS_METHODS, name);
        },

        // Rate limit per connection ID
        connectionId() { return true; }
    }, 5, 1000);
}