import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles(theme => ({
    card: {
        background: '#FDE8E0',
        margin: 20,
        // maxWidth: 345,
        borderTop: '2px solid #FF915F'
    },
    avatar: {
        backgroundColor: '#f1753e',
        width: 30,
        height: 30
    },
    infoIcon: {

    },
    button: {
        background: '#f1753e',
        color: 'white',
        '&:hover': {
            background: '#f1753e',
            color: 'white'
        }
    },
    checkBoxIcon:{

    },
    innerCardHeader: {
        paddingBottom: 5
    },
    innerCardContent: {
        paddingTop: 0
    },
    floatRight: {
        float: 'right'
    }
}));

export default function ActivityCard() {
    const classes = useStyles();

    return (
        <Card className={classes.card}>
            <CardHeader
                avatar={
                    <Avatar aria-label="recipe" className={classes.avatar}>
                        1
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
                    AWARENESS
                </Typography>
                }
            />

            <CardContent>
                {/*<Button variant="contained" className={classes.button} fullWidth={true}>*/}
                    {/*Add Activity*/}
                {/*</Button>*/}
                {/*<Typography variant="body2" color="textSecondary" component="p">*/}
                    {/*This impressive paella is a perfect party dish and a fun meal to cook together with your*/}
                    {/*guests. Add 1 cup of frozen peas along with the mussels, if you like.*/}
                {/*</Typography>*/}
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
                        {/*<Button variant="contained" className={classes.button} fullWidth={true}>*/}
                        {/*Add Activity*/}
                        {/*</Button>*/}
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
                            <Grid item xs={6} md={6} justify="flex-start">
                                <Typography variant="body2" color="textSecondary" component="p">
                                    12 Nov
                                </Typography>
                            </Grid>
                            <Grid item xs={6} md={6} direction="row"
                                  justify="flex-end"
                                  alignItems="center">
                                <Typography variant="body2" color="textSecondary" component="p" >
                                    Jhon Smith
                                </Typography>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
                <br/>
            </CardContent>
        </Card>
    );
}