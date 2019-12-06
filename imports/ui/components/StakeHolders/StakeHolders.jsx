import React from 'react';
import { withRouter } from 'react-router';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import IconButton from "@material-ui/core/IconButton/IconButton";
import Grid from '@material-ui/core/Grid';
import { InputBase } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import {withTracker} from "meteor/react-meteor-data";
import { Companies } from "/imports/api/companies/companies";
import { Projects } from "/imports/api/projects/projects";
import { Peoples } from "/imports/api/peoples/peoples";
import TopNavBar from '/imports/ui/components/App/App';
import config from '/imports/utils/config';
import StakeHolderList from './StakeHoldersList'
import AddStakeHolder from './Modals/AddStakeHolder';


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
function StakeHolders(props){
    let menus = config.menus;
    const [search, setSearch] = React.useState('');
    const classes = useStyles();
    let { stakeHolders } = props;

    const searchFilter = event => {
        setSearch(event.target.value);
        updateFilter('localPeoples', 'search', event.target.value);
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
                    <Grid item xs={12} sm={6} md={4}>
                        <Typography color="textSecondary" variant="h4" className={classes.topHeading}>
                            Stakeholders
                            &nbsp;&nbsp;&nbsp;{stakeHolders.length}
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
                    <Grid item xs={4} className={classes.secondTab}>
                        <AddStakeHolder />
                    </Grid>
                </Grid>
                <StakeHolderList className={classes.stakeHoldersList} rows={stakeHolders}/>
            </Grid>

        </div>
    )
}

const StakeHoldersPage = withTracker(props => {
    let { match } = props;
    let { projectId } = match.params;
    let local = LocalCollection.findOne({
        name: 'localPeoples'
    });
    Meteor.subscribe('companies');
    let company = Companies.findOne() || {};
    let project = Projects.findOne({
        _id : projectId
    });
    let companyId = company._id || {};
    Meteor.subscribe('peoples', companyId, {
        name: local.search
    } );
    return {
        company: Companies.findOne(),
        stakeHolders: Peoples.find({
            _id: {
                $in: project && project.stakeHolders || []
            }
        }).fetch()
    };
})(withRouter(StakeHolders));

export default StakeHoldersPage