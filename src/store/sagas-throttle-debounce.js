import { take, fork, call, throttle, debounce, actionChannel, delay, cancel, takeLatest } from "redux-saga/effects";
import { CHANGE_USERNAME } from "./actions";
import { saveFriendlyName } from "../api/user";
import { buffers } from "redux-saga";

function* changeUserName(action) {
    console.log(action.payload.username);
    yield call(saveFriendlyName, action.payload.username);
}

// напишем саомостоятельно throttle

const throttle2 = (ms, pattern, task, ...args) =>
  fork(function* () {
    // sliding будет возвращать последний результат
    const throttleChannel = yield actionChannel(pattern, buffers.sliding(1));

    while (true) {
      const action = yield take(throttleChannel)
      yield fork(task, ...args, action)
      yield delay(ms)
    }
  })

// напишем саомостоятельно debounce
// схож на takeLatest

function* debounce2(ms, pattern, task, ...args){
    while(true) {
        let _task;
        const action = yield take(pattern);
        if(_task) {
            yield cancel(_task);
        }
        _task = yield fork(function* (){
            yield delay(ms);
            yield fork(task, ...args, action)
        })
    }
}

function* debounce3(ms, pattern, task, ...args){
    yield takeLatest(pattern, function*(action){
        yield delay(ms);
        yield fork(task, ...args, action);
    })
}

export function* sagaThrottleDebounce() {
    // while (true) {
    //     const action = yield take(CHANGE_USERNAME);
    //     yield fork(changeUserName, action);
    // }
    // в течение 2000 мс будет отправлен максимум один вызова на сервер 
    // при вводе данныз а input
    // похоже на автосохранение
    // yield throttle(200, CHANGE_USERNAME, changeUserName);
    // yield throttle2(200, CHANGE_USERNAME, changeUserName);
    // debounce будет ожидать когlа пользователь завершит ввод
    // и если по окончанию через 500 сек ничего не происходило - только тогда будет создано действие
    // yield debounce(500, CHANGE_USERNAME, changeUserName);
    // yield debounce2(500, CHANGE_USERNAME, changeUserName);
    yield debounce3(500, CHANGE_USERNAME, changeUserName);
}