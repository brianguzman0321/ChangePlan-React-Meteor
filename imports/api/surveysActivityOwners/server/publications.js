import { Meteor } from 'meteor/meteor';
import { SurveysActivityOwners } from '../surveysActivityOwners';


Meteor.publish('surveysActivityOwners', function () {
  return SurveysActivityOwners.find({});
});
