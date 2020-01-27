import React, {useEffect, useState} from "react";
import {makeStyles, withStyles} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import MuiCardContent from '@material-ui/core/CardContent';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import MuiCardHeader from '@material-ui/core/CardHeader';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import Grid from '@material-ui/core/Grid';
import AddActivities from './Modals/AddActivities';
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

const CardHeader = withStyles({
  root: {
    padding: '5px 10px 10px 10px',
  },
  avatar: {
    marginRight: '8px'
  }
})(MuiCardHeader);

const CardContent = withStyles({
  root: {
    padding: '8px'
  }
})(MuiCardContent);

const useStyles = makeStyles(theme => ({
  cardAwareness: {
    background: '#FDE8E0',
    marginTop: 20,
    marginBottom: 20,
    borderTop: '2px solid #FF915F',
    paddingBottom: 0,
    boxShadow: 'none',
    paddingTop: 5,
    marginRight: 0
  },
  avatarAwareness: {
    backgroundColor: '#f1753e',
    width: 30,
    height: 30
  },
  infoIcon: {},
  checkBoxIcon: {},
  innerCardAwareness: {
    borderTop: '2px solid #FF915F',
    marginBottom: theme.spacing(2),
    cursor: 'pointer',
    boxShadow: 'none',
  },
  cardInterest: {
    background: '#DCEDC8',
    marginTop: 20,
    marginBottom: 20,
    borderTop: '2px solid #8BC34A',
    paddingBottom: 0,
    boxShadow: 'none',
    paddingTop: 5,
    marginRight: 0
  },
  avatarInterest: {
    backgroundColor: '#8BC34A',
    width: 30,
    height: 30
  },
  innerCardInterest: {
    borderTop: '2px solid #8BC34A',
    marginBottom: theme.spacing(2),
    cursor: 'pointer',
    boxShadow: 'none',
  },
  cardUnderstanding: {
    background: '#B3E5FC',
    marginTop: 20,
    marginBottom: 20,
    borderTop: '2px solid #29B6F6',
    paddingBottom: 0,
    boxShadow: 'none',
    paddingTop: 5,
    marginRight: 0
  },
  avatarUnderstanding: {
    backgroundColor: '#29B6F6',
    width: 30,
    height: 30
  },
  innerCardUnderstanding: {
    borderTop: '2px solid #29B6F6',
    marginBottom: theme.spacing(2),
    cursor: 'pointer',
    boxShadow: 'none',
  },
  cardPreparedness: {
    background: '#d7f1f1',
    marginTop: 20,
    marginBottom: 20,
    borderTop: '2px solid #53cbd0',
    paddingBottom: 0,
    paddingTop: 5,
    marginRight: 0,
    boxShadow: 'none',
  },
  avatarPreparedness: {
    backgroundColor: '#53cbd0',
    width: 30,
    height: 30
  },
  innerCardPreparedness: {
    borderTop: '2px solid #53cbd0',
    marginBottom: theme.spacing(2),
    cursor: 'pointer',
    boxShadow: 'none',
  },
  cardSupport: {
    background: '#ece7f2',
    marginTop: 20,
    marginBottom: 20,
    borderTop: '2px solid #bbabd2',
    paddingBottom: 0,
    paddingTop: 5,
    marginRight: 0,
    boxShadow: 'none',
  },
  avatarSupport: {
    backgroundColor: '#bbabd2',
    width: 30,
    height: 30
  },
  innerCardSupport: {
    borderTop: '2px solid #bbabd2',
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
    padding: '8px',
  },
  floatRight: {
    float: 'right'
  },
  cardHeader: {
    paddingBottom: 0,
  }
}));

