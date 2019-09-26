import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import {Link} from "react-router-dom";
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
    const [open, setOpen] = React.useState(false);
    let { title, entity } = props;

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

                    {/*entities comes from props i.e companies, projects etc*/}
                    {props.entities && props.entities.map((entity) => {
                        return <MenuItem key={entity._id} value={entity._id}>{entity.name}</MenuItem>
                    })
                    }
                    {/*<MenuItem value={10}>Ten</MenuItem>*/}
                    {/*<MenuItem value={20}>Twenty</MenuItem>*/}
                    {/*<MenuItem value={30}>Thirty</MenuItem>*/}
                </Select>
            </FormControl>
        </form>
    );
}