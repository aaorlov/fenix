import thunk from 'redux-thunk';
import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import createHistory from 'history/createBrowserHistory';
import { routerMiddleware, routerReducer } from 'react-router-redux';

import rootReducers from './reducers';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default () => {
  const history = createHistory();

  const combinedReducer = combineReducers({
    ...rootReducers,
    router: routerReducer
  });


  const store = createStore(
    combinedReducer,
    composeEnhancers(applyMiddleware(
      thunk,
      routerMiddleware(history)
    ))
  );

  return { store, history };
};
