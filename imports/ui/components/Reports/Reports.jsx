import React, {useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TopNavBar from '/imports/ui/components/App/App'
import config from '/imports/utils/config';
import Grid from "@material-ui/core/Grid/Grid";
import Typography from "@material-ui/core/Typography/Typography";
import ImpactReport from "./ImpactReport";
import UpcomingActivitiesReport from "./UpcomingActivitiesReport";
import {Meteor} from "meteor/meteor";
import {Projects} from "../../../api/projects/projects";
import {Activities} from "../../../api/activities/activities";
import {withRouter} from "react-router";
import {withTracker} from "meteor/react-meteor-data";
import {Templates} from "../../../api/templates/templates";
import {Companies} from "../../../api/companies/companies";
import CompletedActivitiesReport from "./CompletedActivitiesReport";


const useStyles = makeStyles({
    root: {
        // flexGrow: 1,
        // maxWidth: 400,
        // maxHeight: 200
    },
    activitiesGrid: {
        paddingRight: 20
    },
    activityTabs: {
        wrapper: {
            flexDirection:'row',
        },
    },
    iconTab: {
        display: 'flex',
        alignItems: 'center'
    },
    activityTab: {
        border: '0.5px solid #c5c6c7',
        minWidth: 101,
        '&:selected': {
            backgroundColor: '#3f51b5',
            color: '#ffffff'
        }
    },
    searchContainer: {
        marginTop: 13,
        overflow: 'hidden'
    },
    topHeading: {
        fontSize: '1.8rem',
        fontWeight: 500,
        lineHeight: 1.5,
        letterSpacing: '-0.015em',
        color: '#465563',
        marginLeft: 24,
    },
    gridContainer: {
        // marginBottom: 15,
        overFlow: 'hidden'
    },
    topBar: {
        marginTop: 13,
    }
});

function Reports(props){
    let menus = config.menus;
    let {match, project, template, company, currentCompany} = props;
    let {projectId} = match.params;
    const classes = useStyles();
    const [isSuperAdmin, setIsSuperAdmin] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isChangeManager, setIsChangeManager] = useState(false);
    const [isManager, setIsManager] = useState(false);
    const [isActivityDeliverer, setIsActivityDeliverer] = useState(false);
    const [isActivityOwner, setIsActivityOwner] = useState(false);

    useEffect(() => {
        checkRoles();
    }, [currentCompany, company, template, project]);

    const checkRoles = () => {
        const userId = Meteor.userId();
        if (Roles.userIsInRole(userId, 'superAdmin')) {
            setIsSuperAdmin(true);
        }
        if (currentCompany && currentCompany.admins.includes(userId)) {
            setIsAdmin(true);
        }
        if (currentCompany) {
            const projectsCurCompany = Projects.find({companyId: currentCompany._id}).fetch();
            if (projectsCurCompany) {
                const changeManagers = [...new Set([].concat.apply([], projectsCurCompany.map(project => project.changeManagers)))];
                if (changeManagers.includes(userId)) {
                    setIsChangeManager(true);
                }
            }
        }
        if (currentCompany) {
            const projectsCurCompany = Projects.find({companyId: currentCompany._id}).fetch();
            if (projectsCurCompany) {
                const managers = [...new Set([].concat.apply([], projectsCurCompany.map(project => project.managers)))];
                if (managers.includes(userId)) {
                    setIsManager(true);
                }
            }
        }
        const activities = Activities.find({projectId: projectId}).fetch();
        if (activities) {
            activities.forEach(activity => {
                if (!Roles.userIsInRole(userId, 'superAdmin') && activity.deliverer && activity.deliverer.includes(Meteor.userId())) {
                    setIsActivityDeliverer(true);
                }
                if (!Roles.userIsInRole(userId, 'superAdmin') && activity.owner && activity.owner.includes(Meteor.userId())) {
                    setIsActivityOwner(true);
                }
            })
        }
    };

    return (
        <div>
            <TopNavBar menus={menus} {...props} />
            <Grid
                container
                direction="row"
                justify="space-between"
                alignItems="center"
                className={classes.gridContainer}
                spacing={0}
            >
                <Grid
                    container
                    className={classes.topBar}
                    direction="row"
                    justify="space-between"
                >
                    <Grid item xs={3} md={7}>
                        <Typography color="textSecondary" variant="h4" className={classes.topHeading}>
                            Reports
                        </Typography>
                    </Grid>
                </Grid>
                <Grid container direction="row" justify="space-between">
                    <ImpactReport match={props.match}/>
                </Grid>
                <Grid container direction="row" justify="space-between">
                    <UpcomingActivitiesReport match={props.match} isSuperAdmin={isSuperAdmin} isAdmin={isAdmin}
                                              isChangeManager={isChangeManager} isManager={isManager} company={company}
                                              isActivityDeliverer={isActivityDeliverer} isActivityOwner={isActivityOwner}/>
                </Grid>
                <Grid container direction="row" justify="space-between">
                    <CompletedActivitiesReport match={props.match} company={company}/>
                </Grid>
            </Grid>
        </div>
    )
}

const ReportPage = withTracker(props => {
    let {match} = props;
    let {projectId, templateId} = match.params;
    let currentCompany = {};
    Meteor.subscribe('projects');
    Meteor.subscribe('templates');
    const project = Projects.findOne({_id: projectId});
    const template = Templates.findOne({_id: templateId});
    Meteor.subscribe('companies');
    const companies = Companies.find({}).fetch();
    const company = Companies.findOne({_id: project && project.companyId || template && template.companyId});
    if (!company) {
        currentCompany = companies.find(_company => _company.peoples.includes(userId));
    } else {
        currentCompany = company;
    }
    return {
        company,
        currentCompany,
        project,
        template,
    }
})(withRouter(Reports));

export default ReportPage;
