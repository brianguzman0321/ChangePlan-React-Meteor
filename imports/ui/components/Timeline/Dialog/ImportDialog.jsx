import React, { useState } from 'react';

import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import CloseIcon from '@material-ui/icons/Close';

import { styles, useStyles } from '../utils';
import { importTypes } from '../constants';

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

export default function ImportDialog ({
  isImporting,
  setIsImporting,
  handleImportData,
}) {
  const classes = useStyles();
  const [disabled, setDisabled] = useState(true);
  const [file, setFile] = useState(null);
  const [importType, setImportType] = useState(0);

  return (
    <Dialog
      open={isImporting}
      className={classes.exportDialog}
      onClose={() => setIsImporting(false)}
      aria-labelledby="customized-dialog-title"
      maxWidth="sm"
      fullWidth={true}
    >
      <DialogTitle
        id="customized-dialog-title"
        onClose={() => {
          setIsImporting(false);
          setDisabled(true);
        }}
      >
        <Typography variant="h5">Import events</Typography>
      </DialogTitle>
      <Tabs
        value={importType}
        onChange={(e, newValue) => setImportType(newValue)}
        indicatorColor="primary"
        textColor="primary"
        variant="fullWidth"
        aria-label="action tabs example"
      >
        <Tab label="MS Project" id="action-tab-0"/>
        <Tab label="Excel" id="action-tab-1"/>
      </Tabs>
      <DialogContent dividers>
        <Typography gutterBottom>Instruction text!</Typography>
        <p>{importType === 0 ? 'Download sample.mpp' : 'Download sample.xls'}</p>
        <br />
        {file && file.name && <Typography gutterBottom>{file.name}</Typography>}
      </DialogContent>
      <DialogActions>
        <Button
          color="primary"
          variant="outlined"
          onClick={() => document.getElementById("import-button").click()}
        >
          CHOOSE FILE
          <input
            type="file"
            accept={importTypes}
            onChange={() => {
              let fileData = document.getElementById("import-button").files[0];
              if(fileData && fileData.name) {
                setFile(fileData);
                setDisabled(false);
              }
            }}
            style={{ display: "none" }}
            id="import-button"
          />
        </Button>
        <Button
          color="primary"
          disabled={disabled}
          variant="contained"
          onClick={() => {if(file) handleImportData(file)}}
        >
          UPLOAD
        </Button>
      </DialogActions>
    </Dialog>
  );
}