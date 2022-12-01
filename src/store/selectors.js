export const getUserPostsSelector = (state) => state.app.posts;
export const getUserPostsByQuerySelector = (state, query = '') => {
    const posts = state.posts.posts.filter((p) => p.title.includes(query) || p.body.includes(query));
    return posts;
}
