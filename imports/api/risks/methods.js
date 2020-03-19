// methods related to companies

import {Meteor} from 'meteor/meteor';
import {_} from 'meteor/underscore';
import {ValidatedMethod} from 'meteor/mdg:validated-method';
import SimpleSchema from 'simpl-schema';
import {DDPRateLimiter} from 'meteor/ddp-rate-limiter';
import {LoggedInMixin} from 'meteor/tunifight:loggedin-mixin';

import {Risks} from './risks.js';

export const insert = new ValidatedMethod({
  name: 'risks.insert',
  mixins: [LoggedInMixin],
  checkLoggedInError: {
    error: 'notLogged',
    message: 'You need to be logged in to create impact'
  },
  validate: new SimpleSchema({
    'risk': {
      type: Object
    },
    'risk.projectId': {
      type: String,
      optional: true,
    },
    'risk.description': {
      type: String,
    },
    'risk.raisedDate': {
      type: Date,
    },
    'risk.category': {
      type: String,
    },
    'risk.probability': {
      type: String,
    },
    'risk.impact': {
      type: String,
    },
    'risk.rating': {
      type: String,
    },
    'risk.owner': {
      type: String,
      optional: true,
    },
    'risk.activities': {
      type: Array,
      optional: true,
    },
    'risk.activities.$': {
      type: String,
    },
    'risk.comments': {
      type: String,
      optional: true,
    },
    'risk.residualProbability': {
      type: String,
    },
    'risk.residualImpact': {
      type: String,
    },
    'risk.residualRating': {
      type: String,
    },
    'risk.status': {
      type: String,
    },
  }).validator(),
  run({risk}) {
    return Risks.insert(risk);
  }
});

export const update = new ValidatedMethod({
  name: 'risks.update',
  mixins: [LoggedInMixin],
  checkLoggedInError: {
    error: 'notLogged',
    message: 'You need to be logged in to update impact'
  },
  validate: new SimpleSchema({
    'risk': {
      type: Object
    },
    'risk._id': {
      type: String,
    },
    'risk.projectId': {
      type: String,
      optional: true,
    },
    'risk.description': {
      type: String,
      optional: true,
    },
    'risk.raisedDate': {
      type: Date,
      optional: true,
    },
    'risk.category': {
      type: String,
      optional: true,
    },
    'risk.probability': {
      type: String,
      optional: true,
    },
    'risk.impact': {
      type: String,
      optional: true,
    },
    'risk.rating': {
      type: String,
      optional: true,
    },
    'risk.owner': {
      type: String,
      optional: true,
    },
    'risk.activities': {
      type: Array,
      optional: true,
    },
    'risk.activities.$': {
      type: String,
    },
    'risk.comments': {
      type: String,
      optional: true,
    },
    'risk.residualProbability': {
      type: String,
      optional: true,
    },
    'risk.residualImpact': {
      type: String,
      optional: true,
    },
    'risk.residualRating': {
      type: String,
      optional: true,
    },
    'risk.status': {
      type: String,
      optional: true,
    },
  }).validator(),
  run({risk}) {
    let {_id} = risk;
    return Risks.update(_id, {$set: risk});
  }
});

export const remove = new ValidatedMethod({
  name: 'risks.remove',
  mixins: [LoggedInMixin],
  checkLoggedInError: {
    error: 'notLogged',
    message: 'You need to be logged in to remove impact'
  },
  validate: new SimpleSchema({
    'risk': {
      type: Object
    },
    'risk._id': {
      type: String
    }
  }).validator(),
  run({risk}) {
    const {_id} = risk;
    return Risks.remove(_id);
  }
});

// Get list of all method names on Companies
const RISKS_METHODS = _.pluck([
  insert,
  update,
  remove,
], 'name');

if (Meteor.isServer) {
  DDPRateLimiter.addRule({
    name(name) {
      return _.contains(RISKS_METHODS, name);
    },

    // Rate limit per connection ID
    connectionId() {
      return true;
    }
  }, 20, 1000);
}