import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

import { configureStore } from "@reduxjs/toolkit";

// import { createStore, compose, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import createSagaMiddleware from 'redux-saga';

// import { rootReducer } from './store/reducers/rootReducer';
// импортируем reducer и state через reduxjs/toolkit
import postsSliceReducer from "./store/redux-toolkit/postsSlice";

// Импортируем сагу
import { rootSaga } from "./store/sagas"; 
// import { userPostsFetchRequestedSaga } from "./store/sagas-with-action-channel";
// import { loginFlowSaga } from "./store/sagas-login-flow";
// import { forkSaga } from "./store/sagas-fork";
// import { takeSaga } from "./store/sagas-takes";
// import { eventChannelSaga } from "./store/saga-event-channel";
// import { channelSaga } from "./store/saga-channel";
// import { handleFilesUploading } from './store/saga-channel-upload';
// import { userPostsFetchRequestedWatcherWithBufferSaga } from "./store/sagas-action-channel-with-buffer";
// import { sagaThrottleDebounce } from "./store/sagas-throttle-debounce";
// import { userPostsFetchRequestedCallApplyWatcherSaga } from "./store/sagas-call-apply2";
// import { raceExampleWatcherSaga, allExampleWatcherSaga } from "./store/saga-race-all";

import * as postsApi from "./api/posts";


// основной способ импортирования сервисов, функций - использование middleware (напр. имер redux-thunk)
// в redux-saga для такого импорта есть context, который расширяет middleaware
// использование  - в sagas-with-action-channel.js
const sagaMiddleware = createSagaMiddleware({
  context: {
    postsApi,
  }
});

// Конфигурируем классическим способом
// const store = createStore(rootReducer, compose(
//   applyMiddleware(sagaMiddleware),
//   window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
// ));


// Конфигурируем с помощью reduxjs/toolkit
const store1 = configureStore({
  reducer: {
    posts: postsSliceReducer,
  },
  middleware: [sagaMiddleware], // автомат вызовет applyMiddleware
  // devTools: window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(), // автоматом встроится???
});

sagaMiddleware.run(rootSaga);
// sagaMiddleware.run(userPostsFetchRequestedSaga); // with channels
// sagaMiddleware.run(loginFlowSaga); // loginFlow 
// sagaMiddleware.run(forkSaga); // forkSaga flow
// sagaMiddleware.run(takeSaga); // takeSaga flow
// sagaMiddleware.run(eventChannelSaga); // eventChannel flow
// sagaMiddleware.run(channelSaga); // channel flow
// sagaMiddleware.run(handleFilesUploading); // uploading, channel flow example
// sagaMiddleware.run(userPostsFetchRequestedWatcherWithBufferSaga); // buffering flow
// sagaMiddleware.run(sagaThrottleDebounce); // ThrottleDebounce flow
// sagaMiddleware.run(userPostsFetchRequestedCallApplyWatcherSaga); //call/apply flow
// sagaMiddleware.run(allExampleWatcherSaga); // /race/all flow


const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <Provider store={store1}>
    <App />
  </Provider>
);