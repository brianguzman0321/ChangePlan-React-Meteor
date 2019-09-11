import { Meteor } from 'meteor/meteor';
import { Demos } from '../demos.js';

Meteor.publish('demos', function () {
    return Demos.find({
        owner: this.userId
    }, {sort: {}});
});

Meteor.publish('demos.single', function (id) {
    return Demos.find({
        owner: this.userId,
        _id: id
    });
});