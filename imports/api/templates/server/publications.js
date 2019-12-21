import { Meteor } from 'meteor/meteor';
import { Templates } from '../templates';
import {Projects} from "../../projects/projects";


Meteor.publish('templates', function (company) {
  if (Roles.userIsInRole(this.userId, 'superAdmin')) {
    return Templates.find({})
  }
  if (Roles.userIsInRole(this.userId, 'Admin')
    && company
    && company.admins.includes(this.userId)) {
    return Templates.find({
      companyId: company._id
    })
  }
  return Templates.find({}).fetch();
});


