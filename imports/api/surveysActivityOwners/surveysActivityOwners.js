import {Mongo} from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

class SurveysActivityOwnersCollection extends Mongo.Collection{

}

export const SurveysActivityOwners = new SurveysActivityOwnersCollection('surveysActivityOwners');

SurveysActivityOwners.deny({
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

SurveysActivityOwners.schema = new SimpleSchema({
  activityId: {
    type: String,
    label: 'Activity Id',
  },
  activityOwnerId: {
    type: String,
    label: 'Activity Owner Id',
  },
  question1: {
    type: Number,
    label: 'Was the activity complete?',
  },
  question2: {
    type: Number,
    optional: true,
    label: 'Today\'s activity was successful?',
  },
  question3: {
    type: String,
    optional: true,
    label: 'Any issues that might need to be added to the project risk register or escalated to senior management?',
  },
  question4: {
    type: String,
    optional: true,
    label: 'Any comments about the stakeholders targeted?',
  },
  question5: {
    type: String,
    optional: true,
    label: 'Any other comments?',
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

SurveysActivityOwners.attachSchema(SurveysActivityOwners.schema);

