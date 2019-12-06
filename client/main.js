import '/imports/startup/client';

import React from 'react';
import { Meteor } from 'meteor/meteor';

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

LocalCollection.insert({
    name: 'localStakeHolders',
    ids: [],
    changed: false
});

updateFilter = function (name, key, value){
    const records = LocalCollection.find({name}).fetch();
    if(records.length){
        LocalCollection.update({name}, {$set: {
            [key]: value
        }})
    }
};
