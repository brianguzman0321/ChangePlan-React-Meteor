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

export const removeProject = new ValidatedMethod({
    name: 'users.removeProject',
    mixins : [LoggedInMixin],
    checkLoggedInError: {
        error: 'notLogged',
        message: 'You need to be logged in to create activity'
    },
    validate: null,
    run({projectId, userId}) {
        Projects.update({
            _id: projectId
        }, {
            $pull:  {
                managers: userId,
                changeManagers: userId,
                peoples: userId
            }

        });
    }
});

export const getUsers = new ValidatedMethod({
    name: 'users.getUsers',
    mixins : [LoggedInMixin],
    checkLoggedInError: {
        error: 'notLogged',
        message: 'You need to be logged in to create activity'
    },
    validate: null,
    run({company, project}) {
        if(project){
            return Meteor.users.find({
                _id: {
                    $ne: Meteor.userId(),
                    $in: company.peoples,
                    $nin: project.peoples
                }
            }, {
                fields: { services: 0 }
            }).fetch()
        }
        return Meteor.users.find({
            _id: {
                $ne: Meteor.userId(),
                $nin: company.peoples
            }
        }, {
            fields: { services: 0 }
        }).fetch()
    }
});

export const getPersons = new ValidatedMethod({
    name: 'users.getPersons',
    mixins : [LoggedInMixin],
    checkLoggedInError: {
        error: 'notLogged',
        message: 'You need to be logged in to create activity'
    },
    validate: null,
    run({company, project}) {
        return Meteor.users.find({
            _id: {
                $ne: Meteor.userId(),
                $in: company.peoples
            }
        }, {
            fields: { services: 0 }
        }).fetch()
    }
});

export const updateList = new ValidatedMethod({
    name: 'users.updateList',
    mixins : [LoggedInMixin],
    checkLoggedInError: {
        error: 'notLogged',
        message: 'You need to be logged in to create activity'
    },
    validate: null,
    run({userIds, company, project}) {
        if(project){
            Projects.update({
                _id: project._id
            }, {
                $addToSet: {
                    peoples: {
                        $each: userIds
                    }
                }
            })
        }
        if(company){
            return Companies.update({
                _id: company._id
            }, {
                $addToSet: {
                    peoples: {
                        $each: userIds
                    }
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