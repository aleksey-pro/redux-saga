// все  каналы могут прнимать буфферы

// 5 видов буфферов
//  - none - без буффера, новые сообщения будут потеряны
// - фиксированнный -  что выше выше лимита будет идти в буфер
//  - expanding - начальный задан размер, что выше позволит ему расшираться
// - dropping - что выше выше лимита отсеивается
// - sliding - что выше лимита будет двигать окно лимита

import { USER_POSTS_FETCH_REQUESTED, USER_POSTS_FETCH_SUCCEEDED } from "./actions";
import { take, call, put, actionChannel } from 'redux-saga/effects';
import { buffers } from 'redux-saga';
import { getUserPosts } from "../api/posts";

function* fetchUserPosts(action) {
    console.log(`processing action: ${action.type}; dispatchId: ${action.payload.userId}`);
    const userPosts = yield call(getUserPosts, action.payload.id);

    yield put({
        type: USER_POSTS_FETCH_SUCCEEDED,
        payload: {
            data: {
                userPosts
            }
        }
    })
}

export function* userPostsFetchRequestedWatcherWithBufferSaga() {
    const requestChannel = yield actionChannel(
        USER_POSTS_FETCH_REQUESTED,
        // 1
        // нет буффера
        // 1е сообщение обработается, остальные не попадут в буффер и никакой обрабочик их не обработает (см консоль)
        // buffers.none()

        // 2 фиксированнный
        // лимит 2, по умочланию 10
        //  1е сообщение обработается, остальные сообщат о переполнении буффера
        buffers.fixed(2)

        // 3 

    ) 

    while(true) {
        const action = yield take(requestChannel);
        // важно чтобы было call - она держит в буффере место
        //  пока она волняется, другие задачи будут попадать в буффер
        // при fork сразу бы попали в буффер и отправились на выполнение
        yield call(fetchUserPosts, action);
    }
}