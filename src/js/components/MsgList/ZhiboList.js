// 资讯列表
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { ListView, List, RefreshControl, Grid, WingBlank, WhiteSpace } from 'antd-mobile'
import { Link } from 'react-router'

import styles from './index.scss'
import replyListCSS from '../CommentList/index.scss'

import userHelper from '../../utils/userHelper'
import * as postActions from '../../actions/postActions'
import common from '../../utils/common'


// 添加 用户信息
import UserInfo from './UserInfo'
// 添加 九宫格图片组件
import ImgsGrid from './ImgsGrid'
// 添加 时间，点赞，评论组件篮子
import Stats from './Stats'

// 添加 没有资讯列表组件
import NoMsg from './NoMsg'


// 添加 资讯内容组件
import CommentType from '../CommentType'


/**
 * 下拉刷新
 */
let refreshInfo = {
    y: 0, //滑动开始时的Y坐标
    x: 0, //滑动开始时的X坐标
    endY: 0, //滑动结束时的Y坐标
    endX: 0, //滑动结束时的X坐标
    touchY: 0, //滑动的距离
    msg: ['下拉刷新', '松开刷新', '正在努力加载中...', ''], //文字提醒
    icon: ['', '', '', ''], //三种不同状态的icon
    height: 60, //触发刷新的高度 单位px
    delay: 2, //延迟多少秒请求数据。
    delayId: -1, //延迟器ID
    startTime: 0, //触发开始的时间
    endTime: 0, //触发结束的时间
    click: false, //是否触发点击事件
    scrollTop: 0, //当前滚动条的位置
}
class MsgList extends Component {

    constructor(props) {
        super(props);

        this.state = {
            pageSize: 10, //每页加载的数量
            pageNo: -1, //当前页码
        }
    }

    handleTouchStart(e) {
        console.log("手指按下");
        if (refreshInfo.click) {
            e.preventDefault(); //阻止默认事件
            refreshInfo.startTime = new Date().getTime();
            refreshInfo.x = e.targetTouches[0].clientX;
            refreshInfo.endX = e.targetTouches[0].clientX;
        }

        refreshInfo.y = e.targetTouches[0].clientY;
        refreshInfo.endY = e.targetTouches[0].clientY;
        refreshInfo.touchY = 0;
        refreshInfo.scrollTop = document.body.scrollTop; //当前滚动条的位置

        this.refs.listBox.style.transitionProperty = 'transform'; //重置位置过渡效果
        this.refs.listBox.style.transitionDuration = '0s';
        this.refs.progressBox.style.display = 'inline-block'; //显示圆形进度条
        this.refs.progressBox.style.transitionProperty = 'transform'; //加载中过渡效果
        this.refs.progressBox.style.transitionTimingFunction = "linear";
        this.refs.progressBox.style.transitionDuration = '0s';
    }

    handleTouchMove(e) {
        if (document.body.scrollTop === 0 && refreshInfo.endY - refreshInfo.y > 4) {
            e.preventDefault(); //阻止默认事件
        }

        refreshInfo.endY = e.targetTouches[0].clientY; //当前手指的位置
        refreshInfo.touchY = (refreshInfo.endY - refreshInfo.y - refreshInfo.scrollTop) / 3; //真正的下拉距离 = (滑动距离 - 滚动条距离)/拉力度

        if (refreshInfo.click) { //兼容安卓4.4及以下版本 滚动条无法滑动的bug
            refreshInfo.endX = e.targetTouches[0].clientX; //保存X轴坐标，用于判断是否重复点击事件
            if (refreshInfo.y - refreshInfo.endY > 0) {
                //上滑
                document.body.scrollTop = (refreshInfo.y - refreshInfo.endY) + refreshInfo.scrollTop;
            } else if (refreshInfo.endY - refreshInfo.y - refreshInfo.scrollTop < 0) {
                //下滑却scrollTop不等于0
                document.body.scrollTop = refreshInfo.scrollTop - (refreshInfo.endY - refreshInfo.y);
            }
        }

        refreshInfo.touchY = refreshInfo.touchY > 0 ? refreshInfo.touchY : 0;

        this.setRefTransform(this.refs.listBox, `translate3d(0px, ${refreshInfo.touchY}px, 0px)`); //兼容低版本浏览器
        this.refs.progressBox.style.display = 'inline-block'; //显示圆形进度条
        if (refreshInfo.touchY > refreshInfo.height) {
            //显示松开刷新
            this.refs.refreshMsg.innerHTML = refreshInfo.msg[1];
        } else {
            //显示下拉刷新
            this.refs.refreshMsg.innerHTML = refreshInfo.msg[0];
            //圆形进度条
            let rotateRightDeg = (-135 + (refreshInfo.touchY * 6)); //每下拉1像素=6deg
            rotateRightDeg = rotateRightDeg > 45 ? 45 : rotateRightDeg; //右边遮罩层最大45deg
            this.setRefTransform(this.refs.progressBoxBarRight, `rotate(${rotateRightDeg}deg)`); //兼容低版本浏览器
            if (rotateRightDeg == 45) {
                let rotateLeftDeg = (45 + ((refreshInfo.touchY * 6) - 180)); //每下拉1像素=6deg 减去之前下拉的180deg
                rotateLeftDeg = rotateLeftDeg > 200 ? 200 : rotateLeftDeg; //左边遮罩层最大225deg
                this.setRefTransform(this.refs.progressBoxBarLeft, `rotate(${rotateLeftDeg}deg)`); //兼容低版本浏览器
            } else {
                this.setRefTransform(this.refs.progressBoxBarLeft, `rotate(45deg)`); //兼容低版本浏览器
            }
        }
    }

