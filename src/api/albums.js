export const getUserAlbums = (userId) => {
    // пример при ошибке для несольких fork-саг
    throw new Error("getUserAlbums falled");
    // eslint-disable-next-line no-unreachable
    return fetch(
      `https://jsonplaceholder.typicode.com/users/${userId}/albums`
    ).then((response) => response.json())
}