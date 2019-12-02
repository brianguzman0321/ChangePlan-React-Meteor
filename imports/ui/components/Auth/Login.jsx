import React, { Component, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { withTracker } from 'meteor/react-meteor-data';
import { Grid, Container, Card, Button, CardActions, CardContent, Typography,
    FormControl, Input, InputLabel, FormHelperText} from '@material-ui/core';
import { BrowserRouter as Router, Route, Link, RouterLink, Redirect } from "react-router-dom";


const useStyles1 = makeStyles(theme => ({

}));


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

function Login (props) {

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
        Meteor.loginWithPassword(email, password, (err) => {
            if(err){
                if(err.reason === 'User has no password set'){
                    err.reason = 'User has no password set. Please check your email for your invitation.';
                }
                setError(err.reason);
                return false
            }else{
                return false;
            }
        });
    };

    const handleEmailInput = e => {
        setEmail(e.target.value);
    };
    const handlePasswordInput = e => {
        setPassword(e.target.value);
    };

    useEffect((props) => {
        if (props && props.user) return <Redirect to={'/'} />;
    });
    return <Container maxWidth="sm" style={styles.container}>
        <div className={classes.root}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <img src={`/branding/logo-long.png`}/>

                </Grid>
                <Grid item xs={12}>
                    <h1 className={classes.topText}>Login to ChangePlan</h1>
                </Grid>
                <Grid item xs={12}>
                    <form onSubmit={onSubmit}>
                        <Card className={classes.card} style={{padding: '12px'}}>
                            <CardContent>
                                <FormControl fullWidth>
                                    <InputLabel htmlFor="my-password">Email address</InputLabel>
                                    <Input id="my-input" aria-describedby="my-helper-text" name="email" placeholder="Enter Email" onChange={handleEmailInput} value={email} type="email" required/>
                                    {/*<FormHelperText id="my-helper-text">We'll never share your email.</FormHelperText>*/}
                                </FormControl>
                                <br/>
                                <br/>
                                <FormControl fullWidth>
                                    <InputLabel htmlFor="my-input">Password</InputLabel>
                                    <Input id="my-password" aria-describedby="my-helper-text" name="password" placeholder="Enter Password" onChange={handlePasswordInput} value={password} type="password" minLength={7} required/>
                                </FormControl>
                                <Typography variant="body1" component="p" align='left'>
                                    <br />
                                    <Link to='/forgot-password'>Forgot Your Password?</Link>

                                </Typography>
                            </CardContent>
                            <CardActions style={{justifyContent: 'center'}}>
                                <Button variant="contained" color="primary" type="submit">
                                    Login
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
                        Don't have Account? <Link to='/signup'> Sign up </Link>
                    </Typography>
                </Grid>
            </Grid>
        </div>
    </Container>
}

const LoginPage = withTracker(props => {
    // Do all your reactive data access in this method.
    // Note that this subscription will get cleaned up when your component is unmounted
    // const handle = Meteor.subscribe('todoList', props.id);

    return {
        user: Meteor.user()
    };
})(Login);

export default LoginPage