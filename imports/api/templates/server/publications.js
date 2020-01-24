import { Meteor } from 'meteor/meteor';
import { Templates } from '../templates';

Meteor.publish('templates', function () {
  return Templates.find({});
});


