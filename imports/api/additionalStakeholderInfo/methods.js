// methods related to additionalStakeholderInfo

import {Meteor} from 'meteor/meteor';
import {_} from 'meteor/underscore';
import {ValidatedMethod} from 'meteor/mdg:validated-method';
import SimpleSchema from 'simpl-schema';
import {DDPRateLimiter} from 'meteor/ddp-rate-limiter';
import {LoggedInMixin} from 'meteor/tunifight:loggedin-mixin';

import {AdditionalStakeholderInfo} from "./additionalStakeholderInfo";

export const insert = new ValidatedMethod({
  name: 'additionalStakeholderInfo.insert',
  mixins: [LoggedInMixin],
  checkLoggedInError: {
    error: 'notLogged',
    message: 'You need to be logged in to create people'
  },
  validate: new SimpleSchema({
    'additionalStakeholderInfo': {
      type: Object
    },
    'additionalStakeholderInfo.projectId': {
      type: String,
    },
    'additionalStakeholderInfo.stakeholderId': {
      type: String,
    },
    'additionalStakeholderInfo.levelOfSupport': {
      type: Number,
    },
    'additionalStakeholderInfo.levelOfInfluence': {
      type: Number,
    },
    'additionalStakeholderInfo.notes': {
      type: String,
      optional: true,
    },
  }).validator(),
  run({additionalStakeholderInfo}) {
    return AdditionalStakeholderInfo.insert(additionalStakeholderInfo);
  }
});

export const update = new ValidatedMethod({
  name: 'additionalStakeholderInfo.update',
  mixins: [LoggedInMixin],
  checkLoggedInError: {
    error: 'notLogged',
    message: 'You need to be logged in to update people'
  },
  validate: new SimpleSchema({
    'additionalStakeholderInfo': {
      type: Object
    },
    'additionalStakeholderInfo._id': {
      type: String,
    },
    'additionalStakeholderInfo.projectId': {
      type: String,
    },
    'additionalStakeholderInfo.stakeholderId': {
      type: String,
    },
    'additionalStakeholderInfo.levelOfSupport': {
      type: Number,
    },
    'additionalStakeholderInfo.levelOfInfluence': {
      type: Number,
    },
    'additionalStakeholderInfo.notes': {
      type: String,
      optional: true,
    },
  }).validator(),
  run({additionalStakeholderInfo}) {
    let {_id} = additionalStakeholderInfo;
    delete additionalStakeholderInfo._id;
    return AdditionalStakeholderInfo.update(_id, {$set: additionalStakeholderInfo});
  }
});


export const remove = new ValidatedMethod({
  name: 'additionalStakeholderInfo.remove',
  mixins: [LoggedInMixin],
  checkLoggedInError: {
    error: 'notLogged',
    message: 'You need to be logged in to remove people'
  },
  validate: new SimpleSchema({
    'additionalStakeholderInfo': {
      type: Object
    },
    'additionalStakeholderInfo._id': {
      type: String,
      optional: true
    },
  }).validator(),
  run({additionalStakeholderInfo}) {
    const {_id} = additionalStakeholderInfo;
    return AdditionalStakeholderInfo.remove(_id);
  }
});

const ADDITIONALSTAKEHOLDERINFO_METHODS = _.pluck([
  insert,
  update,
  remove,
], 'name');

if (Meteor.isServer) {
  DDPRateLimiter.addRule({
    name(name) {
      return _.contains(ADDITIONALSTAKEHOLDERINFO_METHODS, name);
    },

    connectionId() {
      return true;
    }
  }, 100, 1000);
}