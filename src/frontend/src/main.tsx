import React from "react";
import ReactDOM from "react-dom/client";
import PersistentDrawerRight from "./components/DrawerRight.js";
import { createStore } from "redux";
import rootReducer from "./reducers/index.js";
import { Provider } from "react-redux";

const store = createStore(rootReducer);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistentDrawerRight />
    </Provider>
  </React.StrictMode>
);
