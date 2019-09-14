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

function ResetPassword (props) {
    const isToken = props.match.params.id

    const [token, setToken] = useState(isToken);
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
        console.log("token", token)
        console.log("token", password)
        Accounts.resetPassword(isToken, password, (err) => {
            if(err){
                setError(err.reason);
            }else{
                setError('Your password has been reset successfully!');
            }
        });
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
                <h1 className={classes.topText}>Login to Change Plan</h1>
            </Grid>
            <Grid item xs={12}>
                <form onSubmit={onSubmit}>
                    <Card className={classes.card} style={{padding: '12px'}}>
                        <CardContent>
                            <FormControl fullWidth>
                                <InputLabel htmlFor="my-input">Password</InputLabel>
                                <Input id="my-password" aria-describedby="my-helper-text" name="password" placeholder="Enter Password" onChange={handlePasswordInput} value={password} type="password" minLength={7} required/>
                            </FormControl>
                            <br/>
                        </CardContent>
                        <CardActions style={{justifyContent: 'center'}}>
                            <Button variant="contained" color="primary" type="submit">
                                Reset Your Password
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

const ResetPasswordPage = withTracker(props => {
    // Do all your reactive data access in this method.
    // Note that this subscription will get cleaned up when your component is unmounted
    // const handle = Meteor.subscribe('todoList', props.id);

    return {
        user: Meteor.user()
    };
})(ResetPassword);

export default ResetPasswordPage