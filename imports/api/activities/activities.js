// definition of the Activities collection

import {Mongo} from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

class ActivitiesCollection extends Mongo.Collection {
}

export const Activities = new ActivitiesCollection('activities');

// Deny all client-side updates since we will be using methods to manage this collection
Activities.deny({
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

Activities.schema = new SimpleSchema({
  owner: {
    type: String,
    label: 'Owner',
    optional: true,
  },
  type: {
    type: String,
    label: 'activity Type'
  },
  step: {
    type: Number,
    label: 'activity Step'
  },
  time: {
    type: Number,
    label: 'activity time away BAU',
    optional: true,
  },
  name: {
    type: String,
    label: 'activity Name'
  },
  description: {
    type: String,
    label: 'activity Description',
    optional: true,
  },
  projectId: {
    type: String,
    label: 'project ID',
    optional: true,
  },
  templateId: {
    type: String,
    label: 'template ID',
    optional: true,
  },
  stakeHolders: {
    type: Array,
    defaultValue: [],
    label: 'activity StakeHolders',
  },
  'stakeHolders.$': {
    type: String
  },
  // responsiblePerson: {
  //     type: Object,
  //     defaultValue: Object,
  //     label: 'activity responsible Person',
  // },
  completedAt: {
    type: Date,
    label: 'activity completion Date',
    optional: true
  },
  dueDate: {
    type: Date,
    label: 'activity Due Date',
    optional: true
  },
  completed: {
    type: Boolean,
    label: 'completed or not',
    defaultValue: false
  },
  timeSchedule: {
    type: Date,
    label: 'Time for send ',
    optional: true,
  },
  stakeholdersFeedback: {
    type: Boolean,
    label: 'Stakeholder feedback',
  },
  sentEmail: {
    type: Boolean,
    label: 'Sent email for survey Activity Owner',
    optional: true,
  },
  sentEmailDate: {
    type: Date,
    label: 'Sent email date',
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

Activities.attachSchema(Activities.schema);

// This represents the keys from Lists objects that should be published
// to the client. If we add secret properties to List objects, don't list
// them here to keep them private to the server.
Activities.publicFields = {
  name: 1
};