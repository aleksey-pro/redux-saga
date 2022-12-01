// комбинаторы эффектов, предназначениие для параллельного запуска саг
import { call, put, all, delay, race, take } from 'redux-saga/effects';
import {
	USER_POSTS_FETCH_REQUESTED,
	USER_POSTS_FETCH_SUCCEEDED,
	USER_POSTS_FETCH_FAILED,
	USER_POSTS_FETCH_CANCEL,
	SAVE_USER_ALBUMS,
	SAVE_USER_POSTS,
} from './actions';
import { getUserPosts } from '../api/posts';
import { getUserAlbums } from '../api/albums'

export function* fetchUserPosts(action) {
	console.log('🚀 ~ file: saga-race-all.js ~ line 8 ~ function*fetchUserPosts ~ action', action);
	delay(1000);
	// const userPosts = yield call(getUserPosts, action.payload.userId); 
	const userPosts = yield call(getUserPosts, 1);
	yield put({
		type: USER_POSTS_FETCH_SUCCEEDED,
		payload: {
			data: userPosts,
		},
	});
	return userPosts;
}

//  race - завершается когда хотя бы 1 из саг выполняется
// используеются например, мы хотим ограничить время запроса, отменить другие другие саги по к-л событию
export function* raceExampleWatcherSaga() {
	const action = take(USER_POSTS_FETCH_REQUESTED);
	console.log('🚀 ~ file: saga-race-all.js ~ line 24 ~ function*raceExampleWatcherSaga ~ action', action);
	// const [ userPosts, userPostsCanceled ] = yield race([
	// 	fetchUserPosts(action),
	// 	//  если этот экшен появится - он отменит fetchUserPosts
	// 	// тк если take произойдет раньше - остальные будут отменены автоматически
	// 	take(USER_POSTS_FETCH_CANCEL),
	// ]);

    const { userPosts, userPostsCanceled } = yield race({
		userPosts: fetchUserPosts(action),
		userPostsCanceled: take(USER_POSTS_FETCH_CANCEL),
    });
	// result
	console.log('🚀 ~ file: saga-race-all.js ~ line 30 ~ function*raceExampleWatcherSaga ~ userPostsCanceled', userPostsCanceled);
	console.log('🚀 ~ file: saga-race-all.js ~ line 30 ~ function*raceExampleWatcherSaga ~ userPosts', userPosts);
}


// all - ожидает выполнения всех переданных в него саг


function* fetchAlbums(userId) {
    const data = yield call(getUserAlbums, userId)
    yield put({
      type: SAVE_USER_ALBUMS,
      payload: { data },
    })
    return data
  }
  function* fetchPosts(userId) {
    const data = yield call(getUserPosts, userId)
    yield put({
      type: SAVE_USER_POSTS,
      payload: { data },
    })
    return data
  }

export function* allExampleWatcherSaga() {
    const action = take(USER_POSTS_FETCH_REQUESTED);

    // илм массив как для race
    const { userPosts, userAlbums } = yield all({
        userPosts: fetchPosts(action.payload.userId),
        userAlbums: fetchAlbums(action.payload.userId),
    });
    console.log("🚀 ~ file: saga-race-all.js ~ line 77 ~ function*allExampleWatcherSaga ~ userAlbums", userAlbums)
    console.log("🚀 ~ file: saga-race-all.js ~ line 77 ~ function*allExampleWatcherSaga ~ userPosts", userPosts)
    

}

