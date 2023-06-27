/**
 * Contributions made by:
 * Sarah Flohr
 */

const initialState = {
  nodes: [],
  links: [],
};
const graphDataReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case "SET_GRAPHDATA":
      return action.payload;
    default:
      return state;
  }
};

export default graphDataReducer;
