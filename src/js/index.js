import 'babel-polyfill'
import React from 'react'
//import 'react-fastclick'  // 这个需要放到react下方才行
import { render } from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import { hashHistory } from 'react-router'
import Root from './containers/Root'
import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import rootReducer from './reducers/index.js'
import networkError from './components/networkError'
import auth from './utils/auth'; //单点登录授权

// let { pathname, host } = window.location
// let localStorageKey = 'W_' + host + '_' + pathname.replace(/\/*/g, ''); //缓存的key
// let localStorageValue = JSON.parse(localStorage.getItem(localStorageKey)) || undefined; //缓存的value

let store = createStore(
  rootReducer,
  // localStorageValue,
  applyMiddleware(
    thunkMiddleware // 允许我们 dispatch() 函数
  )
);

let unsubscribe = store.subscribe(() => {
  let state = store.getState();
  // localStorage.setItem(localStorageKey, JSON.stringify(state)) //实时保存缓存数据
  if (state.fetchStatus.networkError) {
    networkError()
  }
})

const RedBox = require('redbox-react').default;
const rootEl = document.getElementById('app');
//const store = configureStore(window.__INITIAL_STATE__)
//store.runSaga(rootSage)

try {
  const some = document.querySelector("body");
  some.onchange = function () {
    const some2 = document.querySelector(".Home");
    if (some2) {
      this.style.backgroundColor = "#fff";
    } else {
      this.style.backgroundColro = "#f1f1f1";
    }
  }


  render(
    <AppContainer>
      <Root store={store} history={hashHistory} />
    </AppContainer>,
    rootEl
  )
} catch (e) {
  render(
    <RedBox error={e}>
      <AppContainer>
        <Root store={store} history={hashHistory} />
      </AppContainer>
    </RedBox>,
    rootEl
  )
}

if (module.hot) {
  /**
   * Warning from React Router, caused by react-hot-loader.
   * The warning can be safely ignored, so filter it from the console.
   * Otherwise you'll see it every time something changes.
   * See https://github.com/gaearon/react-hot-loader/issues/298
   */
  const orgError = console.error; // eslint-disable-line no-console
  console.error = (message) => { // eslint-disable-line no-console
    if (message && message.indexOf('You cannot change <Router routes>;') === -1) {
      // Log the error as normally
      orgError.apply(console, [message]);
    }
  };
  module.hot.accept('./containers/Root', () => {
    // If you use Webpack 2 in ES modules mode, you can
    // use <App /> here rather than require() a <NextApp />.
    const NextApp = require('./containers/Root').default;
    try {
      render(
        <AppContainer>
          <NextApp store={store} history={hashHistory} />
        </AppContainer>,
        rootEl
      )
    } catch (e) {
      render(
        <RedBox error={e}>
          <AppContainer>
            <NextApp store={store} history={hashHistory} />
          </AppContainer>
        </RedBox>,
        rootEl
      )
    }
  });
}
