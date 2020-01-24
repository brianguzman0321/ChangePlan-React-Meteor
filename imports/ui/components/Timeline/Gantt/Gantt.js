import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { withSnackbar } from 'notistack';
// import { gantt } from 'dhtmlx-gantt';
import 'dhtmlx-gantt/codebase/dhtmlxgantt.css';
import "./Gantt.css";
const gantt = window.gantt;

const updateProjectByImport = (file, project, activities, props) => {
  const len = file.length;
  for (i = 0; i < len; i++) {
    if (file[i].eventType === 'Awareness' || file[i].eventType === 'Ability' || file[i].eventType === 'Reinforcement' || file[i].eventType === 'Desire' || file[i].eventType === 'Knowledge') {
      const currentActivity = activities[i - 1] ? activities[i - 1] : {};
      if (!currentActivity) return;
      let params = {};
      params.activity = currentActivity;
      delete params.activity.personResponsible;
      params.activity.type = file[i].text[0].toLowerCase() + file[i].text.slice(1);
      params.activity.name = file[i].text;
      params.activity.projectId = project._id;
      // params.activity._id = file[i].id;
      // // activity.stakeHolders = file[i].stakeholders;
      if (file[i].eventType === 'Awareness') {
        params.activity.step = 1;
      } else if (file[i].eventType === 'Ability') {
        params.activity.step = 2;
      } else if (file[i].eventType === 'Reinforcement') {
        params.activity.step = 3;
      } else if (file[i].eventType === 'Desire') {
        params.activity.step = 4;
      } else if (file[i].eventType === 'Knowledge') {
        params.activity.step = 5;
      }
      params.activity.description = file[i].description;
      if (file[i].completed === 'true') {
        params.activity.completedAt = new Date(file[i].start_date);
        params.activity.dueDate = new Date();
        params.activity.completed = true;
      } else {
        params.activity.completed = false;
        params.activity.completedAt = null;
        params.activity.dueDate = new Date(file[i].start_date);
      }

      if (activities[i - 1]) {
        Meteor.call('activities.update', params, (err, res) => {
          if (err) {
            props.enqueueSnackbar(err.reason, { variant: 'error' });
          } else {
            props.enqueueSnackbar(`Activity Updated Successfully.`, { variant: 'success' });
          }
        });
      }
      else {
        let step, completedAt, completed, dueDate;
        if (file[i].completed === 'true') {
          completedAt = new Date(file[i].start_date);
          dueDate = new Date();
          completed = true;
        } else {
          completedAt = null;
          dueDate = new Date(file[i].start_date);
          completed = false;
        }
        if (file[i].eventType === 'Awareness') {
          step = 1;
        } else if (file[i].eventType === 'Ability') {
          step = 2;
        } else if (file[i].eventType === 'Reinforcement') {
          step = 3;
        } else if (file[i].eventType === 'Desire') {
          step = 4;
        } else if (file[i].eventType === 'Knowledge') {
          step = 5;
        }
        params1 = {
          activity: {
            name: file[i].text,
            type: file[i].text[0].toLowerCase() + file[i].text.slice(1),
            description: file[i].description,
            projectId: project._id,
            // owner: file[i].owner,
            dueDate: dueDate,
            completedAt: completedAt,
            completed: completed,
            stakeHolders: [],
            step: step,
            time: 0,
            timeSchedule: null,
            stakeholdersFeedback: false,
            // _id: file[i].id,
          }
        }
        Meteor.call('activities.insert', params1, (err, res) => {
          if (err) {
            props.enqueueSnackbar(err.reason, { variant: 'error' });
          } else {
            props.enqueueSnackbar(`Activity Updated Successfully.`, { variant: 'success' });
          }
        });
      }
    }
    if (file[i].eventType === 'Project_Start' || file[i].eventType === 'Project_End') {

      if (file[i].eventType === 'Project_Start') {
        project.startingDate = new Date(file[i].start_date);
      } else {
        let currentActivity = activities[i - 1] ? activities[i - 1] : null;
        if (currentActivity !== null) {
          params1 = {
            activity: {
              _id: currentActivity._id,
            }
          }
          Meteor.call('activities.remove', params1, (err, res) => {
            if (err) {
              props.enqueueSnackbar(err.reason, { variant: 'error' });
            } else {
              props.enqueueSnackbar(`Activity Updated Successfully.`, { variant: 'success' });
            }
          });
        }
        project.endingDate = new Date(file[i].start_date);
      }
      let params = {
        project
      };
      Meteor.call('projects.update', params, (err, res) => {
        if (err) {
          props.enqueueSnackbar(err.reason, { variant: 'error' })
        } else {
          props.enqueueSnackbar(`Project Updated Successfully.`, { variant: 'success' })
        }
      });

    }
    if (file[i].eventType === 'Impact' || file[i].eventType === 'Benefit') {
      const len = file[i].id.length;
      const index = file[i].id[len - 1];
      if (file[i].eventType === 'Impact') {
        if (project.impacts[index]) {
          project.impacts[index].expectedDate = new Date(file[i].start_date);
          project.impacts[index].description = file[i].description;
          project.impacts[index].type = file[i].text.split(' ').pop();
        } else {
          project.impacts.push({
            expectedDate: new Date(file[i].start_date),
            type: '',
            level: '',
            type: file[i].text.split(' ').pop(),
            description: file[i].description,
            stakeholders: file[i].stakeholders,
          });
        }
      } else if (file[i].eventType === 'Benefit') {
        if (project.benefits[index]) {
          project.benefits[index].expectedDate = new Date(file[i].start_date);
          project.benefits[index].description = file[i].description;
        } else {
          project.benefits.push({
            expectedDate: new Date(file[i].start_date),
            description: file[i].description,
            stakeholders: file[i].stakeholders,
          });
        }
      }
      let params = {
        project
      };
      Meteor.call('projects.update', params, (err, res) => {
        if (err) {
          props.enqueueSnackbar(err.reason, { variant: 'error' })
        } else {
          props.enqueueSnackbar(`Project Updated Successfully.`, { variant: 'success' })
        }
      });
    }
  }
}

