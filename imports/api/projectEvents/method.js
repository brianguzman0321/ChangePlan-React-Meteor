// methods related to companies

import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import SimpleSchema from 'simpl-schema';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';
import { LoggedInMixin } from 'meteor/tunifight:loggedin-mixin';

import { ProjectEvents } from './projectEvents';

export const insert = new ValidatedMethod({
  name: 'projectEvents.insert',
  mixins : [LoggedInMixin],
  checkLoggedInError: {
    error: 'notLogged',
    message: 'You need to be logged in to create event'
  },
  validate: new SimpleSchema({
    'projectEvent': {
      type: Object
    },
    'projectEvent.projectId': {
      type: String,
    },
    'projectEvent.name': {
      type: String,
    },
    'projectEvent.startDate': {
      type: Date,
    },
    'projectEvent.endDate': {
      type: Date,
    }
  }).validator(),
  run({ projectEvent }) {
    return ProjectEvents.insert(projectEvent);
  }
});

export const update = new ValidatedMethod({
  name: 'projectEvents.update',
  mixins: [LoggedInMixin],
  checkLoggedInError: {
    error: 'notLogged',
    message: 'You need to be logged in to update event'
  },
  validate: new SimpleSchema({
    'projectEvent': {
      type: Object
    },
    'projectEvent._id': {
      type: String,
    },
    'projectEvent.name': {
      type: String,
    },
    'projectEvent.projectId': {
      type: String,
    },
    'projectEvent.startDate': {
      type: Date,
    },
    'projectEvent.endDate': {
      type: Date,
    },
    'projectEvent.createdAt': {
      type: Date,
      optional: true
    },
    'projectEvent.updatedAt': {
      type: Date,
      optional: true
    },
  }).validator(),
  run({ projectEvent }) {
    let {_id} = projectEvent;
    return ProjectEvents.update(_id, {$set: projectEvent});
  }
});

export const remove = new ValidatedMethod({
  name: 'projectEvents.remove',
  mixins : [LoggedInMixin],
  checkLoggedInError: {
    error: 'notLogged',
    message: 'You need to be logged in to remove event'
  },
  validate: new SimpleSchema({
    'projectEvent': {
      type: Object
    },
    'projectEvent._id': {
      type: String
    }
  }).validator(),
  run({ projectEvent }) {
    const {_id} = projectEvent;
    return ProjectEvents.remove(_id);
  }
});

const PROJECTEVENTS_METHODS = _.pluck([
  insert,
  update,
  remove,
], 'name');

if (Meteor.isServer) {
  DDPRateLimiter.addRule({
    name(name) {
      return _.contains(PROJECTEVENTS_METHODS, name);
    },

    // Rate limit per connection ID
    connectionId() { return true; }
  }, 20, 1000);
}