// Конфигурация store и reduсers при помощи reduxjs/toolkit

import { createSlice } from "@reduxjs/toolkit";

 const initialPostsState = {
    posts: null,
    albums: null,
    filesUploadingProgress: 0,
    isLoading: false,
}

const postsSlice = createSlice({
    name: 'posts',
    initialState: initialPostsState,
    reducers: {
        userPostsFetchRequest(state, action) {
            state.isLoading = true;
        },
        userPostsFetchSuccess(state, action) {
            console.log("🚀 ~ file: postsSlice.js ~ line 18 ~ userPostsFetchSuccess ~ action", action)
            // повзоляет не думать об иммутабельности!! прямо push
            state.posts = action.payload;
            state.isLoading = false;
        },
        userPostsFetchFailed(state, action) {
            state.isLoading = false;
        }
    },
});

// actions - создаются САМИ из редьюсера!!!!
export const { userPostsFetchRequest, userPostsFetchSuccess, userPostsFetchFailed } = postsSlice.actions;

export default postsSlice.reducer;