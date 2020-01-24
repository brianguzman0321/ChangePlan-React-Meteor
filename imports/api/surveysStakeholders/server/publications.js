import { Meteor } from 'meteor/meteor';
import { SurveysStakeholders } from '../surveysStakeholders';

Meteor.publish('surveysStakeholders', function () {
  return SurveysStakeholders.find({});
});
