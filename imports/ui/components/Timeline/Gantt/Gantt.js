import React, { useEffect } from 'react';
import moment from "moment";
import 'dhtmlx-gantt/codebase/dhtmlxgantt.css';
import "./Gantt.css";
const gantt = window.gantt;

const zoom_tasks = dateUnit => {
  switch(dateUnit){
    case "quarter":
      gantt.config.scales = [
        {
          unit: "day",
          step: 1,
          format: "%d, %M",
        },
        {
          unit: "quarter",
          step: 1,
          format: date => {
            var dateToStr = gantt.date.date_to_str("%M %Y");
            var endDate = gantt.date.add(gantt.date.add(date, 3, "month"), -1, "day");
            return dateToStr(date) + " - " + dateToStr(endDate);
          },
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
      var weekScaleTemplate = date => {
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

export { handleDownload, zoom_tasks, handleImportData }

export default Gantt = props => {
  useEffect(() => {
    const { tasks, dateUnit, setActivityId, setEdit, updateTaskByDrag } = props;
    if(
      Roles.userIsInRole(Meteor.userId(), 'manager') ||
      Roles.userIsInRole(Meteor.userId(), 'activityOwner')
    ) {
      gantt.config.drag_resize = false;
      gantt.config.drag_move = false;
    }

    gantt.init(this.ganttContainer);
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
    ];
    gantt.templates.grid_header_class = function(columnName, column){
      return "gantt-column-header";
    };
    gantt.templates.grid_row_class = function(start, end, task){
      return "grey-background";
    }
    gantt.templates.task_class = function(start, end, task) {
      if(task.completed) return "completed-task";
      return "";
    }
    gantt.templates.scale_cell_class = function(date){
      return "grey-background";
    }
    gantt.templates.rightside_text = function(start, end, task) {
      if(task.type == gantt.config.types.milestone) {
        return task.eventType;
      }
    }
    gantt.templates.tooltip_text = function(start, end, task) {
      const { description } = task;
      if(description && description.length > 20)
        return description.slice(0,20) + "...";
      return description;
    };

    gantt.attachEvent("onTaskClick", function(id, e) {
      setActivityId(id);
      setEdit(true);
    });
    gantt.attachEvent("onTaskDrag", function(id, mode, task, original){
      //any custom logic here
      updateTaskByDrag({
        id: task['id'],
        dueDate: new Date(moment(task['start_date'], 'DD/MM/YYYY')),
        updatedAt: new Date(),
      });
    });

    gantt.config.tooltip_timeout = 2000;

    gantt.parse(tasks);
  });

  return (
    <div
      ref={(input) => { this.ganttContainer = input; }}
      style={{ width: '100%', height: '700px', marginTop: '30px' }}
    />
  )
};
