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

Accounts.emailTemplates.siteName = "Change Plan";
Accounts.emailTemplates.from = "Change Plan <no-reply@changeplan.co>";

Accounts.emailTemplates.verifyEmail = {
    subject() {
        return "Change Plan: Verify Your Email Address";
    },
    text(user, url) {
        let emailAddress = user.emails[0].address,
            emailBody = `To verify your email address (${emailAddress}) visit the following link:\n\n${url}\n\n If you did not request this verification, please ignore this email. If you feel something is wrong, please contact our support team: ${supportEmail}.`;

        return emailBody;
    }
};

Accounts.emailTemplates.enrollAccount = {
    subject() {
        return "Welcome to Change Plan!";
    },
    text(user, url) {
        let emailBody = `You have been invited to Change Plan. To activate the account simply click the link below:\n\n${url}\n\n If you have any questions please contact our support team: ${supportEmail}.`;
        return emailBody;
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
        return "Change Plan: Reset Password";
    },
    text(user, url) {
        emailBody = `We have reset this password. Please follow this link: \n\n${url}\n\n If you feel something is wrong, please contact our support team: ${supportEmail}.`;

        return emailBody;
    }
};

Accounts.urls.resetPassword = function(token) {
    return Meteor.absoluteUrl('reset-password/' + token);
};

Accounts.urls.enrollAccount = function(token) {
    return Meteor.absoluteUrl('enroll-account/' + token);
};
