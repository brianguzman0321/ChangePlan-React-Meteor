import React, { PropTypes } from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import ReactDOM from 'react-dom';
import Button from '@material-ui/core/Button';
import App from '/imports/ui/components/App/App';
import Login from '/imports/ui/components/Auth/Login';
import Signup from '/imports/ui/components/Auth/Signup';


const Authenticated = ({ loggingIn, authenticated, component, ...rest }) => (
    <Route {...rest} render={(props) => {
        console.log("loggingIn", loggingIn)
        console.log("authenticated", authenticated)
        if (loggingIn) return <div></div>;
        return authenticated ?
            (React.createElement(component, { ...props, loggingIn, authenticated })) :
            (<Redirect to="/login" />);
    }} />
);

const Public = ({ loggingIn, authenticated, component, ...rest }) => (
    <Route {...rest} render={(props) => {
        if (loggingIn) return <div></div>;
        return !authenticated ?
            (React.createElement(component, { ...props, loggingIn, authenticated })) :
            (<Redirect to="/" />);
    }} />
);

const Routes = appProps => (
    <Router>
        <div className="App">
                <Switch>
                    <Authenticated exact path="/" component={App} {...appProps}/>
                    <Public path="/signup" component={Signup} {...appProps}/>
                    <Public path="/login" component={Login} {...appProps}/>
                </Switch>
        </div>
    </Router>
);



const Root = withTracker(props => {
    // Do all your reactive data access in this method.
    // Note that this subscription will get cleaned up when your component is unmounted
    // const handle = Meteor.subscribe('todoList', props.id);
    const loggingIn = Meteor.loggingIn();
    return {
        user: Meteor.user(),
        loggingIn,
        authenticated: !loggingIn && !!Meteor.userId(),
    };
})(Routes);


Meteor.startup(() => {
    render(<Root />, document.getElementById('render-root'));
});