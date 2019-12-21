import { Meteor } from "meteor/meteor";
import { _ } from 'meteor/underscore';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import SimpleSchema from 'simpl-schema';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';
import { LoggedInMixin } from 'meteor/tunifight:loggedin-mixin';

import { Templates } from './templates.js';

export const insert = new ValidatedMethod({
  name: 'templates.insert',
  mixins: [LoggedInMixin],
  checkLoggedInError: {
    error: 'notLogged',
    message: 'You need to be logged in to create templates'
  },
  validate: new SimpleSchema({
    'template': {
      type: Object
    },
    'template.owner': {
      type: String,
      optional: true,
    },
    'template.name': {
      type: String,
    },
    'template.companyId': {
      type: String,
      optional: true
    },
    'activities': {
      type: Array,
      optional: true,
    },
    'activities.$': {
      type: String,
      optional: true,
    },
    'template.stakeHolders': {
      type: Array,
      defaultValue: [],
      label: 'project StakeHolders',
      optional: true,
    },
    'template.stakeHolders.$': {
      type: String,
      optional: true,
    },
    'template.vision': {
      type: Array,
      optional: true,
    },
    'template.vision.$': {
      type: String,
      optional: true,
    },
    'template.objectives': {
      type: Array,
      optional: true,
    },
    'template.objectives.$': {
      type: String,
      optional: true,
    },
    'template.impacts': {
      type: Array,
      optional: true,
    },
    'template.impacts.$': {
      type: Object,
      blackbox: true,
      optional: true,
    },
    'template.benefits': {
      type: Array,
      optional: true
    },
    'template.benefits.$': {
      type: Object,
      blackbox: true,
      optional: true
    },
    'template.risks': {
      type: Array,
      optional: true,
    },
    'template.risks.$': {
      type: Object,
      blackbox: true,
      optional: true,
    },
  }).validator(),
  run({ template }) {
    if(!template.owner) {
      template.owner = this.userId;
    }
    return Templates.insert(template);
  }
});

export const update = new ValidatedMethod({
  name: 'templates.update',
  mixins: [LoggedInMixin],
  checkLoggedInError: {
    error: 'notLogged',
    message: 'You need to be logged in to create templates'
  },
  validate: new SimpleSchema({
    'template': {
      type: Object
    },
    'template._id': {
      type: String,
    },
    'template.owner': {
      type: String,
      optional: true,
    },
    'template.name': {
      type: String,
    },
    'template.companyId': {
      type: String,
      optional: true
    },
    'template.activities': {
      type: Array,
      optional: true,
    },
    'template.activities.$': {
      type: String,
      optional: true,
    },
    'template.stakeHolders': {
      type: Array,
      defaultValue: [],
      label: 'template StakeHolders',
      optional: true,
    },
    'template.stakeHolders.$': {
      type: String,
      optional: true,
    },
    'template.vision': {
      type: Array,
      optional: true,
    },
    'template.vision.$': {
      type: String,
      optional: true,
    },
    'template.objectives': {
      type: Array,
      optional: true,
    },
    'template.objectives.$': {
      type: String,
      optional: true,
    },
    'template.impacts': {
      type: Array,
      optional: true,
    },
    'template.impacts.$': {
      type: Object,
      blackbox: true,
      optional: true,
    },
    'template.benefits': {
      type: Array,
      optional: true
    },
    'template.benefits.$': {
      type: Object,
      blackbox: true,
      optional: true
    },
    'template.risks': {
      type: Array,
      optional: true,
    },
    'template.risks.$': {
      type: Object,
      blackbox: true,
      optional: true,
    },
  }).validator(),
  run({ template }) {
    const {_id} = template;
    return Templates.update(_id, {$set: template});
  }
});

export const remove = new ValidatedMethod({
  name: 'templates.remove',
  mixins: [LoggedInMixin],
  checkLoggedInError: {
    error: 'notLogged',
    message: 'You need to be logged in to remove template'
  },
  validate: new SimpleSchema({
    'template': {
      type: Object
    },
    'template._id': {
      type: String
    }
  }).validator(),
  run({template}) {
    const {_id} = template;
    return Templates.remove(_id);
  }
});

const TEMPLATES_METHODS = _.pluck([
  insert,
  update,
  remove,
], 'name');

if (Meteor.isServer) {
  DDPRateLimiter.addRule({
    name(name) {
      return _.contains(TEMPLATES_METHODS, name);
    },
    // Rate limit per connection ID
    connectionId() {
      return true;
    }
  }, 5, 1000);
}