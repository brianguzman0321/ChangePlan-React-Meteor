import {Mongo} from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

class SurveysStakeholdersCollection extends Mongo.Collection{

}

export const SurveysStakeholders = new SurveysStakeholdersCollection('surveysStakeholders');

SurveysStakeholders.deny({
  insert() {
    return true;
  },
  update() {
    return true;
  },
  remove() {
    return true
  },
});

SurveysStakeholders.schema = new SimpleSchema({
  activityId: {
    type: String,
    label: 'Activity Id',
  },
  stakeholderId: {
    type: String,
    label: 'Stakeholder Id',
  },
  question1: {
    type: Number,
    label: 'Was the activity complete?',
  },
  question2: {
    type: String,
    optional: true,
    label: 'Is there anything you want the change team to know? Do you have a concern that you think needs to be brought to senior management\'s attention?',
  },
  createdAt: {
    type: Date,
    label: 'Created At Survey',
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
});

SurveysStakeholders.attachSchema(SurveysStakeholders.schema);

