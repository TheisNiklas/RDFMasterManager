import isDrawerOpenReducer from "./isDrawerOpen";
import { combineReducers } from "redux";

// root reducer to combine all reducers
const rootReducer = combineReducers({
  isDrawerOpen: isDrawerOpenReducer,
});

export default rootReducer;
