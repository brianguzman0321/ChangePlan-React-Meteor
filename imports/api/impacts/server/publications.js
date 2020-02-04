import {Meteor} from "meteor/meteor";
import {Impacts} from "../impacts";

Meteor.publish('impacts.findAll', function () {
  return Impacts.find({});
});