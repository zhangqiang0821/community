// 社区首页
import React, { Component } from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import { createStore } from 'redux'
import _ from 'lodash'

//样式
import 'style/home.scss'

// antd-mobile 组件
import { Tabs, Tag, Button, ListView, List, Flex, WhiteSpace, Toast } from 'antd-mobile';

// 添加组件 ：内容简介列表
import MsgListTest from '../components/MsgList/Test'

// 添加 资讯内容标题栏组件
import TitlebarList from '../components/TitlebarList'

//发帖按钮组件
import EditIcon from '../components/editIcon'

// 顶部tab 和点击事件
const TabPane = Tabs.TabPane;
const Item = List.Item;

//actions
import * as communityActions from '../actions/communityActions';
import * as postActions from '../actions/postActions';
import * as menus from '../actions/menus'

//常用工具类
import common from '../utils/common'
import userHelper from '../utils/userHelper'


/**
 * App 重新进入社区时，更新数据，并判断是否需要禁止重新读取列表数据
 * @param removeItem 删除指定key本地存储的值
 */
window.upPostDates = function (removeItem = true) {
    //需要更新数据
    if (localStorage.getItem("needToUpdateData")) {
        let needToUpdateData = JSON.parse(localStorage.getItem("needToUpdateData")); //转为JSON对象
        if (needToUpdateData.type === 'post') {
            window.dispatch(postActions.upPostDates(needToUpdateData.data)); //更新指定的帖子数据
        }
        if (removeItem) {
            localStorage.removeItem("needToUpdateData"); //删除指定key本地存储的值
        }
        return true; //已更新指定数据
    }

    //不需要更新数据
    if (localStorage.getItem("noNeedToUpdateData")) {
        if (removeItem) {
            localStorage.removeItem("noNeedToUpdateData"); //删除指定key本地存储的值
        }
        return true; //不需要更新数据
    }
    return false;
}


let timeId = 0;
let tagSelected = 0; //问答选中的选项
let delBannerH = common.isCXYApp() ? common.isAndroid() ? 24 : 20 : 0; //如果是APP则减少头部高度  安卓：24PX IOS：20PX

class Home extends Component {

    constructor(props) {
        super(props);

        this.state = {
            tagSelected: 0,//0选中第一个，1选择2
            tabsCallbacks: [], //点击tab去请求数据的纪录
            firstPage: [true, false, false, false, false], //是否设置当前列表（五个列表）的数据请求为第一页 ‘兼容数据切换时，页码的状态还是之前的页码’
            thisTag: '0', //当前选中的tag
            isClickHeaderBtn: false, //避免重复点击
            scrollTop: 0, //滚动距离
            isScroll: true, //是否滚动中
            num: 0, //滑动次数
            y: 0, //滑动开始时的Y坐标
            endY: 0, //滑动结束时的Y坐标

            //广告图 如果缓存存在，则优先使用缓存 缓存不存在则使用默认配置
            ad: localStorage.getItem('communityAd') ? JSON.parse(localStorage.getItem('communityAd')) : {
                targetUrl: '',
                url: './images/home/banner2.png'
            }
        }

    }

    componentWillMount() {
        document.querySelector("title").innerHTML = "易友社区";
        document.body.scrollTop = 0; //设为0，避免直接去请求数据

        this.getAd(); //获取广告图
    }

    componentDidMount() {
        window.homeScroll = e => this.handleScroll(e)
        window.addEventListener('scroll', window.homeScroll);
        setTimeout(() => {
            userHelper.getSymbol(() => {
                let groupId = sessionStorage.getItem("home_groupId") || '97'
                //请求数据
                this.props.dispatch(communityActions.getDefaultFollowAsync());
                this.props.dispatch(communityActions.getMemberFollowAsync());
                this.props.dispatch(postActions.removePostsByGroupId(groupId));
                this.tabsCallback(groupId);
                window.onShowReact = () => this.onShowReact();
            })
        }, 100) //延迟100毫秒，避免环境还没有初始化好
    }

