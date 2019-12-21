import { Meteor } from 'meteor/meteor';
import { Templates } from '../templates';
import {Projects} from "../../projects/projects";


Meteor.publish('templates', function (company) {
  return Templates.find({});
});


