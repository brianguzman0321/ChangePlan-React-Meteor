import '/imports/startup/client';

import React from 'react';
import { Meteor } from 'meteor/meteor';
// import moment from 'moment';

import '/imports/startup/client';

LocalCollection = new Meteor.Collection(null);

LocalCollection.insert({
    name: 'localProjects',
    sort: 'endingDate'
});

LocalCollection.insert({
    name: 'localCompanies',
});

LocalCollection.insert({
    name: 'localPeoples'
});

updateFilter = function (name, key, value){
    const records = LocalCollection.find({name}).fetch();
    if(records.length){
        LocalCollection.update({name}, {$set: {
                [key]: value
            }})
    }
};
