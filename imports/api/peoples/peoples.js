// definition of the Peoples collection

import {Mongo} from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

class PeoplesCollection extends Mongo.Collection {
}

export const Peoples = new PeoplesCollection('peoples');

// Deny all client-side updates since we will be using methods to manage this collection
Peoples.deny({
  insert() {
    return true;
  },
  update() {
    return true;
  },
  remove() {
    return true;
  }
});

Peoples.schema = new SimpleSchema({
  firstName: {
    type: String,
    label: 'stakeholder first name',
    optional: true
  },
  lastName: {
    type: String,
    label: 'Stakeholder last name',
    optional: true,
  },
  groupName: {
    type: String,
    label: 'Stakeholder group name',
    optional: true,
  },
  email: {
    type: String,
    index: false,
    optional: true,
    label: 'stakeholder email'
  },
  numberOfPeople: {
    type: Number,
    label: 'Number of people in stakeholder group',
    optional: true,
  },
  jobTitle: {
    type: String,
    label: 'stakeholder job',
    optional: true,
  },
  team: {
    type: String,
    label: 'Stakeholder team',
    optional: true,
  },
  supportLevel: {
    type: Number,
    label: 'stakeholder support Level',
    optional: true
  },
  influenceLevel: {
    type: Number,
    label: 'stakeholder Influence Level',
    optional: true
  },
  company: {
    type: String,
    label: 'stakeholder company',
    optional: true,
  },
  roleTags: {
    type: Array,
    defaultValue: [],
    optional: true,
  },
  'roleTags.$': {
    type: String,
  },
  businessUnit: {
    type: String,
    label: 'stakeholder Business Unit',
    optional: true,
  },
  location: {
    type: String,
    label: 'Stakeholder location',
    optional: true,
  },
  notes: {
    type: String,
    label: 'stakeholder notes',
    optional: true,
  },
  createdAt: {
    type: Date,
    label: 'Created At Company',
    autoValue: function () {
      if (this.isInsert) {
        return new Date();
      } else if (this.isUpsert) {
        return {$setOnInsert: new Date()};
      } else {
        this.unset();
      }
    }
  },
  updatedAt: {
    type: Date,
    label: 'Updated At Company',
    autoValue: function () {
      if (this.isUpdate) {
        return new Date();
      }
    },
    optional: true
  }
});

Peoples.attachSchema(Peoples.schema);

// This represents the keys from Lists objects that should be published
// to the client. If we add secret properties to List objects, don't list
// them here to keep them private to the server.
Peoples.publicFields = {
  name: 1
};