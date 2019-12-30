import { Email } from 'meteor/email'
import activityNotification from "../../emails/activityNotification";
import projectNotification from "../../emails/projectNotification";

Meteor.methods({
  sendEmail: function (email, name,
                       projectName,
                       activityType,
                       activityDueDate,
                       time,
                       activityName,
                       description,
                       stakeholders,
                       activityHelpLink,
                       vision, objectives,
                       currentChangeManagers) {
      Email.send({
        to: email,
        from: 'Change Plan <no-reply@changeplan.co>',
        subject: `You've been assigned an activity for project ${projectName}.`,
        html: activityNotification( { name,
          projectName,
          activityType,
          activityDueDate,
          time,
          activityName,
          description,
          stakeholders,
          activityHelpLink,
          vision, objectives,
          currentChangeManagers } )
      })
    }
});

Meteor.methods({
  sendProjectEmail: function (email, name,
                       projectName,
                       projectHelpLink) {
    Email.send({
      to: email,
      from: 'Change Plan <no-reply@changeplan.co>',
      subject: `You’ve been assigned as a change manager for the project ${projectName}.`,
      html: projectNotification( { name,
        projectName,
        projectHelpLink } )
    })
  }
});