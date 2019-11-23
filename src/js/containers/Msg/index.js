// 帖子详情
import React, { Component } from 'react'
//import { Link } from 'react-router'
import { connect } from 'react-redux'

import { Modal, Toast, ListView, RefreshControl, Grid, WingBlank, WhiteSpace, Icon } from 'antd-mobile'
import * as postActions from '../../actions/postActions';
import * as commentActions from '../../actions/commentActions';
import 'style/postInput.scss' //发布评论输入框样式和加载更多样式
import { createCommentAsync, createReplyAsync } from '../../actions/commentActions'
import common from '../../utils/common'
import userHelper from '../../utils/userHelper'

// 顶部蓝色标题栏
import AppHeader from '../../components/Menus/AppHeader'

// 添加用户信息 
import UserInfo from '../../components/MsgList/UserInfo'

// 添加时间，点赞，评论组件篮子
import Stats from '../../components/MsgList/Stats'

// 添加评论列表组件
import CommentList from '../../components/CommentList'


// 添加 帖子内容组件
import PostDetails from '../../components/PostDetails'


// 添加 没有资讯列表组件
import NoMsg from '../../components/MsgList/NoMsg'


// 初始化 评论列表的数据
const commentListdata = {}


class Msg extends Component {

    constructor(props) {
        super(props);

        this.state = {
            showPostInput: false, //显示评论输入框
            showZYC: false, //显示遮罩层
            inputValue: '', //输入框内容
            postType: 0, //发表类型 0：发表评论 1：发表评论的回复
            placeholder: '评论', //输入框提示信息
            replyInfo: {}, //点击回复按钮获取到的信息
            htmlTitle: '帖子详情', //头部标题
            scrollTop: 0, //滚动位置
        }
    }

    /**
     * 获取评论列表
     */
    getComments(data) {
        if (data.groupId) {
            this.props.dispatch(commentActions.getCommentsAsync(data));
        }

    }

    /**
     * 显示评论输入框
     */
    showPostInput(placeholder = '评论', type = 0) {
        let userInfo = userHelper.getUserIdAndToken();
        if (userInfo.userId == '' || userInfo.token == '') {
            // userHelper.Login(); //跳转到登录页面
            // return;
        }
        this.setState({
            showPostInput: true, //显示评论输入框
            placeholder: placeholder, //输入框提示信息
            postType: type, //评论类型
        })

        setTimeout(() => {
            this.refs.textarea.value = this.state.inputValue
        }, 1000); //显示输入框内容

        setTimeout(() => {
            _cxytj.recordUserBehavior('', type === 0 ? 'showPostInputBtn' : 'showReplyInputBtn', type === 0 ? '评论按钮' : '回复按钮', this.props.post.catid, this.props.post.catid); //用户行为统计
        }, 100);

    }

    /**
     * 隐藏评论输入框
     */
    hidePostInput() {

        this.setState({
            postType: 0, //只要不评论，你们就默认是发表新评论 已经与产品确认过
            placeholder: '评论', //输入框提示信息
            showZYC: false, //避免点击穿透
            showPostInput: false, //隐藏评论输入框
        })

        if (document.querySelector("textarea")) {
            document.querySelector("textarea").blur(); //失去焦点
        }
    }

    /**
     * 隐藏遮罩层
     */
    hideZYC(e) {
        if (e) {
            e.preventDefault && e.preventDefault() //阻止默认事件
        }
        this.hidePostInput()
        this.textareaOnBlur()
    }

    /**
     * 输入框获得焦点
     */
    textareaOnFocus() {
        this.setState({
            showZYC: true
        })
        if (common.isIPhone()) {
            //兼容IOS 输入框
            this.setFocusStyle()
        }
    }

    /**
     * 输入框失去焦点
     */
    textareaOnBlur() {
        this.setBlurStyle()

        if (common.isIPhone()) {
            //兼容IOS 输入框            
            setTimeout(() => {
                this.hidePostInput();
            }, 10);
        }
    }

    /**
     * 获取焦点时的样式
     */
    setFocusStyle() {
        if (common.isIPhone()) {
            setTimeout(() => {
                document.body.scrollTop = document.body.clientHeight; //滚动尾部
                document.getElementsByClassName('appHeader')[0].style.top = document.body.scrollTop + 'px' //头部位置
                this.setRefTransform(this.refs.appBody, `translate3d(0, ${document.body.scrollTop}px, 0)`); //兼容低版本浏览器
            }, 100);
        }
    }

