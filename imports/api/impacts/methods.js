// methods related to companies

import {Meteor} from 'meteor/meteor';
import {_} from 'meteor/underscore';
import {ValidatedMethod} from 'meteor/mdg:validated-method';
import SimpleSchema from 'simpl-schema';
import {DDPRateLimiter} from 'meteor/ddp-rate-limiter';
import {LoggedInMixin} from 'meteor/tunifight:loggedin-mixin';

import {Impacts} from './impacts.js';

export const insert = new ValidatedMethod({
  name: 'impacts.insert',
  mixins: [LoggedInMixin],
  checkLoggedInError: {
    error: 'notLogged',
    message: 'You need to be logged in to create impact'
  },
  validate: new SimpleSchema({
    'impact': {
      type: Object
    },
    'impact.type': {
      type: String,
    },
    'impact.level': {
      type: String,
    },
    'impact.change': {
      type: String,
      optional: true,
    },
    'impact.impact': {
      type: String,
      optional: true,
    },
    'impact.projectId': {
      type: String,
      optional: true,
    },
    'impact.templateId': {
      type: String,
      optional: true,
    },
    'impact.stakeholders': {
      type: Array,
      defaultValue: [],
    },
    'impact.stakeholders.$': {
      type: String
    },
    'impact.activities': {
      type: Array,
      optional: true,
    },
    'impact.activities.$': {
      type: String,
    },
  }).validator(),
  run({impact}) {
    return Impacts.insert(impact);
  }
});

export const update = new ValidatedMethod({
  name: 'impacts.update',
  mixins: [LoggedInMixin],
  checkLoggedInError: {
    error: 'notLogged',
    message: 'You need to be logged in to update impact'
  },
  validate: new SimpleSchema({
    'impact': {
      type: Object
    },
    'impact._id': {
      type: String,
    },
    'impact.type': {
      type: String,
      optional: true,
    },
    'impact.level': {
      type: String,
      optional: true,
    },
    'impact.change': {
      type: String,
      optional: true,
    },
    'impact.impact': {
      type: String,
      optional: true,
    },
    'impact.projectId': {
      type: String,
      optional: true,
    },
    'impact.templateId': {
      type: String,
      optional: true,
    },
    'impact.stakeholders': {
      type: Array,
      defaultValue: [],
      optional: true,
    },
    'impact.stakeholders.$': {
      type: String
    },
    'impact.activities': {
      type: Array,
      defaultValue: [],
      optional: true,
    },
    'impact.activities.$': {
      type: String,
    },
  }).validator(),
  run({impact}) {
    let {_id} = impact;
    return Impacts.update(_id, {$set: impact});
  }
});

export const updateManyImpacts = new ValidatedMethod({
  name: 'impacts.updateMany',
  mixins: [LoggedInMixin],
  checkLoggedInError: {
    error: 'notLogged',
    message: 'You need to be logged in to create people'
  },
  validate: null,
  run({impacts}) {
    _.each(impacts, function (impact) {
      Impacts.update({_id: impact._id}, {$set: {activities: impact.activities}})
    })
  }
});

export const remove = new ValidatedMethod({
  name: 'impacts.remove',
  mixins: [LoggedInMixin],
  checkLoggedInError: {
    error: 'notLogged',
    message: 'You need to be logged in to remove impact'
  },
  validate: new SimpleSchema({
    'impact': {
      type: Object
    },
    'impact._id': {
      type: String
    }
  }).validator(),
  run({impact}) {
    const {_id} = impact;
    return Impacts.remove(_id);
  }
});

// Get list of all method names on Companies
const IMPACTS_METHODS = _.pluck([
  insert,
  update,
  updateManyImpacts,
  remove,
], 'name');

if (Meteor.isServer) {
  DDPRateLimiter.addRule({
    name(name) {
      return _.contains(IMPACTS_METHODS, name);
    },

    // Rate limit per connection ID
    connectionId() {
      return true;
    }
  }, 20, 1000);
}