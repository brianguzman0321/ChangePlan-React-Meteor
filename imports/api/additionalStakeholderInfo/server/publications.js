import {Meteor} from "meteor/meteor";
import {AdditionalStakeholderInfo} from "../additionalStakeholderInfo";

Meteor.publish('additionalStakeholderInfo.findAll', function () {
  return AdditionalStakeholderInfo.find({});
});

Meteor.publish('additionalStakeholderInfo.findByStakeholderId', function (stakeholderId) {
  return AdditionalStakeholderInfo.find({_id: stakeholderId});
});

Meteor.publish('additionalStakeholderInfo.findByProjectId', function (projectId) {
  return AdditionalStakeholderInfo.find({projectId: projectId});
});