    /**
     * 失去焦点时的样式
     */
    setBlurStyle() {
        if (common.isIPhone()) {
            //设置三个时间点来还原演示，避免低端iPhone卡顿
            document.getElementsByClassName('appHeader')[0].style.top = '' //还原头部位置
            this.setRefTransform(this.refs.appBody, `translate3d(0, 0, 0)`); //兼容低版本浏览器
            setTimeout(() => {
                document.getElementsByClassName('appHeader')[0].style.top = '' //还原头部位置
                this.setRefTransform(this.refs.appBody, `translate3d(0, 0, 0)`); //兼容低版本浏览器
            }, 50)
            setTimeout(() => {
                document.getElementsByClassName('appHeader')[0].style.top = '' //还原头部位置
                this.setRefTransform(this.refs.appBody, `translate3d(0, 0, 0)`); //兼容低版本浏览器
            }, 100)
            setTimeout(() => {
                document.getElementsByClassName('appHeader')[0].style.top = '' //还原头部位置
                this.setRefTransform(this.refs.appBody, `translate3d(0, 0, 0)`); //兼容低版本浏览器
            }, 300)
        }
        if (this.refs.textarea) {
            setTimeout(() => {
                this.textareaAutoHight(this.refs.textarea);
            }, 100)
        }

    }

