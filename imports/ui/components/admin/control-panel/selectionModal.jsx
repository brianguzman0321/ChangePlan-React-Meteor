import React, {useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import {Typography} from "@material-ui/core";

const useStyles = makeStyles(theme => ({
    button: {
        display: 'block',
        marginTop: theme.spacing(2),
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
}));

export default function ControlledOpenSelect(props) {
    const classes = useStyles();
    const [age, setAge] = React.useState('');
    const [itemIndex, setIndex] = React.useState(props.index);
    const [open, setOpen] = React.useState(false);
    let { title, entity, index } = props;

    function handleChange(event) {
        setAge(event.target.value);
        updateFilter(props.localCollection, props.id, event.target.value);
    }

    function handleClose() {
        setOpen(false);
    }

    function handleOpen() {
        setOpen(true);
    }

    useEffect(() => {
        if(itemIndex !== props.index){
            updateFilter('localCompanies', 'companyId', '');
            updateFilter('localProjects', 'projectId', '');
            setIndex(props.index)
        }

        return () => {
            setAge('');
            updateFilter('localCompanies', 'companyId', '');
            updateFilter('localProjects', 'projectId', '');
        }

    }, [props.index]);

    return (
        <form autoComplete="off">
            <Typography variant="body2" component="p">
                Select {entity}
            </Typography>
            <FormControl className={classes.formControl} fullWidth>
                <InputLabel htmlFor="demo-controlled-open-select">{title}</InputLabel>
                <Select
                    open={open}
                    onClose={handleClose}
                    onOpen={handleOpen}
                    value={age}
                    onChange={handleChange}
                    inputProps={{
                        name: 'age',
                        id: 'demo-controlled-open-select',
                    }}
                >
                    {!props.entities || (props.entities && !props.entities.length) ?
                        <MenuItem value="">
                            <em>No {title}</em>
                        </MenuItem> : ''
                    }

                    {props.entities && props.entities.map((entity) => {
                        return <MenuItem key={entity._id} value={entity._id}>{entity.name}</MenuItem>
                    })
                    }
                </Select>
            </FormControl>
        </form>
    );
}