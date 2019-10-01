// methods related to companies

import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import SimpleSchema from 'simpl-schema';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';
import { LoggedInMixin } from 'meteor/tunifight:loggedin-mixin';

import { Companies } from './companies.js';

export const insert = new ValidatedMethod({
    name: 'companies.insert',
    mixins : [LoggedInMixin],
    checkLoggedInError: {
        error: 'notLogged',
        message: 'You need to be logged in to create company'
    },
    validate: new SimpleSchema({
        'company': {
            type: Object
        },
        'company.name': {
            type: String
        },
        'company.peoples': {
            type: Array,
            optional: true
        },
        'company.peoples.$': {
            type: String,
            optional: true
        },
        'company.admins': {
            type: Array,
            optional: true
        },
        'company.admins.$': {
            type: String,
            optional: true
        },
        'company.projects': {
            type: Array,
            optional: true
        },
        'company.projects.$': {
            type: String,
            optional: true
        },
    }).validator(),
    run({ company }) {
        company.owner = this.userId;
        return Companies.insert(company);
    }
});




export const update = new ValidatedMethod({
    name: 'companies.update',
    mixins: [LoggedInMixin],
    checkLoggedInError: {
        error: 'notLogged',
        message: 'You need to be logged in to update company'
    },
    validate: new SimpleSchema({
        'company': {
            type: Object
        },
        'company.name': {
            type: String
        },
        'company._id': {
            type: String
        },
        'company.owner': {
            type: String,
            optional: true
        },
        'company.peoples': {
            type: Array,
            optional: true
        },
        'company.peoples.$': {
            type: String,
            optional: true
        },
        'company.admins': {
            type: Array,
            optional: true
        },
        'company.admins.$': {
            type: String,
            optional: true
        },
        'company.projects': {
            type: Array,
            optional: true
        },
        'company.projects.$': {
            type: String,
            optional: true
        },
    }).validator(),
    run({ company }) {
        const { _id } = company;
        delete company._id;
        return Companies.update(_id, {$set: company});
    }
});



export const remove = new ValidatedMethod({
    name: 'companies.remove',
    mixins : [LoggedInMixin],
    checkLoggedInError: {
        error: 'notLogged',
        message: 'You need to be logged in to remove company'
    },
    validate: new SimpleSchema({
        'company': {
            type: Object
        },
        'company._id': {
            type: String
        }
    }).validator(),
    run({ company }) {
        const {_id} = company;
        return Companies.remove(_id);
    }
});

// Get list of all method names on Companies
const COMPANIES_METHODS = _.pluck([
    insert,
    update,
    remove
], 'name');

if (Meteor.isServer) {
    DDPRateLimiter.addRule({
        name(name) {
            return _.contains(COMPANIES_METHODS, name);
        },

        // Rate limit per connection ID
        connectionId() { return true; }
    }, 5, 1000);
}