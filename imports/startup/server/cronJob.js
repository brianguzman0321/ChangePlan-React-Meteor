import moment from 'moment';
import {Activities} from "../../api/activities/activities";
import {Projects} from "../../api/projects/projects";
import {Peoples} from "../../api/peoples/peoples";
import {Companies} from "../../api/companies/companies";
import {Meteor} from "meteor/meteor";


SyncedCron.add({
  name: 'create job for activity owners',
  schedule: function (parser) {
    return parser.text('every 55 minutes')
  },
  job: function () {
    const activities = Activities.find({}).fetch().filter(activity => activity.completed === false && (activity.sentEmail === undefined || activity.sentEmail === false));
    activities.forEach(activity => {
      if (activity.updatedAt !== undefined) {
        SyncedCron.remove(`Sending email to activity owner with id ${activity.owner} ${activity._id}`)
      }
      SyncedCron.add({
        name: `Sending email to activity owner with id ${activity.owner} ${activity._id}`,
        schedule: function (parser) {
          const date = new Date(moment(activity.dueDate, 'YYYY-MM-DD HH-mm-ss Z'));
          date.setHours(date.getHours() + 1);
          return parser.recur().on(date).fullDate();
        },
        job: function () {
          const activityOwner = Meteor.users.findOne({'_id': activity.owner});
          const email = activityOwner.emails[0];
          const firstName = activityOwner.profile.firstName;
          const activityType = activity.type;
          const projectName = Projects.findOne({_id: activity.projectId}).name;
          const surveyLink = `https://changeplan.herokuapp.com/survey-activity-owner/${activity._id}/${activityOwner._id}`;
          Meteor.call('sendSurveyActivityOwner', email, firstName, activityType, projectName, surveyLink, (err, res) => {
          });
          activity.sentEmail = true;
          activity.sentEmailDate = new Date();
          Activities.update({_id: activity._id}, {$set: activity});
        }
      })
    })
  }
});


SyncedCron.add({
  name: 'create job for stakeholders',
  schedule: function (parser) {
    return parser.text('every 5 minutes')
  },
  job: function () {
    const activities = Activities.find({}).fetch().filter(activity => activity.completed && activity.stakeholdersFeedback && activity.timeSchedule);
    activities.forEach(activity => {
      if (activity.stakeHolders.length > 0) {
        activity.stakeHolders.forEach(stakeholder => {
          const stakeholderForEmail = Peoples.findOne({_id: stakeholder});
          if (activity.updatedAt !== undefined) {
            SyncedCron.remove(`Sending email to stakeholder with id ${stakeholderForEmail._id} ${activity._id}`)
          }
          SyncedCron.add({
            name: `Sending email to stakeholder with id ${stakeholderForEmail._id} ${activity._id}`,
            schedule: function (parser) {
              const date = new Date(moment(activity.timeSchedule, 'YYYY-MM-DD HH-mm-ss Z'));
              return parser.recur().on(date).fullDate();
            },
            job: function () {
              const email = stakeholderForEmail.email;
              const firstName = stakeholderForEmail.firstName;
              const activityType = activity.type;
              const phasesNames = Companies.findOne({_id: stakeholderForEmail.company});
              const step = Number(activity.step);
              const phaseName = phasesNames.activityColumns[step - 1];
              const projectName = Projects.findOne({_id: activity.projectId}).name;
              const surveyLink = `https://changeplan.herokuapp.com/survey-stakeholder/${activity._id}/${stakeholderForEmail._id}`;
              Meteor.call('sendSurveyStakeholder', email, firstName, activityType, phaseName, projectName, surveyLink, (err, res) => {
              });
            }
          })
        })
      }
    })
  }
});

SyncedCron.add({
  name: 'check sending email activity owner',
  schedule: function (parser) {
    return parser.text('every 57 minutes');
  },
  job: function () {
    const activities = Activities.find({}).fetch().filter(activity => !activity.completed && activity.sentEmail);
    const dateNow = new Date();
    activities.forEach(activity => {
      const dateSending = new Date(moment(activity.sentEmailDate, 'YYYY-MM-DD HH-mm-ss'));
      if (activity.updatedAt !== undefined) {
        SyncedCron.remove(`Sending remind email ${activity._id} ${activity.owner}`)
      }
      if (dateNow.getFullYear() === dateSending.getFullYear()
        && dateNow.getMonth() === dateSending.getMonth()
        && dateNow.getDate() === dateSending.getDate()
        && (dateNow.getHours() - dateSending.getHours() === 1 || 2)) {
        SyncedCron.add({
          name: `Sending remind email ${activity._id} ${activity.owner}`,
          schedule: function (parser) {
            const date = new Date(moment(activity.sentEmailDate, 'YYYY-MM-DD HH-mm-ss Z'));
            date.setHours(date.getHours() + 2);
            return parser.recur().on(date).fullDate();
          },
          job: function () {
            if (activity.completed === false) {
              const activityOwnerInfo = Meteor.users.findOne({'_id': activity.owner});
              const email = activityOwnerInfo.emails[0];
              const firstName = activityOwnerInfo.profile.firstName;
              const activityType = activity.type;
              const projectName = Projects.findOne({_id: activity.projectId}).name;
              const surveyLink = `https://changeplan.herokuapp.com/survey-activity-owner/${activity._id}/${activityOwnerInfo._id}`;
              Meteor.call('sendSurveyActivityOwner', email, firstName, activityType, projectName, surveyLink, (err, res) => {
              });
              const project = Projects.findOne({_id: activity.projectId});
              const changeManagers = project.changeManagers;
              changeManagers.forEach(_changeManager => {
                const activityOwner = `${activityOwnerInfo.profile.firstName} ${activityOwnerInfo.profile.lastName}`;
                const activityName = activity.name;
                const changeManager = Meteor.users.findOne({_id: _changeManager});
                const emailChangeManager = changeManager.emails[0];
                const firstNameChangeManager = changeManager.profile.firstName;
                Meteor.call('sendRemindToChangeManager', emailChangeManager, firstNameChangeManager, activityOwner, activityName, projectName, surveyLink, (err, res) => {
                });
              })
            }
          }
        })
      }
    })
  }
});

