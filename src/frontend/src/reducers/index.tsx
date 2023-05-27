import isDrawerOpenReducer from "./isDrawerOpen";
import { combineReducers } from "redux";
import sortOptionsReducer from "./sortOptions";

// root reducer to combine all reducers
const rootReducer = combineReducers({
  isDrawerOpen: isDrawerOpenReducer,
  sortOptions: sortOptionsReducer
});

export default rootReducer;
