// methods related to user Settings

import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import SimpleSchema from 'simpl-schema';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';
import { LoggedInMixin } from 'meteor/tunifight:loggedin-mixin';
import {Accounts} from "meteor/accounts-base";
import { Companies } from "/imports/api/companies/companies";


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

export const updateRole = new ValidatedMethod({
    name: 'users.updateRole',
    mixins : [LoggedInMixin],
    checkLoggedInError: {
        error: 'notLogged',
        message: 'You need to be logged in to create activity'
    },
    validate: null,
    run({companyId, userId, role}) {
        if(role === 'noRole'){
            Companies.update({
                _id: companyId
            }, {
                $pull:  {
                    admins: userId
                }

            })
        }
        else if(role === 'admin'){
            Companies.update({
                _id: companyId
            }, {
                $addToSet:  {
                    admins: userId
                }

            })
        }
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