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
import LinearProgress from '@material-ui/core/LinearProgress';

const useStyles = makeStyles({
    card: {
        minHeight: 182,
        minWidth: 300,
        maxWidth: 300,
        marginTop: 23,
        marginLeft: 15,
        marginRight: '0 !important',
        // color: theme.primary,
        color: '#465563'
    },
    progress:{
        color: '#4294db'
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
        color: '#51616e'
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
        <Grid
            container
            direction="row"
            justify="flex-start"
            alignItems="flex-start"
        >
            {[1,2,3,4,5,6,7,8].map(elem => (
                <Grid item xs={12} sm={6} md={3}>
                    <Card className={classes.card}>
                        <LinearProgress variant="determinate" value='50' color="primary"/>
                        <CardHeader
                            titleTypographyProps={{variant:'h6'}}
                            className={classes.cardTitle}
                            action={
                                <IconButton aria-label="settings">
                                    <MoreVertIcon />
                                </IconButton>
                            }
                            title={`Change Plan ${elem}`}
                        />
                        <CardContent>
                            <Grid container>
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
                </Grid>
            ))}
        </Grid>
    );
}