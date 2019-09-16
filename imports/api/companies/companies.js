// definition of the Companies collection

import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

class CompaniesCollection extends Mongo.Collection {}

export const Companies = new CompaniesCollection('companies');

// Deny all client-side updates since we will be using methods to manage this collection
Companies.deny({
    insert() { return true; },
    update() { return true; },
    remove() { return true; }
});

Companies.schema = new SimpleSchema({
    name: {
        type: String,
        label: 'company name'
    },
    owner: {
        type: String,
        label: 'Owner of company'
    },
    peoples: {
        type: [String],
        label: 'company Projects',
        defaultValue: []
    },
    projects: {
        type: [String],
        label: 'company Peoples',
        defaultValue: []
    },
    createdAt: {
        type: Date,
        label: 'Created At Company',
        denyUpdate: true,
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
        denyInsert: true,
        optional: true
    }
});

Companies.attachSchema(Companies.schema);

// This represents the keys from Lists objects that should be published
// to the client. If we add secret properties to List objects, don't list
// them here to keep them private to the server.
Companies.publicFields = {
    name: 1
};