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
    country: {
        type: String,
        label: 'Name of country'
    }
});

Demos.attachSchema(Demos.schema);

// This represents the keys from Lists objects that should be published
// to the client. If we add secret properties to List objects, don't list
// them here to keep them private to the server.
Demos.publicFields = {
    name: 1
};