SyncedCron.add({
  name: 'check sending email activity owner 18',
  schedule: function (parser) {
    return parser.text('every 58 minutes');
  },
  job: function () {
    const activities = Activities.find({}).fetch().filter(activity => activity.completed === false && activity.sentEmail === true);
    const dateNow = new Date();
    activities.forEach(activity => {
      const dateSending = new Date(moment(activity.sentEmailDate, 'YYYY-MM-DD HH-mm-ss'));
      if (activity.updatedAt !== undefined) {
        SyncedCron.remove(`Sending remind email 18 ${activity._id} ${activity.owner}`)
      }
      if (dateNow.getFullYear() === dateSending.getFullYear()
        && dateNow.getMonth() === dateSending.getMonth()
        && dateNow.getDate() === dateSending.getDate()
        && (dateNow.getHours() - dateSending.getHours() === 17 || 18)) {
        SyncedCron.add({
          name: `Sending remind email 18 ${activity._id} ${activity.owner}`,
          schedule: function (parser) {
            const date = new Date(moment(activity.sentEmailDate, 'YYYY-MM-DD HH-mm-ss Z'));
            date.setHours(date.getHours() + 18);
            return parser.recur().on(date).fullDate();
          },
          job: function () {
            if (activity.completed === false) {
              const activityOwnerInfo = Meteor.users.findOne({'_id': activity.owner});
              const email = activityOwnerInfo.emails[0];
              const firstName = activityOwnerInfo.profile.firstName;
              const activityType = activity.type;
              const projectName = Projects.findOne({_id: activity.projectId}).name;
              const surveyLink = `https://changeplan.herokuapp.com/survey-activity-owner/${activity._id}/${activityOwnerInfo._id}`;
              Meteor.call('sendSurveyActivityOwner', email, firstName, activityType, projectName, surveyLink, (err, res) => {
              });
              const project = Projects.findOne({_id: activity.projectId});
              const changeManagers = project.changeManagers;
              changeManagers.forEach(_changeManager => {
                const activityOwner = `${activityOwnerInfo.profile.firstName} ${activityOwnerInfo.profile.lastName}`;
                const activityName = activity.name;
                const changeManager = Meteor.users.findOne({_id: _changeManager});
                const emailChangeManager = changeManager.emails[0];
                const firstNameChangeManager = changeManager.profile.firstName;
                Meteor.call('sendRemindToChangeManager', emailChangeManager, firstNameChangeManager, activityOwner, activityName, projectName, surveyLink, (err, res) => {
                });
              })
            }
          }
        })
      }
    })
  }
});

SyncedCron.add({
  name: 'check sending email activity owner 48',
  schedule: function (parser) {
    return parser.text('every 59 minutes');
  },
  job: function () {
    const activities = Activities.find({}).fetch().filter(activity => !activity.completed && activity.sentEmail);
    const dateNow = new Date();
    activities.forEach(activity => {
      const dateSending = new Date(moment(activity.sentEmailDate, 'YYYY-MM-DD HH-mm-ss'));
      if (activity.updatedAt !== undefined) {
        SyncedCron.remove(`Sending remind email 48 ${activity._id} ${activity.owner}`)
      }
      if (dateNow.getFullYear() === dateSending.getFullYear()
        && dateNow.getMonth() === dateSending.getMonth()
        && (1 < dateNow.getDate() - dateSending.getDate() < 2)) {
        SyncedCron.add({
          name: `Sending remind email 48 ${activity._id} ${activity.owner}`,
          schedule: function (parser) {
            const date = new Date(moment(activity.sentEmailDate, 'YYYY-MM-DD HH-mm-ss Z'));
            date.setDate(date.getDate() + 2);
            return parser.recur().on(date).fullDate();
          },
          job: function () {
            if (activity.completed === false) {
              const activityOwnerInfo = Meteor.users.findOne({'_id': activity.owner});
              const email = activityOwnerInfo.emails[0];
              const firstName = activityOwnerInfo.profile.firstName;
              const activityType = activity.type;
              const projectName = Projects.findOne({_id: activity.projectId}).name;
              const surveyLink = `https://changeplan.herokuapp.com/survey-activity-owner/${activity._id}/${activityOwnerInfo._id}`;
              Meteor.call('sendSurveyActivityOwner', email, firstName, activityType, projectName, surveyLink, (err, res) => {
              });
              const project = Projects.findOne({_id: activity.projectId});
              const changeManagers = project.changeManagers;
              changeManagers.forEach(_changeManager => {
                const activityOwner = `${activityOwnerInfo.profile.firstName} ${activityOwnerInfo.profile.lastName}`;
                const activityName = activity.name;
                const changeManager = Meteor.users.findOne({_id: _changeManager});
                const emailChangeManager = changeManager.emails[0];
                const firstNameChangeManager = changeManager.profile.firstName;
                Meteor.call('sendRemindToChangeManager', emailChangeManager, firstNameChangeManager, activityOwner, activityName, projectName, surveyLink, (err, res) => {
                });
              });
            }
          }
        })
      }
    })
  }
});



