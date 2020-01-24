import {Meteor} from "meteor/meteor";

Meteor.publish('users.notLoggedIn', function () {
  return Meteor.users.find({});
})