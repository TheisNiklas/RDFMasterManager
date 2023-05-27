//reducer to handle changes in the sort-form
const initialState = {
  sortElement: 'sortSubject',
  sortOrder: 'ascending',
  visualLimit: 0,
};

const sortOptionsReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case "SET_SORT_ELEMENT":
      return {
        ...state,
        sortElement: action.payload,
      };
    case "SET_SORT_ORDER":
      return {
        ...state,
        sortOrder: action.payload,
      };
    case "SET_VISUAL_LIMIT":
      return {
        ...state,
        visualLimit: action.payload,
      };
    default:
      return state;
  }
};

export default sortOptionsReducer;