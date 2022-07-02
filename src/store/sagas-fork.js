// БЛОКИРУЮЩИЕ / НЕБЛОКИРУЮЩИЕ САГИ fork/spawn
import { call, fork, spawn, put } from "redux-saga/effects";
import { getUserAlbums } from '../api/albums';
import { getUserPosts } from '../api/posts';
import { SAVE_USER_ALBUMS, SAVE_USER_POSTS } from "./actions";

function* fetchAlbums(userId) {
    const data = yield call(getUserAlbums, userId);
    yield put({
        type: SAVE_USER_ALBUMS,
        payload: {
            data
        }
    })
}

function* fetchPosts(userId) {
    const data = yield call(getUserPosts, userId);
    yield put({
        type: SAVE_USER_POSTS,
        payload: {
            data
        }
    })
}

// ждем когда завершатся все fork-нутые саги и только тогда ч-л делаем
// но если хоть в одной из задач будет ошибка - все остальное будет отменено
// выкинем ошибку в getUserAlbums => в консоли будут видны отмененные задачи
// есть fork attached - привязан к родиельскому форку - тут это fetchPosts
function* fetchUserData1(userId) {
    yield fork(fetchAlbums, userId);
    yield fork(fetchPosts, userId);
    console.log("done");
}


// есть fork dettached === SPAWN fork
// в нем если будет где-то ошибка - она не поднимется, пропустит саги с ошибкой. и console.log выполнится
function* fetchUserData(userId) {
    yield spawn(fetchAlbums, userId);
    yield spawn(fetchPosts, userId);
    console.log("done");
}

export function* forkSaga() {
    const userId = 1;
    yield call(fetchUserData, userId);
}

// ПРОВЕРИТЬ - ПЕРЗАГРУЗИТЬ СТРАНИЦУ