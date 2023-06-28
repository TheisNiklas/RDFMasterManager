/**
 * Contributions made by:
 * Sarah Flohr
 */

/**
 * Monitor if Drawer is open or closed
 * @param state current drawer status. if closed, status is false.
 * @param action payload information
 * @returns updated state
 */
const isDrawerOpenReducer = (state = false, action: any) => {
  switch (action.type) {
    case "IS_OPEN":
      return !state;
    case "IS_CLOSED":
      return state;
    default:
      return state;
  }
};

export default isDrawerOpenReducer;
