import { Meteor } from 'meteor/meteor';
import { Peoples } from '../peoples.js';

Meteor.publish('peoples', function (companyId) {
    return Peoples.find({
        company: companyId
    }, {sort: {}});
});

Meteor.publish('peoples.single', function (id) {
    return Peoples.find({
        owner: this.userId,
        _id: id
    });
});