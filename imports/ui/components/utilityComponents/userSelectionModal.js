import React, {useEffect} from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { withSnackbar } from 'notistack';

import IntegrationReactSelect from './AutoComplete'
import {Meteor} from "meteor/meteor";

function UserSelectionModal(props) {
    let { title } = props;
    const [open, setOpen] = React.useState(false);
    const [users, setUsers] = React.useState([]);

    const handleClickOpen = () => {
        setOpen(true);
    };

    function modalMessage(){
        if(Roles.userIsInRole(Meteor.userId(), 'superAdmin')){
            return 'Assign an existing user to this Project. To add new users, click on the the (+) Add button on the bottom right corner.'
        }
        else if(props.currentCompany && props.currentCompany.admins.includes(Meteor.userId())){
            return 'Assign an existing user to this Project. To add new users, click on the the (+) Add button on the bottom right corner.'
        }
        else if(props.currentProject && props.currentProject.changeManagers.includes(Meteor.userId())){
            return 'Assign an existing user to this Project. To add new users, click on the the (+) Add button on the bottom right corner.'
        }
    }

    const updateUsers = (value) => {
        setUsers(value)
    };

    const handleClose = () => {
        setUsers([]);
        setOpen(false);
    };

    const saveUsers = () => {
        if(users && users.length){
            const userIds = users.map(user =>  user.value);
            Meteor.call('users.updateList', {
                userIds, company: props.currentCompany,
                project: props.currentProject
            },(err, res) => {
                if(err){
                    props.enqueueSnackbar(err.reason, {variant: 'error'});
                }
                else{
                    props.enqueueSnackbar('New Users Added Successfully.', {variant: 'success'})
                }
                props.updateUsersList();
                setOpen(false);
            })
        }
        else{
            setOpen(false);
        }

    };

    useEffect(() => {
        setUsers([]);
        return () => {
        };
    }, []);

    return (
        <div>
            <Button variant="outlined" color="primary" onClick={handleClickOpen}>
                ASSIGN EXISTING USER TO {title}
            </Button>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title" maxWidth="md" fullWidth={true}>
                <DialogTitle id="form-dialog-title">Assign Users</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {modalMessage()}
                    </DialogContentText>
                    <IntegrationReactSelect updateUsers={updateUsers} data={props.options}/>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={saveUsers} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default withSnackbar(UserSelectionModal)