    handleTouchEnd(e) {
        if (refreshInfo.click) {
            //如果滑动事件小于300毫秒，并且未移动 则触发点击事件
            refreshInfo.endTime = new Date().getTime();
            if ((refreshInfo.endTime - refreshInfo.startTime < 300) && refreshInfo.endY === refreshInfo.y && refreshInfo.endX === refreshInfo.x) {
                e.target.click(); //触发点击事件
            }
        }

        this.refs.listBox.style.transitionDuration = '0.3s'; //重置位置过渡效果
        this.refs.progressBox.style.transitionDuration = '30s'; //加载中过渡效果
        //刷新
        if (refreshInfo.touchY > 60) {
            //显示加载中
            this.setRefTransform(this.refs.listBox, `translate3d(0px, 40px, 0px)`); //兼容低版本浏览器
            this.refs.refreshMsg.innerHTML = refreshInfo.msg[2]; //提示文字
            this.refs.progressIcon.style.display = `none`; //隐藏下箭头ICON
            this.setRefTransform(this.refs.progressBox, `rotate(${30 * 360}deg)`); //兼容低版本浏览器 30秒*360deg

            clearTimeout(refreshInfo.delayId); //关闭延迟器，避免频繁请求数据
            refreshInfo.delayId = setTimeout(() => { //延迟请求，避免频繁请求数据
                this.loadMore(true); //刷新
                //加载完毕
                this.refs.refreshMsg.innerHTML = refreshInfo.msg[3]; //提示文字
                this.refs.progressBox.style.display = 'none'; //隐藏
                this.setRefTransform(this.refs.progressBox, ''); //兼容低版本浏览器
                this.refs.progressBox.style.transitionDuration = '0s';
                this.refs.progressIcon.style.display = 'block'; //还原下箭头ICON
                setTimeout(() => { //延迟隐藏
                    this.setRefTransform(this.refs.listBox, `translate3d(0px, 0px, 0px)`); //兼容低版本浏览器
                }, 500)
            }, refreshInfo.delay * 1000);
        } else {
            this.setRefTransform(this.refs.listBox, `translate3d(0px, 0px, 0px)`); //兼容低版本浏览器
        }
    }

    /**
     * 设置transform
     * @param ref对象
     * @param style 样式
     */
    setRefTransform(ref, style) {
        if (ref) {
            ref.style.transform = style;
            ref.style.webkitTransform = style;
            ref.style.mozTransform = style;
            ref.style.oTransform = style;
        }
    }

    /**
     * 点赞
     * @param type 4:帖子点赞 5:取消帖子点赞
     */
    praise(data) {
        console.log("点击了点赞按钮：", data)
        let postData = {
            "groupId": data.groupId,//社区id
            "postsId": data.postsId,//帖子ID
        }
        if (data.is_praise == 1) {
            console.log("取消点赞")
            postData.ac_type = 5;
        } else {
            console.log("点赞")
            postData.ac_type = 4;
        }
        this.props.dispatch(postActions.praiseAsync(postData));
    }

