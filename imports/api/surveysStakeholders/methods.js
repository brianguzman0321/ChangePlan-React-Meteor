import { Meteor } from "meteor/meteor";
import { _ } from 'meteor/underscore';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import SimpleSchema from 'simpl-schema';

import {SurveysStakeholders} from './surveysStakeholders';

export const insert = new ValidatedMethod({
  name: 'surveysStakeholders.insert',
  validate: new SimpleSchema({
    'surveyStakeholder': {
      type: Object,
    },
    'surveyStakeholder.activityId': {
      type: String,
    },
    'surveyStakeholder.stakeholderId': {
      type: String,
    },
    'surveyStakeholder.question1': {
      type: Number,
    },
    'surveyStakeholder.question2': {
      type: String,
      optional: true,
    },
  }).validator(),
  run({surveyStakeholder}) {
    return SurveysStakeholders.insert(surveyStakeholder);
  }
});

export const update = new ValidatedMethod({
  name: 'surveysStakeholders.update',
  validate: new SimpleSchema({
    'surveyStakeholder': {
      type: Object,
    },
    'surveyStakeholder.activityId': {
      type: String,
    },
    'surveyStakeholder._id': {
      type: String,
    },
    'surveyStakeholder.stakeholderId': {
      type: String,
    },
    'surveyStakeholder.question1': {
      type: Number,
    },
    'surveyStakeholder.question2': {
      type: String,
      optional: true,
    },
  }).validator(),
  run({surveyStakeholder}) {
    const {_id} = surveyStakeholder;
    return SurveysStakeholders.update(_id, {$set: surveyStakeholder});
  }
});

export const remove = new ValidatedMethod({
  name: 'surveysStakeholders.remove',
  validate: new SimpleSchema({
    'surveyStakeholder': {
      type: Object
    },
    'surveyStakeholder._id': {
      type: String
    }
  }).validator(),
  run({surveyStakeholder}) {
    const {_id} = surveyStakeholder;
    return SurveysStakeholders.remove(_id);
  }
});

const SURVEYSSTAKEHOLDERS_METHODS = _.pluck([
  insert,
  update,
  remove,
], 'name');

if (Meteor.isServer) {
  DDPRateLimiter.addRule({
    name(name) {
      return _.contains(SURVEYSSTAKEHOLDERS_METHODS, name);
    },
    // Rate limit per connection ID
    connectionId() {
      return true;
    }
  }, 5, 1000);
}