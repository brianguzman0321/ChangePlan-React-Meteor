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
            optional: true
        },
        'project.name': {
            type: String,
        },
        'project.companyId': {
            type: String,
        },
        'project.peoples': {
            type: Array,
            optional: true
        },
        'project.peoples.$': {
            type: String,
            optional: true
        },
        'project.stakeHolders': {
            type: Array,
            optional: true
        },
        'project.stakeHolders.$': {
            type: String,
            optional: true
        },
        'project.managers': {
            type: Array,
            optional: true
        },
        'project.managers.$': {
            type: String,
            optional: true
        },
        'project.changeManagers': {
            type: Array,
            optional: true
        },
        'project.changeManagers.$': {
            type: String,
            optional: true
        },
        'project.vision': {
            type: Array,
            optional: true
        },
        'project.vision.$': {
            type: String,
            optional: true
        },
        'project.objectives': {
            type: Array,
            optional: true
        },
        'project.objectives.$': {
            type: String,
            optional: true
        },
        'project.risks': {
            type: Array,
            optional: true
        },
        'project.risks.$': {
            type: String,
            optional: true
        },
        'project.impacts': {
            type: Array,
            optional: true
        },
        'project.impacts.$': {
            type: Object,
            blackbox: true,
            optional: true
        },
        'project.startingDate': {
            type: Date,
        },
        'project.peopleCount': {
            type: Number,
            optional: true
        },
        'project.endingDate': {
            type: Date,
        },
    }).validator(),
    run({ project }) {
        if(!project.owner){
            project.owner = this.userId;
            project.changeManagers = [this.userId];
            //TODO append if peoples already supplying from admin panel
            project.peoples = [this.userId]
        }
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
        'project._id': {
            type: String,
        },
        'project.owner': {
            type: String,
        },
        'project.name': {
            type: String,
        },
        'project.companyId': {
            type: String,
        },
        'project.peoples': {
            type: Array,
        },
        'project.peoples.$': {
            type: String
        },
        'project.stakeHolders': {
            type: Array,
        },
        'project.stakeHolders.$': {
            type: String
        },
        'project.managers': {
            type: Array,
        },
        'project.managers.$': {
            type: String
        },
        'project.changeManagers': {
            type: Array,
        },
        'project.changeManagers.$': {
            type: String
        },
        'project.vision': {
            type: Array,
            optional: true
        },
        'project.vision.$': {
            type: String,
            optional: true
        },
        'project.objectives': {
            type: Array,
            optional: true
        },
        'project.objectives.$': {
            type: String,
            optional: true
        },
        'project.impacts': {
            type: Array,
            optional: true
        },
        'project.impacts.$': {
            type: Object,
            blackbox: true,
            optional: true
        },
        'project.risks': {
            type: Array,
            optional: true
        },
        'project.risks.$': {
            type: Object,
            blackbox: true,
            optional: true
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
        'project.createdAt': {
            type: Date,
            optional: true
        },
        'project.updatedAt': {
            type: Date,
            optional: true
        },
    }).validator(),
    run({ project }) {
        let { _id } = project;
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