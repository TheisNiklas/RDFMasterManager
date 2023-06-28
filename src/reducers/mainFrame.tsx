/**
 * Contributions made by:
 * Sarah Flohr
 */

/**
 * Set the data visualization - text or graph.
 * @param state current visualization type
 * @param action payload information
 * @returns modiefied visualization type
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
