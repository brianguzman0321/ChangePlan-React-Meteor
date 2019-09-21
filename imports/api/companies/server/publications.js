import { Meteor } from 'meteor/meteor';
import { Companies } from '../companies.js';

Meteor.publish('companies', function () {
    return Companies.find({
        owner: this.userId
    }, {sort: {}});
});

Meteor.publishTransformed('compoundCompanies', function () {
    return Companies.find({

    }).serverTransform({
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
    return Companies.find({
        owner: this.userId,
        _id: id
    });
});