// methods related to companies

import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import SimpleSchema from 'simpl-schema';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';
import { LoggedInMixin } from 'meteor/tunifight:loggedin-mixin';

import { Demos } from './demos.js';

export const insert = new ValidatedMethod({
    name: 'demos.insert',
    mixins : [LoggedInMixin],
    checkLoggedInError: {
        error: 'notLogged',
        message: 'You need to be logged in to create demo'
    },
    validate: new SimpleSchema({
        'demo': {
            type: Object
        },
        'demo.country': {
            type: String
        },
        'demo.owner': {
            type: String,
            optional: true
        },
    }).validator(),
    run({ demo }) {
        return Demos.insert(demo);
    }
});




export const update = new ValidatedMethod({
    name: 'demos.update',
    mixins: [LoggedInMixin],
    checkLoggedInError: {
        error: 'notLogged',
        message: 'You need to be logged in to update demo'
    },
    validate: new SimpleSchema({
        'demo': {
            type: Object
        },
        'demo._id': {
            type: Object
        },
        'demo.country': {
            type: String
        },
        'demo.owner': {
            type: String,
            optional: true
        },
        'demo.createdAt': {
            type: Date,
            optional: true
        },'demo.updatedAt': {
            type: Date,
            optional: true
        }
    }).validator(),
    run({ demo }) {
        let { _id } = demo;
        return Demos.update(_id, {$set: demo});
    }
});



export const remove = new ValidatedMethod({
    name: 'demos.remove',
    mixins : [LoggedInMixin],
    checkLoggedInError: {
        error: 'notLogged',
        message: 'You need to be logged in to remove demo'
    },
    validate: new SimpleSchema({
        'demo': {
            type: Object
        },
        'demo._id': {
            type: String
        }
    }).validator(),
    run({ demo }) {
        const {_id} = demo;
        return Demos.remove(_id);
    }
});

// Get list of all method names on Companies
const DEMOS_METHODS = _.pluck([
    insert,
    update,
    remove
], 'name');

if (Meteor.isServer) {
    DDPRateLimiter.addRule({
        name(name) {
            return _.contains(DEMOS_METHODS, name);
        },

        // Rate limit per connection ID
        connectionId() { return true; }
    }, 5, 1000);
}