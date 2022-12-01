import { USER_POSTS_FETCH_REQUESTED, USER_POSTS_FETCH_SUCCEEDED, USER_POSTS_FETCH_FAILED  } from './actions';
// Исплользуем redux/toolkit actions
import { userPostsFetchRequest, userPostsFetchSuccess, userPostsFetchFailed } from './redux-toolkit/postsSlice';

// эффекты - набор инструкций с объектом что делать
import { takeEvery, takeLatest, call, put, all, take, select } from "redux-saga/effects";
import { getUserPostsSelector, getUserPostsByQuerySelector } from "./selectors";
import { getUserPosts } from "../api/posts";

// worker-сага = action-thunk
// call - эффект запускающий к-л функцию (1 арг - функция,2й арг - её аргумент), это блокирующий вызов
// те к послед операции не перейдет пока call не будет выполнен = await fetch = asyncFetch
// call создает очередь задач
function* fetchUserPosts(action) {
    try {
        // call = action creator
        const userPosts = yield call(getUserPosts, action.payload.userId);
        // сохраним userPosts в store 
        // put = dispatch внутри саг, неблокирующий вызов
        // const putResult = put({
        //     type: USER_POSTS_FETCH_SUCCEEDED,
        //     payload: {
        //         data: userPosts,
        //     }
        // });
        // Исплользуем redux/toolkit
        const putResult = put(userPostsFetchSuccess(userPosts));
        console.log("🚀 ~ file: sagas.js ~ line 22 ~ function*fetchUserPosts ~ putResult", putResult)
        // select  -  для извлечения даных из стора внутри саг
        // структура  - в rootReducer.js
        // const data = yield select(getUserPostsByQuerySelector, 'ab'); ?????? TODO ????
        // console.log("🚀 ~ file: sagas.js ~ line 14 ~ function*fetchUserPosts ~ data", data) 
        yield putResult;
    } catch (e) {
        console.log(e.message);
        // yield put({
        //     type: USER_POSTS_FETCH_FAILED,
        //     payload: {
        //         messsage: e.messsage,
        //     }
        // }) 
        // Исплользуем redux/toolkit
        yield put(userPostsFetchFailed({  messsage: e.messsage }));
    }
}  

// watcher-saga - прослушивает экшены определенного типа USER_POST_FETCH_REQUESTED и напавляет на worker-сагу fetchUserPosts
// здесь мы слушаем handleClick в app.js
// export function* userPostsFetchRequestedSaga() {
//     yield takeEvery(USER_POSTS_FETCH_REQUESTED, fetchUserPosts); // задачи стартуют практически одновременно
//     // если takeLatest - одна задача в опред промежуток времени
// }

// напишем с помощью redux-toolkit
export function* userPostsFetchRequestedSaga() {
    yield takeEvery('posts/userPostsFetchRequest', fetchUserPosts);
}

// eslint-disable-next-line require-yield
export function* someSaga() {
   console.log("Some saga");
} 

// позволяет авыполнить сразу несколько watcher-sagas
export function* rootSaga() {
    yield all([
        userPostsFetchRequestedSaga(),
        someSaga(),
    ])
}