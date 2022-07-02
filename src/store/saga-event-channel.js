// Event channel позволяет получать события из сторонних источников данных (вебсокеты и тп)

import { createEventProvider } from "../api/event-provider";
import { call, take } from 'redux-saga/effects';
import { eventChannel, END } from "redux-saga";


const createEventProviderChannel = (eventProvider) => {
    //eventChannel возвращает ф-цию, в которой происходит инициализация присоединения в стороннему источнику событий
    return eventChannel((emit) => {
        const valueHandler = (event) => {
            // приведет к тому что в try-catch блок перейдет к finally
            if(event.payload > 3) {
                emit(END);
                return;
            }
            emit(event.payload);
        }
        eventProvider.subscribe("value", valueHandler);
        return () => {
            eventProvider.unsubscribe("value", valueHandler);
            console.log("unsubscibed");
        }
    })
}

export function* eventChannelSaga() {
    const eventProvider = yield call(createEventProvider);
    const eventProviderChannel = yield call(
        createEventProviderChannel,
        eventProvider,
    )
    try {
        while(true) {
            const payload = yield take(eventProviderChannel);
            console.log("payload", payload)
        }
    } catch (error) {
        console.log("error", error)
    } finally {
        console.log("event channel terminated");
    }
}
