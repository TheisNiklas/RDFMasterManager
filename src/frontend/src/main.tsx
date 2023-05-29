import React from "react";
import ReactDOM from "react-dom/client";
import PersistentDrawerRight from "./components/DrawerRight.js";
import { compose, createStore } from "redux";
import rootReducer from "./reducers/index.js";
import { Provider } from "react-redux";
import { devToolsEnhancer } from '@redux-devtools/extension';

const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(rootReducer, devToolsEnhancer() );

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistentDrawerRight />
    </Provider>
  </React.StrictMode>
);
