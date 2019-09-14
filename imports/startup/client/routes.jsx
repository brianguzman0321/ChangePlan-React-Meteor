import React, { Component } from 'react';
import { render } from 'react-dom';
import { withTracker } from 'meteor/react-meteor-data';

import ReactDOM from 'react-dom';
import Button from '@material-ui/core/Button';
import App from '/imports/ui/components/App/App';
import Login from '/imports/ui/components/Auth/Login';
import Login1 from '/imports/ui/components/Auth/Login1';
import Signup from '/imports/ui/components/Auth/Signup';



import { BrowserRouter as Router, Route, Link, Redirect } from "react-router-dom";


class AuthRequiredRoute extends Route {
    /**
     * @example <AuthRequiredRoute path="/" component={Products}>
     */
    render(props) {
        // call some method/function that will validate if user is logged in
        // if (!Meteor.userId()) {
        if (false) {
            return <Redirect to="/login"></Redirect>
        } else {
            return <this.props.component />
        }
    }
}

class Routes extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <Router>
                <Route exact path="/" component={App}/>
                <Route exact path="/login" component={Login}/>
                <Route exact path="/login1" component={Login1}/>
                <Route exact path="/signup" component={Signup}/>
            </Router>
        );
    }

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
    render(<Root />, document.getElementById('render-root'));
});