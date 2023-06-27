/**
 * Contributions made by:
 * Niklas Theis
 * Sarah Flohr
 */

const initialState: any[] = [];

const currentDataReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case "ADD_TRIPLE":
      return [...state, action.payload];
    case "REMOVE_TRIPLE":
      return state.filter((triple, index) => index !== action.payload);
    case "SET_CURRENTDATA":
      return action.payload;
    default:
      return state;
  }
};

export default currentDataReducer;
