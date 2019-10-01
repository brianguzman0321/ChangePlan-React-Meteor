import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Avatar from "@material-ui/core/Avatar/Avatar";
import IconButton from "@material-ui/core/IconButton/IconButton";
import MoreVertIcon from '@material-ui/icons/MoreVert';
import CardHeader from "@material-ui/core/CardHeader/CardHeader";
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles({
    card: {
        minHeight: 182,
        minWidth: 300,
        maxWidth: 300,
        margin: 23
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    cardTitle: {
        fontSize: 11,
    },
    title: {
        fontSize: 11,
    },
    pos: {
        fontWeight: 'Bold',
    },
    bottomText: {
        marginTop: 12,
    },
});

export default function ProjectCard() {
    const classes = useStyles();
    const bull = <span className={classes.bullet}>•</span>;

    return (
        <Card className={classes.card}>
            <CardHeader
                action={
                    <IconButton aria-label="settings">
                        <MoreVertIcon />
                    </IconButton>
                }
                title="Project Name" className={classes.cardTitle}
            />
            <CardContent>
                <Grid container spacing={3}>
                    <Grid item xs={4}>
                        <Typography className={classes.title} color="textSecondary" gutterBottom>
                            STAKEHOLDERS
                        </Typography>
                        <Typography className={classes.pos} color="textSecondary">
                            1410
                        </Typography>
                    </Grid>
                    <Grid item xs={4}>
                        <Typography className={classes.title} color="textSecondary" gutterBottom>
                            ACTIVITIES
                        </Typography>
                        <Typography className={classes.pos} color="textSecondary">
                            17
                        </Typography>
                    </Grid>
                    <Grid item xs={4}>
                        <Typography className={classes.title} color="textSecondary" gutterBottom>
                            DUE
                        </Typography>
                        <Typography className={classes.pos} color="textSecondary">
                            16-Jul-19
                        </Typography>
                    </Grid>

                </Grid>
                <Typography variant="body2" component="p" className={classes.bottomText}>
                    Change Manager
                    <br />
                    Gavin Wedell
                </Typography>
            </CardContent>
        </Card>
    );
}