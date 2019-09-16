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