import React from "react";
import Grid from "@material-ui/core/Grid";
import InputLabel from "@material-ui/core/InputLabel";
import {ClickAwayListener, Dialog, ListSubheader, Select} from "@material-ui/core";
import MenuItem from "@material-ui/core/MenuItem";
import Typography from "@material-ui/core/Typography";
import SVGInline from "react-svg-inline";
import {data} from "../../../../activitiesContent";
import Tooltip from "@material-ui/core/Tooltip";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";

const SelectActivityType = (props) => {
  const {
    disabledManager, showSelect, handleShowSelect, activityType, customActivityIcon, handleClickAwayListener,
    activityCategories, changeActivityType, color, showInputEditActivity, handleShowEditActivity, gridClass, classes,
    customType, handleChangeTextField
  } = props;

  return (
    <Grid>
      <FormControl fullWidth disabled={disabledManager}>
        <InputLabel id="select-activity-type">Type*</InputLabel>
        <Select fullWidth value={0} id="select-activity-type" open={showSelect} onOpen={handleShowSelect}>
          <MenuItem value={0} style={{display: 'none'}}>
            <Typography className={classes.secondaryHeading}>
              {activityType.category && `${activityType.category}: ${activityType.buttonText}` || 'Choose Activity*'}
              {activityType.iconSVG ? <SVGInline
                style={{position: 'absolute', marginTop: -8}}
                width="35px"
                height="35px"
                fill={color}
                svg={activityType.iconSVG || customActivityIcon}
              /> : null}
            </Typography>
          </MenuItem>
          <Dialog open={showSelect} fullWidth
                  BackdropProps={{classes: {root: classes.backdrop}}}
                  PaperProps={{classes: {root: classes.dialogPaper}}}>
            <ClickAwayListener onClickAway={handleClickAwayListener}>
              <List>
                <Grid container direction={"row"} className={classes.selectTypes}>
                  {activityCategories.map((activityCategory, index) => {
                    return (<div>
                      {activityCategory !== 'Engagement' && <hr/>}
                      <ListSubheader disableSticky>{activityCategory.toUpperCase()}</ListSubheader>
                      <Grid container key={index} direction="row" className={classes.selectTypes}>
                        {data.filter(item => item.category === activityCategory).map((item, index) => {
                          return <Grid item key={index}
                                       style={{
                                         background: activityType.name === item.name ? '#dae0e5' : '',
                                         width: '20%'
                                       }}>
                            <ListItem value={item.buttonText} onClick={() => {
                              changeActivityType(item)
                            }}>
                              <Tooltip title={item.helpText} key={index} enterDelay={600}>
                                <Grid item={true} xs={12} classes={gridClass}>
                                  <SVGInline
                                    width="35px"
                                    height="35px"
                                    fill={color}
                                    svg={item.iconSVG}
                                  />
                                  <Typography className={classes.gridText}>
                                    {item.buttonText}
                                  </Typography>
                                </Grid>
                              </Tooltip>
                            </ListItem>
                          </Grid>
                        })}
                        {!showInputEditActivity && activityCategory === 'Other' &&
                        <Grid item onClick={handleShowEditActivity} style={{width: '20%'}}>
                          <ListItem value={activityType.buttonText}>
                            <Grid item={true} xs={12} classes={gridClass}
                                  style={{background: activityType.category === "Custom" ? '#dae0e5' : ''}}>
                              <SVGInline
                                width="35px"
                                height="35px"
                                fill={color}
                                svg={customActivityIcon}
                              />
                              <Typography className={classes.gridText}>
                                {(activityType.category !== "Custom") ? 'Custom' : activityType.buttonText}
                              </Typography>
                            </Grid>
                          </ListItem>
                        </Grid>}
                      </Grid>
                      <br/>
                    </div>)
                  })
                  }

                  {showInputEditActivity ?
                    <Grid container direction="row" justify="flex-start" alignItems="flex-start"
                          className={classes.selectTypes}>
                      <Grid item xs={1} style={{maxWidth: '5%'}}>
                        <SVGInline
                          width="35px"
                          height="35px"
                          fill={color}
                          svg={customActivityIcon}
                        />
                      </Grid>
                      <Grid item xs={11}>
                        <TextField
                          placeholder="Enter activity type"
                          fullWidth type="text"
                          value={activityType.category === "Custom" ? activityType.buttonText : customType}
                          onChange={(e) => handleChangeTextField(e)}
                          onKeyDown={(e) => {e.key === 'Enter' ? changeActivityType(e.target.value, true) : null}}/>
                      </Grid>
                    </Grid> : null}
                </Grid>
              </List>
            </ClickAwayListener>
          </Dialog>
        </Select>
      </FormControl>
    </Grid>
  )
};

export default SelectActivityType;