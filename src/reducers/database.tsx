//reducer to handle drawer open and close
import { Rdfcsa } from "../rdf/rdfcsa";
const initialState = new Rdfcsa([]);
const databaseReducer = (state = initialState, action: any) => {
    switch (action.type) {
      case "SET_DATABASE":
        return action.payload;
      default:
        return state;
    }
  };
  
  export default databaseReducer;