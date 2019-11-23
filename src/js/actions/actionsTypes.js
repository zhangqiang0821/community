/*
* 这里定义所有的action类型
* */

/**
 * 网络相关
 */
export const NETWORK_ERROR = 'NETWORK_ERROR' //网络错误

/* 导航条、兴趣社区管理  */
export const GET_MENUS = 'GET_MENUS' //获取导航条列表
export const SET_MENUS = 'SET_MENUS' //修改导航条列表
export const NO_LIKE = 'NO_LIKE' //修改导航条列表
export const ADD_LIKE = 'ADD_LIKE' //添加导航条列表

/**
 * 社区相关
 */
export const GET_MEMBER_FOLLOW="GET_MEMBER_FOLLOW";//已关注的社区
export const GET_DEFAULT_FOLLOW="GET_DEFAULT_FOLLOW";//获取社区首页栏目


/**
 * 帖子相关
 */

export const CHANGE_FETCH_STATUS_POSTS="CHANGE_FETCH_STATUS_POSTS";//
export const GET_POSTS="GET_POSTS";//获取帖子列表
export const GET_POST="GET_POST";//获取帖子列
export const PRAISE = 'PRAISE'; //点赞
export const DELETE_POST_BY_ID = 'DELETE_POST_BY_ID'; //删除帖子
export const IS_VOTE = 'IS_VOTE'; //投票
export const REMOVE_POSTS_BY_GROUPID="REMOVE_POSTS_BY_GROUPID";//本地删除社区的帖子
export const DELETE_POSTS_LIST = 'DELETE_POSTS_LIST'; //删除所有帖子列表数据
export const DELETE_POST = 'DELETE_POST'; //删除帖子数据
export const UP_POST = 'UP_POST'; //更新帖子数据
export const DELETE_POSTS_1 = 'DELETE_POSTS_1'; //删除最后一条资讯
export const POSTS_IS_END = 'POSTS_IS_END'; //列表已经没有更多数据了

/**
 * 评论相关
 */
export const GET_COMMENTS="GET_COMMENTS";//获取评论列表
export const GET_REPLY="GET_REPLY";//评论的评论
export const CREATE_COMMENT = "CREATE_COMMENT"; //增加新评论
export const GET_COMMENTS_TOTAL="GET_COMMENTS_TOTAL";//获取评论列表
export const CREATE_REPLY = "CREATE_REPLY"; //添加评论的回复
export const DELETE_REPLY = "DELETE_REPLY"; //删除评论的回复
