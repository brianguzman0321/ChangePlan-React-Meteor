import { Meteor } from 'meteor/meteor';
import { Activities } from '../activities.js';

Meteor.publish('activities', function () {
    return Activities.find({
        owner: this.userId
    }, {sort: {}});
});

Meteor.publish('activities.single', function (id) {
    return Activities.find({
        owner: this.userId,
        _id: id
    });
});