import {Email} from 'meteor/email'
import projectNotification from "../../emails/projectNotification";
import surveyActivityOwner from "../../emails/surveyActivityOwner";
import surveyStakeholders from "../../emails/surveyStakeholders";
import remindEmailToChangeManager from "../../emails/remindEmailToChangeManager";

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
      from: 'ChangePlan <no-reply@changeplan.co>',
      subject: `You’ve been assigned as a change manager for the project ${projectName}.`,
      html: projectNotification({
        name,
        projectName,
        projectHelpLink
      })
    })
  }
});

Meteor.methods({
  sendSurveyActivityOwner: function (email, firstName, activityType, projectName, surveyLink) {
    Email.send({
      to: email,
      from: 'ChangePlan <no-reply@changeplan.co>',
      subject: "Action required: Mark activity as complete",
      html: surveyActivityOwner({
        firstName, activityType, projectName, surveyLink
      })
    })
  }
});

Meteor.methods({
  sendSurveyStakeholder: function (email, firstName, activityType, phaseName, projectName, surveyLink) {
    Email.send({
      to: email,
      from: 'ChangePlan <no-reply@changeplan.co>',
      subject: `Quick feedback about project "${projectName}"`,
      html: surveyStakeholders({
        firstName, activityType, phaseName, projectName, surveyLink
      })
    })
  }
});

Meteor.methods({
  sendReportToChangeManager: function (email, activityOwner, activityName, projectName) {
    Email.send({
      to: email,
      from: 'ChangePlan <no-reply@changeplan.co>',
      subject: `Report "${projectName}"`,
      text: `${activityOwner} has reported the activity ${activityName} wasn't completed`
    })
  }
});

Meteor.methods({
  sendRemindToChangeManager: function (email, firstName, activityOwner, activityName, projectName, surveyLink) {
    Email.send({
      to: email,
      from: 'ChangePlan <no-reply@changeplan.co>',
      subject: `Report "${projectName}"`,
      html: remindEmailToChangeManager({
        firstName, activityOwner, activityName, projectName, surveyLink
      })
    })
  }
});