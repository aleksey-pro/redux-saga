import { call, put, takeEvery, takeLatest, all, apply, delay } from 'redux-saga/effects';
import { USER_POSTS_FETCH_REQUESTED, USER_POSTS_FETCH_SUCCEEDED, USER_POSTS_FETCH_FAILED } from './actions';

const createPostService = (baseUrl) => {
	return {
		getUrl(userId) {
			return `${baseUrl}/users/${userId}/posts`;
		},
		getUserPosts(userId) {
			console.log('hello');
			return fetch(this.getUrl(userId)).then((response) => response.json());
		},
	};
};

const postService = createPostService('https://jsonplaceholder.typicode.com');

export function* fetchUserPosts(action) {
	yield delay(100);
	try {
		// const userPostsBad = yield call(
			// ОШИБКА!
			// здесь мы отправляем ф-цию отвязаную от контекста - this не будет контекстом ф-ции postService
			// postService.getUserPosts,
			// action.payload.userId
		// ); // => вызовем правильно
        
        const userPosts = yield apply(
            postService, postService.getUserPosts,
            [action.payload.userId]
        )

        // ИЛИ - НО У меня не работает???))
		// const userPosts = yield call(
		//   [postService, postService.getUserPosts],
		//   action.payload.userId
		// )
        // ИЛИ - НО У меня не работает???))
        // postService.getUserPosts
        //     .call(postService, action.payload.userId)
        //     .then((result) => {
        //         console.log('result', result)
        //     })
        // ИЛИ - НО У меня не работает???))
        // postService.getUserPosts
        // .apply(postService, [action.payload.userId])
        //     .then((result) => {
        //         console.log('result', result)
        //     })

		// ИЛИ as an object
		// const userPosts = yield call(
		//   {
		//     context: postService,
		//     fn: postService.getUserPosts,
		//   },
		//   action.payload.userId
		// )

		yield put({
			type: USER_POSTS_FETCH_SUCCEEDED,
			payload: {
				data: userPosts,
			},
		});
	} catch (e) {
		console.log('e', e);
		yield put({
			type: USER_POSTS_FETCH_FAILED,
			payload: { message: e.message },
		});
	}
}

export function* userPostsFetchRequestedCallApplyWatcherSaga() {
	yield takeEvery(USER_POSTS_FETCH_REQUESTED, fetchUserPosts);
}
