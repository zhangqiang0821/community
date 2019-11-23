// 社区首页
import React, { Component } from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'

import { createStore } from 'redux'
import _ from 'lodash'
import * as communityActions from '../../actions/communityActions';
import * as postActions from '../../actions/postActions';
// antd-mobile 组件
import { Tabs, Tag, Button, ListView, List, Flex, WhiteSpace, Icon } from 'antd-mobile';
import common from '../../utils/common'
import userHelper from '../../utils/userHelper'
import 'style/home.scss'

// 顶部蓝色标题栏
import AppHeader from '../../components/Menus/AppHeader'

// 添加组件 ：内容简介列表
import MsgListTest from '../../components/MsgList/Test'

// 添加 资讯内容标题栏组件
import TitlebarList from '../../components/TitlebarList'

//发帖按钮组件
import EditIcon from '../../components/editIcon'


const Item = List.Item  // Item


class CommunityList extends Component {

    constructor(props) {
        super(props);
    }

    state = {
        groupId: this.props.params.groupId,
        community: undefined,
        scrollTop: 0, //滚动距离
        isScroll: true, //是否滚动中
    }


    /**
     * 检测用户是否已经登录
     */
    checkUser(url) {
        _cxytj.recordUserBehavior('', 'addTopicBtn', '发表话题按钮'); //用户行为统计
        let userInfo = userHelper.getUserIdAndToken();
        // alert(JSON.stringify(userInfo));
        if (userInfo.userId && userInfo.token) {
            //存在用户信息
            common.openNewBrowserWithURL(url);
        } else {
            //跳转到登录页面
            userHelper.Login();
        }
    }

    onShowReact() {
        userHelper.getSymbol(() => {
            let userInfo = userHelper.getUserIdAndToken(); //获取用户信息 每次返回页面都应该重新去拿用户信息
            if (userInfo.userId != localStorage.getItem("g_userId") || userInfo.token != localStorage.getItem("g_userToken")) {
                //用户信息不一致
                if (localStorage.getItem("tabsCallback")) {
                    this.getPosts({ groupId: this.state.groupId, pageNo: 1 }); //刷新栏目
                } else {
                    if (upPostDates(false)) {
                        return; //禁止代码往下执行
                    }
                }
            }
        })
    }

    componentWillMount() {
    }

    componentDidMount() {
        //console.log("首页 组件渲染完成 已经出现在dom文档里");
        setTimeout(() => {
            setTimeout(() => {
                this.props.dispatch(communityActions.getMemberFollowAsync()); //延迟请求关注社区，优化加载速度
            }, 100);
            this.getPosts({ groupId: this.state.groupId });

            window.onShowReact = () => this.onShowReact()

        }, 100); //延迟请求数据，避免安卓无法实时拿到正确的用户数据
        window.addEventListener('scroll', this.handleScroll.bind(this));


    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll.bind(this));
    }

    handleScroll(e) {
        // console.log("页面滚动了已超出指定的位置:", document.body.scrollTop>this.refs.bannerImg.height);
        this.setState({
            tabsFixed: document.body.scrollTop > this.refs.bannerImg.height ? true : false,
            isScroll: true, //是否滚动中
        })
        setTimeout(() => this.setState({
            isScroll: false, //是否滚动中
        }), 1000); //延迟1秒更新加载状态
    }

    getNavigation(id) {
        for (let item of this.props.follows) {
            if (id) {
                if (item.groupId == id) {
                    return item;
                }
            }
        }
        return undefined
    }

    getPosts(data) {
        if (data) {
            this.props.dispatch(postActions.getPostsByGroupIdAsync(data));
        }

    }

    render() {

        /**
        * 暴露react组件给外部JS调用 start
        */

        window.dispatch = this.props.dispatch;

        /**
        * 暴露react组件给外部JS调用 end
        */

        const obj = this.props;

        let groupIds = this.props.params.groupId;
        let defaultGroupName = this.props.params.groupName; //地区名称

        const header = {
            left: {
                text: <Icon type="left" />,
                onClick: () => common.closeAppView(true)
            },
            center: {
                text: obj.params.groupName ? obj.params.groupName : '社区详情',
                onClick: () => false
            },
            right: {
                text: '',
                onClick: () => false
            }
        }



        /*if (this.getNavigation(this.state.groupId) == undefined) {
            console.log("有可能是正在加载，有可能是社区不存在(不是已关注社区)");
            return (
                <div>
                    <AppHeader {...header} />
                </div>
            )
        }*/

        return (
            <div>
                <AppHeader {...header} />
                <div className='appBody1'>
                    <WhiteSpace size="rem24" style={{ position: "relative", background: '#f1f1f1', zIndex: "1" }} /> {/*  上下间隔 */}


                    {/* 列表 */}

                    {
                        this.props.posts[this.state.groupId] && this.props.posts[this.state.groupId].length > 0 ?

                            <div className='tabody-body'>
                                <div className='tabody' style={{ position: "relative", zIndex: '1' }}>
                                    <TitlebarList
                                        postFetching={this.props.postFetching}
                                        groupId={this.state.groupId}
                                        getPosts={data => this.getPosts(data)}
                                        posts={this.props.posts[this.state.groupId]}
                                    />
                                </div>
                                <MsgListTest
                                    thisTag={this.state.groupId}
                                    getPosts={data => this.getPosts(data)}
                                    posts={this.props.posts[this.state.groupId]}
                                    noFirstPage={true}
                                    firstPage={false}
                                    postFetching={this.props.postFetching}
                                    groupId={this.state.groupId}
                                    isEnd={this.props.postsIsEnd[this.state.groupId] && this.props.postsIsEnd[this.state.groupId] == '1' ? true : false}
                                />
                            </div>
                            :
                            <div className='ft-center font-darkgray font-28'>
                                <WhiteSpace size="rem24" /> {/*  上下间隔 */}
                                <WhiteSpace size="rem24" /> {/*  上下间隔 */}
                                <WhiteSpace size="rem24" /> {/*  上下间隔 */}
                                {this.props.postFetching || this.getNavigation(this.state.groupId) == undefined ? '正在加载中...' : '暂无数据'}
                            </div>



                    }

                    {/* 列表 end */}

                </div>

                {/*   <WhiteSpace size="rem24" /> 右下角 ：编辑按钮 */}
                {this.getNavigation(this.state.groupId) == undefined ? '' :
                    <EditIcon onClick={() => this.checkUser('/IssueTopic/' + groupIds + '/' + defaultGroupName)} />
                }

            </div>
        )
    }
}

CommunityList.defaultProps = {
    follows: [],
    postFetching: true
}


function mapStateToProps(state) {
    return {
        follows: state.community.follows,
        navigation: state.community.navigation,
        posts: state.posts,
        postsIsEnd: state.postsIsEnd, //是否没有更多数据可加载
        postFetching: state.fetchStatus.postFetching || false
    }
}


//包装 component , 注入 dispatch 和 state 到其默认的 connect(select)(Home) 中；
export default connect(mapStateToProps)(CommunityList);