    componentWillUnmount() {
        console.log("首页页面离开了", this.props)
        sessionStorage.setItem("homeProps", this.props) //保存数据到缓存中
        window.removeEventListener('scroll', window.homeScroll);
    }

    getAd() {
        this.props.dispatch(communityActions.getAdAsync(
            res => {
                if (res.code == '1000') {
                    this.setState({
                        ad: res.data
                    });

                    localStorage.setItem("communityAd", JSON.stringify(res.data)); //保存广告图信息
                }
            }
        ));
    }

    handleScroll(e) {
        let { tabsFixed, isScroll } = this.state
        // console.log("页面滚动了已超出指定的位置:", document.body.scrollTop , this.refs.bannerImg.height);
        try {
            if (this.state.tabsFixed && document.body.scrollTop < this.refs.bannerImg.height) {
                //还原
                this.setState({
                    tabsFixed: false,
                    isScroll: true, //是否滚动中
                })
                if (document.body.scrollTop > this.refs.bannerImg.height - delBannerH) {
                    document.body.scrollTop = this.refs.bannerImg.height - delBannerH //滚动高度改为图片的高度-20
                }
            } else if (!this.state.tabsFixed && document.body.scrollTop > this.refs.bannerImg.height - delBannerH) {
                //悬浮
                this.setState({
                    tabsFixed: true,
                    isScroll: true, //是否滚动中
                })
                if (document.body.scrollTop < this.refs.bannerImg.height) {
                    document.body.scrollTop = this.refs.bannerImg.height //滚动高度改为图片的高度
                }
            }

            clearTimeout(timeId);
            timeId = setTimeout(() => this.setState({
                isScroll: false, //是否滚动中
            }), 100); //延迟更新加载状态
        } catch (error) {
            //单页应该没有及时卸载带来的bug提示
            console.log("单页应该没有及时卸载带来的bug提示")
        }
    }

    handleTouchStart(e) {
        event.preventDefault();
        console.log("手指按下");
        this.setState({
            num: 1,
            y: e.targetTouches[0].clientY,
            endY: e.targetTouches[0].clientY,
        })
    }

    handleTouchMove(e) {
        if (document.body.scrollTop === 0 && this.state.endY - this.state.y > 4) {
            e.preventDefault(); //阻止默认事件
        }

        console.log(e.targetTouches[0].clientY);
        let num = this.state.num;
        this.setState({
            num: ++num,
            endY: e.targetTouches[0].clientY
        })
    }

    handleTouchEnd(e) {
        this.setState({
            num: 0,
            y: 0,
            endY: 0
        })
    }

    toUrl(url) {
        this.context.router.push(url);
    }

    /**
     * 打开banner图的链接
     * @param url 跳转的URL
     * @param name 活动名称
     */
    openBannerUrl(url, name = '') {
        if (url) {
            _cxytj.recordUserBehavior('', 'SY_banner', name || ''); //用户行为统计
            let showTitle = undefined;
            if (url.indexOf(window.location.hostname) > -1) {
                showTitle = 'false';
            }
            common.openNewBrowserWithURL(url, true, showTitle);
        }
    }

    /**
     * 打开关注社区
     * @param url 跳转的URL
     * @param noNeedToUpdateData 不需要更新数据
     * @param data 社区数据（groupID、groupName、groupType）
     */
    openCommunity(data) {
        _cxytj.recordUserBehavior('', data.groupId, data.groupName, data.groupType, 'communityGroup'); //用户行为统计
        common.openNewBrowserWithURL(`/community/${data.groupId}/${encodeURIComponent(data.groupName)}`, true);
    }

    /**
     * 检测用户是否已经登录
     */
    checkUser(url) {
        _cxytj.recordUserBehavior('', 'addTopicBtn', '发表话题按钮'); //用户行为统计
        let userInfo = userHelper.getUserIdAndToken();
        if (userInfo.userId && userInfo.token) {
            //存在用户信息
            common.openNewBrowserWithURL(url);
        } else {
            //跳转到登录页面
            userHelper.Login();
        }
    }

