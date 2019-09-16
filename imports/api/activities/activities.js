// definition of the Activities collection

import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

class ActivitiesCollection extends Mongo.Collection {}

export const Activities = new ActivitiesCollection('activities');

// Deny all client-side updates since we will be using methods to manage this collection
Activities.deny({
    insert() { return true; },
    update() { return true; },
    remove() { return true; }
});

Activities.schema = new SimpleSchema({
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

Activities.attachSchema(Activities.schema);

// This represents the keys from Lists objects that should be published
// to the client. If we add secret properties to List objects, don't list
// them here to keep them private to the server.
Activities.publicFields = {
    name: 1
};