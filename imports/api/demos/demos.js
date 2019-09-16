// definition of the Demos collection

import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

class DemosCollection extends Mongo.Collection {}

export const Demos = new DemosCollection('demos');

// Deny all client-side updates since we will be using methods to manage this collection
Demos.deny({
    insert() { return true; },
    update() { return true; },
    remove() { return true; }
});

Demos.schema = new SimpleSchema({
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

Demos.attachSchema(Demos.schema);

// This represents the keys from Lists objects that should be published
// to the client. If we add secret properties to List objects, don't list
// them here to keep them private to the server.
Demos.publicFields = {
    name: 1
};