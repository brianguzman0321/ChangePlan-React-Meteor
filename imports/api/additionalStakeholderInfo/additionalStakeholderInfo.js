
import {Mongo} from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

class AdditionalStakeholderInfoCollection extends Mongo.Collection {
}

export const AdditionalStakeholderInfo = new AdditionalStakeholderInfoCollection('additionalStakeholderInfo');

// Deny all client-side updates since we will be using methods to manage this collection
AdditionalStakeholderInfo.deny({
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

AdditionalStakeholderInfo.schema = new SimpleSchema({
  projectId: {
    type: String,
    label: 'Project Id',
  },
  stakeholderId: {
    type: String,
    label: 'Stakeholder Id',
  },
  levelOfSupport: {
    type: Number,
    label: 'stakeholder support Level',
  },
  levelOfInfluence: {
    type: Number,
    label: 'stakeholder Influence Level',
  },
  notes: {
    type: String,
    label: 'stakeholder notes',
    defaultValue: null,
    optional: true,
  },
  createdAt: {
    type: Date,
    label: 'Created At Additional Stakeholder Info',
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
    label: 'Updated At Additional Stakeholder Info',
    autoValue: function () {
      if (this.isUpdate) {
        return new Date();
      }
    },
    optional: true
  }
});
AdditionalStakeholderInfo.attachSchema(AdditionalStakeholderInfo.schema);

AdditionalStakeholderInfo.publicFields = {
  name: 1
};