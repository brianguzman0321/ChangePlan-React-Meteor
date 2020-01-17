import {Email} from 'meteor/email'
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
      from: 'ChangePlan <no-reply@changeplan.co>',
      subject: `You've been assigned an activity for project ${projectName}.`,
      text: `Hi ${name},

You've been assigned a change management activity for the project ${projectName}.
Activity type: ${activityType}
Due date: ${activityDueDate}
Duration (time away from BAU): ${time}
Activity: ${activityName}
Description: ${description}
Stakeholders targeted: ${stakeholders}

"View activity details in ChangePlan" ${activityHelpLink}
This activity supports the project ${projectName}.

Project vision:
${vision !== [] ? vision.map(item => `${item}`).join(',\n') : null}

Project objectives:
${objectives !== [] ? objectives.map(item => `${item}`).join(', \n') : null}

For more information please contact the project’s change manager/s${currentChangeManagers ? currentChangeManagers.map(item => ` ${item.profile.firstName} ${item.profile.lastName} (${item.emails[0].address}) `) : '.'}

ChangePlan is the single-source-of-truth for enterprise change management.
www.changeplan.co`,
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
      html: projectNotification({
        name,
        projectName,
        projectHelpLink
      })
    })
  }
});