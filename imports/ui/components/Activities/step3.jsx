import React, {useEffect} from "react";
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
import AddActivity from '/imports/ui/components/Activities/Modals/AddActivity3'
import moment from 'moment'
import { stringHelpers } from '/imports/helpers/stringHelpers'
import SVGInline from "react-svg-inline";
import { data } from "/imports/activitiesContent.json";

var sActivity = {};

const useStyles = makeStyles(theme => ({
    card: {
        background: '#ece7f2',
        margin: 20,
        // maxWidth: 345,
        borderTop: '2px solid #bbabd2',
        paddingBottom: 0,
        paddingTop: 5,
        marginRight: 0
    },
    avatar: {
        backgroundColor: '#bbabd2',
        width: 30,
        height: 30
    },
    infoIcon: {

    },
    button: {
        background: '#bbabd2',
        color: 'white',
        '&:hover': {
            background: '#bbabd2',
            color: 'white'
        }
    },
    checkBoxIcon:{

    },
    innerCard: {
        borderTop: '2px solid #bbabd2',
        marginBottom: theme.spacing(2),
        cursor: 'pointer'
    },
    innerCardHeader: {
        padding: 5,
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

export default function AWARENESSCard(props) {
    let { activities } = props;
    const classes = useStyles();
    const [edit, setEdit] = React.useState(false);

    function completeActivity(activity){
        activity.completed = !activity.completed;
        delete activity.personResponsible;
        let params = {
            activity
        };
        Meteor.call('activities.update', params, (err, res) => {
        })
    }

    function editActivity(activity){
        sActivity = activity;
        setEdit(false);
        setTimeout(() => {
            setEdit(true)
        })

    }

    function iconSVG(activity){
        let selectedActivity = data.find(item => item.name === activity.type) || {};
        return selectedActivity && selectedActivity.iconSVG
    }

    useEffect(() => {

    }, [edit]);

    return (
        <Card className={classes.card}>
            <CardHeader
                className={classes.cardHeader}
                avatar={
                    <Avatar aria-label="recipe" className={classes.avatar}>
                        3
                    </Avatar>
                }
                action={
                    <IconButton aria-label="settings" className={classes.info}>
                        <InfoOutlinedIcon className={classes.infoIcon}/>
                    </IconButton>
                }
                title={
                    <Typography variant="subtitle1">
                        SUPPORT
                    </Typography>
                }
            />

            <CardContent>

                {
                    activities.map(activity => {
                        return <Card className={classes.innerCard} key={activity._id} onClick={(e) =>{editActivity(activity)}}>
                            <CardHeader
                                className={classes.innerCardHeader}
                                avatar={<SVGInline
                                    width="35px"
                                    height="35px"
                                    fill='#bbabd2'
                                    svg={iconSVG(activity)}
                                />
                                }
                                action={
                                    <IconButton aria-label="settings" className={classes.info} onClick={(e) => {
                                        e.stopPropagation();
                                        completeActivity(activity)
                                    }}>
                                        {
                                            activity.completed ? <CheckBoxIcon className={classes.checkBoxIcon} color="primary"/> :
                                                <CheckBoxOutlineBlankIcon className={classes.checkBoxIcon} color="primary"/>
                                        }
                                    </IconButton>
                                }
                                title={
                                    <Typography variant="subtitle1">
                                        {activity.name}
                                    </Typography>
                                }
                            />

                            <CardContent className={classes.innerCardContent}>
                                <Typography variant="body2" color="textSecondary" component="p">
                                    {stringHelpers.limitCharacters(activity.description, 50)}
                                </Typography>
                                <br/>
                                <Grid container justify="space-between">
                                    <Typography variant="body2" color="textSecondary" component="p">
                                        {moment(activity.dueDate).format('DD MMM')}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary" component="p" >
                                        {`${activity.personResponsible.profile.firstName} ${activity.personResponsible.profile.lastName}`}
                                    </Typography>
                                </Grid>
                                <br/>
                            </CardContent>
                        </Card>
                    })
                }

                <AddActivity edit={edit} activity={sActivity} newActivity={() => setEdit(false)}/>
            </CardContent>
        </Card>
    );
}