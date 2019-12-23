// methods related to companies

import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import SimpleSchema from 'simpl-schema';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';
import { LoggedInMixin } from 'meteor/tunifight:loggedin-mixin';

import { Activities } from './activities.js';

export const insert = new ValidatedMethod({
    name: 'activities.insert',
    mixins : [LoggedInMixin],
    checkLoggedInError: {
        error: 'notLogged',
        message: 'You need to be logged in to create activity'
    },
    validate: new SimpleSchema({
        'activity': {
            type: Object
        },
        'activity.owner': {
            type: String,
            optional: true
        },
        'activity.type': {
            type: String,
        },
        'activity.step': {
            type: Number,
        },
        'activity.time': {
            type: Number,
            optional: true,
        },
        'activity.name': {
            type: String,
        },
        'activity.description': {
            type: String,
            optional: true,
        },
        'activity.projectId': {
            type: String,
            optional: true,
        },
        'activity.templateId': {
          type: String,
          optional: true,
        },
        'activity.stakeHolders': {
            type: Array,
            defaultValue: [],
        },
        'activity.stakeHolders.$': {
            type: String
        },
        'activity.completedAt': {
            type: Date,
            optional: true
        },
        'activity.dueDate': {
            type: Date,
        },
        'activity.completed': {
            type: Boolean,
            optional: true
        },
    }).validator(),
    run({ activity }) {
        return Activities.insert(activity);
    }
});




export const update = new ValidatedMethod({
    name: 'activities.update',
    mixins: [LoggedInMixin],
    checkLoggedInError: {
        error: 'notLogged',
        message: 'You need to be logged in to update activity'
    },
    validate: new SimpleSchema({
        'activity': {
            type: Object
        },
        'activity._id': {
            type: String,
        },
        'activity.owner': {
            type: String,
            optional: true,
        },
        'activity.type': {
            type: String,
        },
        'activity.step': {
            type: Number,
        },
        'activity.time': {
            type: Number,
            optional: true,
        },
        'activity.name': {
            type: String,
        },
        'activity.description': {
            type: String,
            optional: true,
        },
        'activity.projectId': {
            type: String,
            optional: true,
        },
        'activity.templateId': {
            type: String,
            optional: true,
        },
        'activity.stakeHolders': {
            type: Array,
            defaultValue: [],
        },
        'activity.stakeHolders.$': {
            type: String
        },
        'activity.completedAt': {
            type: Date,
            optional: true
        },
        'activity.dueDate': {
            type: Date,
        },
        'activity.createdAt': {
            type: Date,
            optional: true
        },
        'activity.updatedAt': {
            type: Date,
            optional: true
        },
        'activity.completed': {
            type: Boolean,
            optional: true
        },
    }).validator(),
    run({ activity }) {
        let {_id} = activity;
        return Activities.update(_id, {$set: activity});
    }
});



export const remove = new ValidatedMethod({
    name: 'activities.remove',
    mixins : [LoggedInMixin],
    checkLoggedInError: {
        error: 'notLogged',
        message: 'You need to be logged in to remove activity'
    },
    validate: new SimpleSchema({
        'activity': {
            type: Object
        },
        'activity._id': {
            type: String
        }
    }).validator(),
    run({ activity }) {
        const {_id} = activity;
        return Activities.remove(_id);
    }
});

export const getStakeholderActivities = new ValidatedMethod({
    name: 'activities.getStakeholderActivities',
    mixins : [LoggedInMixin],
    checkLoggedInError: {
        error: 'notLogged',
        message: 'You need to be logged in to remove activity'
    },
    validate: new SimpleSchema({
        'activity': {
            type: Object
        },
        'activity.stakeholderId': {
            type: String
        }
    }).validator(),
    run({ activity }) {
        const {stakeholderId} = activity;
        let pipeline = [
            {
                $match: {
                    stakeHolders: stakeholderId
                }
            },
            {
                $group: {_id: null, totalTime: {$sum: "$time"}}
            }
        ];
        let result = Activities.aggregate(pipeline);
        let totalTime = result.length && result[0].totalTime;
        let activities = Activities.find({
            stakeHolders: stakeholderId
        }).fetch();
        return {
            activities,
            totalTime
        }
    }
});

// Get list of all method names on Companies
const ACTIVITIES_METHODS = _.pluck([
    insert,
    update,
    remove,
    getStakeholderActivities
], 'name');

if (Meteor.isServer) {
    DDPRateLimiter.addRule({
        name(name) {
            return _.contains(ACTIVITIES_METHODS, name);
        },

        // Rate limit per connection ID
        connectionId() { return true; }
    }, 20, 1000);
}