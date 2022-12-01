import './App.css';
import { useDispatch, useSelector } from "react-redux";
import {
  requestUserPosts,
  USER_POSTS_FETCH_REQUESTED,
  LOGIN_REQUEST,
  LOGOUT,
  FILES_UPLOADING_START,
  CHANGE_USERNAME,
  USER_POSTS_FETCH_CANCEL,
} from './store/actions';

import { userPostsFetchRequest } from "./store/redux-toolkit/postsSlice";

function App() {
  const dispatch = useDispatch();

  // -------  logging sagas --------- //
  // const isLoginPending = useSelector((state) => state.user.isLoginPending);
  // const error = useSelector((state) => state.user.error);
  // const token = useSelector((state) => state.user.token);
  // const filesUploadingProgress = useSelector(state => state.app.filesUploadingProgress);

  const handleCancelTask = () => {
    dispatch({
      type: USER_POSTS_FETCH_CANCEL,
    })
  }

  const handleLoginClick = () => {
    dispatch({
      type: LOGIN_REQUEST,
      payload: {
        username: 'user1',
        password: 'user1password',
      },
    })
  }
  const handleLogoutClick = () => {
    dispatch({ type: LOGOUT })
  }

  const handleUsernameChange = (event) => {
    dispatch({
      type: CHANGE_USERNAME,
      payload: {
        username: event.target.value,
      },
    })
  }

  // -------  end logging sagas --------- //

  // const handleClick = () => {
  // смотрим как будут работать саги при нескольких подряд вызовах
  // dispatch({ type: USER_POSTS_FETCH_REQUESTED, payload: { userId: 1, actionId: 1 } });
  // dispatch({ type: USER_POSTS_FETCH_REQUESTED, payload: { userId: 1, actionId: 2 } });
  // dispatch({ type: USER_POSTS_FETCH_REQUESTED, payload: { userId: 1, actionId: 3 } });
  // dispatch({ type: USER_POSTS_FETCH_REQUESTED, payload: { userId: 1, actionId: 4 } });

  // setTimeout(() => {
  //   dispatch({ type: USER_POSTS_FETCH_REQUESTED, payload: { userId: 1, actionId: 5 } });
  // }, 1000)
  // }

  // saga-channel-buffers
  const handleClick = () => {
    try {
      for (let dispatchId = 1; dispatchId <= 4; dispatchId++) {
        // dispatch(requestUserPosts({ userId: 1, actionId: dispatchId }));
        // напишем с помощью redux-toolkit
        dispatch(userPostsFetchRequest({ userId: 1, actionId: dispatchId }));
        
      }
    } catch (error) {
      console.log('error', error.message);
    }
  }


  // channel канал
  const handleUploadClick = () => {
    dispatch({ type: FILES_UPLOADING_START });
  }


  return (
    <div className="app__container">
      {/* POSTS */}
      <button onClick={handleClick}>Get posts</button>

      {/* race-all */}
      <button onClick={handleCancelTask}>Cancel task</button>

      {/* AUTORIZATION */}
      <div className="app__login-container">
        <button onClick={handleLoginClick}>Log in</button>
        <button onClick={handleLogoutClick}>Log out</button>
        {/* {isLoginPending && <p>Logging in...</p>} */}
        {/* {error && <p>Error: {error}</p>}  */}
        {/* {token && <p>{token}</p>} */}
      </div>

      {/* channel канал */}
      {/* <div className="app__login-container">
        <button onClick={handleUploadClick}>Upload files</button>
        <p>Uploading progress {filesUploadingProgress}%</p>
      </div> */}


      {/* throttle/debounce */}
      <div className="app__login-container">
        <input
          type="text"
          placeholder="Username"
          onChange={handleUsernameChange}
        />
      </div>
    </div>
  );
}

export default App;
