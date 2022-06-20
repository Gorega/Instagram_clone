import { configureStore } from '@reduxjs/toolkit'
import modalReducer from "./features/modalSlice";
import navigatorReducer from './features/navigatorListSlice';
import addPostReducer from "./features/addPostSlice";
import postLikesReducer from "./features/post/likeSlice";
import postCommentsReducer from "./features/post/commentSlice";
import savedReducer from "./features/savedSlice";
import PostReducer from "./features/post/index";
import userFollowersReducer from "./features/user/follower";
import userPostsReducer from "./features/user/posts";
import spinnerReducer from "./features/post/spinnerSlice";
import messengerReducer from "./features/messengerSlice";

export const store = configureStore({
  reducer: {
    modal:modalReducer,
    spinner:spinnerReducer,
    navigatorList:navigatorReducer,
    addPost:addPostReducer,
    post:PostReducer,
    postLikes:postLikesReducer,
    postComments:postCommentsReducer,
    saved:savedReducer,
    userFollowers:userFollowersReducer,
    userPosts:userPostsReducer,
    messenger:messengerReducer,
  },
  middleware: getDefaultMiddleware =>
  getDefaultMiddleware({
    serializableCheck: false,
  }),
})