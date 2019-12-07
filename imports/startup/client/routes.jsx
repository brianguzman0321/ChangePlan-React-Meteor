import React, { PropTypes } from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import { Roles } from 'meteor/alanning:roles'
import ReactDOM from 'react-dom';
import Button from '@material-ui/core/Button';
import App from '/imports/ui/components/App/App';
import Login from '/imports/ui/components/Auth/Login';
import Signup from '/imports/ui/components/Auth/Signup';
import ForgotPassword from '/imports/ui/components/Auth/forgotPassword';
import ResetPassword from '/imports/ui/components/Auth/ResetPassword';
import EnrollAccountPage from '/imports/ui/components/Auth/EnrollAccount';
import CompaniesListPage from '/imports/ui/components/admin/companies/CompaniesList';
import MaterialTableDemo from '/imports/ui/components/admin/control-panel/control-panel';
import ControlPanel from '/imports/ui/components/ControlPanel/ControlPanel.jsx';
import Home from '/imports/ui/components/Home/Home';
import ActivitiesCard from '/imports/ui/components/Activities/Activities';
import StakeHoldersCard from '/imports/ui/components/StakeHolders/StakeHolders'
import ReportsCard from '/imports/ui/components/Reports/Reports'
import Dashboard from '/imports/ui/components/DashBoard/Dashboard'
import { SnackbarProvider } from 'notistack';

//list of Public Routes

const Authenticated = ({ loggingIn, authenticated, component, ...rest }) => (
    <Route {...rest} render={(props) => {
        if (loggingIn) return <div></div>;
        return authenticated ?
            (React.createElement(component, { ...props, loggingIn, authenticated })) :
            (<Redirect to="/login" />);
    }} />
);

const AdminRoute = ({ loggingIn, authenticated, user, component, ...rest }) => (
    <Route {...rest} render={(props) => {
        if (loggingIn) return <div></div>;
        if (user && !user.roles) return <div></div>;
        return authenticated && user && Roles.userIsInRole(user._id, 'superAdmin') ?
            (React.createElement(component, { ...props, loggingIn, authenticated })) :
            (<Redirect to="/" />);

    }} />
);

const Public = ({ loggingIn, authenticated, component, ...rest }) => (
    <Route {...rest} render={(props) => {
        // if (loggingIn) return <div></div>;
        return !authenticated ?
            (React.createElement(component, { ...props, loggingIn, authenticated })) :
            (<Redirect to="/" />);
    }} />
);

const Routes = appProps => (
    <Router>
        <div className="App">
            <Switch>
                <Authenticated exact path="/" component={Home} {...appProps}/>
                <Authenticated exact path="/projects/:projectId" component={Dashboard} {...appProps}/>
                <Authenticated exact path="/control-panel" component={ControlPanel} {...appProps}/>
                <Authenticated exact path="/projects/:projectId/activities" component={ActivitiesCard} {...appProps}/>
                <Authenticated exact path="/projects/:projectId/stake-holders" component={StakeHoldersCard} {...appProps}/>
                <Authenticated exact path="/projects/:projectId/reports" component={ReportsCard} {...appProps}/>
                <AdminRoute exact path="/admin/control-panel" component={MaterialTableDemo} {...appProps}/>
                <AdminRoute exact path="/admin/companies" component={CompaniesListPage} {...appProps}/>
                <Public path="/signup" component={Signup} {...appProps}/>
                <Public path="/login" component={Login} {...appProps}/>
                <Public path="/forgot-password" component={ForgotPassword} {...appProps}/>
                <Public path="/reset-password/:id" component={ResetPassword} {...appProps}/>
                <Public path="/enroll-account/:id" component={EnrollAccountPage} {...appProps}/>
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
    render(
        <SnackbarProvider maxSnack={3}
                          anchorOrigin={{vertical : 'top', horizontal:"right"}}>
            <Root />
        </SnackbarProvider>,
        document.getElementById('render-root'));
});