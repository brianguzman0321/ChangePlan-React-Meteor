import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import { withSnackbar } from 'notistack';

function DeleteStakeHolder(props) {
    const [open, setOpen] = React.useState(props.open || false);
    const {stakeholder, multiple} = props;

    const handleClickOpen = (e) => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const removeStakeHolder = () => {
        let params = {
            people: {
                _id: stakeholder._id,

            }
        };
        if(multiple){
            params.people._ids = stakeholder
        }
        Meteor.call('peoples.remove', params, (err, res) => {
            if(err){
                props.enqueueSnackbar(err.reason, {variant: 'error'})
            }
            else{
                props.enqueueSnackbar('Stakeholder Removed Successfully.', {variant: 'success'});
                setOpen(false)
            }

        })

    };

    return (
        <>
        {
            multiple ? <IconButton aria-label="delete" style={{color: 'white'}} onClick={handleClickOpen}>
                <DeleteIcon />
            </IconButton> : <IconButton aria-label="delete" onClick={handleClickOpen}>
                <DeleteIcon />
            </IconButton>
        }

        <Dialog open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            maxWidth="sm" fullWidth={true}
        >
            <DialogTitle id="alert-dialog-title">
                Delete Stakeholder
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    Are you sure? You are going to remove this stakeholder permanently. This action can't be reversed.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={removeStakeHolder} color="secondary">
                    Remove
                </Button>
            </DialogActions>
        </Dialog>
        </>
    );
}

export default withSnackbar(DeleteStakeHolder)