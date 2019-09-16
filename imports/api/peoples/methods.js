// methods related to companies

import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import SimpleSchema from 'simpl-schema';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';
import { LoggedInMixin } from 'meteor/tunifight:loggedin-mixin';

import { Peoples } from './peoples.js';

export const insert = new ValidatedMethod({
    name: 'peoples.insert',
    mixins : [LoggedInMixin],
    checkLoggedInError: {
        error: 'notLogged',
        message: 'You need to be logged in to create people'
    },
    validate: new SimpleSchema({
        'people': {
            type: Object
        },
        'people.name': {
            type: String,
        },
        'people.email': {
            type: String,
        },
        'people.role': {
            type: String,
        },
        'people.supportLevel': {
            type: Number,
            optional: true
        },
        'people.influenceLevel': {
            type: Number,
            optional: true
        },
    }).validator(),
    run({ people }) {
        return Peoples.insert(people);
    }
});




export const update = new ValidatedMethod({
    name: 'peoples.update',
    mixins: [LoggedInMixin],
    checkLoggedInError: {
        error: 'notLogged',
        message: 'You need to be logged in to update people'
    },
    validate: new SimpleSchema({
        'people': {
            type: Object
        },
        'people.name': {
            type: String,
        },
        'people.email': {
            type: String,
        },
        'people.role': {
            type: String,
        },
        'people.supportLevel': {
            type: Number,
            optional: true
        },
        'people.influenceLevel': {
            type: Number,
            optional: true
        },
    }).validator(),
    run({ people }) {
        return Peoples.update(_id, {$set: people});
    }
});



export const remove = new ValidatedMethod({
    name: 'peoples.remove',
    mixins : [LoggedInMixin],
    checkLoggedInError: {
        error: 'notLogged',
        message: 'You need to be logged in to remove people'
    },
    validate: new SimpleSchema({
        'people': {
            type: Object
        },
        'people._id': {
            type: String
        }
    }).validator(),
    run({ people }) {
        const {_id} = people;
        return Peoples.remove(_id);
    }
});

// Get list of all method names on Companies
const PEOPLES_METHODS = _.pluck([
    insert,
    update,
    remove
], 'name');

if (Meteor.isServer) {
    DDPRateLimiter.addRule({
        name(name) {
            return _.contains(PEOPLES_METHODS, name);
        },

        // Rate limit per connection ID
        connectionId() { return true; }
    }, 5, 1000);
}