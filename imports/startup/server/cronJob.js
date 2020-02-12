import moment from 'moment';
import {Activities} from "../../api/activities/activities";
import {Projects} from "../../api/projects/projects";
import {Peoples} from "../../api/peoples/peoples";
import {Companies} from "../../api/companies/companies";
import {Meteor} from "meteor/meteor";
import {AdditionalStakeholderInfo} from "../../api/additionalStakeholderInfo/additionalStakeholderInfo";


SyncedCron.add({
  name: 'create job for activity deliverers',
  schedule: function (parser) {
    return parser.text('every 55 minutes')
  },
  job: function () {
    const activities = Activities.find({}).fetch().filter(activity => activity.completed === false && (activity.sentEmail === undefined || activity.sentEmail === false));
    activities.forEach(activity => {
      if (activity.updatedAt !== undefined) {
        SyncedCron.remove(`Sending email to activity deliverer with id ${activity.deliverer} ${activity._id}`)
      }
      SyncedCron.add({
        name: `Sending email to activity deliverer with id ${activity.deliverer} ${activity._id}`,
        schedule: function (parser) {
          const date = new Date(moment(activity.dueDate, 'YYYY-MM-DD HH-mm-ss Z'));
          date.setHours(date.getHours() + 1);
          return parser.recur().on(date).fullDate();
        },
        job: function () {
          const activityDeliverer = Meteor.users.findOne({'_id': activity.deliverer});
          const email = activityDeliverer.emails[0];
          const firstName = activityDeliverer.profile.firstName;
          const activityType = activity.type;
          const projectName = Projects.findOne({_id: activity.projectId}).name;
          const surveyLink = `https://changeplan.herokuapp.com/survey-activity-deliverer/${activity._id}/${activityDeliverer._id}`;
          Meteor.call('sendSurveyActivityDeliverer', email, firstName, activityType, projectName, surveyLink, (err, res) => {
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
    return parser.text('every 56 minutes')
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
  name: 'check sending email activity deliverer',
  schedule: function (parser) {
    return parser.text('every 57 minutes');
  },
  job: function () {
    const activities = Activities.find({}).fetch().filter(activity => !activity.completed && activity.sentEmail);
    const dateNow = new Date();
    activities.forEach(activity => {
      const dateSending = new Date(moment(activity.sentEmailDate, 'YYYY-MM-DD HH-mm-ss'));
      if (activity.updatedAt !== undefined) {
        SyncedCron.remove(`Sending remind email ${activity._id} ${activity.deliverer}`)
      }
      if (dateNow.getFullYear() === dateSending.getFullYear()
        && dateNow.getMonth() === dateSending.getMonth()
        && dateNow.getDate() === dateSending.getDate()
        && (dateNow.getHours() - dateSending.getHours() === 1 || 2)) {
        SyncedCron.add({
          name: `Sending remind email ${activity._id} ${activity.deliverer}`,
          schedule: function (parser) {
            const date = new Date(moment(activity.sentEmailDate, 'YYYY-MM-DD HH-mm-ss Z'));
            date.setHours(date.getHours() + 2);
            return parser.recur().on(date).fullDate();
          },
          job: function () {
            if (activity.completed === false) {
              const activityDelivererInfo = Meteor.users.findOne({'_id': activity.deliverer});
              const email = activityDelivererInfo.emails[0];
              const firstName = activityDelivererInfo.profile.firstName;
              const activityType = activity.type;
              const projectName = Projects.findOne({_id: activity.projectId}).name;
              const surveyLink = `https://changeplan.herokuapp.com/survey-activity-deliverer/${activity._id}/${activityDelivererInfo._id}`;
              Meteor.call('sendSurveyActivityDeliverer', email, firstName, activityType, projectName, surveyLink, (err, res) => {
              });
              const project = Projects.findOne({_id: activity.projectId});
              const changeManagers = project.changeManagers;
              changeManagers.forEach(_changeManager => {
                const activityDeliverer = `${activityDelivererInfo.profile.firstName} ${activityDelivererInfo.profile.lastName}`;
                const activityName = activity.name;
                const changeManager = Meteor.users.findOne({_id: _changeManager});
                const emailChangeManager = changeManager.emails[0];
                const firstNameChangeManager = changeManager.profile.firstName;
                Meteor.call('sendRemindToChangeManager', emailChangeManager, firstNameChangeManager, activityDeliverer, activityName, projectName, surveyLink, (err, res) => {
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
  name: 'check sending email activity deliverer 18',
  schedule: function (parser) {
    return parser.text('every 58 minutes');
  },
  job: function () {
    const activities = Activities.find({}).fetch().filter(activity => activity.completed === false && activity.sentEmail === true);
    const dateNow = new Date();
    activities.forEach(activity => {
      const dateSending = new Date(moment(activity.sentEmailDate, 'YYYY-MM-DD HH-mm-ss'));
      if (activity.updatedAt !== undefined) {
        SyncedCron.remove(`Sending remind email 18 ${activity._id} ${activity.deliverer}`)
      }
      if (dateNow.getFullYear() === dateSending.getFullYear()
        && dateNow.getMonth() === dateSending.getMonth()
        && dateNow.getDate() === dateSending.getDate()
        && (dateNow.getHours() - dateSending.getHours() === 17 || 18)) {
        SyncedCron.add({
          name: `Sending remind email 18 ${activity._id} ${activity.deliverer}`,
          schedule: function (parser) {
            const date = new Date(moment(activity.sentEmailDate, 'YYYY-MM-DD HH-mm-ss Z'));
            date.setHours(date.getHours() + 18);
            return parser.recur().on(date).fullDate();
          },
          job: function () {
            if (activity.completed === false) {
              const activityDelivererInfo = Meteor.users.findOne({'_id': activity.deliverer});
              const email = activityDelivererInfo.emails[0];
              const firstName = activityDelivererInfo.profile.firstName;
              const activityType = activity.type;
              const projectName = Projects.findOne({_id: activity.projectId}).name;
              const surveyLink = `https://changeplan.herokuapp.com/survey-activity-deliverer/${activity._id}/${activityDelivererInfo._id}`;
              Meteor.call('sendSurveyActivityDeliverer', email, firstName, activityType, projectName, surveyLink, (err, res) => {
              });
              const project = Projects.findOne({_id: activity.projectId});
              const changeManagers = project.changeManagers;
              changeManagers.forEach(_changeManager => {
                const activityDeliverer = `${activityDelivererInfo.profile.firstName} ${activityDelivererInfo.profile.lastName}`;
                const activityName = activity.name;
                const changeManager = Meteor.users.findOne({_id: _changeManager});
                const emailChangeManager = changeManager.emails[0];
                const firstNameChangeManager = changeManager.profile.firstName;
                Meteor.call('sendRemindToChangeManager', emailChangeManager, firstNameChangeManager, activityDeliverer, activityName, projectName, surveyLink, (err, res) => {
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
  name: 'check sending email activity deliverer 48',
  schedule: function (parser) {
    return parser.text('every 59 minutes');
  },
  job: function () {
    const activities = Activities.find({}).fetch().filter(activity => !activity.completed && activity.sentEmail);
    const dateNow = new Date();
    activities.forEach(activity => {
      const dateSending = new Date(moment(activity.sentEmailDate, 'YYYY-MM-DD HH-mm-ss'));
      if (activity.updatedAt !== undefined) {
        SyncedCron.remove(`Sending remind email 48 ${activity._id} ${activity.deliverer}`)
      }
      if (dateNow.getFullYear() === dateSending.getFullYear()
        && dateNow.getMonth() === dateSending.getMonth()
        && (1 < dateNow.getDate() - dateSending.getDate() < 2)) {
        SyncedCron.add({
          name: `Sending remind email 48 ${activity._id} ${activity.deliverer}`,
          schedule: function (parser) {
            const date = new Date(moment(activity.sentEmailDate, 'YYYY-MM-DD HH-mm-ss Z'));
            date.setDate(date.getDate() + 2);
            return parser.recur().on(date).fullDate();
          },
          job: function () {
            if (activity.completed === false) {
              const activityDelivererInfo = Meteor.users.findOne({'_id': activity.deliverer});
              const email = activityDelivererInfo.emails[0];
              const firstName = activityDelivererInfo.profile.firstName;
              const activityType = activity.type;
              const projectName = Projects.findOne({_id: activity.projectId}).name;
              const surveyLink = `https://changeplan.herokuapp.com/survey-activity-deliverer/${activity._id}/${activityDelivererInfo._id}`;
              Meteor.call('sendSurveyActivityDeliverer', email, firstName, activityType, projectName, surveyLink, (err, res) => {
              });
              const project = Projects.findOne({_id: activity.projectId});
              const changeManagers = project.changeManagers;
              changeManagers.forEach(_changeManager => {
                const activityDeliverer = `${activityDelivererInfo.profile.firstName} ${activityDelivererInfo.profile.lastName}`;
                const activityName = activity.name;
                const changeManager = Meteor.users.findOne({_id: _changeManager});
                const emailChangeManager = changeManager.emails[0];
                const firstNameChangeManager = changeManager.profile.firstName;
                Meteor.call('sendRemindToChangeManager', emailChangeManager, firstNameChangeManager, activityDeliverer, activityName, projectName, surveyLink, (err, res) => {
                });
              });
            }
          }
        })
      }
    })
  }
});

SyncedCron.add({
  name: 'Add levels info to table',
  schedule: function (parser) {
    return parser.text('every 10 minutes');
  },
  job: function () {
    const stakeholders = Peoples.find({});
    stakeholders.forEach(stakeholder => {
      const project = Projects.findOne({stakeHolders: {$in: [stakeholder._id]}});
      if (project) {
        const additionalStakeholderInfo = {
          projectId: project._id,
          stakeholderId: stakeholder._id,
          levelOfSupport: stakeholder.supportLevel || 0,
          levelOfInfluence: stakeholder.influenceLevel || 0,
          notes: stakeholder.notes,
        };
        AdditionalStakeholderInfo.insert(additionalStakeholderInfo);
      }
    })
  }
});

