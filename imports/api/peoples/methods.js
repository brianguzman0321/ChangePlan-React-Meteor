// methods related to companies

import {Meteor} from 'meteor/meteor';
import {_} from 'meteor/underscore';
import {ValidatedMethod} from 'meteor/mdg:validated-method';
import SimpleSchema from 'simpl-schema';
import {DDPRateLimiter} from 'meteor/ddp-rate-limiter';
import {LoggedInMixin} from 'meteor/tunifight:loggedin-mixin';

import {Peoples} from './peoples.js';
import {Projects} from '/imports/api/projects/projects';
import {Templates} from "../templates/templates";

export const insert = new ValidatedMethod({
  name: 'peoples.insert',
  mixins: [LoggedInMixin],
  checkLoggedInError: {
    error: 'notLogged',
    message: 'You need to be logged in to create people'
  },
  validate: new SimpleSchema({
    'people': {
      type: Object
    },
    'people.firstName': {
      type: String,
      optional: true,
    },
    'people.lastName': {
      type: String,
      optional: true,
    },
    'people.groupName': {
      type: String,
      optional: true,
    },
    'people.email': {
      type: String,
      optional: true,
    },
    'people.numberOfPeople': {
      type: Number,
      optional: true,
    },
    'people.jobTitle': {
      type: String,
      optional: true,
    },
    'people.team': {
      type: String,
      optional: true,
    },
    'people.company': {
      type: String,
      optional: true,
    },
    'people.businessUnit': {
      type: String,
      optional: true,
    },
    'people.location': {
      type: String,
      optional: true,
    },
    'people.notes': {
      type: String,
      optional: true
    },
    'people.roleTags': {
      type: Array,
      optional: true,
    },
    'people.roleTags.$': {
      type: String,
      optional: true,
    },
    'people.projectId': {
      type: String,
      optional: true,
    },
    'people.templateId': {
      type: String,
      optional: true,
    },
    'people.supportLevel': {
      type: Number,
      optional: true
    },
    'people.influenceLevel': {
      type: Number,
      optional: true
    },
  }).validator(),
  run({people}) {
    let {projectId, templateId} = people;
    let collection = Projects;
    let id = projectId;
    if (templateId) {
      delete people.templateId;
      collection = Templates;
      id = templateId;
    } else {
      delete people.projectId;
    }

    let alreadyExist = Peoples.findOne({
      email: people.email
    });
    if (!alreadyExist || !people.email) {
      //throw new Meteor.Error(500, "A Stakeholder with given Email Already Exists");
      let personId = Peoples.insert(people);
      collection.update({
        _id: id
      }, {
        $addToSet: {
          stakeHolders: personId
        }
      });
      return personId;
    }
  }
});

export const insertMany = new ValidatedMethod({
  name: 'peoples.insertMany',
  mixins: [LoggedInMixin],
  checkLoggedInError: {
    error: 'notLogged',
    message: 'You need to be logged in to create people'
  },
  validate: null,
  run({peoples}) {
    if (!peoples || !Array.isArray(peoples)) {
      throw new Meteor.Error(500, "Stakeholders required");
    }
    const peopleIds = [];
    _.each(peoples, function (doc) {
      let params = {
        people: doc
      }

      Meteor.call('peoples.insert', params, (err, res) => {
        if (res) {
          peopleIds.push({id: res, email: params.people.email});
        }
      })
    });
    return peopleIds;
  }
});


export const update = new ValidatedMethod({
  name: 'peoples.update',
  mixins: [LoggedInMixin],
  checkLoggedInError: {
    error: 'notLogged',
    message: 'You need to be logged in to update people'
  },
  validate: new SimpleSchema({
    'people': {
      type: Object
    },
    'people._id': {
      type: String,
    },
    'people.firstName': {
      type: String,
      optional: true,
    },
    'people.lastName': {
      type: String,
      optional: true,
    },
    'people.groupName': {
      type: String,
      optional: true,
    },
    'people.email': {
      type: String,
      optional: true,
    },
    'people.numberOfPeople': {
      type: Number,
      optional: true,
    },
    'people.jobTitle': {
      type: String,
      optional: true,
    },
    'people.team': {
      type: String,
      optional: true,
    },
    'people.company': {
      type: String,
      optional: true
    },
    'people.businessUnit': {
      type: String,
    },
    'people.roleTags': {
      type: Array,
      optional: true,
    },
    'people.roleTags.$': {
      type: String,
      optional: true,
    },
    'people.location': {
      type: String,
      optional: true,
    },
    'people.notes': {
      type: String,
      optional: true
    },
    'people.supportLevel': {
      type: Number,
      optional: true
    },
    'people.influenceLevel': {
      type: Number,
      optional: true
    },
  }).validator(),
  run({people}) {
    let {_id} = people;
    delete people._id;
    Peoples.update(_id, {$set: people});
    return _id;
  }
});


export const remove = new ValidatedMethod({
  name: 'peoples.remove',
  mixins: [LoggedInMixin],
  checkLoggedInError: {
    error: 'notLogged',
    message: 'You need to be logged in to remove people'
  },
  validate: new SimpleSchema({
    'people': {
      type: Object
    },
    'people._id': {
      type: String,
      optional: true
    },
    'people.projectId': {
      type: String,
      optional: true,
    },
    'people.templateId': {
      type: String,
      optional: true,
    },
    'people._ids': {
      type: Array,
      optional: true
    },
    'people._ids.$': {
      type: String,
    }
  }).validator(),
  run({people}) {
    const {_id, _ids, projectId} = people;
    let update = {
      $pull: {}
    }
    _ids && (update.$pull.stakeHolders = {$in: _ids});
    _id && (update.$pull.stakeHolders = _id);
    _ids ? Peoples.remove({
      _id: {
        $in: _ids
      }
    }) : Peoples.remove(_id);
    return Projects.update({
      _id: projectId
    }, update)
  }
});

// Get list of all method names on Companies
const PEOPLES_METHODS = _.pluck([
  insert,
  update,
  remove,
  insertMany
], 'name');

if (Meteor.isServer) {
  DDPRateLimiter.addRule({
    name(name) {
      return _.contains(PEOPLES_METHODS, name);
    },

    // Rate limit per connection ID
    connectionId() {
      return true;
    }
  }, 20, 1000);
}