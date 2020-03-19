import {Meteor} from "meteor/meteor";
import {Risks} from "../risks";

Meteor.publish('risks.findAll', function () {
  return Risks.find({});
});