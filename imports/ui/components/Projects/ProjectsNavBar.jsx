import React, {useEffect, useState} from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import {withTracker} from 'meteor/react-meteor-data';
import config from '../../../utils/config';
import {Companies} from '../../../api/companies/companies';
import {makeStyles} from '@material-ui/core';
import AppBar from "@material-ui/core/AppBar/AppBar";
import Divider from "@material-ui/core/Divider";


const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  grow: {
    flexGrow: 1,
  },
  toolbar: {
    minHeight: 48,
    flexWrap: 'wrap',
    justifyContent: 'center'
  },
  topTexts: {
    paddingRight: theme.spacing(4),
    paddingLeft: theme.spacing(4),
    color: '#465563',
    fontWeight: 700,
    borderRight: '0.1em solid #eaecef',
    padding: '1em',
    cursor: 'pointer',
    '&:selected': {
      color: '#1890ff',
      fontWeight: theme.typography.fontWeightMedium,
    },
    '&:first-child': {
      borderLeft: '0.1em solid #eaecef'
    }
  },
  appBar: {
    background: '#ffffff',
    minHeight: 48
  }
}));

const ProjectNavBar = ({history: {push, location}, handleChange, selectedTab, currentCompanyId, isChangeManager, isSuperAdmin, isAdmin, templates, ...props}) => {
  const [displayMenus, setDisplayMenus] = useState([]);
  const classes = useStyles();

  useEffect(() => {
    let selectedDisplayMenus = [];
    let countTemplates = templates && templates.filter(template => template.companyId === currentCompanyId);
    if ((isSuperAdmin || ((isChangeManager && countTemplates && !countTemplates.length) && !isSuperAdmin && !isAdmin) && !isAdmin)) {
      selectedDisplayMenus = config.adminProjectsMenus.filter(item => item.show);
    }
    if (!isSuperAdmin && (isAdmin || (isChangeManager && countTemplates && countTemplates.length > 0) && !isAdmin && !isSuperAdmin)) {
      selectedDisplayMenus = config.projectsMenus.filter(item => item.show);
    }
    if (!isSuperAdmin && !isAdmin && !isChangeManager) {
      selectedDisplayMenus = [];
    }
    setDisplayMenus(selectedDisplayMenus);
  }, [isSuperAdmin, isAdmin, isChangeManager, templates]);

  return (
    <div className={classes.root}>
      <AppBar position="static" color="default">
        {displayMenus.length ? <Tabs
          value={selectedTab}
          onChange={(e, value) => handleChange(value)}
          centered
          variant="fullWidth"
          indicatorColor="primary"
        >
          {displayMenus.map((item, index) => {
            return <Tab variant="fullWidth" label={item.name.toUpperCase()} value={item.value}
                        className={classes.topTexts} key={index}
            />
          })}
        </Tabs> : ''}
      </AppBar>
    </div>
  )
};

const ProjectNavBarPage = withTracker(props => {
  let userId = Meteor.userId();
  const companies = Companies.find({}).fetch();
  const currentCompany = companies.find(company => company.peoples.includes(userId));
  return {
    companies: Companies.find({}).fetch(),
    currentCompany,
  }
})(ProjectNavBar);

export default ProjectNavBarPage;