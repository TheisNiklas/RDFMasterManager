import isDrawerOpenReducer from "./isDrawerOpen";
import { combineReducers } from "redux";
import sortOptionsReducer from "./sortOptions";
import filterTripleReducer from "./filterTriples";
import currentDataReducer from "./currentData";
import databaseReducer from "./database";

// root reducer to combine all reducers
const rootReducer = combineReducers({
  isDrawerOpen: isDrawerOpenReducer,
  sortOptions: sortOptionsReducer,
  filterTriples: filterTripleReducer,
  currentData: currentDataReducer,
  database: databaseReducer
});

export default rootReducer;
