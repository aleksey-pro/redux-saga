import { call, put, takeEvery, takeLatest, takeLeading, take, fork, cancel } from "redux-saga/effects";
import { getUserPosts } from "../api/posts";
import { USER_POSTS_FETCH_FAILED, USER_POSTS_FETCH_REQUESTED, USER_POSTS_FETCH_SUCCEEDED } from './actions';


function* fetchUserPosts(action) {
    try {
        const posts = yield call(getUserPosts, action.payload.userId)
        yield put({
            type: USER_POSTS_FETCH_SUCCEEDED,
            payload: {
                data: posts
            }
        })
        console.log(`posts: ${posts.length}; action id: ${action.payload.actionId}`);
    } catch (error) {
        yield put({
            type: USER_POSTS_FETCH_FAILED,
            payload: {
                message: error.message,
            },
        })
    }
}

function* userPostsFetchRequestedWatcherSaga() {
    // слушает все экшены типа USER_POSTS_FETCH_REQUESTED и применяет к нему обработчик fetchUserPosts
    // в аргументе могут быть канал, экшен, масиив экшенов, * - все экшены
    // не имеет контроля над тем, когда коллбек будет вызываться - просто каждый раз, когда пропустить
    // yield takeEvery(USER_POSTS_FETCH_REQUESTED, fetchUserPosts);

    // выполнит таску, которая пришла последней данного типа
    // yield takeLatest(USER_POSTS_FETCH_REQUESTED, fetchUserPosts);
    // выполнит таску, которая пришла первой данного типа
    // yield takeLeading(USER_POSTS_FETCH_REQUESTED, fetchUserPosts);

    // ----- TAKE -------
    // так как take - блокирующия и чтобы прослушать все действия данного типа - нужен цикл
    // while(true) {
    //     // позволяет вытащить action и дальше использовать
    //     // имеет контроля над тем, когда коллбек будет вызываться, когда пропустить/проигнорить
    //     yield take(USER_POSTS_FETCH_REQUESTED); // будет проигнорирован
    //     yield take(USER_POSTS_FETCH_REQUESTED); // будет проигнорирован
    //    const action = yield take(USER_POSTS_FETCH_REQUESTED); // вернет 3й экшен этого типа
    //    yield call(fetchUserPosts, action);
    //    // выполнен только 1й вызов. остальные заблочены, но если есть аснхронный dispatch - он не блочится - см с setTimeout
    // }

    // while(true) {
    //     const action = yield take(USER_POSTS_FETCH_REQUESTED);
    //     // fork - неболкирующий выозов позволит вернуться к ожиданию нового экшена
    //     // и мы НЕ доожидаемся когда будет fetchUserPosts выполнена
    //     yield fork(fetchUserPosts, action);
    // }

    // while(true) {
    //     // аналог takeLeading, также не касается асинхронных dispatch
    //     const action = yield take(USER_POSTS_FETCH_REQUESTED);
    //     yield call(fetchUserPosts, action);
    // }

    let task;
    while(true) {
        // аналог takeLatest, также не касается асинхронных dispatch
        const action = yield take(USER_POSTS_FETCH_REQUESTED);
        if (task) {
            yield cancel(task);
        }
        task = yield fork(fetchUserPosts, action);
    }
}

export function* takeSaga() {
    yield userPostsFetchRequestedWatcherSaga()
}


