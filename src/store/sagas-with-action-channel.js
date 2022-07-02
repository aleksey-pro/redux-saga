// action-channel
// каналы позволяют общаться между сагами

import { USER_POSTS_FETCH_REQUESTED, USER_POSTS_FETCH_SUCCEEDED, USER_POSTS_FETCH_FAILED  } from './actions';
import { call, put, actionChannel, take } from "redux-saga/effects";
import { buffers } from "redux-saga";
import { getUserPosts } from "../api/posts";

function* fetchUserPosts(action) {
    try {
        const userPosts = yield call(getUserPosts, action.payload.userId);
        yield put({
            type: USER_POSTS_FETCH_SUCCEEDED,
            payload: {
                data: userPosts,
            }
        })
    } catch (e) {
        yield put({
            type: USER_POSTS_FETCH_FAILED,
            payload: {
                messsage: e.messsage,
            }
        }) 
    }
}  

// создаем канал
// создадим в App.js dispatch повторных экшенов

// он позолит вызвать каждый call дождаться выполнения предыдущего
// если сделать slow 3g - будет видно это
export function* userPostsFetchRequestedSaga() {
    // const requestChannel = yield actionChannel(USER_POST_FETCH_REQUESTED);
    // Есди мы применим buffers.none - выполнится только одна задача в экшене, дпугие отбросятся
    const requestChannel = yield actionChannel(USER_POSTS_FETCH_REQUESTED, buffers.none());

    while(true) {
        const action = yield take(requestChannel);
        console.log("🚀 ~ file: sagas-with-action-channel.js ~ line 45 ~ function*userPostsFetchRequestedSaga ~ action", action)
        yield call(fetchUserPosts, action); 
    }
}
