import {makeStyles} from "@material-ui/core";
import React, {useState} from "react";
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import SaveChanges from "../../../Modals/SaveChanges";
import AddActivities from "../../../Activities/Modals/AddActivities";
import Grid from "@material-ui/core/Grid";
import {ListActivities} from "./ListActivities";

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
  },
  head: {
    background: 'red'
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
  selectButton: {
    color: '#3f51b5',
  },
  appBar: {
    position: 'relative',
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  buttonSelect: {
    padding: '0px',
    '&:hover': {
      backgroundColor: '#ffffff',
      borderColor: '#ffffff',
      boxShadow: 'none',
    },
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function SelectActivities(props) {
  let {
    activities, selectedActivities, handleClose, open, handleChange, company, projectId, isSuperAdmin, isAdmin,
    isChangeManager, isManager, project, template, templateId, match, isOneCreate, isOneImpact, impact
  } = props;
  const classes = useStyles();
  const [selActivities, setSelActivities] = React.useState(selectedActivities || []);
  const [showModalDialog, setShowModalDialog] = useState(false);
  const [edit, setEdit] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);

  const handleOpenModalDialog = () => {
    if (isUpdated) {
      setShowModalDialog(true);
    } else {
      handleClose();
    }
  };

  const closeModalDialog = () => {
    setShowModalDialog(false);
    setIsUpdated(false);
  };

  const updateValue = () => {
    setIsUpdated(true);
  };

  const updateActivities = () => {
    handleChange(selActivities);
    closeModalDialog(isUpdated);
    handleClose();
  };

  const selectActivities = (ids) => {
    setSelActivities(ids);
  };

  return (
    <div>

      <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
        <AppBar className={classes.appBar} color="default">
          <Toolbar>
            <Grid container direction={'row'} alignItems={'center'} justify={'space-between'}>
              <Grid item xs={2}>
                <Grid container direction={'row'} alignItems={'center'} justify={'flex-start'}>
                  <Grid item xs={1}>
                    <IconButton edge="start" color="inherit" onClick={isUpdated ? handleOpenModalDialog : handleClose}
                                aria-label="close">
                      <CloseIcon/>
                    </IconButton>
                  </Grid>
                  <Grid item xs={11}>
                    <Typography variant="h6" className={classes.title}>
                      Select Activities
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={8}>
                <Typography variant="h6" className={classes.title} style={{textAlign: 'center'}}>
                  Selected {selActivities && selActivities.length}
                </Typography>
              </Grid>
              <Grid item xs={2}>
                <Grid container direction={'row'} alignItems={"center"} justify={'flex-end'}>
                  <Grid item xs={10} style={{textAlign: 'right'}}>
                    <AddActivities
                      edit={edit}
                      list={isOneCreate}
                      isOpen={false}
                      project={project}
                      template={template}
                      activity={{}}
                      isImpact={true}
                      isOneImpact={isOneImpact}
                      newActivity={() => setEdit(false)}
                      type={templateId && 'template' || projectId && 'project'}
                      match={match}
                      isSuperAdmin={isSuperAdmin}
                      isAdmin={isAdmin}
                      isChangeManager={isChangeManager}
                      isManager={isManager}
                      isActivityDeliverer={false}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <Button autoFocus color="inherit" onClick={updateActivities}>
                      save
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>
        <ListActivities activities={activities} company={company}
                        selectActivities={selectActivities} classes={classes}
                        selectedActivities={selectedActivities} update={updateValue}/>
        <SaveChanges closeModalDialog={closeModalDialog}
                     handleClose={handleClose}
                     showModalDialog={showModalDialog}
                     handleSave={updateActivities}
        />
      </Dialog>
    </div>
  );
}