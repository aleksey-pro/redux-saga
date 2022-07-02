// Описание саги сводится к кейсу  - возможность отменить вызов другим вызовом

import { take, call, put, fork, cancel, cancelled } from 'redux-saga/effects';
import * as userApi from '../api/user';

import {
  LOGIN_ERROR,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGOUT,
  STOP_LOGING_PENDING,
} from './actions';

export function* authorize(username, password) {
  try {
    const token = yield call(userApi.login, username, password);
    yield put({ type: LOGIN_SUCCESS, payload: { token } });
    yield call(userApi.saveToken, token);
    // return token for loginFlowBad;
  } catch (error) {
    yield put({ type: LOGIN_ERROR, payload: { error } });
  } finally { // нужен для отмены лодера при cancel-е
        if (yield cancelled()) {
            yield put({ type: STOP_LOGING_PENDING });
        }
   }
}



// 1) прослушиваем 2 dispatch экшена
// если в момент LOGIN_REQUEST будет вызван LOGOUT, то LOGOUT будет пропущен и будет завершено с LOGIN_SUCCESS
// так как call - эффект блокирующий обработку и в момент выполнения не реагирует на другие экшены
// => call меняем на fork, но fork не ждем заверешения выполнения authorize
// => переносим yield call(userApi.saveToken, token) в ф-цию authorize
// => loginFlow
export function* loginFlowBad() {
    while (true) {
        const { payload } = yield take(LOGIN_REQUEST);
        // если будет вызван любой другой экшен - в эту часть мы не попадаем
        const token = yield call(authorize, payload.username, payload.password); // меняем на fork

        if (token) {
            yield call(userApi.saveToken, token); // переносим в ф-цию authorize
            // до момента логаута сага находится здесь!
            yield take(LOGOUT);
            yield call(userApi.clearToken);
        }
    }
}

// так как fork не блокирует  - мы можем продолжать прослушивать LOGOUT и LOGIN_ERROR
// и когда приходит LOGOUT - отменяем задачу authorize
export function* loginFlow() {
  while (true) {
    const { payload } = yield take(LOGIN_REQUEST);
    const task = yield fork(authorize, payload.username, payload.password);
    // watching for two concurrent actions
    const action = yield take([LOGOUT, LOGIN_ERROR]);
    if (action.type === LOGOUT) yield cancel(task);
    yield call(userApi.clearToken);
  }
}

export function* loginFlowSaga() {
  yield loginFlow()
}