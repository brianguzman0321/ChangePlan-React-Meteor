import React, { Component } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Card from '@material-ui/core/Card';

import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { FormControl } from '@material-ui/core';

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
});

const SimpleCard = () => {
    const classes = useStyles1();
    const bull = <span className={classes.bullet}>•</span>;

    return (
        <Card className={classes.card}>
            <CardContent>
                <FormControl>
                    <InputLabel htmlFor="my-input">Email address</InputLabel>
                    <Input id="my-input" aria-describedby="my-helper-text" />
                    <FormHelperText id="my-helper-text">We'll never share your email.</FormHelperText>
                </FormControl>
                <Typography variant="h5" component="h2">
                    be
                    {bull}
                    nev
                    {bull}o{bull}
                    lent
                </Typography>
                <Typography className={classes.pos} color="textSecondary">
                    adjective
                </Typography>
                <Typography variant="body2" component="p">
                    well meaning and kindly.
                    <br />
                    {'"a benevolent smile"'}
                </Typography>
            </CardContent>
            <CardActions>
                <Button size="small">Learn More</Button>
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
            <Grid item xs={3}>
                <Paper className={classes.paper}>xs=3</Paper>
            </Grid>
            <Grid item xs={3}>
                <Paper className={classes.paper}>xs=3</Paper>
            </Grid>
            <Grid item xs={3}>
                <Paper className={classes.paper}>xs=3</Paper>
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