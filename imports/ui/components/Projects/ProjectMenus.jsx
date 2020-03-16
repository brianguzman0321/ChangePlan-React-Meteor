import React, {useEffect, useState} from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from "@material-ui/core/IconButton/IconButton";
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ShareProject from "./Models/ShareProject";
import DeleteProject from "./Models/DeleteProject";
import EditProject from "./Models/EditProject";
import DuplicateProject from "./Models/DuplicateProject";
import {changeManagersNames} from "../Timeline/utils";

export default function SimpleMenu(props) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [modals, setModals] = React.useState({
        edit: false,
        share: false,
        duplicate: false,
        delete: false
    });
    const [openDuplicateModal, setOpenDuplicateModal] = useState(false)
    let { project, company, activities, isManager, isChangeManager, isAdmin, isSuperAdmin, isActivityOwner, isActivityDeliverer } = props;
    const allowedValues = ['share', 'delete', 'edit', 'duplicate'];

    const handleClick = event => {
        event.stopPropagation();
        event.preventDefault();
        setAnchorEl(event.currentTarget);
    };

    const handleModalClose = obj => {
        setModals({modals, ...obj})
    };

    const handleClose = (value) => {
        if(allowedValues.includes(value)){
            let obj = {
                [value]: !modals[value]
            };
            setModals({modals, ...obj})
        }
        setAnchorEl(null);
    };

    const handleOpenDuplicateModal = () => {
        setOpenDuplicateModal(true)
    };

    const handleCloseDuplicateModal = () => {
        setOpenDuplicateModal(false);
        handleClose();
    };

    const isAdminOrChangeManager = (type) => {
        return !(isAdmin || isSuperAdmin || (type !== "delete" && isChangeManager));
    };

    return (
        <div>
            <IconButton aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick} style={{padding: 0}} onTouchEnd={e => e.preventDefault()}>
                <MoreVertIcon />
            </IconButton>
            <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem onClick={handleClose.bind(null, 'share')} disabled={isAdminOrChangeManager("share")}>Share</MenuItem>
                <MenuItem onClick={handleClose.bind(null, 'edit')} disabled={isAdminOrChangeManager("edit")}>Edit</MenuItem>
                <MenuItem onClick={handleOpenDuplicateModal} disabled={isAdminOrChangeManager("duplicate")}>Duplicate</MenuItem>
                <MenuItem onClick={handleClose.bind(null, 'delete')} disabled={isAdminOrChangeManager("delete")}>Delete</MenuItem>
            </Menu>
            <ShareProject open={modals.share} handleModalClose={handleModalClose} project={project}/>
            <DeleteProject open={modals.delete} handleModalClose={handleModalClose} project={project} activities={activities}/>
            <DuplicateProject open={openDuplicateModal}
                              handleClose={handleCloseDuplicateModal}
                              project={project}
                              company={company}/>
            <EditProject open={modals.edit} handleModalClose={handleModalClose} project={project}
                         isSuperAdmin={isSuperAdmin} isAdmin={isAdmin} isChangeManager={isChangeManager}
                         isManger={isManager} isActivityOwner={isActivityOwner} isActivityDeliverer={isActivityDeliverer}/>
        </div>
    );
}