function ActivitiesColumn(props) {
  let {activities, company, match, type, template, isSuperAdmin, isAdmin, isChangeManager, isActivityOwner, project, isManager, name, step, color} = props;
  const classes = useStyles(color);
  const [edit, setEdit] = useState(false);
  const [stepActivities, setStepActivities] = useState([]);
  const [columnsName, setColumnsName] = useState('');
  const [showInput, setShowInput] = useState(false);
  const [nameTitle, setNameTitle] = useState(company.activityColumns && company.activityColumns[step] || '');
  const [changeManager, setChangeManager] = useState('');
  const [users, setUsers] = useState([]);
  let {projectId} = match.params;
  const disabled = (!(isAdmin && template && (template.companyId === company._id)
    || isSuperAdmin) && (projectId === undefined)
    || (isManager && !isActivityOwner && !isChangeManager && !isAdmin && !isSuperAdmin));
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
    let selectedActivity = data.find(item => item.name === activity.type || item.category === "custom") || {};
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
    let allColumnsName = company.activityColumns;
    allColumnsName[step - 1] = columnsName;
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
    if (activities) {
      const newActivities = activities.filter(activity => activity.step === step);
      setStepActivities(newActivities);
    }
  }, [activities]);

  useEffect(() => {
    if (company.activityColumns && company.activityColumns[step - 1]) {
      setNameTitle(company.activityColumns[step - 1])
    }
  }, [company]);

  return (
    <Card className={step === 4 ? classes.cardInterest :
      step === 5 ? classes.cardUnderstanding :
        step === 1 ? classes.cardAwareness :
          step === 2 ? classes.cardPreparedness :
            step === 3 ? classes.cardSupport : null}>
      <CardHeader
        className={classes.cardHeader}
        avatar={
          <Avatar aria-label="recipe"
                  className={step === 4 ? classes.avatarInterest :
                    step === 5 ? classes.avatarUnderstanding :
                      step === 1 ? classes.avatarAwareness :
                        step === 2 ? classes.avatarPreparedness :
                          step === 3 ? classes.avatarSupport : null}>
            {step === 4 ? '2' : step === 5 ? '3' : step === 2 ? '4' : step === 3 ? '5' : step}
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
              {name.toUpperCase()}
            </Typography>
        }
      />

      <CardContent>
        {stepActivities.map(activity => {
          return <Card
            className={step === 4 ? classes.innerCardInterest :
              step === 5 ? classes.innerCardUnderstanding :
                step === 1 ? classes.innerCardAwareness :
                  step === 2 ? classes.innerCardPreparedness :
                    step === 3 ? classes.innerCardSupport : null}
            key={activity._id} onClick={(e) => {
            editActivity(activity)
          }}>
            <CardHeader
              className={classes.innerCardHeader}
              avatar={<SVGInline
                width="35px"
                height="35px"
                fill={color}
                svg={iconSVG(activity)}
              />
              }
              action={
                <IconButton aria-label="settings"
                            disabled={disabled}
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
                <Typography variant="body2" style={{fontSize: '13px'}}>
                  {activity.name}
                </Typography>
              }
            />

            <CardContent className={classes.innerCardContent}>
              <Typography variant="body2" style={{fontSize: '13px'}} color="textSecondary" component="p">
                {stringHelpers.limitCharacters(activity.description, 50)}
              </Typography>
              <br/>
              <Grid container justify="space-between">
                <Typography variant="body2" style={{fontSize: '13px'}} color="textSecondary" component="p">
                  {moment(activity.dueDate).format('DD MMM')}
                </Typography>
                <Typography variant="body2" style={{fontSize: '13px'}} color="textSecondary" component="p">
                  {activity.personResponsible !== undefined ? `${activity.personResponsible.profile.firstName} ${activity.personResponsible.profile.lastName}` : ''}
                </Typography>
              </Grid>
              <br/>
            </CardContent>
          </Card>
        })
        }
        <AddActivities edit={edit} match={match} step={step}
                       currentChangeManager={changeManager} color={color}
                       isChangeManager={isChangeManager} isManager={isManager}
                       isAdmin={isAdmin} isSuperAdmin={isSuperAdmin} isActivityOwner={isActivityOwner}
                       project={currentProject} template={template}
                       type={type} activity={sActivity}
                       expandAccordian={true}
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
})(withRouter(withSnackbar(ActivitiesColumn)));