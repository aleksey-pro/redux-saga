import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createStore, compose, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import { rootReducer } from './store/reducers/rootReducer';
import createSagaMiddleware from 'redux-saga';
import { rootSaga } from "./store/sagas";
import { userPostsFetchRequestedSaga } from "./store/sagas-with-action-channel";
import { loginFlowSaga } from "./store/sagas-login-flow";
import { forkSaga } from "./store/sagas-fork";
import { takeSaga } from "./store/sagas-takes";
import { eventChannelSaga } from "./store/saga-event-channel";
import { channelSaga } from "./store/saga-channel";
import { handleFilesUploading } from './store/saga-channel-upload';
import { userPostsFetchRequestedWatcherWithBufferSaga } from "./store/sagas-action-channel-with-buffer";
import * as postsApi from "./api/posts";
import { sagaThrottleDebounce } from "./store/sagas-throttle-debounce";

// носновной спопоб импортирования сервисов, функций - использование middleware (напр. имер redux-thunk)
// в redux-saga для такого импорта есть context, который расширяет middleaware
// использование  - в sagas-with-action-channel.js
const sagaMiddleware = createSagaMiddleware({
  context: {
    postsApi,
  }
});

const store = createStore(rootReducer, compose(
  applyMiddleware(sagaMiddleware),
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
));

// sagaMiddleware.run(rootSaga);
// sagaMiddleware.run(userPostsFetchRequestedSaga); // with channels
// sagaMiddleware.run(loginFlowSaga); // loginFlow 
// sagaMiddleware.run(forkSaga); // forkSaga flow
// sagaMiddleware.run(takeSaga); // takeSaga flow
// sagaMiddleware.run(eventChannelSaga); // eventChannel flow
// sagaMiddleware.run(channelSaga); // channel flow
// sagaMiddleware.run(handleFilesUploading); // uploading, channel flow example
// sagaMiddleware.run(userPostsFetchRequestedWatcherWithBufferSaga); // buffering flow
sagaMiddleware.run(sagaThrottleDebounce); // ThrottleDebounce flow

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();



// Блокирующий вызов - сага ожидат заверешения yield для совершения нового вызова - call
// Неблокирующий - fork
// + документация по каждому эффекту