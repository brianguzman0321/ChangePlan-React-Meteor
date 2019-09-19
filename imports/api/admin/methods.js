// methods related to companies

import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import SimpleSchema from 'simpl-schema';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';
import { LoggedInMixin } from 'meteor/tunifight:loggedin-mixin';
import {Accounts} from "meteor/accounts-base";


export const getAllusers = new ValidatedMethod({
    name: 'users.getAllusers',
    mixins : [LoggedInMixin],
    checkLoggedInError: {
        error: 'notLogged',
        message: 'You need to be logged in to create activity'
    },
    validate: null,
    run() {
        return Meteor.users.find({
            _id: {
                $ne: Meteor.userId()
            }
        }, {
            fields: { services: 0 }
        }).fetch()
    }
});

export const InviteNewUser = new ValidatedMethod({
    name: 'users.inviteNewUser',
    mixins : [LoggedInMixin],
    checkLoggedInError: {
        error: 'notLogged',
        message: 'You need to be logged in to create activity'
    },
    validate: null,
    run({profile, email}) {
            const newUserID = Accounts.createUser({profile, email});
            Accounts.sendEnrollmentEmail(newUserID);
            return newUserID;
        }
});