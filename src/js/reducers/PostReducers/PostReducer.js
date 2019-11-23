/**
 * 帖子
 */
import {
    GET_POST,
    PRAISE, //点赞
    DELETE_POST,// 删除
    IS_VOTE, //投票
} from "../../actions/actionsTypes"

export default function PostsReducer(state = {}, action) {
    switch (action.type) {
        case GET_POST:
            return action.data;
        case PRAISE:
            return Object.assign({}, state, {
                is_praise: action.data.ac_type == 4 ? "1" : "0",
                supports: action.data.ac_type == 4 ? ++state.supports : --state.supports
            })
        case DELETE_POST:
            return {}
        case IS_VOTE:
            let vote = Object.assign({}, state.vote, {
                hasVote: '1', //已经投票
            })
            vote.itemList.map(item => {
                if(item.voteId == action.data.voteId){
                    item.voteResult.cnt = (item.voteResult.cnt * 1) + 1
                }
            })
            return Object.assign({}, state, {
                vote: vote
            });
        default:
            return state
    }
}