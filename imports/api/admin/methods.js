// methods related to user Settings

import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { LoggedInMixin } from 'meteor/tunifight:loggedin-mixin';
import {Accounts} from "meteor/accounts-base";
import { Companies } from "/imports/api/companies/companies";
import { Projects } from "/imports/api/projects/projects";


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

export const updateProjectRole = new ValidatedMethod({
    name: 'users.updateProjectRole',
    mixins : [LoggedInMixin],
    checkLoggedInError: {
        error: 'notLogged',
        message: 'You need to be logged in to create activity'
    },
    validate: null,
    run({projectId, userId, role}) {
        Projects.update({
            _id: projectId
        }, {
            $pull:  {
                managers: userId,
                changeManagers: userId
            }

        });
        if(role === 'changeManager'){
            Projects.update({
                _id: projectId
            }, {
                $addToSet:  {
                    changeManagers: userId
                }

            })
        }
        else if(role === 'manager'){
            Projects.update({
                _id: projectId
            }, {
                $addToSet:  {
                    managers: userId
                }

            })
        }
    }
});

export const removeCompany = new ValidatedMethod({
    name: 'users.removeCompany',
    mixins : [LoggedInMixin],
    checkLoggedInError: {
        error: 'notLogged',
        message: 'You need to be logged in to create activity'
    },
    validate: null,
    run({companyId, userId}) {
        Companies.update({
            _id: companyId
        }, {
            $pull:  {
                admins: userId,
                peoples: userId
            }

        })
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
    run({profile, email, company}) {
            const newUserID = Accounts.createUser({profile, email});
            Accounts.sendEnrollmentEmail(newUserID);
            if(company){
                let update= {
                    $addToSet: {
                        peoples: newUserID
                    }
                };
                if(company.role){
                    update.$addToSet.admins = newUserID
                }
                Companies.update({
                    _id: company._id
                }, update)
            }
            return newUserID;
        }
});

export const InviteNewProjectUser = new ValidatedMethod({
    name: 'users.inviteNewProjectUser',
    mixins : [LoggedInMixin],
    checkLoggedInError: {
        error: 'notLogged',
        message: 'You need to be logged in to create activity'
    },
    validate: null,
    run({profile, email, company, project}) {
        const newUserID = Accounts.createUser({profile, email});
        Accounts.sendEnrollmentEmail(newUserID);
        if(company){
            let update= {
                $addToSet: {
                    peoples: newUserID
                }
            };
            if(company.role){
                update.$addToSet.admins = newUserID
            }
            Companies.update({
                _id: company._id
            }, update)
        }
        if(project){
            let update= {
                $addToSet: {
                    peoples: newUserID
                }
            };
            if(project.role === 'changeManager'){
                update.$addToSet.changeManagers = newUserID
            }
            else if(project.role === 'manager'){
                update.$addToSet.managers = newUserID
            }
            Projects.update({
                _id: project._id
            }, update)
        }
        return newUserID;
    }
});