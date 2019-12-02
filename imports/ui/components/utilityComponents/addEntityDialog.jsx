import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { withSnackbar } from 'notistack';

function AddEntityDialog(props) {
    let { entity } = props;
    const [open, setOpen] = React.useState(false);
    const [name, setName] = React.useState('');

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setName('');
        setOpen(false);
    };
    const handleChange = (e) => {
        setName(e.target.value)
    };
    const createCompany = () => {
        let params = {
            company: {
                name
            }
        };
        Meteor.call('companies.insert', params, (err, res) =>{
            if(err){
                props.enqueueSnackbar(err.reason, {variant: 'error'});
            }
            else{
                setName('');
                setOpen(false);
                updateFilter('localCompanies', 'companyId', res);
                props.enqueueSnackbar("Company Created Successfully.", {variant: 'success'});
            }
        });

    };

    return (
        <div>
            <Button variant="outlined" color="primary" onClick={handleClickOpen}>
                Create New {entity}
            </Button>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title" maxWidth="md" fullWidth={true}>
                <DialogTitle id="form-dialog-title">Create {entity}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Enter New {entity} Name.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Company Name"
                        value={name}
                        onChange={handleChange}
                        required={true}
                        type="text"
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={createCompany} color="primary">
                        Add
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default withSnackbar(AddEntityDialog)