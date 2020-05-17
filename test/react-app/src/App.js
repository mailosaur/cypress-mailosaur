/* eslint-disable no-underscore-dangle */
import React from 'react';
import { Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';
import { storeManager } from '@data-provider/core';
import './App.css';

const store = createStore(
  combineReducers({
    dataProviders: storeManager.reducer,
  }),
  window && window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

storeManager.setStore(store, 'dataProviders');

function App() {
  return (
    <Provider store={store}>
      <div className="App">
      </div>
    </Provider>
  );
}

export default App;
