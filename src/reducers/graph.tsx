/**
 * Contributions made by:
 * Sarah Flohr
 */

const initialState = {
  nodes: [],
  links: [],
};

/**
 * Set the graph data.
 * Triples need to be compiled to graph readable data.
 * @param state current graph data
 * @param action payload information
 * @returns modiefied graph data
 */
const graphDataReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case "SET_GRAPHDATA":
      return action.payload;
    default:
      return state;
  }
};

export default graphDataReducer;
