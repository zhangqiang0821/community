// 我的帖子首页
import React, { Component } from 'react'

// antd-mobile 组件
import { List, Badge, WhiteSpace, Toast, Modal } from 'antd-mobile'
import 'style/MyPost.scss'

import { connect } from 'react-redux'
import postService from '../../services/postService';
import common from '../../utils/common'
import userHelper from '../../utils/userHelper'



class MyPost extends Component {

    constructor(props) {
        super(props);

        this.state = {
            myPost: {
                isEnd: '0', //是否结束, 最后一页：“1”; 其它：“0”
                list: [], //帖子数组
                isLoading: false, //已加载
            },
            pageSize: 10, //每页加载的数量
        }
    }

    //点击我的帖子
    clickMyPost(url, index) {
        let myPost = this.state.myPost;
        this.setState({
            myPost: Object.assign({}, myPost, {
                list: myPost.list.map((item, i) => {
                    if (i === index) {
                        item.unread_comments = '0'; //string    未读评论数
                        item.unread_supports = '0'; //string	未读点赞数
                    }
                    return item; //设置未读数为0
                })
            })
        })
        common.openNewBrowserWithURL(url); //打开新窗口
    }

    //根据catid 返回对应的图标 1：违章热点/吐槽 2：资讯 3：违章详情 4:话题 5：问答 6：投票，7：社区资讯
    getIconImg(catid) {
        let icon = 'topic-icon.png';
        switch (catid) {
            case '4': icon = 'topic-icon.png'; break;
            case '5': icon = 'qa-icon.png'; break;
            case '6': icon = 'vote-icon.png'; break;
        }
        let img = <img src={'./images/' + icon} style={{ height: '0.3rem', width: 'auto' }} />
        return img;
    }

    /**
     * 加载数据
     * @param isAdd 追加数据 默认true
     */
    loadMore(isAdd = true) {
        if (this.refs.loadMore.innerHTML != '点击加载更多' && isAdd) {
            return false;
        }
        this.refs.loadMore.innerHTML = '加载中...';

        console.log("加载数据,目前已经加载的条数：", this.state.myPost.list.length, isAdd ? Math.ceil(this.state.myPost.list.length / this.state.pageSize) + 1 : 1);
        let postData = {
            pageNo: isAdd ? Math.ceil(this.state.myPost.list.length / this.state.pageSize) + 1 : 1, //页码
            pageSize: this.state.pageSize, //每页加载的数量
        }
        // return false;
        Toast.hide();
        Toast.loading("", 30, () => Toast.info("网络错误", 2));
        postService.myPost(postData).then(data => {
            Toast.hide();
            console.log("我的帖子：", data);
            if (data.code == 1000) {
                if (isAdd) {
                    let stateMyPost = this.state.myPost;
                    this.setState({
                        myPost: Object.assign({}, stateMyPost, {
                            isEnd: data.data.isEnd,
                            list: [...stateMyPost.list, ...data.data.list]
                        })
                    })
                } else {
                    //非加载更多数据（第一次请求数据）
                    this.setState({
                        myPost: Object.assign({}, data.data, { isLoading: true })
                    })
                }

            } else {
                if (data.code != '90015') {
                    Toast.info(data.msg, 2);
                }
            }
        }, () => {
            Toast.hide(); //隐藏Toast
            Toast.info("系统繁忙，请稍后再试");
        }).then(() => this.refs.loadMore.innerHTML = '点击加载更多');
    }

    //从详情页回到我的帖子时，更新指定的数据
    onShowReact() {
        //需要更新数据
        if (localStorage.getItem("upLoginState") && this.state.myPost.list.length === 0) {
            this.loadMore(false); //加载数据
            return; //用户登录状态发生变化后不再往下执行
        }
        if (localStorage.getItem("needToUpdateData")) {
            let needToUpdateData = JSON.parse(localStorage.getItem("needToUpdateData")); //转为JSON对象
            if (needToUpdateData.type === 'post') {
                Toast.hide(); //加载前 先关闭其他加载中的提示框 避免提示框一直存在的bug
                let postData = needToUpdateData.data;
                postService.getPostsInfo(postData).then(data => {

                    let stateMyPost = this.state.myPost; //原帖子列表相关数据
                    let myPostList = this.state.myPost.list; //原帖子列表数据
                    let newMyPostList = []; //新的列表数据
                    if (data.code == 1000) {
                        newMyPostList = myPostList.map(item => {
                            if (item.postsId == postData.postsId && item.groupId == postData.groupId) {
                                item.supports = data.data.supports; //点赞数
                                item.is_praise = data.data.is_praise; //是否已经点赞
                                item.comments = data.data.comments; //评论数
                                item.attends = data.data.attends; //投票人数
                            }
                            return item;
                        })
                    } else {
                        if (data.code == 91119) {
                            //帖子不存在或已删除！
                            newMyPostList = myPostList.filter(item => item.postsId !== postData.postsId || item.groupId !== postData.groupId);
                        }
                    }

                    //更新帖子列表数据
                    this.setState({
                        myPost: Object.assign({}, stateMyPost, {
                            list: newMyPostList
                        })
                    })
                }, () => {
                    //静默更新数据
                });
            }
        }
    }

