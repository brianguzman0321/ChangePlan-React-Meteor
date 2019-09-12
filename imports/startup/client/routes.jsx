import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { render } from 'react-dom';
import { withTracker } from 'meteor/react-meteor-data';

import ReactDOM from 'react-dom';
import Button from '@material-ui/core/Button';
import App from '/imports/ui/components/App/App';
import Login from '/imports/ui/components/Auth/Login';



import { BrowserRouter as Router, Route, Link } from "react-router-dom";

function Routes() {
    return (
        <Router>
            <Route exact path="/" component={App} />
            <Route exact path="/login" component={Login} />
        </Router>
    );
}

const Root = withTracker(props => {
    // Do all your reactive data access in this method.
    // Note that this subscription will get cleaned up when your component is unmounted
    // const handle = Meteor.subscribe('todoList', props.id);

    return {
        user: Meteor.user()
    };
})(Routes);


Meteor.startup(() => {
    ReactDOM.render(<Root />, document.getElementById('render-root'));
});