import { Accounts } from "meteor/accounts-base";
import enrollmentEmail from "/imports/emails/enrollmentEmail.js";

Accounts.onCreateUser(function(options, user) {
    // set user custom fields
    user.profile = options.profile || {};
    user.organization = options.organization || {};
    user.suspended = false;
    user.roles = {};
    return user;
});

const supportEmail = "support@changeplan.co";

Accounts.emailTemplates.siteName = "ChangePlan";
Accounts.emailTemplates.from = "ChangePlan <no-reply@changeplan.co>";

Accounts.emailTemplates.verifyEmail = {
    subject() {
        return "ChangePlan: Verify Your Email Address";
    },
    text(user, url) {
        let emailAddress = user.emails[0].address;

        return `To verify your email address (${emailAddress}) visit the following link:\n\n${url}\n\n If you did not request this verification, please ignore this email. If you feel something is wrong, please contact our support team: ${supportEmail}.`;
    }
};

Accounts.emailTemplates.enrollAccount = {
    subject() {
        return "Welcome to ChangePlan!";
    },
    text(user, url) {
        return `You have been invited to ChangePlan. To activate the account simply click the link below:\n\n${url}\n\n If you have any questions please contact our support team: ${supportEmail}.`;
    }
    // html( user, url ) {
    //   // let emailAddress   = user.emails[0].address,
    //   //     profile = Meteor.user().profile
    //   //     username = `${profile.firstname} ${profile.lastname}`
    //   let emailBody = enrollmentEmail({url})
    //   return emailBody;
    // }
};

Accounts.emailTemplates.resetPassword = {
    subject() {
        return "ChangePlan: Reset Password";
    },
    text(user, url) {
        return `We have reset this password. Please follow this link: \n\n${url}\n\n If you feel something is wrong, please contact our support team: ${supportEmail}.`;
    }
};

Accounts.urls.resetPassword = function(token) {
    return Meteor.absoluteUrl('reset-password/' + token);
};

Accounts.urls.enrollAccount = function(token) {
    return Meteor.absoluteUrl('enroll-account/' + token);
};
