import React from 'react';
import moment from 'moment';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Paper from '@material-ui/core/Paper';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import IconButton from "@material-ui/core/IconButton/IconButton";
import CardHeader from "@material-ui/core/CardHeader/CardHeader";
import Grid from '@material-ui/core/Grid';
import LinearProgress from '@material-ui/core/LinearProgress';
import { InputBase } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import {withTracker} from "meteor/react-meteor-data";
import { Companies } from "/imports/api/companies/companies";
import { Projects } from "/imports/api/projects/projects";
import TopNavBar from '/imports/ui/components/App/App';
import config from '/imports/utils/config';
import Button from '@material-ui/core/Button';
import StakeHolderList from './StakeHoldersList'


const useStyles = makeStyles(theme => ({
    root: {
        // flexGrow: 1,
        // maxWidth: 400,
        // maxHeight: 200
    },
    gridContainer: {
        // marginBottom: 15,
        overFlow: 'hidden'
    },
    topBar: {
        marginTop: 13,
    },
    topHeading: {
        color: '#465563',
        marginLeft: 24,
    },
    searchGrid: {
        display: 'flex',
        background: '#fff',
        border: '1px solid #cbcbcc',
        maxHeight: 40,
        maxWidth: 352,
        marginLeft: theme.spacing(5),
    },
    createNewProject : {
        flex: 1,
        marginTop: 2,
        marginLeft: 23
    },
    iconButton: {
        marginTop: -3
    },
    input: {
        marginLeft: theme.spacing(1),
        flex: 1,
    },
    stakeHoldersList: {
        margin: theme.spacing(2)
    }
}));
export default function Reports(props){
    let menus = config.menus;
    const [search, setSearch] = React.useState('');
    const classes = useStyles();

    const searchFilter = event => {
        setSearch(event.target.value);
        // updateFilter('localProjects', 'search', event.target.value);
    };

    return (
        <div>
            <TopNavBar menus={menus} {...props} />
            <Grid
                container
                direction="row"
                justify="flex-start"
                alignItems="center"
                className={classes.gridContainer}
                spacing={0}
            >
                <Grid container className={classes.topBar}>
                <Grid item xs={12} sm={6} md={2}>
                        <Typography color="textSecondary" variant="h4" className={classes.topHeading}>
                            Stakeholders
                        </Typography>
                    </Grid>
                    <Grid item xs={4} className={classes.searchGrid} md={3} sm={6}>
                        <InputBase
                            className={classes.input}
                            placeholder="Search"
                            inputProps={{ 'aria-label': 'search by project name' }}
                            onChange={searchFilter}
                            value={search}
                        />
                        <IconButton className={classes.iconButton} aria-label="search">
                            <SearchIcon />
                        </IconButton>
                    </Grid>
                    {/*<Grid item xs={4} className={classes.secondTab}>*/}
                        {/*<Button color="primary" className={classes.createNewProject}>*/}
                            {/*Add*/}
                        {/*</Button>*/}
                    {/*</Grid>*/}
                </Grid>
                <StakeHolderList className={classes.stakeHoldersList}/>
            </Grid>

        </div>
    )
}