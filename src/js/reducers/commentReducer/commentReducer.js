/**
 * 评论列表
 */
import {
    GET_COMMENTS,
    GET_REPLY,
    CREATE_COMMENT, //增加新评论
    CREATE_REPLY, //添加评论的回复
    DELETE_POST,// 删除
    DELETE_REPLY, // 删除回复
} from "../../actions/actionsTypes"

import _ from 'lodash'

export default function PostsReducer(state = [], action) {


    switch (action.type) {
        case GET_COMMENTS:
            return action.data;
        case CREATE_COMMENT:
            return [action.data, ...state];
        case CREATE_REPLY:

            let newState = state.map(item => {
                if (item.id == action.data.com_id) {
                    item.replyList.push(action.data); //追加评论的回复
                    console.log("追加了评论")
                }
                console.log('比较数据：', item.id, action.data.com_id)
                return item;
            })
            console.log(state, action.data, '---------', newState)
            return newState
        case DELETE_POST:
            return []
        case DELETE_REPLY:
            let newReplyState = []
            console.log("state-", state, action);
            var newList = _.clone(state);

            for (let i = 0; i < newList.length; i++) {
                let item = newList[i];
                if (item.id == action.data.com_id) {
                    let replyList = [];
                    for (let j = item.replyList.length - 1; j >= 0; j--) {
                        let reply = item.replyList[j];
                        if (action.data.reply_id == reply.id) {
                            _.pull(item.replyList, reply)
                        }
                    }
                }

            }
            return newList
        default:
            return state
    }
}