    getNavigation(id, type) {
        for (let item of this.props.navigation) {
            if (id) {
                if (item.groupId == id) {
                    return item;
                }
            }
            if (type) {
                if (item.groupType == type) {
                    return item;
                }
            }
        }
        return { groupName: "", groupId: 120 }
    }

    /**
     * 点击头部的栏目切换按钮
     */
    tabsCallback(key) {
        setTimeout(() => {
            let groupInfo = this.props.navigation.filter(item => item.groupId == key);
            if (groupInfo.length > 0) {
                _cxytj.recordUserBehavior('', groupInfo[0].groupId, groupInfo[0].groupName, groupInfo[0].groupType, 'communityGroup'); //用户行为统计
            }
        }, 10)

        sessionStorage.setItem("home_groupId", key) //保存groupId 用于网络错误后的刷新

        this.setState({
            thisTag: key,
        })

        console.log("tabsCallback", key, this.state.tabsCallbacks.indexOf(key) === -1);

        document.body.scrollTop = 0; //设置高度为“0”,避免出现页面到底的情况

        if (key == '96') {
            //问答（求助）模块需要用户先登录
            let userInfo = userHelper.getUserIdAndToken(); //获取用户信息
            if (!userInfo.userId || !userInfo.token) {
                return userHelper.Login(); //需要先登录
            }
        }

        let index = 1; //默认选择社区的
        switch (key) {
            case '97': index = 0; break;
            case '96': index = 2; break;
            case '99': index = 3; break;
            case '98': index = 4; break;
            default: index = 1;
        }
        //设置是否请求第一页
        let firstPage = this.state.firstPage;
        this.setState({
            firstPage: firstPage.map((item, i) => i === index)
        })
        this.getPosts({ groupId: key, pageNo: 1 }) //请求数据
    }

    /**
     * 设置为非第一页
     */
    noFirstPage(key) {
        let index = 1; //默认选择社区的
        switch (key) {
            case '97': index = 0; break;
            case '96': index = 2; break;
            case '99': index = 3; break;
            case '98': index = 4; break;
            default: index = 1;
        }
        let firstPage = this.state.firstPage;
        firstPage[index] = false;
        this.setState({
            firstPage: firstPage,
        })
    }

    tagCallback(index) {
        // console.log("tagCallback", key);
        tagSelected = index; //实时保存问答点击的选项，避免state状态不是实时更新的问题
        this.setState({
            tagSelected: index
        })

        this.tabsCallback("96"); //更新数据
    }

    /**
    * 根据社区获取帖子列表
    * @param data Object
    *  {"userId": "13800138000"//用户id
    * ,"token": "ADJKSKJNKJASLKSKLS"//token
    * ,"groupId":"问答Id"//社区id
    * ,"extends":[10,11]//1、默认是0   2、groupId = 问答Id, 跟我相关："10";未解决:"11";已解决:"12"   3、groupId = 吐槽Id,我的吐槽："20"; 易友吐槽: "21"
    * ,"pageNo":1//第一页  默认是1
    * ,"pageSize":10//分页数量 默认是10
    * ,"cityName":""//城市名称，易友吐槽的时候需要
    * ,direction:''//up 上划 down下拉。
    * ,postsId:''//根据最后一个帖子的ID来拉取数据
    * }
    */
    getPosts(data) {
        if (data.groupId == 96 && !data.extends) {
            //问答
            if (tagSelected === 0) {
                data.extends = [10];
            } else if (tagSelected === 1) {
                data.extends = [11];
            } else if (tagSelected === 2) {
                data.extends = [12];
            } else {
                data.extends = [10];
            }
        }
        if (data) {
            this.props.dispatch(postActions.getPostsByGroupIdAsync(data));
        }

    }

