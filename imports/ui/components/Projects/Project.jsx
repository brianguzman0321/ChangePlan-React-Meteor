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
import { InputBase } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';


const useStyles = makeStyles(theme => ({
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
    searchContainer: {
        marginTop: 13
    },
    topHeading: {
        color: '#465563',
        marginLeft: 74,
    },
    input: {
        marginLeft: theme.spacing(1),
        flex: 1,
    },
    searchGrid: {
        display: 'flex',
        background: '#fff',
        border: '1px solid #cbcbcc',
        maxHeight: 40
    },
    iconButton: {
        marginTop: -3
    },
    sortBy:{
        float: 'right',
        marginTop: 13,
        fontSize: 18
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 200,
    },
    selectEmpty: {
        border: '1px solid #c5c6c7',
        paddingLeft: 5
    }
}));

export default function ProjectCard() {
    const classes = useStyles();
    const bull = <span className={classes.bullet}>•</span>;
    const [age, setAge] = React.useState(10);
    const [open, setOpen] = React.useState(false);

    const handleChange = event => {
        setAge(event.target.value);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleOpen = () => {
        setOpen(true);
    };

    return (
        <Grid
            container
            direction="row"
            justify="flex-start"
            alignItems="flex-start"
        >
            <Grid container className={classes.searchContainer}>
                <Grid item xs={2}>
                    <Typography color="textSecondary" variant="h4" className={classes.topHeading}>
                        Projects
                    </Typography>
                </Grid>
                <Grid item xs={4} className={classes.searchGrid}>
                    <InputBase
                        className={classes.input}
                        placeholder="Search By Project Name"
                        inputProps={{ 'aria-label': 'search by project name' }}
                    />
                    <IconButton className={classes.iconButton} aria-label="search">
                        <SearchIcon />
                    </IconButton>
                </Grid>
                <Grid item xs={4}>
                    <Typography color="textSecondary" variant="title" className={classes.sortBy}>
                        Sort by
                    </Typography>
                </Grid>
                <Grid item xs={2}>
                    <FormControl className={classes.formControl}>
                        <Select
                            value={age}
                            onChange={handleChange}
                            displayEmpty
                            name="age"
                            className={classes.selectEmpty}
                        >
                            <MenuItem value={10}>Date Added</MenuItem>
                            <MenuItem value={20}>Date Due</MenuItem>
                            <MenuItem value={30}>Project Name</MenuItem>
                        </Select>
                        {/*<FormHelperText>Without label</FormHelperText>*/}
                    </FormControl>
                </Grid>
            </Grid>
            {[1,2,3,4,5,6,7,8].map(elem => (
                <Grid item xs={12} sm={6} md={3} key={elem}>
                    <Card className={classes.card}>
                        <LinearProgress variant="determinate" value={elem * 10} color="primary"/>
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