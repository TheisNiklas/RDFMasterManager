/**
 * Contributions made by:
 * Niklas Theis
 */

//reducer to handle drawer open and close
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
