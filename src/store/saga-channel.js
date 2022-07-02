// 3 вида каналов - обычные, к-е позволяют буфферизовать экшены
// action-channels и event-channels - позволяют привязать сторонний источник данных
// channel канал - не привзяан к источникам данных, отправляем данные через put, данные буфферизуются - для общения между сагами


// channel канал
import { call, delay, fork, take, put } from 'redux-saga/effects';
import { channel } from "redux-saga";

function* handleChannelRequest(requestChannel) {
    while(true) {
        //  прослушиваем сообщения, к-е приходят в канал
        const payload = yield take(requestChannel);
        console.log('payload', payload);
        // останваливает поток на заданное число секунд
        yield delay(2000);
    } 
}

export function* channelSaga() {
    const requestChannel = yield call(channel);
    // хэндлер событий для канала
    yield fork(handleChannelRequest, requestChannel);
    // кидаем в канал сообщения - будут последовательно повляться в консоли
    yield put(requestChannel, { payload: 'hello' });
    yield put(requestChannel, { payload: 'hello' });
    yield put(requestChannel, { payload: 'hello' });
    yield put(requestChannel, { payload: 'hello' });
    yield put(requestChannel, { payload: 'hello' });
    yield put(requestChannel, { payload: 'hello' });
}


// одно из решений  - использование канала для отправки данных в стор с помощью коллбеков
// пример  - onProgress callback с сервера