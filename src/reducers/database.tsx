/**
 * Contributions made by:
 * Niklas Theis
 */

import { Rdfcsa } from "../rdf/rdfcsa";
const initialState = new Rdfcsa([]);

/**
 * Set the database dependent on the rdfcsa.
 * @param state current database in store
 * @param action payload information
 * @returns modified database
 */
const databaseReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case "SET_DATABASE":
      return action.payload;
    default:
      return state;
  }
};

export default databaseReducer;