    /**
     * 分割问答为：跟我相关、未解决、已解决
     * @param datas 问答数据列表
     * @param type 类型：10、11、12分别表示：跟我相关、未解决、已解决
     */
    initPosts(datas = [], type) {
        let newDatas = [];
        if (type === 10) {
            newDatas = datas;
        } else if (type === 11 || type === 12) {
            newDatas = datas.filter(data => data.extends == type); //返回对应的数据
        }

        return newDatas
    }

    onShowReact() {
        userHelper.getSymbol(() => {
            let userInfo = userHelper.getUserIdAndToken(); //获取用户信息 每次返回页面都应该重新去拿用户信息
            //是否刷新栏目
            if (localStorage.getItem("tabsCallback")) {
                localStorage.removeItem("tabsCallback"); //删除指定key本地存储的值
                window.tabsCallback(); //刷新栏目
            }

            if (localStorage.getItem("upLoginState") || userInfo.userId != localStorage.getItem("g_userId") || userInfo.token != localStorage.getItem("g_userToken")) {
                localStorage.removeItem("upLoginState"); //删除指定key本地存储的值
                //用户信息不一致
                window.tabsCallback(); //刷新栏目
                window.dispatch(menus.getMemberFollowAsync()); //获取关注的社区
            }

            if (userInfo.city != localStorage.getItem("g_city")) {
                //当前城市不一致
                window.dispatch(communityActions.getDefaultFollowAsync()); //获取社区首页栏目
                this.tabsCallback('97'); //城市改版后 默认回到最新页面
            }

            if (window.upPostDates()) {
                return; //禁止代码往下执行
            }
        })
    }

