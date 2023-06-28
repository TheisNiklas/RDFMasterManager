/**
 * Contributions made by:
 * Kai Joshua Martin
 */

const initialState: boolean = false;

/**
 * Handle loading state.
 * Loading may be displayed when (huge) rdfcsa structures are build.
 * @param state current loading state
 * @param action payload information
 * @returns modified loading state
 */
const loadingReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case "SET_LOADING":
      return action.payload;
    default:
      return state;
  }
};

export default loadingReducer;
