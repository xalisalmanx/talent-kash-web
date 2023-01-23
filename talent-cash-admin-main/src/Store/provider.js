//Redux
import { createStore, compose, applyMiddleware } from "redux";

//redux-thunk
import thunkMiddleware from "redux-thunk";

import rootReducer from "./index";

const composeEnhancer =
  typeof window === "object" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
    : compose;

const store = createStore(
  rootReducer,
  composeEnhancer(applyMiddleware(thunkMiddleware))
);

export default store;
