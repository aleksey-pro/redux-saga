
import { channel } from 'redux-saga';
import { call, fork, take, put } from 'redux-saga/effects';
import { FILES_UPLOADING_PROGRESS, FILES_UPLOADING_START } from './actions';
import { uploadFile } from "../api/mock-file-uploader";

const handleProgressChannel = (fileUploadingChannel, progressValue) => {
    fileUploadingChannel.put({
        value: progressValue,
    })
}

function* handleFilesUploadingEvents(fileUploadingChannel,) {
    while(true) {
        const payload = yield take(fileUploadingChannel);
        yield put({
            type: FILES_UPLOADING_PROGRESS,
            payload: {
                value: payload.value,
            }
        })
    }
}

export function* handleFilesUploading() {
    const fileUploadingChannel = yield call(channel);
    yield fork(handleFilesUploadingEvents, fileUploadingChannel);

    while(true) {
        yield take(FILES_UPLOADING_START);

        yield fork(uploadFile, {
            url: "https://server",
            files: ["file1", "file2"],
            onProgress: (progressValue) => {
                handleProgressChannel(fileUploadingChannel, progressValue);
            }
        })
    }
}