import { Meteor } from "meteor/meteor";
import { _ } from 'meteor/underscore';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import SimpleSchema from 'simpl-schema';

import {SurveysActivityOwners} from './surveysActivityOwners';

export const insert = new ValidatedMethod({
  name: 'surveysActivityOwners.insert',
  validate: new SimpleSchema({
    'surveyActivityOwners': {
      type: Object,
    },
    'surveyActivityOwners.activityId': {
      type: String,
    },
    'surveyActivityOwners.activityOwnerId': {
      type: String,
    },
    'surveyActivityOwners.question1': {
      type: Number,
    },
    'surveyActivityOwners.question2': {
      type: Number,
      optional: true,
    },
    'surveyActivityOwners.question3': {
      type: String,
      optional: true,
    },
    'surveyActivityOwners.question4': {
      type: String,
      optional: true,
    },
    'surveyActivityOwners.question5': {
      type: String,
      optional: true,
    },
  }).validator(),
  run({surveyActivityOwners}) {
    return SurveysActivityOwners.insert(surveyActivityOwners);
  }
});

export const update = new ValidatedMethod({
  name: 'surveysActivityOwners.update',
  validate: new SimpleSchema({
    'surveyActivityOwners': {
      type: Object,
    },
    'surveyActivityOwners.activityId': {
      type: String,
    },
    'surveyActivityOwners._id': {
      type: String,
    },
    'surveyActivityOwners.activityOwnerId': {
      type: String,
    },
    'surveyActivityOwners.question1': {
      type: Number,
    },
    'surveyActivityOwners.question2': {
      type: Number,
      optional: true,
    },
    'surveyActivityOwners.question3': {
      type: String,
      optional: true,
    },
    'surveyActivityOwners.question4': {
      type: String,
      optional: true,
    },
    'surveyActivityOwners.question5': {
      type: String,
      optional: true,
    },
  }).validator(),
  run({surveyActivityOwners}) {
    const {_id} = surveyActivityOwners;
    return SurveysActivityOwners.update(_id, {$set: surveyActivityOwners});
  }
});

export const remove = new ValidatedMethod({
  name: 'surveysActivityOwners.remove',
  validate: new SimpleSchema({
    'surveyActivityOwners': {
      type: Object
    },
    'surveyActivityOwners._id': {
      type: String
    }
  }).validator(),
  run({surveyActivityOwners}) {
    const {_id} = surveyActivityOwners;
    return SurveysActivityOwners.remove(_id);
  }
});

const SURVEYSACTIVITYOWNERS_METHODS = _.pluck([
  insert,
  update,
  remove,
], 'name');

if (Meteor.isServer) {
  DDPRateLimiter.addRule({
    name(name) {
      return _.contains(SURVEYSACTIVITYOWNERS_METHODS, name);
    },
    // Rate limit per connection ID
    connectionId() {
      return true;
    }
  }, 5, 1000);
}