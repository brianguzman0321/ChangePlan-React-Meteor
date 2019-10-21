import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles(theme => ({
    card: {
        background: '#d7f1f1',
        margin: 20,
        // maxWidth: 345,
        borderTop: '2px solid #53cbd0',
        paddingBottom: 0,
        paddingTop: 5,
        marginRight: 0
    },
    avatar: {
        backgroundColor: '#53cbd0',
        width: 30,
        height: 30
    },
    infoIcon: {

    },
    button: {
        background: '#53cbd0',
        color: 'white',
        '&:hover': {
            background: '#53cbd0',
            color: 'white'
        }
    },
    checkBoxIcon:{

    },
    innerCard: {
        borderTop: '2px solid #53cbd0',
    },
    innerCardHeader: {
        paddingBottom: 5
    },
    innerCardContent: {
        paddingTop: 0,
        paddingBottom: '0 !important'
    },
    floatRight: {
        float: 'right'
    },
    cardHeader: {
        paddingBottom: 0
    }
}));

export default function AWARENESSCard() {
    const classes = useStyles();
    let switchBlock = false;

    return (
        <Card className={classes.card}>
            <CardHeader
                className={classes.cardHeader}
                avatar={
                    <Avatar aria-label="recipe" className={classes.avatar}>
                        2
                    </Avatar>
                }
                action={
                    <IconButton aria-label="settings" className={classes.info}>
                        <InfoOutlinedIcon className={classes.infoIcon}/>
                    </IconButton>
                }
                // title="AWARENESS"
                title={
                    <Typography variant="subtitle1">
                    PREPAREDNESS
                </Typography>
                }
            />

            <CardContent>

                <Card className={classes.innerCard}>
                    <CardHeader
                        className={classes.innerCardHeader}
                        avatar={
                            <Avatar aria-label="recipe" className={classes.avatar}>
                                1
                            </Avatar>
                        }
                        action={
                            <IconButton aria-label="settings" className={classes.info}>
                                <CheckBoxIcon className={classes.checkBoxIcon} color="primary"/>
                            </IconButton>
                        }
                        // title="AWARENESS"
                        title={
                            <Typography variant="subtitle1">
                                Email
                            </Typography>
                        }
                    />

                    <CardContent className={classes.innerCardContent}>
                        <Typography variant="body2" color="textSecondary" component="p">
                        The Quick Brown Fox Jumps over a Lazy Dog.
                        </Typography>
                        <br/>
                        <Grid
                            container
                            direction="row"
                            justify="space-between"
                            alignItems="center"
                        >
                            <Grid item xs={9} md={9}>
                                <Typography variant="body2" color="textSecondary" component="p">
                                    12 Nov
                                </Typography>
                            </Grid>
                            <Grid item xs={3} md={3}>
                                <Typography variant="body2" color="textSecondary" component="p" >
                                    Jhon Smith
                                </Typography>
                            </Grid>
                        </Grid>
                        <br/>
                    </CardContent>
                </Card>
                <br/>
                <Card className={classes.innerCard}>
                    <CardHeader
                        className={classes.innerCardHeader}
                        avatar={
                            <Avatar aria-label="recipe" className={classes.avatar}>
                                1
                            </Avatar>
                        }
                        action={
                            <IconButton aria-label="settings" className={classes.info}>
                                <CheckBoxOutlineBlankIcon className={classes.checkBoxIcon} color="primary"/>
                            </IconButton>
                        }
                        // title="AWARENESS"
                        title={
                            <Typography variant="subtitle1">
                                Email
                            </Typography>
                        }
                    />

                    <CardContent className={classes.innerCardContent}>
                        {switchBlock && <Button variant="contained" className={classes.button} fullWidth={true}>
                            Add Activity
                        </Button>
                        }
                        <Typography variant="body2" color="textSecondary" component="p">
                            The Quick Brown Fox Jumps over a Lazy Dog.
                        </Typography>
                        <br/>
                        <Grid
                            container
                            direction="row"
                            justify="space-between"
                            alignItems="center"
                        >
                            <Grid item xs={9} md={9}>
                                <Typography variant="body2" color="textSecondary" component="p">
                                    12 Nov
                                </Typography>
                            </Grid>
                            <Grid item xs={3} md={3}>
                                <Typography variant="body2" color="textSecondary" component="p" >
                                    Jhon Smith
                                </Typography>
                            </Grid>
                        </Grid>
                        <br/>
                    </CardContent>
                </Card>
                <br/>
                <Button variant="contained" className={classes.button} fullWidth={true}>
                    Add Activity
                </Button>
            </CardContent>
        </Card>
    );
}