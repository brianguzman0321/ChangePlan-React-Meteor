import { Meteor } from 'meteor/meteor';
import { SurveysActivityDeliverers } from '../surveysActivityDeliverers';


Meteor.publish('surveysActivityDeliverers', function () {
  return SurveysActivityDeliverers.find({});
});
