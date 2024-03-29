/**
 * Contributions made by:
 * Kai Joshua Martin
 * Karl Neitmann
 * Niklas Theis
 */

import { Box, FormControl, InputLabel, MenuItem, Select, styled } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { setMainFrame } from "../actions";

const DropDownBox = styled(Box)(({ theme }) => ({
  position: "absolute",
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  height: "100%",
  float: "right",
  right: theme.spacing(8),
  "& .MuiSvgIcon-root": {
    color: "white",
  },
}));

/**
 * Check if the device is a mobile device.
 * Set the screen max and min screen width for a mobile device.
 * @returns boolean if device is mobile or else
 */
function isMobileDevice() {
  if (window.screen.width < 1200 && window.screen.width >= 320) {
    return true;
  } else {
    return false;
  }
}

//Dropdown for the different visualisation options
const DropDownForm = styled(FormControl)(({ theme }) => ({
  minWidth: 100,
}));

const DropDownMenue = () => {
  const dispatch = useDispatch();

  const handleDropDownChange = (value: any) => {
    dispatch(setMainFrame(value));
  };

  return (
    <DropDownBox>
      <DropDownForm variant="standard">
        {!isMobileDevice() && (
          <InputLabel variant="standard" id="format_chooser_label" style={{ color: "white" }}>
            Visualization
          </InputLabel>
        )}
        <Select
          defaultValue={"text"}
          style={{
            color: "white",
          }}
          inputProps={{
            name: "mainFrame",
          }}
          onChange={(e) => handleDropDownChange(e.target.value)}
        >
          <MenuItem value={"text"}>Text</MenuItem>
          <MenuItem value={"2d"}>2D</MenuItem>
          <MenuItem value={"3d"}>3D</MenuItem>
        </Select>
      </DropDownForm>
    </DropDownBox>
  );
};

export default DropDownMenue;
