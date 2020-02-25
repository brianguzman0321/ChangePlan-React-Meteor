import { Meteor } from "meteor/meteor";
import { _ } from 'meteor/underscore';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import SimpleSchema from 'simpl-schema';

import {SurveysActivityDeliverers} from './surveysActivityDeliverers';

export const insert = new ValidatedMethod({
  name: 'surveysActivityDeliverers.insert',
  validate: new SimpleSchema({
    'surveyActivityDeliverers': {
      type: Object,
    },
    'surveyActivityDeliverers.activityId': {
      type: String,
    },
    'surveyActivityDeliverers.activityDelivererId': {
      type: String,
    },
    'surveyActivityDeliverers.question1': {
      type: Number,
    },
    'surveyActivityDeliverers.question2': {
      type: Number,
      optional: true,
    },
    'surveyActivityDeliverers.question3': {
      type: String,
      optional: true,
    },
    'surveyActivityDeliverers.question4': {
      type: String,
      optional: true,
    },
    'surveyActivityDeliverers.question5': {
      type: String,
      optional: true,
    },
  }).validator(),
  run({surveyActivityDeliverers}) {
    return SurveysActivityDeliverers.insert(surveyActivityDeliverers);
  }
});

export const update = new ValidatedMethod({
  name: 'surveysActivityDeliverers.update',
  validate: new SimpleSchema({
    'surveyActivityDeliverers': {
      type: Object,
    },
    'surveyActivityDeliverers._id': {
      type: String,
    },
    'surveyActivityDeliverers.activityId': {
      type: String,
    },
    'surveyActivityDeliverers.activityDelivererId': {
      type: String,
    },
    'surveyActivityDeliverers.question1': {
      type: Number,
    },
    'surveyActivityDeliverers.question2': {
      type: Number,
      optional: true,
    },
    'surveyActivityDeliverers.question3': {
      type: String,
      optional: true,
    },
    'surveyActivityDeliverers.question4': {
      type: String,
      optional: true,
    },
    'surveyActivityDeliverers.question5': {
      type: String,
      optional: true,
    },
  }).validator(),
  run({surveyActivityDeliverers}) {
    const {_id} = surveyActivityDeliverers;
    return SurveysActivityDeliverers.update(_id, {$set: surveyActivityDeliverers});
  }
});

export const remove = new ValidatedMethod({
  name: 'surveysActivityDeliverers.remove',
  validate: new SimpleSchema({
    'surveyActivityDeliverers': {
      type: Object
    },
    'surveyActivityDeliverers._id': {
      type: String
    }
  }).validator(),
  run({surveyActivityDeliverers}) {
    const {_id} = surveyActivityDeliverers;
    return SurveysActivityDeliverers.remove(_id);
  }
});

const SURVEYSACTIVITYDELIVERERS_METHODS = _.pluck([
  insert,
  update,
  remove,
], 'name');

if (Meteor.isServer) {
  DDPRateLimiter.addRule({
    name(name) {
      return _.contains(SURVEYSACTIVITYDELIVERERS_METHODS, name);
    },
    // Rate limit per connection ID
    connectionId() {
      return true;
    }
  }, 5, 1000);
}