const handleImportData = (file, currentProject, activities, props) => {
  const type = file.name.split('.').pop();
  let data = {}, len;
  if (type === "xlsx" || type === "xls") {
    gantt.importFromExcel({
      server: "https://export.dhtmlx.com/gantt",
      data: file,
      callback: function (file) {
        gantt.clearAll();
        // updateProjectByImport(file, currentProject, activities, props);
        len = file.length;
        for (i = 0; i < len; i++)
          file[i].start_date = moment(file[i].start_date).format("DD-MM-YYYY");
        gantt.parse({ data: file });
      }
    });
  } else {
    gantt.importFromMSProject({
      data: file,
      callback: function (project) {
        if (project) {
          gantt.clearAll();
          if (project.config.duration_unit) {
            gantt.config.duration_unit = project.config.duration_unit;
          }
          data = { project }
        }
      }
    });
  }
};

const handleDownload = (exportType) => {
  switch (exportType) {
    case 0:
      gantt.exportToExcel({
        cellColors: true,
        columns: [
          { id: "text", header: "text", width: 30 },
          { id: "start_date", header: "start_date", width: 30, type: 'date' },
          { id: "color", header: "color", width: 30 },
          { id: "description", header: "description", width: 30 },
          { id: "eventType", header: "eventType", width: 30 },
          { id: "id", header: "id", width: 30 },
          { id: "owner", header: "owner", width: 30 },
          { id: "stakeholders", header: "stakeholders", width: 30 },
          { id: "completed", header: "completed", width: 30 }
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
  const { tasks, scaleText, setActivityId, setEdit, activities, isSuperAdmin, isAdmin, isChangeManager, isManager, project } = props;
  const obj = { project: undefined };

  const updateTaskByDrag = (savedActivities, updatedTask) => {
    const validActivity = savedActivities.find(item => item['_id'] === updatedTask['id']);
    if (!validActivity) return;
    let params = {};
    params.activity = validActivity;
    delete params.activity.personResponsible;
    if (updatedTask.completed === true) {
      params.activity['completedAt'] = updatedTask.start_date;
    } else {
      params.activity['dueDate'] = updatedTask.start_date;
    }
    params.activity['updatedAt'] = updatedTask.end_date;
    if (params.activity['stakeholdersFeedback'] === undefined) {
      params.activity['stakeholdersFeedback'] = false;
    }
    if (params.activity['timeSchedule'] === undefined) {
      params.activity['timeSchedule'] = null;
    }
    Meteor.call('activities.update', params, (err, res) => {
      if (err) {
        props.enqueueSnackbar(err.reason, { variant: 'error' })
      } else {
        props.enqueueSnackbar(`Activity Updated Successfully.`, { variant: 'success' })
      }
    });
  };

  const updateProjectByDrag = (savedTask, project) => {
    if (savedTask.eventType === 'Project_Start') {
      project.startingDate = savedTask.start_date;
    } else {
      project.endingDate = savedTask.start_date;
    }
    let params = {
      project
    };
    Meteor.call('projects.update', params, (err, res) => {
      if (err) {
        props.enqueueSnackbar(err.reason, { variant: 'error' })
      } else {
        props.enqueueSnackbar(`Project Updated Successfully.`, { variant: 'success' })
      }
    });
  }
  console.error('+++++++++superAmdin', isSuperAdmin);
  console.error('+++++++++isChangeManger', isChangeManager);
  console.error('++++++++++++isManager', isManager);
  console.error('++++++++++++isAdmin', isAdmin);
  const updateImpactBenefitByDrag = (savedTask, project) => {
    const index = savedTask.id[savedTask.id.length - 1];
    if (savedTask.eventType === 'Impact') {
      project.impacts[index].expectedDate = savedTask.start_date;
    } else {
      project.benefits[index].expectedDate = savedTask.start_date;
    }
    let params = {
      project
    };
    Meteor.call('projects.update', params, (err, res) => {
      if (err) {
        props.enqueueSnackbar(err.reason, { variant: 'error' })
      } else {
        props.enqueueSnackbar(`Project ${savedTask.eventType} Updated Successfully.`, { variant: 'success' })
      }
    });
  }

  Object.assign(gantt, obj);

  useEffect(() => {
    if (
      Roles.userIsInRole(Meteor.userId(), 'manager') ||
      Roles.userIsInRole(Meteor.userId(), 'activityOwner')
    ) {
      gantt.config.drag_resize = false;
      gantt.config.drag_move = false;
    }
    gantt.config.autofit = true;
    gantt.config.columns = [
      { name: "start_date", label: "Due Date", algin: "left", width: 100 },
      { name: "eventType", label: "Event type", align: "left", width: 100 },
      { name: "stakeholders", label: "👨‍💼👩‍💼", align: "left", width: 10 },
      { name: "owner", label: "Owner", align: "left", width: 190 },
    ];
    gantt.config.tooltip_timeout = 200;
    // Gantt Template Styling 
    gantt.templates.grid_header_class = (columnName, column) => "gantt-column-header";
    gantt.templates.grid_row_class = (start, end, task) => "grey-background";
    gantt.templates.task_class = (start, end, task) => {
      if (task.completed) return "completed-task";
      return "";
    }
    gantt.templates.scale_cell_class = date => "grey-background";
    gantt.templates.rightside_text = (start, end, task) => {
      const sizes = gantt.getTaskPosition(task, start, end);
      const textLength = 7 * task.text.length;
      if (sizes.width < textLength) {
        return task.text;
      }
    };
    gantt.templates.task_text = (start, end, task) => {
      const sizes = gantt.getTaskPosition(task, start, end);
      const textLength = 7 * task.text.length;
      if (sizes.width < textLength) {
        return '';
      } else {
        return task.text;
      }
    }
    // gantt.templates.rightside_text = (start, end, task) => task.type == gantt.config.types.milestone && task.eventType;
    gantt.templates.tooltip_text = (start, end, task) => {
      const { description } = task;
      if (description && description.length > 20)
        return description.slice(0, 20) + "...";
      return description;
    };


    // Events
    gantt.attachEvent("onTaskClick", function (id, e) {
      setActivityId(id);
      setEdit(true);
    });
    // FIXME: This is a temporary solution
    gantt.activities = activities;
    gantt.project = project;
    gantt.attachEvent("onTaskDrag", (id, e) => {
      setActivityId(null);
    });
    gantt.attachEvent("onAfterTaskDrag", (id, mode, e) => {
      //any custom logic here
      if (project === undefined) return;
      if ((isAdmin && template && (template.companyId === companyID)) || isSuperAdmin || isChangeManager ) {
        if (mode === 'move' && gantt.getTask(id).start_date !== savedTask.start_date) {
          savedTask = gantt.getTask(id);
          updateTaskByDrag(gantt.activities, savedTask);

          if (savedTask.eventType === 'Project_Start' || savedTask.eventType === 'Project_End') {
            updateProjectByDrag(savedTask, gantt.project);
          }

          if (savedTask.eventType === 'Impact' || savedTask.eventType === 'Benefit') {
            updateImpactBenefitByDrag(savedTask, gantt.project);
          }

        }
      }
    });

    gantt.init(ganttContainer);
    gantt.clearAll();
    gantt.parse(tasks);
  });

  useEffect(() => { gantt.parse(tasks) }, [tasks]);
  useEffect(() => {
    switch (scaleText) {
      case "quarter":
        gantt.config.scales = [
          {
            unit: "quarter", step: 1, format: date => {
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
          { unit: "day", step: 1, format: "%d %M" }
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
          { unit: "week", step: 1, format: weekScaleTemplate },
          { unit: "day", step: 1, format: "%j %D" }
        ];
        gantt.config.scale_height = 40;
        gantt.config.min_column_width = 50;
        break;
      case "month":
        gantt.config.scales = [
          { unit: "month", step: 1, format: "%F, %Y" },
          { unit: "week", step: 1, format: "Week #%W" }
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
      style={{ width: '100%', height: '82vh', marginTop: '30px' }}
    />
  )
};

export default withSnackbar(Gantt);
