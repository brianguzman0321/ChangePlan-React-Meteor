// definition of the Activities collection

import {Mongo} from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

class ProjectEventsCollection extends Mongo.Collection {
}

export const ProjectEvents = new ProjectEventsCollection('projectEvents');

// Deny all client-side updates since we will be using methods to manage this collection
ProjectEvents.deny({
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

ProjectEvents.schema = new SimpleSchema({
  projectId: {
    type: String,
    label: 'Project ID',
  },
  name: {
    type: String,
    label: 'Event name',
  },
  startDate: {
    type: Date,
    label: 'Event start date',
  },
  endDate: {
    type: Date,
    label: 'Event end date'
  },
  createdAt: {
    type: Date,
    label: 'Created At Event',
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
    label: 'Updated At Event',
    autoValue: function () {
      if (this.isUpdate) {
        return new Date();
      }
    },
    optional: true
  }
});

ProjectEvents.attachSchema(ProjectEvents.schema);

// This represents the keys from Lists objects that should be published
// to the client. If we add secret properties to List objects, don't list
// them here to keep them private to the server.
ProjectEvents.publicFields = {
  name: 1
};