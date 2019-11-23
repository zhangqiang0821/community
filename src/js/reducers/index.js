import { combineReducers } from 'redux'
import menus from './menus'
import memberFollow from './memberFollow'
import communityReducers from './communityReducers';
import postsReducer from './PostReducers/PostsReducer';
import postsIsEnd from './PostReducers/postsIsEnd';
import PostReducer from './PostReducers/PostReducer';
import commentReducer from './commentReducer';
import replyReducer from './replyReducer';
import fetchStatusReducer from './fetchStatusReducer';

const rootReducer = combineReducers({
	menus,
	memberFollow,
	community: communityReducers,
	posts: postsReducer,
	postsIsEnd: postsIsEnd,
	post: PostReducer,
	comment: commentReducer,
	replys: replyReducer,
	fetchStatus:fetchStatusReducer
});

export default rootReducer;