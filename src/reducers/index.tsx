/**
 * Contributions made by:
 * Niklas Theis
 * Bjarne Küper
 * Sarah Flohr
 */

import isDrawerOpenReducer from "./isDrawerOpen";
import { combineReducers } from "redux";
import sortOptionsReducer from "./sortOptions";
import filterTripleReducer from "./filterTriples";
import currentDataReducer from "./currentData";
import databaseReducer from "./database";
import mainFrameReducer from "./mainFrame";
import graphDataReducer from "./graph";
import metaDataReducer from "./metaData";
import loadingReducer from "./loading";

// root reducer to combine all reducers
const rootReducer = combineReducers({
  isDrawerOpen: isDrawerOpenReducer,
  sortOptions: sortOptionsReducer,
  filterTriples: filterTripleReducer,
  currentData: currentDataReducer,
  database: databaseReducer,
  mainFrame: mainFrameReducer,
  graphData: graphDataReducer,
  metaData: metaDataReducer,
  loading: loadingReducer
});

export default rootReducer;
