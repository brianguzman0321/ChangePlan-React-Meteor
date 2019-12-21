import React, {useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TopNavBar from '/imports/ui/components/App/App'
import Tabs from '@material-ui/core/Tabs';
import Button from '@material-ui/core/Button';
import Tab from '@material-ui/core/Tab';
import ViewColumnIcon from '@material-ui/icons/ViewColumn';
import ListIcon from '@material-ui/icons/List';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import config from '/imports/utils/config';
import { withRouter } from 'react-router';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import moment from "moment";
import {withTracker} from "meteor/react-meteor-data";
import { withStyles } from '@material-ui/core/styles';
import FormControlLabel from '@material-ui/core/FormControlLabel';

//Importing DHTMLX Modules
//import { gantt } from 'dhtmlx-gantt';
import 'dhtmlx-gantt/codebase/dhtmlxgantt.css';

import { Activities } from '/imports/api/activities/activities'
import { Projects } from "/imports/api/projects/projects";

import "./Gantt.css";
const gantt = window.gantt;
const styles = theme => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  title: {
    color: "rgb(70,86,100)",
    fontWidth: 400,
    fontSize: "30px !important"
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const useStyles = makeStyles(theme => ({
  inline: {
    display:"inline",
  },
  activityTabs: {
    wrapper: {
      flexDirection:'row',
    },
    color: "black",
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
  topHeading: {
    fontSize: '1.8rem',
    fontWeight: 500,
    lineHeight: 1.5,
    letterSpacing: '-0.015em',
    color: '#465563',
    marginRight: "20px",
  },
  gridContainer: {
    overFlow: 'hidden',
    padding: "0 20px",
  },
  topBar: {
    marginTop: 13,
  },
  selectExportType: {
    width: "200px",
    marginLeft: "20px",
  },
  exportDialog: {
    padding: "20px 30px",
    width: "800px !important",
  },
  flexBox: {
    display: "flex",
  }
}));
const DialogTitle = withStyles(styles)(props => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.title} {...other}>
      <Typography variant="h2">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles(theme => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles(theme => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

const zoom_tasks = function(dateUnit){
    switch(dateUnit){
      case "quarter":
        gantt.config.scales = [
          {unit: "day", step: 1, format: "%d, %M"},
          {
           unit: "quarter", step: 1, format: function (date) {
            var dateToStr = gantt.date.date_to_str("%M %Y");
            var endDate = gantt.date.add(gantt.date.add(date, 3, "month"), -1, "day");
            return dateToStr(date) + " - " + dateToStr(endDate);
           }
         }
        ];
        gantt.config.scale_height = 50;
      break;
      case "day":
        gantt.config.scales = [
          {unit: "day", step: 1, format: "%d %M"}
        ];
        gantt.config.scale_height = 27;
      break;
      case "week":
        var weekScaleTemplate = function (date) {
          var dateToStr = gantt.date.date_to_str("%d %M");
          var endDate = gantt.date.add(gantt.date.add(date, 1, "week"), -1, "day");
          return dateToStr(date) + " - " + dateToStr(endDate);
        };
        gantt.config.scales = [
            {unit: "week", step: 1, format: weekScaleTemplate},
            {unit: "day", step: 1, format: "%D"}
        ];
        gantt.config.scale_height = 50;
      break;
      case "month":
        gantt.config.scales = [
          {unit: "month", step: 1, format: "%F, %Y"},
          {unit: "day", step: 1, format: "%D, %j"}
        ];
        gantt.config.scale_height = 50;
      break;
    }
   // set_scale_units();
  }

const dateUnit = ["day", "week", "month", "quarter"];
const colors = {
  activity: ["rgb(241, 118, 62)","rgb(180, 157, 213)", "rgb(0, 179, 163)"],
  benefit: "rgb(255, 187, 67)",
  impact: "rgb(38, 153, 251)",
  completed: "rgb(0, 179, 163)",
}

function ChangeManagersNames(project) {
  if (project.changeManagerDetails) {
    let changeManagers = project.changeManagerDetails.map(changeManager => {
      return `${changeManager.profile.firstName} ${changeManager.profile.lastName}`
    });
    if (changeManagers.length) {
      return changeManagers.join(", ")
    } else {
      return "-"
    }
  }
}

function Gantt(props) {
  useEffect(() => {
    const { tasks, dateUnit} = props;
    console.log("Events for display", tasks);
    if(Roles.userIsInRole(Meteor.userId(), 'manager') || Roles.userIsInRole(Meteor.userId(), 'activityOwner') ) {  
      gantt.config.drag_resize = false;
      gantt.config.drag_move = false;
    }
    gantt.init(this.ganttContainer);
  //  gantt.config.sort = true;
    gantt.config.columns = [
      {
        name:"eventType", label: "Event type", align:"left"
      },
      {
        name: "stakeholders", label: "Stakeholders"
      },
      {
        name: "owner", label: "Owner"
      }
    ]
    gantt.templates.grid_header_class = function(columnName, column){
      return "gantt-column-header";
    };

    gantt.templates.grid_row_class = function(start, end, task){
      return "grey-background";
    }

    gantt.templates.task_class = function(start, end, task) {
      if(task.completed) return "completed-task";
      else return "";
    }

    gantt.templates.scale_cell_class = function(date){
      return "grey-background";
    }

    gantt.templates.rightside_text = function(start,end, task){
      if(task.type == gantt.config.types.milestone) {
        return task.eventType;
      }
    }
    
    gantt.templates.tooltip_text = function(start,end,task){
      if(task.description && task.description.length > 20)
        return task.description.slice(0,20) + "...";
      else return task.description;
    };

    gantt.config.tooltip_timeout = 2000;

    console.log("Tasks:", tasks);
    gantt.parse(tasks);
  } )
  return (
    <div
      ref={ (input) => { this.ganttContainer = input } }
      style={ { width: '100%', height: '700px', marginTop:"30px"} }
    ></div>
  )
}

function Timeline(props){
  const classes = useStyles();
  const [viewMode, setViewMode] = useState(0);
  const [zoomMode, setZoomMode] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const [exportType, setExportType] = useState(0);

  const handleChangeViewMode = (event, newValue) => {
    setViewMode(newValue);
  };

  const handleChangeZoomMode = (event, newValue) => {
    zoom_tasks(dateUnit[newValue]);
    setZoomMode(newValue);
  };

  const openExportModal = (event) => {
    setIsExporting(true);
  }

  const handleClose = (event) => {
    setIsExporting(false);
  }

  const handleExportTypeChange = (event) => {
    console.log(event.target.value);
    setExportType(event.target.value);
  }

  const handleImportClick = (event) => {
    document.getElementById("import-button").click();
  }

  const handleImportData = () => {
    let file = document.getElementById("import-button").files[0];
    const type = file.name.split('.').pop();
    let data = {}, len;
    if(type === "xlsx" || type === "xls") {
      gantt.importFromExcel({
        server:"https://export.dhtmlx.com/gantt",
        data: file,
        callback: function(project){
          gantt.clearAll();
          len = project.length
          for(i = 0; i < len; i ++)
            project[i].start_date = moment(project[i].start_date).format("DD-MM-YYYY")
          console.log("Imported Data:", project);          
          gantt.parse({data:project});
        }
      });
    }
    else {
      gantt.importFromMSProject({
        data: file,
        callback: function (project) {
            console.log("Imported Data:", project);
            if(project){
              gantt.clearAll();
              if (project.config.duration_unit) {
                  gantt.config.duration_unit = project.config.duration_unit;
              }                    
              data = {project}
            }
         }
      });
    }
  }
  const handleDownload = (event) => {
    console.log(data);
    switch(exportType) {
      case 0:
        gantt.exportToExcel({
          cellColors: true,
          columns:[
            { id:"text",  header:"text", width:30 },
            { id:"start_date",  header:"start_date", width:30, type: 'date'},
            { id:"color",  header:"color", width:30 },
            { id:"description",  header:"description", width:30 },
            { id:"eventType",  header:"eventType", width:30 },
            { id:"id",  header:"id", width:30 },
            { id:"owner",  header:"owner", width:30 },
            { id:"stakeholders",  header:"stakeholders", width:30 },
            { id:"type",  header:"type", width:30 }
          ]
        });
        break;
      case 1:
        gantt.exportToMSProject();
        break;
      case 2:
        gantt.exportToPDF();
        break;
      case 3:
        gantt.exportToPNG();
        break;
    }
  }
  let menus = config.menus;
  const [data, setData] = useState({data:[]})
  useEffect(() => {
    console.log("Events with all fields", props);
    let tempData = [];
    let i, len;
    const {activities, projects} = props;

    // if(projects[0]) {
    //   tempData.push({
    //     id: projects[0]._id,
    //     eventType: "Project start",
    //     text: "Project start",
    //     start_date: moment(projects[0].startingDate).format("DD-MM-YYYY"),
    //     stakeholders: projects[0].stakeHolders.length,
    //     owner: projects[0].owner,
    //     color: "white",
    //     type: gantt.config.types.milestone,
    //     description: "Project",
    //   })
    // }

    len = activities.length;
    for(i = 0; i < len; i ++) {
      let type = activities[i].type;
      const defaultSteps = ["Awareness", "Preparedness", "Support"];
      tempData.push({
        id: activities[i]._id,
        eventType:activities[i].label || defaultSteps[activities[i].step-1],
        text: type[0].toUpperCase() +  
        type.slice(1),
        start_date: moment(activities[i].dueDate).format("DD-MM-YYYY"), 
        duration: 1,
        color: colors.activity[activities[i].step-1],
        stakeholders: activities[i].stakeHolders.length,
        owner: activities[i].owner,
        completed: activities[i].completed,
        description: activities[i].description,
      })
    }

    if(projects[0]) {
      let owner = ChangeManagersNames(projects[0]);
      let impacts = projects[0] ? projects[0].impacts:[];
      len = impacts.length;
      for(i = 0; i < len; i ++) {
        tempData.push({
          id: `impacts #${i}`, 
          eventType:"Impact",
          text: `Impact: ${impacts[i].type}`,
          start_date: moment(impacts[i].expectedDate).format("DD-MM-YYYY"), 
          duration: 1,
          color: colors.impact,
          stakeholders: impacts[i].stakeholders.length,
          owner: owner,
          description: impacts[i].description,
        })
      }

      let benefits = projects[0] ? projects[0].benefits:[];
      len = benefits.length;
      for(i = 0; i < len; i ++) {
        tempData.push({
          id: `benefits #${i}`,
          eventType:"Benefit",
          text: `Stakeholder benefit`,
          start_date: moment(benefits[i].dueDate).format("DD-MM-YYYY"), 
          duration: 1,
          color: colors.benefit,
          stakeholders: benefits[i].stakeholders.length,
          owner: owner,
          description: benefits[i].description,
        })
      }
    }
    if(!_.isEqual(data.data, tempData))
      setData({data:tempData});
  }, [props])

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
          <Grid item className={classes.flexBox}>
            <Typography color="textSecondary" variant="h4" className={classes.topHeading} display="inline">
              Timeline
            </Typography>
            <Tabs
              value={viewMode}
              onChange={handleChangeViewMode}
              indicatorColor="primary"
              textColor="primary"
              aria-label="icon tabs example"
              style={
                {
                  background: "white",
                }
              }
            >
              <Tab className={classes.activityTab} label={<><div className={classes.iconTab}><ViewColumnIcon/>&nbsp; Gantt</div></>}/>
              <Tab className={classes.activityTab} label={<><div className={classes.iconTab}><ListIcon/>&nbsp; List</div></>}/>
            </Tabs>
          </Grid>
          <Grid className={classes.flexBox}>
              <Button 
                color="primary"
                onClick={handleImportClick}
              >
                Import
                <input 
                  type="file"
                  accept=".xlsx, .xls, .mpp,.xml, text/xml, application/xml, application/vnd.ms-project, application/msproj, application/msproject, application/x-msproject, application/x-ms-project, application/x-dos_ms_project, application/mpp, zz-application/zz-winassoc-mpp" 
                  onChange={handleImportData}
                  style={{display:"none"}}
                  id="import-button"
                />
              </Button>
              <Button 
                color="primary" 
                onClick={openExportModal}
                style={{
                  marginLeft: "20px"
                }}
              >
                Export
              </Button>
            <Tabs
              value={zoomMode}
              onChange={handleChangeZoomMode}
              indicatorColor="primary"
              textColor="primary"
              aria-label="icon tabs example"
              style={{
                marginLeft: "20px",
                background: "white",
              }}
            >
              <Tab className={classes.activityTab} label={<><div className={classes.iconTab}>&nbsp; DAY</div></>}/>
              <Tab className={classes.activityTab} label={<><div className={classes.iconTab}>&nbsp; WEEK</div></>}/>
              <Tab className={classes.activityTab} label={<><div className={classes.iconTab}>&nbsp; MONTH</div></>}/>
              <Tab className={classes.activityTab} label={<><div className={classes.iconTab}>&nbsp; QUARTER </div></>}/>
            </Tabs>
          </Grid>
        </Grid>
        <Gantt tasks={data}/>
        <Dialog 
          onClose={handleClose} 
          aria-labelledby="customized-dialog-title" 
          open={isExporting} 
          className={classes.exportDialog}
          maxWidth="sm"
          fullWidth={true}
        >
          <DialogTitle id="customized-dialog-title" onClose={handleClose}>
            Export events
          </DialogTitle>
          <DialogContent dividers>
            <Typography gutterBottom>
              Instruction text!
            </Typography>
            <Typography gutterBottom display="inline">
              Export to 
            </Typography>
            <Select
              label="Select type here"
              id="demo-simple-select-placeholder-label"
              value={exportType}
              onChange={handleExportTypeChange}
              displayEmpty
              className={classes.selectEmpty + " " + classes.selectExportType}
            >
              <MenuItem value={0}>
                MS Excel .xls
              </MenuItem>
              <MenuItem value={1}>MS Project .mpp</MenuItem>
              <MenuItem value={2}>PDF document</MenuItem>
              <MenuItem value={3}>PNG image</MenuItem>
            </Select>
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={handleDownload} color="primary" >
              Download
            </Button>
          </DialogActions>
        </Dialog>
      </Grid>         
    </div>
  )
}

const TimelinePage = withTracker(props => {
  let { match } = props;
  let { projectId } = match.params;
  Meteor.subscribe('compoundActivities', projectId);
  // Meteor.subscribe('myProjects', null, {
  //     sort: local.sort || {},
  //     name: local.search
  // });
  return {
      activities : Activities.find().fetch(),
      projects  : Projects.find(projectId).fetch(),
  };
})(withRouter(Timeline));

export default withRouter(TimelinePage)