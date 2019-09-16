import { Meteor } from 'meteor/meteor';
import { Projects } from '../projects.js';

Meteor.publish('projects', function () {
    return Projects.find({
        owner: this.userId
    }, {sort: {}});
});

Meteor.publish('projects.single', function (id) {
    return Projects.find({
        owner: this.userId,
        _id: id
    });
});