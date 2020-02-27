import Grid from "@material-ui/core/Grid";
import React from "react";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import {impactTypes} from "../../../../impactTypes";
import MenuItem from "@material-ui/core/MenuItem";
import Typography from "@material-ui/core/Typography";
import SVGInline from "react-svg-inline";
import Dialog from "@material-ui/core/Dialog";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import {ListItemIcon, makeStyles} from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";

const useStyles = makeStyles(theme => ({
  dialog: {
    '@media (min-height: 700px)': {
      bottom: '240px !important'
    },
    '@media (max-height: 700px)': {
      bottom: '200px !important'
    }
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '33.33%',
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  svg: {
    position: 'absolute',
    marginTop: '-5px',
    marginLeft: '5px',
  },
  helperText: {
    textAlign: 'center',
    color: '#c8c8c8',
  },
  backdrop: {
    backgroundColor: 'transparent',
  },
  select: {
    height: '32px',
  },
  item: {
    display: 'none',
    height: '32px'
  },
}));


const SelectImpactType = (props) => {
  const {openSelect, type, handleSelectOpen, handleSelectClose, handleTypeChange, disabled} = props;
  const classes = useStyles();

  return (
    <Grid>
      <FormControl fullWidth={true}>
        <InputLabel htmlFor="demo-controlled-open-select"
                    required={true}>Impact type</InputLabel>
        <Select
          id="type"
          label="type"
          fullWidth={true}
          value={type}
          className={classes.select}
          open={openSelect}
          onOpen={handleSelectOpen}
          onClose={handleSelectClose}
          disabled={disabled}
        >
          {impactTypes.map(impactType => {
            return <MenuItem className={classes.item} value={impactType.type}>
              <Typography className={classes.secondaryHeading}>
                {impactType.type}
                <SVGInline
                  className={classes.svg}
                  width="30px"
                  height="30px"
                  svg={impactType.iconSVG}/>
              </Typography>
            </MenuItem>
          })}
          <Dialog open={openSelect} onClose={handleSelectClose} fullWidth maxWidth={'md'} className={classes.dialog}
                  BackdropProps={{classes: {root: classes.backdrop}}}>
            <List>
              <Grid container direction={"row"}>
                {impactTypes.map((impactType, index) => {
                  return <Grid item xs={3}>
                    <ListItem button key={index} onClick={() => handleTypeChange(impactType.type)}>
                      <Grid container direction={"column"} justify={"center"} alignItems={"center"}>
                        <Grid item xs={12}>
                          <ListItemIcon>
                            <SVGInline
                              width="100px"
                              height="100px"
                              svg={impactType.iconSVG}
                            />
                          </ListItemIcon>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography>
                            {impactType.type}
                          </Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography className={classes.helperText}>
                            {impactType.helperText}
                          </Typography>
                        </Grid>
                      </Grid>
                    </ListItem>
                  </Grid>
                })}
              </Grid>
            </List>
          </Dialog>
        </Select>
      </FormControl>
    </Grid>
  )
};

export default SelectImpactType;