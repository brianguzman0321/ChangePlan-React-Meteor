import {ValidatedMethod} from "meteor/mdg:validated-method";
import {LoggedInMixin} from "meteor/tunifight:loggedin-mixin";
import {Accounts} from "meteor/accounts-base";
import {Companies} from "../companies/companies";
import { Projects } from "../projects/projects";

export const AssignProjectRole = new ValidatedMethod({
    name: 'roles.assignRole',
    mixins : [LoggedInMixin],
    checkLoggedInError: {
        error: 'notLogged',
        message: 'You need to be logged in to create activity'
    },
    validate: null,
    run({name, email, role, project}) {
        let userId;
        let user = Meteor.users.findOne({
            'emails.address' : email
        });
        if(user && user._id){
            userId = user._Id
        }
        else{
            let profile = {
                firstName: name
            };
            userId = Accounts.createUser({profile, email});
            Accounts.sendEnrollmentEmail(userId);
        }
        //update Company
        let update= {
            $addToSet: {
                peoples: userId
            }
        };
        Companies.update({
            _id: project.companyId
        }, update);

        if(project){
            let update= {
                $addToSet: {
                    peoples: userId
                }
            };
            if(role === 'changeManager') {
                update.$addToSet.changeManagers = userId
            }
            else if(role === 'manager') {
                update.$addToSet.managers = userId
            }
            Projects.update({
                _id: project._id
            }, update)
        }
        return userId;
    }
});

