import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { makeStyles, useTheme } from '@material-ui/core/styles';

export default function UserSelectionModal() {
    const useStyles = makeStyles(theme => ({
        root: {
            flexGrow: 1,
            height: 250
        },
        input: {
            display: 'flex',
            padding: 0
        },
        valueContainer: {
            display: 'flex',
            flexWrap: 'wrap',
            flex: 1,
            alignItems: 'center',
            overflow: 'hidden'
        },
        noOptionsMessage: {
            padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`
        },
        singleValue: {
            fontSize: 16
        },
        placeholder: {
            position: 'absolute',
            left: 2,
            fontSize: 16
        },
        paper: {
            position: 'absolute',
            zIndex: 1,
            marginTop: theme.spacing(1),
            left: 0,
            right: 0
        }
    }));
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
        <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Add Users to Company
    </Button>
    <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Add Users</DialogTitle>
        <DialogContent>
        <DialogContentText>
        This Feature is meant to add existing application user to specific Company if you want to invite new Users then you should invite with right bottom add(+) button.
    </DialogContentText>
    <TextField
    autoFocus
    margin="dense"
    id="name"
    label="Email Address"
    type="email"
    fullWidth
    />
    </DialogContent>
    <DialogActions>
    <Button onClick={handleClose} color="primary">
        Cancel
        </Button>
        <Button onClick={handleClose} color="primary">
        Save
        </Button>
        </DialogActions>
        </Dialog>
        </div>
    );
}