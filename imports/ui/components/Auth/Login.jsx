import React, { Component } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
// import { Link } from '@material-ui/core';

import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { FormControl, Input, InputLabel, FormHelperText } from '@material-ui/core';
import { BrowserRouter as Router, Route, Link, RouterLink } from "react-router-dom";

const useStyles1 = makeStyles(theme => ({
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


const useStyles = makeStyles({
    root: {
        justifyContent: 'center'
    },
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
});

const SimpleCard = () => {
    const classes = useStyles1();
    const bull = <span className={classes.bullet}>•</span>;

    return (
        <Card className={classes.card} style={{padding: '12px'}}>
            <CardContent>
                <FormControl fullWidth>
                    <InputLabel htmlFor="my-input">Email address</InputLabel>
                    <Input id="my-input" aria-describedby="my-helper-text" placeholder="Enter Email"/>
                    {/*<FormHelperText id="my-helper-text">We'll never share your email.</FormHelperText>*/}
                </FormControl>
                <br/>
                <br/>
                <FormControl fullWidth>
                    <InputLabel htmlFor="my-input">Password</InputLabel>
                    <Input id="my-password" aria-describedby="my-helper-text" placeholder="Enter Password"/>
                </FormControl>
                <Typography variant="body2" component="p" align='left'>
                    <br />
                    Forgot Your Password?
                </Typography>
            </CardContent>
            <CardActions style={{justifyContent: 'center'}}>
                <Button variant="contained" color="primary">
                    Login
                </Button>
            </CardActions>
        </Card>
    );
}


const SampleGrid = () => {
    const classes = useStyles();
    return <div className={classes.root}>
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <img src={`/branding/logo-long.png`}/>
            </Grid>
            <Grid item xs={12}>
                <h1 className={classes.topText}>Login to Change Plan</h1>
            </Grid>
            <Grid item xs={12}>
                <SimpleCard/>
            </Grid>
            <Grid item xs={12} classes={classes.root}>
                <Typography variant="body2" component="p">
                    <br />
                    Don't have Account! <Link to='/login1'> Sign up </Link>
                </Typography>
            </Grid>
        </Grid>
    </div>
}


class Login extends Component {
    constructor(props){
        super(props)
    }

    render(){
        const styles = {
            container: {
                marginTop: '70px',
                textAlign: 'center'
            },
        }
        return (
            <Container maxWidth="sm" style={styles.container}>
                <SampleGrid/>
            </Container>

        );
    }
}

export default Login