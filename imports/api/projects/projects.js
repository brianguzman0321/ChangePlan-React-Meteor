// definition of the Projects collection

import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

class ProjectsCollection extends Mongo.Collection {}

export const Projects = new ProjectsCollection('projects');

// Deny all client-side updates since we will be using methods to manage this collection
Projects.deny({
    insert() { return true; },
    update() { return true; },
    remove() { return true; }
});

Projects.schema = new SimpleSchema({
    owner: {
        type: String,
        label: 'Owner'
    },
    name: {
        type: String,
        label: 'Project Name'
    },
    companyId: {
        type: String,
        label: 'company ID'
    },
    peoples: {
        type: Array,
        defaultValue: [],
        label: 'company Peoples',
    },
    'peoples.$': {
        type: String,
    },
    stakeHolders: {
        type: Array,
        defaultValue: [],
        label: 'project StakeHolders',
    },
    'stakeHolders.$': {
        type: String
    },
    changeManagers: {
        type: Array,
        defaultValue: [],
        label: 'project change managers',
    },
    'changeManagers.$': {
        type: String
    },
    managers: {
        type: Array,
        defaultValue: [],
        label: 'project managers',
    },
    'managers.$': {
        type: String
    },
    vision: {
        type: Array,
        defaultValue: [],
        label: 'project vision',
    },
    'vision.$': {
        type: String
    },
    objectives: {
        type: Array,
        defaultValue: [],
        label: 'project vision',
    },
    'objectives.$': {
        type: String
    },
    impacts: {
        type: Array,
        defaultValue: [],
        label: 'project impacts',
    },
    'impacts.$': {
        type: Object,
        blackbox: true
    },
    risks: {
        type: Array,
        defaultValue: [],
        label: 'project risks',
    },
    'risks.$': {
        type: Object,
        blackbox: true
    },
    startingDate: {
        type: Date,
        label: 'Starting Date',
    },
    peopleCount: {
        type: Number,
        label: 'People Count',
        defaultValue: 0,
    },
    endingDate: {
        type: Date,
        label: 'End Date',
    },
    createdAt: {
        type: Date,
        label: 'Created At Company',
        autoValue: function() {
            if (this.isInsert) {
                return new Date();
            } else if (this.isUpsert) {
                return {$setOnInsert: new Date()};
            } else {
                this.unset();
            }
        }
    },
    updatedAt: {
        type: Date,
        label: 'Updated At Company',
        autoValue: function() {
            if (this.isUpdate) {
                return new Date();
            }
        },
        optional: true
    }
});

Projects.attachSchema(Projects.schema);

// This represents the keys from Lists objects that should be published
// to the client. If we add secret properties to List objects, don't list
// them here to keep them private to the server.
Projects.publicFields = {
    name: 1
};