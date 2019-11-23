/**
 * 帖子列表
 */
import {
    GET_POSTS,
    REMOVE_POSTS_BY_GROUPID,
    PRAISE, //点赞
    DELETE_POST_BY_ID, //删除帖子
    DELETE_POSTS_LIST, //删除所有帖子列表数据
    UP_POST, //更新帖子数据
    DELETE_POSTS_1, //删除最后一条资讯
} from "../../actions/actionsTypes"
import _ from 'lodash'

export default function PostsReducer(state = {}, action) {
    switch (action.type) {
        case GET_POSTS:
            if (action.pageNo === 1) {
                //如果是第一页，那么直接替换原有的内容
                // return { [action.groupId]:action.data }
                return Object.assign({}, state, { [action.groupId]: action.data });
            }
            return Object.assign({}, state, { [action.groupId]: state[action.groupId] ? [...state[action.groupId], ...action.data] : action.data });
        case PRAISE:
            return Object.assign({}, state, {
                '97': state[97] ? state[97].map(item => {
                    if (item.postsId == action.data.postsId) {
                        item.is_praise = action.data.ac_type == 4 ? "1" : "0",
                            item.supports = action.data.ac_type == 4 ? ++item.supports : --item.supports
                    }
                    return item;
                }) : undefined,
                '96': state[96] ? state[96].map(item => {
                    if (item.postsId == action.data.postsId) {
                        item.is_praise = action.data.ac_type == 4 ? "1" : "0",
                            item.supports = action.data.ac_type == 4 ? ++item.supports : --item.supports
                    }
                    return item;
                }) : undefined,
                [action.data.groupId]: state[action.data.groupId] ? state[action.data.groupId].map(item => {
                    if (item.postsId == action.data.postsId) {
                        item.is_praise = action.data.ac_type == 4 ? "1" : "0",
                            item.supports = action.data.ac_type == 4 ? ++item.supports : --item.supports
                    }
                    return item;
                }) : undefined
            });
        case DELETE_POST_BY_ID:
            // let newState2 = {};
            // for (let obj in state) {
            //     newState2[obj] = [];
            //     state[obj].map((item, i) => {
            //         if (item.postsId == action.data.postsId) {
            //             return item; //删除帖子
            //         }else{
            //             newState2[obj].push(item);
            //         }
            //     })
            // }
            // return newState2;
            return Object.assign({}, state, {
                '97': state[97] ? state[97].filter(item => item.postsId !== action.data.postsId) : [], //最新
                '96': state[96] ? state[96].filter(item => item.postsId !== action.data.postsId) : [], //问答
                [action.data.groupId]: state[action.data.groupId] ? state[action.data.groupId].filter(item => item.postsId !== action.data.postsId) : []
            }); //删除帖子
        case REMOVE_POSTS_BY_GROUPID:
            let newState3 = _.cloneDeep(state);
            newState3[action.groupId] = [];
            return newState3;
        case DELETE_POSTS_LIST:
            return {} //删除所有帖子列表数据
        case UP_POST:
            return Object.assign({}, state, {
                '97': state[97] ? state[97].map(item => { //最新
                    if (item.postsId == action.data.postsId) {
                        item.supports = action.data.supports; //点赞数
                        item.is_praise = action.data.is_praise; //是否已经点赞
                        item.comments = action.data.comments; //评论数
                        item.attends = action.data.attends; //投票人数
                    }
                    return item;
                }) : [],
                '96': state[96] ? state[96].map(item => { //问答
                    if (item.postsId == action.data.postsId) {
                        item.supports = action.data.supports; //点赞数
                        item.is_praise = action.data.is_praise; //是否已经点赞
                        item.comments = action.data.comments; //评论数
                        item.attends = action.data.attends; //投票人数
                    }
                    return item;
                }) : [],
                [action.data.groupId]: state[action.data.groupId] ? state[action.data.groupId].map(item => { //对应的社区
                    console.log(item.postsId, action.data.postsId);
                    if (item.postsId == action.data.postsId) {
                        item.supports = action.data.supports; //点赞数
                        item.is_praise = action.data.is_praise; //是否已经点赞
                        item.comments = action.data.comments; //评论数
                        item.attends = action.data.attends; //投票人数
                    }
                    return item;
                }) : []
            }); //更新帖子数据
        case DELETE_POSTS_1:
            //删除一条资讯 删除第五条以后的数据
            return Object.assign({}, state, {
                [action.groupId]: state[action.groupId] ? state[action.groupId].filter((item, i) => i < 2) : []
            });
        default:
            return state
    }
}