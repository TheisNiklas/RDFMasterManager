/**
 * Contributions made by:
 * Bjarne Küper
 */

const initialState: any[] = [];

/**
 * Set the current Meta Data.
 * @param state current meta data
 * @param action payload information
 * @returns modified meta data
 */
const metaDataReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case "SET_METADATA":
      return action.payload;
    default:
      return state;
  }
};

export default metaDataReducer;
