import React, {useState} from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from "@material-ui/core/IconButton/IconButton";
import MoreVertIcon from '@material-ui/icons/MoreVert';
import DeleteTemplate from "./Modals/DeleteTemplate";
import EditTemplate from "./Modals/EditTemplate";
import DuplicateTemplate from "./Modals/DuplicateTemplate";
import CreateProjectModal from "./Modals/CreateProjectModal";

export default function SimpleMenu(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [modals, setModals] = React.useState({
    edit: false,
    duplicate: false,
    delete: false
  });
  const [openDuplicateModal, setOpenDuplicateModal] = useState(false);
  const [openCreateProject, setOpenCreateProject] = useState(false);
  let {template, company, isAdmin, isSuperAdmin} = props;
  const allowedValues = ['delete', 'edit', 'duplicate'];

  const handleClick = event => {
    event.stopPropagation();
    event.preventDefault();
    setAnchorEl(event.currentTarget);
  };

  const handleModalClose = obj => {
    setModals({modals, ...obj})
  };

  const handleClose = (value) => {
    if (allowedValues.includes(value)) {
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

  const handleOpenCreateProjectModal = () => {
    setOpenCreateProject(true)
  };

  const handleCloseCreatProjectModal = () => {
    setOpenCreateProject(false);
    handleClose();
  }

  const handleCloseDuplicateModal = () => {
    setOpenDuplicateModal(false);
    handleClose();
  };

  return (
    <div>
      <IconButton aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick} style={{padding: 0}}
                  onTouchEnd={e => e.preventDefault()}>
        <MoreVertIcon/>
      </IconButton>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleClose.bind(null, 'edit')}
                  disabled={!((isAdmin && template && (template.companyId === company._id)) || isSuperAdmin)}>Edit</MenuItem>
        <MenuItem onClick={handleOpenDuplicateModal}
                  disabled={!((isAdmin && template && (template.companyId === company._id)) || isSuperAdmin)}>Duplicate</MenuItem>
        <MenuItem onClick={handleClose.bind(null, 'delete')}
                  disabled={!((isAdmin && template && (template.companyId === company._id)) || isSuperAdmin)}>Delete</MenuItem>
        <MenuItem onClick={handleOpenCreateProjectModal}>Create new project from template</MenuItem>
      </Menu>
      <DeleteTemplate open={modals.delete} handleModalClose={handleModalClose} template={template}/>
      <DuplicateTemplate open={openDuplicateModal}
                         handleClose={handleCloseDuplicateModal}
                         template={template}
                         company={company}/>
      <EditTemplate open={modals.edit} handleModalClose={handleModalClose} template={template}/>
      <CreateProjectModal open={openCreateProject}
                          handleClose={handleCloseCreatProjectModal}
                          template={template}
                          company={company}/>
    </div>
  );
}
