import { Meteor } from 'meteor/meteor';
import { Companies } from '../companies.js';

Meteor.publish('companies', function () {
    if(Roles.userIsInRole(this.userId, 'superAdmin')){
        return Companies.find({})
    }
    return Companies.find({
        $or: [{
            owner: this.userId
        }, {
            peoples:{
                $in: [this.userId]
            }
        }]
    });
});

Meteor.publishTransformed('compoundCompanies', function () {
    let query = {};
    if(!Roles.userIsInRole(this.userId, 'superAdmin')){
        //if user Not Super Admin then return only if owner or admin
        query = {
            $or: [{
                owner: this.userId
            }, {
                admins:{
                    $in: [this.userId]
                }
            }]
        }
    }
    return Companies.find(query).serverTransform({
        'peoplesDetails': function (doc) {
            let peoples = [];
            _(doc.peoples).each(function (PeopleId) {
                peoples.push(Meteor.users.findOne({_id: PeopleId}, {
                    fields: {
                        services: 0, roles: 0
                    }
                }));
            });

            return peoples;
        }
    });
});

Meteor.publish('companies.single', function (id) {
    if(id){
        return Companies.find({
            owner: this.userId,
            _id: id
        });
    }
    return Companies.find({
        peoples:{
            $in: [this.userId]
        }
    })
});