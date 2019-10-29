import { Meteor } from 'meteor/meteor';
import { Peoples } from '../peoples.js';

Meteor.publish('peoples', function (companyId, params) {
    let query = {
        company: companyId
    };
    params = params || {};
    if(params.name){
        query.firstName = {
            $regex: params.name,
            $options : 'i'
        }
    }
    return Peoples.find(query, {sort: {}});
});

Meteor.publish('peoples.single', function (id) {
    return Peoples.find({
        owner: this.userId,
        _id: id
    });
});