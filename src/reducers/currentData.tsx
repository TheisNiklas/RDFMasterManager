/**
 * Contributions made by:
 * Niklas Theis
 * Sarah Flohr
 */

const initialState: any[] = [];

/**
 * Set the current data dependetn on the current Triples.
 * @param state current data store
 * @param action payload information
 * @returns modified current data store
 */
const currentDataReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case "SET_CURRENTDATA":
      return action.payload;
    default:
      return state;
  }
};

export default currentDataReducer;
