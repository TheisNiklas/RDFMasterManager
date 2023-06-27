/**
 * Contributions made by:
 * Kai Joshua Martin
 */

const initialState: boolean = false;

const loadingReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case "SET_LOADING":
      return action.payload;
    default:
      return state;
  }
};

export default loadingReducer;