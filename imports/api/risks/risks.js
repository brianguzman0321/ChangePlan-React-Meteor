// definition of the Activities collection

import {Mongo} from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

class RisksCollection extends Mongo.Collection {
}

export const Risks = new RisksCollection('risks');

// Deny all client-side updates since we will be using methods to manage this collection
Risks.deny({
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

Risks.schema = new SimpleSchema({
  projectId: {
    type: String,
    label: 'project ID',
    optional: true,
  },
  description: {
    type: String,
    label: 'Risk description',
  },
  raisedDate: {
    type: Date,
    label: 'Risk raised date',
  },
  category: {
    type: String,
    label: 'Risk category'
  },
  probability: {
    type: String,
    label: 'Risk probability',
  },
  impact: {
    type: String,
    label: 'risk impact',
  },
  rating: {
    type: String,
    label: 'Risk rating',
  },
  owner: {
    type: String,
    label: 'Risk owner',
    optional: true,
  },
  activities: {
    type: Array,
    defaultValue: [],
    label: 'risk activity',
    optional: true,
  },
  'activities.$': {
    type: String,
  },
  comments: {
    type: String,
    label: 'Risk comments',
    optional: true,
  },
  residualProbability: {
    type: String,
    label: 'Risk residual probability',
  },
  residualImpact: {
    type: String,
    label: 'Risk residual impacts'
  },
  residualRating: {
    type: String,
    label: 'Risk residual rating'
  },
  status: {
    type: String,
    label: 'Risk status'
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

Risks.attachSchema(Risks.schema);

// This represents the keys from Lists objects that should be published
// to the client. If we add secret properties to List objects, don't list
// them here to keep them private to the server.
Risks.publicFields = {
  name: 1
};