import {
  legacy_createStore as createStore,
  applyMiddleware,
  compose,
  combineReducers,
} from "redux";
import thunk from "redux-thunk";
import sessionReducer from "./session";
import courseReducer from "./course";
import scalesReducer from "./scale";
import reviewReducer from "./review";
import chordsReducer from "./chord";
import progressionsReducer from "./progression";
import keysReducer from "./key";
import songReducer from "./song";
import testReducer from "./test";


const rootReducer = combineReducers({
  session: sessionReducer,
  course: courseReducer,
  scale: scalesReducer,
  review: reviewReducer,
  chord: chordsReducer,
  progression: progressionsReducer,
  key: keysReducer,
  song: songReducer,
  test: testReducer
});

let enhancer;
if (import.meta.env.MODE === "production") {
  enhancer = applyMiddleware(thunk);
} else {
  const logger = (await import("redux-logger")).default;
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}

const configureStore = (preloadedState) => {
  return createStore(rootReducer, preloadedState, enhancer);
};

export default configureStore;
