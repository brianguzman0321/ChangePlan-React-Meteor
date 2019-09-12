import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { render } from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

import ReactDOM from 'react-dom';
import Button from '@material-ui/core/Button';
import App from '/imports/ui/components/App/App';

Meteor.startup(() => {
    ReactDOM.render(<App />, document.getElementById('render-root'));
});