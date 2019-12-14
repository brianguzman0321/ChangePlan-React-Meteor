import { Email } from 'meteor/email'
import activityNotification from "../../emails/activityNotification";

Meteor.methods({

  sendEmail: function (email, fromEmail, username,
                       projectName,
                       activityType,
                       activityDueDate,
                       time,
                       activityName,
                       description,
                       stakeholders,
                       activityHelpLink) {
      Email.send({
        to: email,
        from: 'no-reply.changeplan.co',
        subject: 'test message',
        html: activityNotification( { email, fromEmail, username,
          projectName,
          activityType,
          activityDueDate,
          time,
          activityName,
          description,
          stakeholders,
          activityHelpLink } )
      })
    }
});