    render() {
        /**
        * 暴露react组件给外部JS调用 start
        */

        window.dispatch = this.props.dispatch;

        if (this.state.firstPage[1]) {
            //如果当前停留在地区列表，则自动切换成最新列表
            window.tabsCallback = () => this.tabsCallback(this.props.navigation[1].groupId);
        } else {
            window.tabsCallback = () => this.tabsCallback(this.state.thisTag);
        }

        /**
        * 暴露react组件给外部JS调用 end
        */

        let addrs = this.props.navigation.filter(item => item.groupType !== '0');
        let groupIds = addrs.map(item => item.groupId);
        groupIds = groupIds.join(","); //默认选中的地区
        let defaultGroupName = addrs.length > 0 ? addrs[0].groupName : '默认'; //地区名称
        defaultGroupName = encodeURI(defaultGroupName); //url编码
        let latestListARR = this.props.posts[97]; //最新列表
        let showLatestListARR = false; //显示列表内容
        if (latestListARR && latestListARR.length > 0) {
            showLatestListARR = true;
        }

        let tagSelectedId = 10;
        switch (this.state.tagSelected) {
            case 0: tagSelectedId = 10;
                break;
            case 1: tagSelectedId = 11;
                break;
            case 2: tagSelectedId = 12;
                break;
            default:

        }
        let antdTagStyle = <Tag></Tag> //这里只是为了引发antdUI的Tag样式

        let tabodys = {
            '97': <div className='tabody'>
                <div className='tabody-tab bg-white bor-B-gray'>
                    <Flex className='hobbies-list' align="start">

                        {
                            this.props.follows.map((item, i) => {
                                return <div key={i} onClick={() => this.openCommunity(item)} className='hobbies-item'>{item.groupName}</div>
                            })
                        }

                    </Flex>
                    <Link to={'/Menus/' + groupIds}>
                        <div className='tabody-tab-img'>
                            <img src='./images/icon-list.png' className='img' />
                        </div>
                    </Link>
                </div>
                <div style={{ position: "relative", zIndex: '2', minHeight: '1px' }}>
                    <TitlebarList postFetching={this.props.postFetching} groupId="97" getPosts={data => this.getPosts(data)} posts={this.props.posts[97]} />
                </div>
                {/* 列表 */}
                <div className='tabody-body' style={{ position: "relative", zIndex: "1", overflow: "hidden" }}>
                    {showLatestListARR ?
                        <MsgListTest
                            thisTag={this.state.thisTag}
                            noFirstPage={index => this.noFirstPage(index)}
                            firstPage={this.state.firstPage[0]}
                            postFetching={this.props.postFetching}
                            groupId="97"
                            getPosts={data => this.getPosts(data)}
                            posts={this.props.posts[97]}
                            isEnd={this.props.postsIsEnd[97] && this.props.postsIsEnd[97] == '1' ? true : false} />
                        :
                        <div className='ft-center font-darkgray font-28'>
                            <WhiteSpace size="rem24" /> {/*  上下间隔 */}
                            <WhiteSpace size="rem24" /> {/*  上下间隔 */}
                            <WhiteSpace size="rem24" /> {/*  上下间隔 */}
                            {/*正在加载中...*/}
                        </div>

                    }
                </div>

                {/* 列表 end */}

            </div>,
            '96': <div className='tabody'>


                {/* 子 标签 */}
                <Flex className='bg-white tabody-tagList bor-B-gray' style={{ position: "relative", zIndex: "2" }}>
                    {
                        ['跟我相关', '未解决', '已解决'].map((item, i) =>
                            <div key={'w-tag' + i} className={"am-tag " + (this.state.tagSelected === i ? 'am-tag-active' : 'am-tag-normal')} onClick={() => this.tagCallback(i)}>
                                <div className="am-tag-text">{item}</div>
                            </div>
                        )
                    }
                    {/*<Tag selected={this.state.tagSelected === 0 ? true : false} onChange={() => this.tagCallback(0)}>跟我相关</Tag>
                    <Tag selected={this.state.tagSelected === 1 ? true : false} onChange={() => this.tagCallback(1)}>未解决</Tag>
                    <Tag selected={this.state.tagSelected === 2 ? true : false} onChange={() => this.tagCallback(2)}>已解决</Tag>*/}
                </Flex>
                {/* 列表 */}
                <div className='tabody-body' style={{ position: "relative", zIndex: "1", overflow: "hidden" }}>

                    <div style={this.state.tagSelected === 0 || 1 == 1 ? { display: 'block' } : { display: 'none' }} >
                        {this.initPosts(this.props.posts[96], tagSelectedId).length > 0 ?
                            <div>
                                <MsgListTest
                                    thisTag={this.state.thisTag}
                                    noFirstPage={index => this.noFirstPage(index)}
                                    firstPage={this.state.firstPage[2]}
                                    postFetching={this.props.postFetching}
                                    groupId="96"
                                    getPosts={(a) => this.getPosts(a)}
                                    posts={this.initPosts(this.props.posts[96], tagSelectedId)}
                                    extends={tagSelectedId}
                                    isEnd={this.props.postsIsEnd[96] && this.props.postsIsEnd[96] == '1' ? true : false} />
                            </div>
                            :
                            <div className='ft-center font-darkgray font-28'>
                                <WhiteSpace size="rem24" /> {/*  上下间隔 */}
                                <WhiteSpace size="rem24" /> {/*  上下间隔 */}
                                <WhiteSpace size="rem24" /> {/*  上下间隔 */}
                                {this.props.postFetching ? '' : '目前没有人向您求助哦'}
                            </div>
                        }

                    </div>


                </div>

                {/* 列表 end */}



            </div>,
            '98': <div className='tabody'>

                <div className='bor-B-gray' style={{ position: "relative", zIndex: "1", overflow: "hidden" }}>
                    <List>
                        <Item multipleLine align="top" wrap
                            onClick={url => common.openNewBrowserWithNewURL('热门资讯', '24')}>
                            <i className='lineOrange'></i>
                            <span className='til font-black font-28'>热门资讯</span>
                            <span
                                className='float-right font-gray font-26 line-more'
                            >
                                更多
                                        </span>
                        </Item>
                    </List>
                </div>

                <MsgListTest
                    thisTag={this.state.thisTag}
                    noFirstPage={index => this.noFirstPage(index)}
                    firstPage={this.state.firstPage[4]}
                    postFetching={this.props.postFetching}
                    groupId="98"
                    getPosts={(a) => this.getPosts(a)}
                    posts={this.props.posts[98]}
                    isEnd={this.props.postsIsEnd[98] && this.props.postsIsEnd[98] == '1' ? true : false} />

            </div>,
        }

        let { ad } = this.state
        let tabsClassName = this.state.tabsFixed ? delBannerH ? common.isAndroid() ? 'wTabs' : 'wTabsIos' : 'notAppTabs' : '';

        return (
            <div className="Home">
                <div className='bannerBox'>
                    <img ref="bannerImg" className='img'
                        src={ad.url}
                        onClick={() => this.openBannerUrl(ad.targetUrl, ad.name)}
                    />
                </div>
                <Tabs className={tabsClassName} activeKey={sessionStorage.getItem("home_groupId") || '97'} defaultActiveKey={sessionStorage.getItem("home_groupId") || '97'} animated={false} swipeable={false} onChange={(key) => this.tabsCallback(key)}>

                    {
                        this.props.navigation.map((navigation, navigationIndex) =>

                            <TabPane tab={navigation.groupName} key={navigation.groupId}>

                                <WhiteSpace size="rem24" style={{ position: "relative", background: '#f1f1f1', zIndex: "1" }} /> {/*  上下间隔 */}

                                {/* 内容  : 社区 */}
                                {
                                    tabodys[navigation.groupId] ? tabodys[navigation.groupId] :
                                        <div className='tabody'>
                                            <div style={{ position: "relative", zIndex: '2' }}>
                                                <TitlebarList postFetching={this.props.postFetching} groupId={navigation.groupId} getPosts={data => this.getPosts(data)} posts={this.props.posts[navigation.groupId]} />
                                            </div>

                                            {/* 列表 */}
                                            <div className='tabody-body' style={{ position: "relative", zIndex: "1", overflow: "hidden" }}>
                                                <MsgListTest
                                                    thisTag={this.state.thisTag}
                                                    noFirstPage={index => this.noFirstPage(index)}
                                                    firstPage={this.state.firstPage[navigationIndex]}
                                                    postFetching={this.props.postFetching}
                                                    groupId={navigation.groupId}
                                                    getPosts={data => this.getPosts(data)}
                                                    posts={this.props.posts[navigation.groupId]}
                                                    isEnd={this.props.postsIsEnd[navigation.groupId] && this.props.postsIsEnd[navigation.groupId] == '1' ? true : false} />
                                            </div>

                                            {/* 列表 end */}

                                        </div>
                                }

                                {/* 内容 end : 社区 */}

                            </TabPane>
                        )
                    }



                </Tabs>



                {/*   <WhiteSpace size="rem24" /> 右下角 ：编辑按钮 */}

                {/*<div className='am-fixed am-fixed-bottom' style={{ left: 'inherit', right: '0.6rem', bottom: '0.6rem', width: '0.91rem', height: '0.91rem' }}>
                    <img onClick={() => this.checkUser('/IssueTopic/' + groupIds + '/' + defaultGroupName)} src='./images/icon-edit.png' className='img' />
                </div>*/}
                <EditIcon onClick={() => this.checkUser('/IssueTopic/' + groupIds + '/' + defaultGroupName)} />

            </div>
        )
    }
}

//使用context
Home.contextTypes = {
    router: React.PropTypes.object.isRequired
}

Home.defaultProps = {
    navigation: [
        {
            groupId: "97",
            groupName: "最新",
            groupType: "0",
        },
        {
            groupId: "120",
            groupName: "广东",
            groupType: "1",
        }
    ]
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
export default connect(mapStateToProps)(Home);