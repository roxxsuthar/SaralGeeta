import { compose, createStore, applyMiddleware } from 'redux';
import { persistStore } from 'redux-persist';
import { setAutoFreeze } from 'immer';
import { logger } from 'redux-logger';
import createSagaMiddleware from 'redux-saga';

import reducers from './reducers';
import sagas from './sagas';

setAutoFreeze(false);

const configureStore = () => {
  const middleware = [];
  const enhancers = [];

  const sagaMiddleware = createSagaMiddleware();
  middleware.push(sagaMiddleware);

  // Only add logger in development
  if (__DEV__) {
    middleware.push(logger);
  }

  enhancers.push(applyMiddleware(...middleware));

  // Use Reactotron's createEnhancer in development
  if (__DEV__ && console.tron && console.tron.createEnhancer) {
    enhancers.push(console.tron.createEnhancer());
  }

  const store = createStore(reducers, compose(...enhancers));
  const persistor = persistStore(store);
  sagaMiddleware.run(sagas);

  return { store, persistor };
};

export default configureStore;