    /**
     * 加载数据
     * @param isAdd 追加数据 默认true
     */
    loadMore(isAdd = true) {
        if (this.props.isEnd && isAdd) {
            return;
        }
        if (this.refs.loadMore) {
            if (this.refs.loadMore.innerHTML != '点击加载更多' && isAdd) {
                return;
            }
        }

        let pageNo = Math.ceil(this.props.posts.length / this.state.pageSize) + 1;
        if (this.props.posts.length < 10) {
            pageNo = 1; //如果当前条数小于10条，那么则请求第一页
            isAdd = false; //非追加数据
        }

        pageNo = isAdd ? pageNo : 1; //非追加数据则直接请求第一页

        console.log("点击了加载数据按钮，当前需要加载的页码为1：", pageNo, this.props.postFetching);
        // let UserIdAndToken = userHelper.getUserIdAndToken();
        let params = {
            groupId: this.props.groupId,
            pageNo: pageNo,
            pageSize: this.state.pageSize, //每页加载的数量
            extends: 0,
            // cityName: UserIdAndToken.city,
            cityName: '北京'
        }
        console.log(params, '------');
        switch (this.props.groupId) {
            case "97"://最新

                break;
            case "96"://问答
                params.extends = this.props.extends;
                break;
            case "99"://吐槽
                params.extends = [20, 21];
                break;
            case "98"://资讯
                break;
            default:
                break;
        }
        if (this.props.getPosts) {
            this.setState({
                pageNo: pageNo, //保存当前页码
            })
            //根据最后一个帖子ID来拉取数据
            if (params.pageNo > 1) {
                params.direction = 'up'; //上滑
                params.postsId = this.props.posts[this.props.posts.length - 1].postsId; //最后一个帖子的ID
                console.log("根据最后一个帖子ID来拉取数据", params)
            }

            this.props.getPosts(params);
        }
    }

    /**
     * 页面滑动 判断是否到达底部
     */
    handleScroll(e) {
        if (this.props.thisTag != this.props.groupId) {
            //只加载当前的Tap
            return false;
        }
        let clientHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight; //窗口高度
        let scrollTop = document.body.scrollTop; //滚动高度
        // console.log("当前滚动距离", scrollTop + clientHeight + 100, this.refs.listBox.scrollHeight + this.refs.listBox.offsetTop)
        try {
            if (scrollTop + clientHeight + 100 > this.refs.listBox.scrollHeight + this.refs.listBox.offsetTop) {
                this.loadMore();
            }
        } catch (error) {
            //单页引用 没有及时卸载监听带来的bug
        }

    }

    componentWillMount() {

    }

    componentDidMount() {
        window.loadingMoreScroll = ()=>this.handleScroll()
        // window.addEventListener('scroll', window.loadingMoreScroll); //绑定页面滚动事件

        let version = common.getAndroidVersion();
        if (version) {
            version = version.split(".");
            if ((version[0] * 1) < 5 && (version[1] * 1) < 5) {
                refreshInfo.click = true;; //4.4及以下的系统需要触发点击事件
            }
        }
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', window.loadingMoreScroll); //取消绑定页面滚动事件
    }

