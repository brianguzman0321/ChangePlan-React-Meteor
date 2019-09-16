import { Meteor } from 'meteor/meteor';
import { Companies } from '../companies.js';

Meteor.publish('companies', function () {
    return Companies.find({
        owner: this.userId
    }, {sort: {}});
});

Meteor.publish('companies.single', function (id) {
    return Companies.find({
        owner: this.userId,
        _id: id
    });
});