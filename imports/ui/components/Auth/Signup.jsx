import React, { Component, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { withTracker } from 'meteor/react-meteor-data';
import { Grid, Container, Card, Button, CardActions, CardContent, Typography,
    FormControl, Input, InputLabel, FormHelperText} from '@material-ui/core';
import { BrowserRouter as Router, Route, Link, RouterLink, Redirect } from "react-router-dom";

import { Accounts } from 'meteor/accounts-base'
import {Meteor} from "meteor/meteor";

const useStyles = makeStyles(theme => ({
    card: {
        minWidth: 275,
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
    button: {
        textAlign: 'center',
    },
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
    topText:{
        color: '#465663'
    }
}));

function Signup (props) {

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const classes = useStyles();
    const styles = {
        container: {
            marginTop: '57px',
            textAlign: 'center'
        },
    };

    const onSubmit = (event) => {
        event.preventDefault();
        setError('');
        if(password && password.length < 7){
            setError('7 character minimum password.');
            return false;
        }
        let profile = {
            firstName,
            lastName
        };
        Accounts.createUser({profile, email, password}, (err) => {
            if(err){
                setError(err.reason);
            }else{
                Meteor.call("sendVerificationLink", (error, response) => {
                    if (error) {
                        console.log(error.reason);
                    } else {
                        let email = Meteor.user().emails[0].address;
                        console.log(`Verification sent to ${email}!`, "success");
                    }
                });
            }
        });
    };

    const handleFirstName = e => {
        setFirstName(e.target.value);
    };

    const handleLastName = e => {
        setLastName(e.target.value);
    };

    const handleEmailInput = e => {
        setEmail(e.target.value);
    };

    const handlePasswordInput = e => {
        setPassword(e.target.value);
    };

    useEffect(() => {
    });
    return <Container maxWidth="sm" style={styles.container}>
        <div className={classes.root}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <img src={`/branding/logo-long.png`}/>
                </Grid>
                <Grid item xs={12}>
                    <h1 className={classes.topText}>Get Started!</h1>
                    <h3 className={classes.topText}>Free trial, no credit card required</h3>
                </Grid>
                <Grid item xs={12}>
                    <form onSubmit={onSubmit}>
                        <Card className={classes.card} style={{padding: '12px'}}>
                            <CardContent>
                                <FormControl fullWidth>
                                    <InputLabel htmlFor="first-name">First Name</InputLabel>
                                    <Input id="first-name" aria-describedby="my-helper-text" name="firstName" placeholder="Enter first name" onChange={handleFirstName} value={firstName} required/>
                                </FormControl>
                                <br/>
                                <br/>
                                <FormControl fullWidth>
                                    <InputLabel htmlFor="last-name">Last Name</InputLabel>
                                    <Input id="last-name" aria-describedby="my-helper-text" name="lastName" placeholder="Enter last name" onChange={handleLastName} value={lastName} required/>
                                </FormControl>
                                <br/>
                                <br/>
                                <FormControl fullWidth>
                                    <InputLabel htmlFor="email-name">Email address</InputLabel>
                                    <Input id="email-name" aria-describedby="my-helper-text" name="email" placeholder="Enter Email" onChange={handleEmailInput} value={email} type="email" required/>
                                </FormControl>
                                <br/>
                                <br/>
                                <FormControl fullWidth>
                                    <InputLabel htmlFor="my-password">Password</InputLabel>
                                    <Input id="my-password" aria-describedby="my-helper-text" name="password" placeholder="Enter Password" onChange={handlePasswordInput} value={password} type="password" minLength="7" required/>
                                </FormControl>
                                <Typography variant="body1" component="p" align='left'>
                                    <br />
                                    <Link to='/forgot-password'>Forgot Your Password?</Link>
                                </Typography>
                            </CardContent>
                            <CardActions style={{justifyContent: 'center'}}>
                                <Button variant="contained" color="primary" type="submit">
                                    Start My Free Trial
                                </Button>
                            </CardActions>
                            {error ?
                                <CardActions style={{justifyContent: 'center'}}>
                                    <Typography variant="body2" component="p" color='error'>
                                        <br />
                                        {error}
                                    </Typography>
                                </CardActions> : ''}
                        </Card>
                    </form>
                </Grid>
                <Grid item xs={12} className={classes.root}>
                    <Typography variant="body2" component="p">
                        <br />
                        Existing User <Link to='/login'> Login here </Link>
                    </Typography>
                </Grid>
            </Grid>
        </div>
    </Container>
}

const signUpPage = withTracker(props => {
    return {
        user: Meteor.user()
    };
})(Signup);

export default signUpPage