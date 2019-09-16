// definition of the Peoples collection

import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

class PeoplesCollection extends Mongo.Collection {}

export const Peoples = new PeoplesCollection('peoples');

// Deny all client-side updates since we will be using methods to manage this collection
Peoples.deny({
    insert() { return true; },
    update() { return true; },
    remove() { return true; }
});

Peoples.schema = new SimpleSchema({
    name: {
        type: String,
        label: 'stack holder name'
    },
    email: {
        type: String,
        label: 'stack holder email'
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

Peoples.attachSchema(Peoples.schema);

// This represents the keys from Lists objects that should be published
// to the client. If we add secret properties to List objects, don't list
// them here to keep them private to the server.
Peoples.publicFields = {
    name: 1
};