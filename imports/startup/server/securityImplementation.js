// Deny all client-side updates to user documents
// Reference https://guide.meteor.com/security.html#checklist
Meteor.users.deny({
    update() { return true; }
});