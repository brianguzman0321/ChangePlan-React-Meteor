// definition of the Activities collection

import {Mongo} from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

class ImpactsCollection extends Mongo.Collection {
}

export const Impacts = new ImpactsCollection('impacts');

// Deny all client-side updates since we will be using methods to manage this collection
Impacts.deny({
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

Impacts.schema = new SimpleSchema({
  type: {
    type: String,
    label: 'impact Type'
  },
  level: {
    type: String,
    label: 'impact level'
  },
  change: {
    type: String,
    label: 'Change Impact',
    optional: true,
  },
  impact: {
    type: String,
    label: 'impact',
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
  stakeholders: {
    type: Array,
    defaultValue: [],
    label: 'impact Stakeholders',
    optional: true,
  },
  'stakeholders.$': {
    type: String
  },
  activities: {
    type: Array,
    defaultValue: [],
    label: 'impact activity',
    optional: true,
  },
  'activities.$': {
    type: String,
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

Impacts.attachSchema(Impacts.schema);

// This represents the keys from Lists objects that should be published
// to the client. If we add secret properties to List objects, don't list
// them here to keep them private to the server.
Impacts.publicFields = {
  name: 1
};