    /**
     * 监听滚动事件
     */
    msgScroll() {
        if (common.isIPhone() && this.state.showZYC) {
            //兼容IOS 输入框
            this.setFocusStyle()
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
     * 自动修改输入框的高度
     */
    textareaAutoHight = (o) => {
        o.style.height = 'auto'; //默认高度
        let _h = o.scrollTop + o.scrollHeight + "px";
        o.style.height = _h; //高度自适应

        this.setState({
            inputValue: this.refs.textarea.value, //保存输入框输入的信息
        })
    }

    /**
     * 检查输入是否合法
     */
    checkInputText() {
        let text = this.refs.textarea.value.replace(/\s/g, "");
        if (text.replace(/\s/g, '').length === 0) {
            Toast.info("内容不能为空", 2);
            return false;
        }
        if (this.refs.textarea.value.length > 140) {
            Toast.info("内容不能超过140个字符", 2);
            return false;
        }
        return true;
    }

    /**
     * 发表评论 | 评论的回复
     * @param type 1为回复评论 0为发表评论 默认为发表评论
     */
    postInputSubmit(type = 0) {
        let userInfo = userHelper.getUserIdAndToken();
        if (!userInfo.userId || !userInfo.token) {
            userHelper.Login(); //跳转到登录页面
            return;
        }
        setTimeout(() => {
            if (this.checkInputText()) {
                let { groupId, id } = this.props.params;
                if (type === 1) {
                    console.log("回复某上一条信息：", this.state.replyInfo)
                    if (this.state.replyInfo.id == 1) {

                    }
                    if (!this.state.replyInfo.pid) {
                        // toPid=  this.state.replyInfo.id
                    }
                    let toPid = !this.state.replyInfo.pid ? '0' : this.state.replyInfo.id; // 定义 pid，上级id
                    console.log(" 回复某上一条信息：pid: " + toPid)

                    let data = {
                        "groupId": groupId,//社区ID
                        "postsId": id,//帖子ID
                        "com_id": this.state.replyInfo.com_id || this.state.replyInfo.id, //回复id
                        "content": this.refs.textarea.value,//评论内容
                        "pid": toPid,//上一级回应ID 
                    }
                    this.props.dispatch(createReplyAsync(data));
                    setTimeout(() => {
                        _cxytj.recordUserBehavior('', 'replyInputSubmitBtn', '回复发表按钮', this.props.post.catid, this.props.params.groupId); //用户行为统计
                    }, 100);
                } else {
                    let data = {
                        "groupId": groupId,//社区ID
                        "postsId": id,//帖子ID
                        "content": this.refs.textarea.value,//评论内容
                    }
                    this.props.dispatch(createCommentAsync(data));
                    setTimeout(() => {
                        _cxytj.recordUserBehavior('', 'postInputSubmitBtn', '评论发表按钮', this.props.post.catid, this.props.params.groupId); //用户行为统计
                    }, 100);
                }
                this.hidePostInput();
                this.setState({
                    inputValue: '', //清空内容
                })
                this.refs.textarea.value = '' //清空内容
            }
            setTimeout(() => this.setBlurStyle(), 0) //设置为失去焦点时的样式
        }, 0) //避免toast后出现闪一下
    }

    /**
     * 点击回复
     */
    clickReply(data) {
        console.log("点击回复按钮： ", this.state.replyInfo);
        this.showPostInput("回复" + data.author_username + ":", 1);
        this.setState({
            replyInfo: data,
            postType: 1, //发表的类型
        })
    }

    /**
     * 点击设为最佳
     */
    isOptimum(data) {
        console.log("点击设为最佳按钮：", data);
        Modal.alert('', <span style={{ fontSize: '16px', padding: '15px 0', color: '#1a1a1a', display: 'block' }}>请确认是否设为最佳回答</span>, [
            { text: <span style={{ fontSize: '16px', color: '#2582EA' }}>取消</span>, onPress: () => false },
            {
                text: <span style={{ fontSize: '16px', color: '#2582EA' }}>确认</span>, onPress: () => {
                    let { groupId, id } = this.props.params;
                    let postData = {
                        "groupId": groupId,//社区id
                        "postsId": id,//帖子ID
                        "comId": data.id, //评论ID
                    }
                    this.props.dispatch(commentActions.setSolutionAsync(postData));
                }
            }
        ])
    }

    /**
     * 点赞
     * @param type 4:帖子点赞 5:取消帖子点赞
     */
    praise(data) {
        console.log("点击了点赞按钮：", data)
        let { groupId, id } = this.props.params;
        let postData = {
            "groupId": groupId,//社区id
            "postsId": id,//帖子ID
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
     * 删除帖子
     */
    delete(data) {
        console.log("点击了删除按钮：", data)
        Modal.alert('', <span style={{ fontSize: '16px', padding: '15px 0', color: '#1a1a1a', display: 'block' }}>请确认是否删除</span>, [
            { text: <span style={{ fontSize: '16px', color: '#2582EA' }}>取消</span>, onPress: () => false },
            {
                text: <span style={{ fontSize: '16px', color: '#2582EA' }}>删除</span>, onPress: () => {
                    let { groupId, id } = this.props.params;
                    let postData = {
                        "groupId": groupId,//社区id
                        "postsId": id,//帖子ID
                    }
                    this.props.dispatch(postActions.deletePostByIdAsync(postData));
                }
            }
        ])
    }

    /**
     * 投票
     */
    vote(data) {
        console.log("你点击了投票按钮：", data)
        let { groupId, id } = this.props.params;
        let postData = {
            "groupId": groupId,//社区id
            "postsId": id,//帖子ID
            "voteId": data, //选项ID
        }
        this.props.dispatch(postActions.voteAsync(postData));
        // this.props.dispatch(postActions.isVote(postData)); //测试投票
    }

    /**
     * 删除评论
     */
    deleteComment(data) {
        console.log("删除评论的按钮 ", )

        Modal.alert('', <span style={{ fontSize: '16px', padding: '15px 0', color: '#1a1a1a', display: 'block' }}>请确认是否删除</span>, [
            { text: <span style={{ fontSize: '16px', color: '#2582EA' }}>取消</span>, onPress: () => false },
            {
                text: <span style={{ fontSize: '16px', color: '#2582EA' }}>删除</span>, onPress: () => {
                    let { groupId, id } = this.props.params;
                    if (!data.to_author_uid) {
                        // 没有 to_author_uid，说明是在评论列表
                        let postCommentData = {
                            "groupId": groupId,//社区id
                            "postsId": id,//帖子ID
                            "com_id": data.id, //选项ID
                        }
                        this.props.dispatch(commentActions.deleteCommentAsync(postCommentData)); //删除评论

                    }
                    else {
                        // 有 to_author_uid，说明是在回复列表
                        let postReplyData = {
                            "groupId": groupId,//社区id
                            "postsId": id,//帖子ID
                            "com_id": data.com_id, //评论ID
                            "reply_id": data.id, //选项ID
                        }

                        this.props.dispatch(commentActions.deleteReplyAsync(postReplyData)); //删除回复

                    }
                }
            }
        ])

    }

    /**
     * 点击加载更多
     */
    loadMore() {
        console.log("你点击了加载按钮，目前的数量为：" + this.props.comment.total, this.props.comment.comments.length);
        if (this.refs.loadMore.innerHTML != '点击加载更多') {
            return false;
        }
        this.refs.loadMore.innerHTML = '加载中...';
        if (this.props.comment.total > this.props.comment.comments.length && this.props.comment.total > 10) {
            let data = {
                pageSize: (Math.ceil(this.props.comment.comments.length / 10) + 1) * 10, //分页数量
                groupId: this.props.params.groupId,
                postsId: this.props.params.id
            }
            this.getComments(data);
            this.refs.loadMore.innerHTML = '点击加载更多';
        }
    }

    /**
     * 全局点击事件
     */
    documentClick(e) {

        let xpath = this.getXpath(e.target)
        if (xpath.indexOf('inputFocusHandle') !== -1) {
            //输入框置焦点
            this.refs.textarea && this.refs.textarea.focus();
        }
        console.log(e, '全局点击事件', xpath)
    }

    getXpath(obj) {
        let nodeName, id, className, xpath = '';
        while (nodeName != 'html') {
            nodeName = obj.nodeName.toLocaleLowerCase()
            id = obj.id ? '#' + obj.id : '';
            className = obj.className ? '.' + obj.className.replace(' ', ',') : '';
            xpath += nodeName + id + className + '>';
            obj = obj.parentNode;
        }

        return xpath.substr(0, xpath.length - 1);
    }

    onShowReact() {
        userHelper.getSymbol(() => {
            let userInfo = userHelper.getUserIdAndToken(); //获取用户信息 每次返回页面都应该重新去拿用户信息
            if (userInfo.userId != localStorage.getItem("g_userId") || userInfo.token != localStorage.getItem("g_userToken")) {
                //用户信息不一致
                this.props.dispatch(postActions.getPostByIdAsync({
                    groupId: this.props.params.groupId,
                    postsId: this.props.params.id
                }))
            }
        })
    }

    share() {
        let { post } = this.props
        if (common.isCXYApp()) {
            let share = common.share({
                "url": window.location.href,
                "title": post.title || post.content,
                "content": post.content,
                "icon": "http://m.cx580.com/a.png",
                "shareChannel": "weiXin,wenXinCircle",
            })
            if (!share) {
                Toast.info('请使用车行易APP分享', 1)
            }
        }
    }

    componentWillMount() {
        //console.log("话题详情 组件出现前 就是dom还没有渲染到html文档里面");
        let htmlTitle = this.state.htmlTitle;
        //1：违章热点/吐槽 2：资讯 3：违章详情 4:话题 5：问答 6：投票，7：社区资讯）
        switch (this.props.params.catid) {
            case '1':
                htmlTitle = '违章热点/吐槽';
                break;
            case '2':
                htmlTitle = '资讯详情';
                break;
            case '3':
                htmlTitle = '违章详情';
                break;
            case '4':
                htmlTitle = '话题详情';
                break;
            case '5':
                htmlTitle = '问题详情';
                break;
            case '6':
                htmlTitle = '投票';
                break;
            case '7':
                htmlTitle = '社区资讯';
                break;
            default:
                htmlTitle = '帖子详情';
        }
        this.setState({
            htmlTitle: htmlTitle
        })
        if (common.isCXYApp()) {
            document.querySelector("title").innerHTML = htmlTitle;
        } else {
            document.querySelector("title").innerHTML = '车行易社区话题';
        }


        let data = {
            pageSize: 10, //分页数量
            groupId: this.props.params.groupId,
            postsId: this.props.params.id
        }
        this.getComments(data); //获取数据

        /**
         * 获取帖子详情列表 并暴露window.upPostData给外部调用
         */

        this.props.dispatch(postActions.getPostByIdAsync({
            groupId: this.props.params.groupId,
            postsId: this.props.params.id
        }));

    }

    componentDidMount() {

        let needToUpdateData = {
            type: 'post', //路由名称
            data: { ///:groupId/:id(/:catid)"
                groupId: this.props.params.groupId,
                postsId: this.props.params.id
            }
        }
        localStorage.setItem("needToUpdateData", JSON.stringify(needToUpdateData)); //需要更新指定数据

        document.addEventListener('click', this.documentClick.bind(this)) //绑定点击事件

        window.msgScroll = () => this.msgScroll();
        window.addEventListener('scroll', window.msgScroll); //绑定滚动事件

        setTimeout(() => {
            window.onShowReact = () => this.onShowReact()
        }, 100)
    }

    componentWillUnmount() {
        this.props.dispatch(postActions.deletePost());

        document.removeEventListener('click', this.documentClick.bind(this)) //解除点击绑定事件

        window.removeEventListener('scroll', window.msgScroll); //绑定滚动事件
    }

    render() {
        const obj = this.props.post;

        const header = {
            left: {
                text: <Icon type="left" />,
                onClick: () => common.closeAppView()
            },
            center: {
                text: obj.title ? obj.title : this.state.htmlTitle,
                onClick: () => false
            },
            right: {
                text: common.isCXYApp() ? '分享' : '',
                onClick: () => this.share()
            }
        }




        /*
           * 1、未获得数据情况：空白页面
           */
        if (!obj.postsId || obj.postsId != this.props.post.postsId) {

            return (
                <div className={"bg-white " + (common.needAddAppHeaderHeight() ? '' : 'notAddHeader')}>
                    <AppHeader {...header} />
                    <div className='appBody'>
                        <NoMsg />
                    </div>
                </div>
            );
        }


        /*
          * 2、有数据
         */

        const URLcatid = this.props.params.catid;

        const commentdata = commentListdata.data ? commentListdata.data : {};
        commentdata.list = this.props.comment.comments;


        return (
            <div
                className={
                    (this.state.showPostInput ? 'PostInputBlock bg-white ' : 'PostInputNone bg-white ') + (common.needAddAppHeaderHeight() ? '' : 'notAddHeader')
                }>


                {
                    common.isCXYApp() ? <AppHeader {...header} /> : <div className='hide'><AppHeader {...header} /></div>
                }

                <div className='appBody' ref="appBody" style={common.isCXYApp() ? {} : { paddingTop: 0 }}>

                    {/*  用户信息  : 用户头像和用户名 */}
                    <UserInfo
                        img={obj.headImgUrl}
                        nickname={obj.authorUsername ? obj.authorUsername : '匿名易友'}
                        catid={obj.catid}
                        hideCatidImg={true}
                    />

                    <div style={{ paddingLeft: '.84rem' }}>
                        {/*  内容  : 根据catid改变布局  */}
                        <PostDetails data={obj} vote={data => this.vote(data)} />

                        {/*  时间，点赞和评论 */}
                        <Stats
                            {...obj}
                            siteType='PostDetails'
                            datas={obj}
                            praise={praiseData => this.praise(praiseData)} //点赞回调函数
                            delete={deleteDate => this.delete(deleteDate)} //删除回调函数
                        />
                    </div>

                    {/*<WingBlank>
                        <div className='float-left font-black font-28'>
                            {this.props.params.catid == '5' ? '回答' : '评论'}({this.props.comment.total})</div>
                        <div className='float-right font-blue font-28' onClick={() => this.showPostInput()}>发表{this.props.params.catid == '5' ? '回答' : '评论'}</div>
                    </WingBlank>
                    <div className='float-clear'></div>*/}

                    {/*  评论列表的数据  */}
                    <CommentList
                        type={URLcatid}
                        totalComment={this.props.comment.total}
                        data={commentdata}
                        post={this.props.post}
                        getComments={data => this.getComments(data)}
                        clickReply={data => this.clickReply(data)}
                        delete={data => this.deleteComment(data)}
                        isOptimum={data => this.isOptimum(data)} />


                    {/* 点击加载更多 */}
                    {
                        this.props.comment.total != this.props.comment.comments.length && this.props.comment.total > 10 ?
                            <div ref='loadMore' className="w-load-more-btn" onClick={() => this.loadMore()}>点击加载更多</div>
                            : ''
                    }

                    {/*占位div 避免输入框挡住内容*/}
                    <div style={{ display: 'block', height: '2rem' }}></div>
                </div>
                {/* 回复输入框 start */}
                <div id="zyc" className="zyc" onTouchStart={(e) => this.hideZYC(e)} style={!this.state.showZYC ? { display: 'none' } : {}}></div>
                <div ref="postInput" className="w-reply-box flex flex-vc">
                    <div className="w-reply-input-box flex1">
                        <textarea
                            id='replyTextarea'
                            ref="textarea"
                            name="reply"
                            rows="1"
                            placeholder={this.state.placeholder}
                            onChange={(e) => this.textareaAutoHight(e.target)}
                            onFocus={() => this.textareaOnFocus()}
                            onBlur={() => this.textareaOnBlur()}
                            maxLength="1000"></textarea>
                    </div>
                    <div className="w-reply-submit" onClick={() => this.postInputSubmit(this.state.postType)}>发表</div>
                </div>
                {/* 回复输入框 end */}
            </div>
        )
    }
}

function getFormatComments(comment, replys) {
    comment.comments.map(item => {
        item["replyList"] = replys[item.id] || []
    });
    return comment
}

function mapStateToProps(state) {
    return {
        post: state.post,
        comment: getFormatComments(state.comment, state.replys),
        replys: state.replys
    }
}



//包装 component , 注入 dispatch 和 state 到其默认的 connect(select)(Home) 中；
export default connect(mapStateToProps)(Msg);