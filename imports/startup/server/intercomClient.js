import { Meteor } from "meteor/meteor";

const serverIntercomClient = IntercomClient();
Meteor.methods({
    "intercom.callEvent"(project, section) {
        // Create an event for a user
        serverIntercomClient.events.create(
            {
                event_name: `submitted_${section}`,
                created_at: Math.floor(new Date().getTime() / 1000),
                user_id: this.userId
            },
            function(d) {
                // console.log(d);
            }
        );
    }
});

// Server
Meteor.publish("userData", function() {
    if (this.userId) {
        return Meteor.users.find(
            { _id: this.userId },
            {
                fields: { organization: 1 }
            }
        );
    } else {
        this.ready();
    }
});

Meteor.publish(null, function (){
    return Meteor.roles.find({})
});

// TODO possibly delete
