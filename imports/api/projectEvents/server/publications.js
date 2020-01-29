import { Meteor } from 'meteor/meteor';
import { ProjectEvents } from '../projectEvents';

Meteor.publish('projectEvents.find',function () {
  return ProjectEvents.find({});
});