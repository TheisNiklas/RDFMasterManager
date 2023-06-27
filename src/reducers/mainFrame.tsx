/**
 * Contributions made by:
 * Sarah Flohr
 */

const mainFrameReducer = (state = "text", action: any) => {
  switch (action.type) {
    case "SET_MAINFRAME":
      return action.payload;
    default:
      return state;
  }
};

export default mainFrameReducer;