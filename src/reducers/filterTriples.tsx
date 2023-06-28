/**
 * Contributions made by:
 * Niklas Theis
 */

const initialState = [{ subject: "", predicate: "", object: "" }];

/**
 * Handle the Triple Filter Options.
 * @param state inital values for subject, predicate and object
 * @param action payload information
 * @returns modified state
 */
const filterTripleReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case "ADD_QUERYTRIPLE":
      return [...state, action.payload];
    case "REMOVE_QUERYTRIPLE":
      return state.filter((triple, index) => index !== action.payload);
    case "UPDATE_SUBJECT": {
      const { index, value } = action.payload;
      return state.map((triple, i) => {
        if (i === index) {
          return {
            ...triple,
            subject: value,
            predicate: triple.predicate,
            object: triple.object,
          };
        }
        return triple;
      });
    }

    case "UPDATE_PREDICATE": {
      const { index, value } = action.payload;
      return state.map((triple, i) => {
        if (i === index) {
          return {
            ...triple,
            subject: triple.subject,
            predicate: value,
            object: triple.object,
          };
        }
        return triple;
      });
    }
    case "UPDATE_OBJECT": {
      const { index, value } = action.payload;
      return state.map((triple, i) => {
        if (i === index) {
          return {
            ...triple,
            subject: triple.subject,
            predicate: triple.predicate,
            object: value,
          };
        }
        return triple;
      });
    }
    default:
      return state;
  }
};

export default filterTripleReducer;
