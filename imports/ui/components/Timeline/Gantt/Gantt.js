import React, { useState, useEffect } from 'react';
import moment from 'moment';
import {withSnackbar} from 'notistack';
// import { gantt } from 'dhtmlx-gantt';
import 'dhtmlx-gantt/codebase/dhtmlxgantt.css';
import "./Gantt.css";
const gantt = window.gantt;

const handleImportData = (file) => {
  const type = file.name.split('.').pop();
  let data = {}, len;
  if(type === "xlsx" || type === "xls") {
    gantt.importFromExcel({
      server: "https://export.dhtmlx.com/gantt",
      data: file,
      callback: function(project) {
        gantt.clearAll();
        len = project.length;
        for(i = 0; i < len; i ++)
          project[i].start_date = moment(project[i].start_date).format("DD-MM-YYYY");          
        gantt.parse({ data: project });
      }
    });
  } else {
    gantt.importFromMSProject({
      data: file,
      callback: function(project) {
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
};

const handleDownload = (exportType) => {
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
};

export { handleDownload, handleImportData }

const Gantt = props => {
  savedTask = {};
  const { tasks, scaleText, setActivityId, setEdit, activities } = props;

  const updateTaskByDrag = (savedActivities, updatedTask) => {
    const validActivity = savedActivities.find(item => item['_id'] === updatedTask['id']);
    if (!validActivity) return;
    let params = {};
    params.activity = validActivity;
    delete params.activity.personResponsible;
    params.activity['dueDate'] = updatedTask.start_date;
    params.activity['updatedAt'] = updatedTask.end_date;

    Meteor.call('activities.update', params, (err, res) => {
      if (err) {
        props.enqueueSnackbar(err.reason, {variant: 'error'})
      } else {
        props.enqueueSnackbar(`Activity Updated Successfully.`, {variant: 'success'})
      }
    });
  }

  useEffect(() => {
    if(
      Roles.userIsInRole(Meteor.userId(), 'manager') ||
      Roles.userIsInRole(Meteor.userId(), 'activityOwner')
    ) {
      gantt.config.drag_resize = false;
      gantt.config.drag_move = false;
    }

    gantt.config.columns = [
      { name: "eventType", label: "Event type", align:"left" },
      { name: "stakeholders", label: "Stakeholders" },
      { name: "owner", label: "Owner" }
    ];
    gantt.config.tooltip_timeout = 200;

    // Gantt Template Styling //////////////////////
    gantt.templates.grid_header_class = (columnName, column) => "gantt-column-header";
    gantt.templates.grid_row_class = (start, end, task) => "grey-background";
    gantt.templates.task_class = (start, end, task) => {
      if(task.completed) return "completed-task";
      return "";
    }
    gantt.templates.scale_cell_class = date => "grey-background";
    // gantt.templates.rightside_text = (start, end, task) => {
    //   // return 'aaaaa';
    // };
    gantt.templates.rightside_text = (start, end, task) => task.type == gantt.config.types.milestone && task.eventType;
    gantt.templates.tooltip_text = (start, end, task) => {
      const { description } = task;
      if(description && description.length > 20)
        return description.slice(0, 20) + "...";
      return description;
    };
    ////////////////////////////////////////////////

    // Events
    gantt.attachEvent("onTaskClick", function(id, e) {
      setActivityId(id);
      setEdit(true);
      console.error('+++++++++++++++tasks', id);
    });
    // FIXME: This is a temporary solution
    gantt.activities = activities;
    gantt.attachEvent("onAfterTaskDrag", (id, mode, e) => {
      //any custom logic here
      var updatedTask = gantt.getTask(id);
      if (mode === 'move' && updatedTask !== savedTask) {
        savedTask = updatedTask;
        updateTaskByDrag(gantt.activities, updatedTask);
      }
    });
    ////////
    gantt.init(ganttContainer);
    gantt.clearAll();
    gantt.parse(tasks);
  });
  
  useEffect(() => {gantt.parse(tasks)}, [tasks]);
 
  useEffect(() => {
    switch(scaleText){
      case "quarter":
        gantt.config.scales = [
          { unit: "quarter", step: 1, format: date => {
              var dateToStr = gantt.date.date_to_str("%M, %Y");
              var endDate = gantt.date.add(gantt.date.add(date, 3, "month"), -1, "day");
              return dateToStr(date) + " - " + dateToStr(endDate);
            },
          },
          {
            unit: "month", step: 1, format: "%M",
          },
        ];
        gantt.config.scale_height = 40;
        gantt.config.min_column_width = 90;
      break;
      case "day":
        gantt.config.scales = [
          {unit: "day", step: 1, format: "%d %M"}
        ];
        gantt.config.scale_height = 40;
        gantt.config.min_column_width = 80;
      break;
      case "week":
        var weekScaleTemplate = date => {
          var dateToStr = gantt.date.date_to_str("%d %M");
          var endDate = gantt.date.add(gantt.date.add(date, 1, "week"), -1, "day");
          return dateToStr(date) + " - " + dateToStr(endDate);
        };
        gantt.config.scales = [
            {unit: "week", step: 1, format: weekScaleTemplate},
            {unit: "day", step: 1, format: "%j %D"}
        ];
        gantt.config.scale_height = 40;
        gantt.config.min_column_width = 50;
      break;
      case "month":
        gantt.config.scales = [
          {unit: "month", step: 1, format: "%F, %Y"},
          {unit: "week", step: 1, format: "Week #%W"}
        ];
        gantt.config.scale_height = 40;
        gantt.config.min_column_width = 120;
      break;
    }
    gantt.render();
  }, [scaleText]);

  

  return (
    <div
      ref={(input) => { ganttContainer = input; }}
      style={{ width: '100%', height: '85vh', marginTop: '30px' }}
    />
  )
};

export default withSnackbar(Gantt);
