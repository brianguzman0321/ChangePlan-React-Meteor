import React from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from "@material-ui/core/IconButton/IconButton";
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ShareProject from "./Models/ShareProject";

export default function SimpleMenu(props) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [modals, setModals] = React.useState({
        share: false,
        duplicate: false,
        delete: false
    });
    let { project } = props;
    const allowedValues = ['share'];

    const handleClick = event => {
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

    return (
        <div>
            <IconButton aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick} Style={{padding: 0}}>
                <MoreVertIcon />
            </IconButton>
            <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem onClick={handleClose.bind(null, 'share')}>Share</MenuItem>
                <MenuItem onClick={handleClose} disabled={true}>Edit</MenuItem>
                {/*<MenuItem onClick={handleClose}>Duplicate</MenuItem>*/}
                <MenuItem onClick={handleClose} disabled={true}>Delete</MenuItem>
            </Menu>
            <ShareProject open={modals.share} handleModalClose={handleModalClose} project={project}/>
        </div>
    );
}