import { Email } from 'meteor/email'
import activityNotification from "../../emails/activityNotification";

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
        subject: `You've been assigned an activity for project ${projectName}`,
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