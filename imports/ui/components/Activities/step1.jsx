import React, {useEffect, useState} from "react";
import {makeStyles} from '@material-ui/core/styles';
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
import AddActivity from '/imports/ui/components/Activities/Modals/AddActivity'
import moment from 'moment'
import {withRouter} from 'react-router'
import {withTracker} from "meteor/react-meteor-data";
import {stringHelpers} from '/imports/helpers/stringHelpers'
import SVGInline from "react-svg-inline";
import {data} from "/imports/activitiesContent.json";
import {Projects} from "../../../api/projects/projects";
import {Companies} from "../../../api/companies/companies";
import {Peoples} from "../../../api/peoples/peoples";
import Input from "@material-ui/core/Input";
import {withSnackbar} from "notistack";


var sActivity = {};

const useStyles = makeStyles(theme => ({
  card: {
    background: '#FDE8E0',
    margin: 20,
    borderTop: '2px solid #FF915F',
    paddingBottom: 0,
    boxShadow: 'none',
    paddingTop: 5,
    marginRight: 0
  },
  avatar: {
    backgroundColor: '#f1753e',
    width: 30,
    height: 30
  },
  infoIcon: {},
  button: {
    background: '#f1753e',
    color: 'white',
    '&:hover': {
      background: '#f1753e',
      color: 'white'
    }
  },
  checkBoxIcon: {},
  innerCard: {
    borderTop: '2px solid #FF915F',
    marginBottom: theme.spacing(2),
    cursor: 'pointer',
    boxShadow: 'none',
  },
  innerCardHeader: {
    padding: 5,
    paddingBottom: 5,
    boxShadow: 'none'
  },
  innerCardContent: {
    paddingTop: 0,
    paddingBottom: '0 !important',
    boxShadow: 'none',
  },
  cardContent: {
    boxShadow: 'none',
  },
  floatRight: {
    float: 'right'
  },
  cardHeader: {
    paddingBottom: 0
  }
}));

function AWARENESSCard(props) {
  let {activities, company, match, type, template, isSuperAdmin, isAdmin, isChangeManager, project, isManager} = props;
  const classes = useStyles();
  const [edit, setEdit] = React.useState(false);
  const [columnsName, setColumnsName] = useState('');
  const [showInput, setShowInput] = useState(false);
  const [nameTitle, setNameTitle] = useState(company.activityColumns && company.activityColumns[0] || '');
  const [changeManager, setChangeManager] = useState('');
  const [users, setUsers] = useState([]);
  let {projectId, templateId} = match.params;
  const [currentProject, setProject] = useState({});

  function completeActivity(activity) {
    activity.completed = !activity.completed;
    activity.completed ?
      activity.completedAt = activity.dueDate :
      activity.completedAt = null;
    delete activity.personResponsible;
    let params = {
      activity
    };
    Meteor.call('activities.update', params, (err, res) => {
    })
  }

  function editActivity(activity) {
    sActivity = activity;
    setEdit(false);
    setTimeout(() => {
      setEdit(true)
    })
  }

  function iconSVG(activity) {
    let selectedActivity = data.find(item => item.name === activity.type) || {};
    return selectedActivity && selectedActivity.iconSVG
  }

  const handleShowInput = () => {
    if ((isAdmin && type === 'project')) {
      setShowInput(true);
    }
  };

  const handleChangeName = (e) => {
    setColumnsName(e.target.value)
  };

  const getProjectManager = () => {
    if (type === 'project') {
      const curProject = Projects.find({_id: projectId}).fetch()[0];
      setProject(curProject);
      const changeManager = users.find(user => curProject.changeManagers.includes(user.value));
      setChangeManager(changeManager);
    } else {
      setProject(template);
      setChangeManager('');
    }
  };

  const updateUsersList = () => {
    Meteor.call(`users.getAllUsersInCompany`, {company: company}, (err, res) => {
      if (err) {
        props.enqueueSnackbar(err.reason, {variant: 'error'});
      }
      if (res && res.length) {
        setUsers(res.map(user => {
          return {
            label: `${user.profile.firstName} ${user.profile.lastName}`,
            value: user._id,
            role: user.roles,
            email: user.emails,
          }
        }))
      } else {
        setUsers([])
      }
    })
  };

  const updateColumnsName = () => {
    let allColumnsName
    if (company.activityColumns) {
      allColumnsName = company.activityColumns;
      allColumnsName[0] = columnsName;
    } else {
      allColumnsName = [columnsName, '', '']
    }
    const params = {
      company: {
        _id: company._id,
        name: company.name,
        activityColumns: allColumnsName,
      }
    };
    Meteor.call('companies.update', params, (err, res) => {
      if (err) {
        props.enqueueSnackbar(err.reason, {variant: 'error'});
      } else {
        props.enqueueSnackbar('Activity board column name changed successful', {variant: 'success'});
      }
      setShowInput(false);
    })
  };

  useEffect(() => {
    updateUsersList();
    getProjectManager();
  }, [edit], [changeManager]);

  useEffect(() => {
    if (company.activityColumns && company.activityColumns[0]) {
      setNameTitle(company.activityColumns[0])
    }
  }, [company]);

  return (
    <Card className={classes.card}>
      <CardHeader
        className={classes.cardHeader}
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
        title={showInput ?
          <Input type="text" onChange={handleChangeName} onBlur={updateColumnsName} onKeyPress={(e) => {
            (e.key === 'Enter' ? updateColumnsName(e.target.value) : null)
          }}/> :
          company.activityColumns && nameTitle !== '' ?
            <Typography variant="subtitle1" onDoubleClick={handleShowInput}>
              {nameTitle.toUpperCase()}
            </Typography> :
            <Typography variant="subtitle1" onDoubleClick={handleShowInput}>
              AWARENESS
            </Typography>
        }
      />

      <CardContent>
        {activities.map(activity => {
          return <Card className={classes.innerCard} key={activity._id} onClick={(e) => {
            editActivity(activity)
          }}>
            <CardHeader
              className={classes.innerCardHeader}
              avatar={<SVGInline
                width="35px"
                height="35px"
                fill='#f1753e'
                svg={iconSVG(activity)}
              />
              }
              action={
                <IconButton aria-label="settings"
                            disabled={(!(isAdmin && template && (template.companyId === company._id) || isSuperAdmin) && (projectId === undefined))}
                            className={classes.info} onClick={(e) => {
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
                <Typography variant="body2" color="textSecondary" component="p">
                  {activity.personResponsible !== undefined ? `${activity.personResponsible.profile.firstName} ${activity.personResponsible.profile.lastName}` : ''}
                </Typography>
              </Grid>
              <br/>
            </CardContent>
          </Card>
        })
        }
          <AddActivity edit={edit} match={match}
                       currentChangeManager={changeManager}
                       isChangeManager={isChangeManager} isManager={isManager}
                       isAdmin={isAdmin} isSuperAdmin={isSuperAdmin}
                       project={currentProject} template={template}
                       type={type} activity={sActivity}
                       newActivity={() => setEdit(false)}/>
      </CardContent>
    </Card>
  );
}

export default withTracker(props => {
  let local = LocalCollection.findOne({
    name: 'localStakeHolders'
  });
  Meteor.subscribe('companies');
  let company = Companies.findOne() || {};
  let companyId = company._id || {};
  Meteor.subscribe('peoples', companyId);
  return {
    stakeHolders: Peoples.find().fetch(),
    local,
    company,
  };
})(withRouter(withSnackbar(AWARENESSCard)));