    render() {
        const { groupId, getPosts, type, posts } = this.props;
        // console.log('MsgList--test', this.props)

        /*
         * 判断tab是否为 ‘社区’，
         * 最新 groupId=97
         * 问答 groupId=96
         * 吐槽 groupId=99 
         * 资讯 groupId=98
         * 剩下为社区，因为社区根据类型是可变的
         * */

        let questionListARR = this.props.extends; //资讯，问答栏
        let showQueListARR10 = false; //显示问答的 关于我 :标题
        if (questionListARR == 10) {
            showQueListARR10 = true;
        }
        let showQueListARR12 = false; //显示问答的已解决，最佳答案
        if (questionListARR == 12) {
            showQueListARR12 = true;
            console.log(" 问答 -首页列表 ：", showQueListARR12)
        }

        /**
         * 最新、地区等默认列表
         */
        let defaultHtml = this.props.posts.map((obj, i) =>
            <div key={i} className={'bg-white ' + styles.itemBox} style={obj.isTop == '1' ? { display: "none" } : {}}>
                <div onClick={url => common.openNewBrowserWithURL(this.props.groupId == '99' || this.props.groupId == '98' ?
                    `${obj.url}` : `/post/${obj.groupId}/${obj.postsId}/${obj.catid}`)}>

                    {/*  用户信息  : 用户头像和用户名 */}

                    <div className={styles.userInfo}>
                        <UserInfo
                            img={obj.headImgUrl}
                            nickname={obj.authorUsername ? obj.authorUsername : '匿名易友'}
                            catid={obj.catid}
                        />
                    </div>

                    {/*  内容  : 根据catid改变布局  */}
                    <CommentType data={obj} />

                </div>
                {/*  图片列表 */}
                <ImgsGrid
                    data={obj.thumbImgList ? obj.thumbImgList : obj.imgList}
                    columnNum={3}
                    imgList={obj.imgList}
                    clickImgsGrid={url => common.openNewBrowserWithURL(this.props.groupId == '99' || this.props.groupId == '98' ?
                        `${obj.url}` : `/post/${obj.groupId}/${obj.postsId}/${obj.catid}`)}
                />

                {/*  时间，点赞和评论 */}
                <Stats
                    {...obj}
                    siteType='HomePageList'
                    datas={obj}
                    praise={praiseData => this.praise(praiseData)} //点赞回调函数
                    openNewBrowserWithURL={url => common.openNewBrowserWithURL(this.props.groupId == '99' || this.props.groupId == '98' ?
                        `${obj.url}` : `/post/${obj.groupId}/${obj.postsId}/${obj.catid}`)}
                />


            </div>
        )

        /**
         * 资讯列表
         */
        let zixunHtml = this.props.posts.map((obj, i) =>
            <div key={i} 
            className={'bg-white ' + styles.itemBox} onClick={url => common.openNewBrowserWithURL(this.props.groupId == '99' || this.props.groupId == '98' ?
                `${obj.url}` : `/post/${obj.groupId}/${obj.postsId}/${obj.catid}`)} style={obj.isTop == '1' ? { display: "none" } : {paddingLeft:'0',paddingTop:'0'}}>

                <div className='bg-white' >

                    <WhiteSpace size='md' /> {/*  上下间隔 */}

                    <WingBlank className={styles.inforIMGBody}>
                        <img className={styles.inforIMG} src={obj.thumbImgList[0]} />
                    </WingBlank>

                    <WhiteSpace size='sm' /> {/*  上下间隔 */}

                    <WingBlank className='font-black font-30'>{obj.title}</WingBlank>

                    <WhiteSpace size='sm' /> {/*  上下间隔 */}

                    <WingBlank className='font-gray font-26'>{obj.content}</WingBlank>

                </div>

                {/*  时间，点赞和评论 */}
                <Stats
                    {...obj}
                    siteType='HomePageList'
                    datas={obj}
                    notLikeIcon={true}
                    openNewBrowserWithURL={url => common.openNewBrowserWithURL(this.props.groupId == '99' || this.props.groupId == '98' ?
                        `${obj.url}` : `/post/${obj.groupId}/${obj.postsId}/${obj.catid}`)}
                />



            </div>
        )

        /**
         * 问答列表
         */
        let wendaHtml = this.props.posts.map((obj, i) =>
            <div key={i} className={'bg-white w-count-96 ' + styles.itemBox} style={obj.isTop == '1' ? { display: "none" } : {}}>

                <div onClick={url => common.openNewBrowserWithURL(this.props.groupId == '99' || this.props.groupId == '98' ?
                    `${obj.url}` : `/post/${obj.groupId}/${obj.postsId}/${obj.catid}`)}>
                    {/*  用户信息  : 用户头像和用户名 */}
                    <div>

                        <WhiteSpace size='md' /> {/*  上下间隔 */}

                        {showQueListARR10 ?
                            <div>
                                <WingBlank className='font-darkgray font-28' style={{ marginLeft: '25PX', position: 'relative' }}>
                                    <i className={styles.lineOrange}></i>{obj.title}</WingBlank>
                                <WhiteSpace size='md' className='font-black font-30 bor-B-gray' /> {/*  上下间隔 */}
                            </div>
                            :
                            ''
                        }
                        <div className={styles.userInfo}>
                            <UserInfo
                                img={obj.headImgUrl}
                                nickname={obj.authorUsername ? obj.authorUsername : '匿名易友'}
                                catid={obj.catid}
                            />
                        </div>
                    </div>

                    {/*  内容  : 根据catid改变布局  */}

                    <CommentType data={obj} />



                </div>

                {/*  图片列表 */}
                <ImgsGrid
                    data={obj.thumbImgList ? obj.thumbImgList : obj.imgList}
                    columnNum={3}
                    imgList={obj.imgList}
                    clickImgsGrid={url => common.openNewBrowserWithURL(this.props.groupId == '99' || this.props.groupId == '98' ?
                        `${obj.url}` : `/post/${obj.groupId}/${obj.postsId}/${obj.catid}`)}
                />

                <div onClick={url => common.openNewBrowserWithURL(this.props.groupId == '99' || this.props.groupId == '98' ?
                    `${obj.url}` : `/post/${obj.groupId}/${obj.postsId}/${obj.catid}`)}>
                    {/*  问答：已解决的效果 */}
                    {showQueListARR12
                        ?
                        <div className={styles.ReplyList}>
                            <div
                                className={styles.ReplyListitem + ' font-26 font-darkgray'}
                                style={{ background: '#f1f1f1' }}
                            >


                                <span className='font-white bg-orange'
                                    style={{ padding: '2PX', borderRadius: '4PX', marginTop: '2PX' }}>
                                    最佳
                                                </span>
                                &nbsp;
                                               <span
                                    dangerouslySetInnerHTML={{ __html: obj.qa.bestComment.commContent }}
                                >
                                </span>

                                {console.log(" 问答 -首页qq ：", obj.qa)}

                                <div className='float-clear'></div>

                            </div>
                        </div>
                        :
                        <span></span>
                    }
                </div>


                {/*  时间，点赞和评论 */}
                <Stats
                    {...obj}
                    siteType='HomePageList'
                    datas={obj}
                    praise={praiseData => this.praise(praiseData)} //点赞回调函数
                    openNewBrowserWithURL={url => common.openNewBrowserWithURL(this.props.groupId == '99' || this.props.groupId == '98' ?
                        `${obj.url}` : `/post/${obj.groupId}/${obj.postsId}/${obj.catid}`)}
                />



            </div>
        )

        /**
         * 判断不同的栏目 展示不同的样式
         */
        let listHtml = defaultHtml;
        switch (this.props.groupId) {
            case '96': listHtml = wendaHtml; break;
            case '98': listHtml = zixunHtml; break;
            default: listHtml = defaultHtml;
        }

        return (
            <div ref="listBox" className={styles.listBox} onTouchStart={(e) => this.handleTouchStart(e)} onTouchMove={(e) => this.handleTouchMove(e)} onTouchEnd={(e) => this.handleTouchEnd(e)} >
                <div className={styles.updatasBox}>
                    <div className={styles.updatasBoxMsg}>
                        <div ref="progressBox" className={styles.progressBox}>
                            <img ref="progressIcon" src='./images/progress-icon.png' className={styles.progressIcon} />
                            <div ref="progressBoxBar" className={styles.progressBoxBar}></div>
                            <div className={styles.progressBoxBarLeftBox}>
                                <div ref="progressBoxBarLeft" className={styles.progressBoxBarLeft}></div>
                            </div>
                            <div className={styles.progressBoxBarRightBox}>
                                <div ref="progressBoxBarRight" className={styles.progressBoxBarRight}></div>
                            </div>
                        </div>
                        <span ref="refreshMsg">下拉加载的提示信息</span>
                    </div>
                </div>
                
                {/* 加载更多 state */}
                {this.props.isEnd ?
                    <div className="w-load-more-btn" style={{ padding: '0 0.15rem' }}>
                        {this.props.posts.length < 10 ? '' :
                            <img src='./images/list-end.png' style={{ width: '100%' }} />
                        }
                    </div>
                    :
                    <div
                        ref='loadMore'
                        onClick={() => this.loadMore(this.props.posts.length > 9)}
                        className="w-load-more-btn" >
                        {this.props.postFetching ? (this.props.posts.length > 9 ? '加载中...' : '') : '点击加载更多'}
                    </div>
                }
                {/* 加载更多 end */}

                {listHtml ? listHtml :
                    <div className='ft-center font-darkgray font-28'>
                        <WhiteSpace size="rem24" /> {/*  上下间隔 */}
                        <WhiteSpace size="rem24" /> {/*  上下间隔 */}
                        <WhiteSpace size="rem24" /> {/*  上下间隔 */}
                        {this.props.postFetching ? '正在加载中...' : '暂无数据'}
                    </div>
                }
            </div>
        );
    }
}

MsgList.defaultProps = {
    posts: [] //定义空数据，避免父组件没有传递数据过来时出现报错的情况
}


export default connect()(MsgList);