    handleScroll(e) {
        // console.log("当前滚动距离", document.body.scrollTop, this.refs.listBox.clientHeight, this.refs.listBox.scrollHeight)
        if (this.state.myPost.list.length < this.state.pageSize) {
            return; //如果已加载的数量，不等于单次加载的数量，则不再去请求数据
        }
        if (document.body.scrollTop + this.refs.listBox.clientHeight + 100 > this.refs.listBox.scrollHeight) {
            console.log("到底了")
            this.loadMore(); //追加数据
        }
    }

    componentWillMount() {
        document.querySelector("title").innerHTML = "我的发帖";
    }

    componentDidMount() {
        window.addEventListener('scroll', this.handleScroll.bind(this)); //绑定页面滚动事件
        //请求数据
        setTimeout(() => {
            this.loadMore(false); //加载数据
        }, 250);
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll.bind(this));
    }


    render() {
        /**
        * 暴露react组件给外部JS调用 start
        */

        window.onShowReact = () => this.onShowReact(); //更新数据

        /**
        * 暴露react组件给外部JS调用 end
        */
        


        const Item = List.Item  // Item

        return (
            <div ref="listBox">
                {/* 列表 state */}
                {
                    this.state.myPost.list.map((item, i) =>
                        <div key={i} className='postList' onClick={() => this.clickMyPost(`/post/${item.groupId}/${item.postsId}/${item.catid}`, i)}>
                            <span style={{ position: 'absolute', top: '-16PX', left: '15PX', zIndex: 1 }}>{this.getIconImg(item.catid)}</span>
                            <List>
                                <Item data-seed="logId" className='postItem bor-B-gray'>
                                    <WhiteSpace size='xs' />

                                    <span className='font-32' dangerouslySetInnerHTML={{ __html: item.title ? item.title : item.content }}></span>

                                    <WhiteSpace size='md' />

                                    {
                                        item.catid == '6'
                                            ? <div className='font-24 font-darkgray'>参与人数：{item.attends ? item.attends : 0}
                                                <WhiteSpace size='md' /></div>
                                            : <span ></span>
                                    }

                                    <p className='font-24 font-lightgray'>

                                        <span className='float-left'>{item.addtime}</span>

                                        {
                                            item.catid == '6'
                                                ? <span className='float-right ft-right font-darkgray minW'>{item.attends ? item.attends : 0}投票</span>
                                                : ''
                                        }

                                        <span className='float-right ft-right font-darkgray minW'>{item.comments}{item.catid == '5' ? '回答' : '评论'}{item.unread_comments > 0 ? <i>{item.unread_comments > 99 ? '...' : item.unread_comments}</i> : ''}</span>

                                        <span className='float-right ft-right font-darkgray minW'>{item.supports}点赞{item.unread_supports > 0 ? <i>{item.unread_supports}</i> : ''}</span>

                                    </p>
                                    <WhiteSpace size='xs' className='float-clear' />

                                </Item>
                            </List>
                        </div>
                    )
                }
                {/* 列表 end */}

                {/* 加载更多 state */}
                {
                    this.state.myPost.isEnd == '1' ?
                        <div className="w-load-more-btn" style={{ padding: '0 0.15rem' }}>
                            {this.state.myPost.list.length > 9 ?
                                <img src='./images/list-end.png' style={{ width: '100%' }} />
                                : ''
                            }
                        </div>
                        : <div style={{ textAlign: "center" }}>
                            {this.state.myPost.list.length > 0 ?
                                <div ref='loadMore' className="w-load-more-btn" onClick={() => this.loadMore(true)}>点击加载更多</div>
                                : <img ref='loadMore' src='./images/no-post.png' style={this.state.myPost.isLoading ? { width: '33%', marginTop: '2.46rem' } : { display: 'none' }} />
                            }

                        </div>
                }
                {/* 加载更多 end */}
            </div>
        )
    }
}

MyPost.defaultProps = {

}

//包装 component , 注入 dispatch 和 state 到其默认的 connect(select)(Home) 中；
export default connect()(MyPost);