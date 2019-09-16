import { Meteor } from 'meteor/meteor';
import { Peoples } from '../peoples.js';

Meteor.publish('peoples', function () {
    return Peoples.find({
        owner: this.userId
    }, {sort: {}});
});

Meteor.publish('peoples.single', function (id) {
    return Peoples.find({
        owner: this.userId,
        _id: id
    });
});