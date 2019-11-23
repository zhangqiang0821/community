// 资讯列表
import React from 'react'
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



// 组件 的 下拉事件
function tabHobbyClick() {
    //console.log("tabHobbyClick",this);
}

// 下拉加载效果

// 组件


let isFirst = true;



const MsgList = React.createClass({

    getInitialState() {

        isFirst = true;

        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        });
        return {
            dataSource: dataSource.cloneWithRows([]),
            isLoading: true,
            pageIndex: 1,
            postFetching: false,
            posts: {}
        };
    },

    componentWillMount() {
        //console.log("列表 组件出现前 就是dom还没有渲染到html文档里面");

    },

    componentDidMount() {
        //console.log("列表 组件渲染完成 已经出现在dom文档里");
    },

    getPosts() {
        let UserIdAndToken = userHelper.getUserIdAndToken();
        let params = {
            groupId: this.props.groupId,
            pageNo: this.state.pageIndex,
            pageSize: 10,
            extends: 0,
            cityName: UserIdAndToken.city
        }
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
        this.props.getPosts(params);
    },

    onEndReached(event) {
        console.log('加载1', this.props.groupId, this.props.thisTag == this.props.groupId, this.props.thisTag)
        if (this.props.thisTag != this.props.groupId) {
            //只加载当前的Tap
            return false;
        }
        let pageIndex = this.props.firstPage ? 1 : this.state.pageIndex;
        this.setState({
            pageIndex: pageIndex
        });
        // let pageIndex = this.state.pageIndex;
        console.log(
            "到底", '是否请求中：' + this.state.postFetching,
            '是否请求第一页：' + this.props.firstPage,
            '当前页码：' + pageIndex,
            '当页面的数据条数：' + document.querySelectorAll(".w-count-" + this.props.groupId).length, this.state.dataSource._cachedRowCount, this.props.groupId);
        if (this.props.firstPage) {
            console.log("如果是首次进入页面，则不去获取数据！", this.props.noFirstPage(this.props.groupId), this.props.groupId)
            setTimeout(() => this.props.noFirstPage(this.props.groupId), 1000); //延迟1秒 设置为非第一页，避免一直请求第一页
            // this.props.noFirstPage(this.props.groupId); //设置为非第一页，避免一直请求第一页
            return;
        }
        if (this.state.dataSource._cachedRowCount !== pageIndex * 10 && this.state.dataSource._cachedRowCount !== (pageIndex - 1) * 10) {
            console.log("如果当前已有的数据不等于已请求到的数据，则不再去请求。", document.querySelectorAll(".w-count-" + this.props.groupId).length, this.state.dataSource._cachedRowCount, pageIndex * 10)
            return; //如果当前已有的数据不等于已请求到的数据，则不再去请求。
        }
        if (this.state.postFetching) {
            return;
        }
        this.setState({
            postFetching: true,
            pageIndex: pageIndex + 1
        });
        console.log('这里去请求数据了。。。。。。。。。')
        this.getPosts();
    },

    /**
     * 点赞
     * @param type 4:帖子点赞 5:取消帖子点赞
     */
    praise(data) {
        console.log("点击了点赞按钮：", data)
        let { groupId, postsId } = data;
        let postData = {
            "groupId": groupId,//社区id
            "postsId": postsId,//帖子ID
        }
        if (data.is_praise == 1) {
            console.log("取消点赞")
            postData.ac_type = 5;
        } else {
            console.log("点赞")
            postData.ac_type = 4;
        }
        this.props.dispatch(postActions.praiseAsync(postData));
    },


    render() {

        const { groupId, getPosts, type, posts} = this.props;
        /*
         * 1、无数据情况
         */
        if (posts == undefined || posts.length == 0) {
            return <NoMsg /> //无数据则返回空
        }
        // console.log("<==================分割线=======================>", posts);
        console.log("this.props.postFetching", this.props.postFetching);

        if (!this.props.postFetching && this.state.dataSource._cachedRowCount !== posts.length && this.state.dataSource.cloneWithRows) {
            console.log("可以渲染列表", posts);
            
            setTimeout(() => {
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(posts.map(item => item.postsId)),
                    isLoading: false,
                    postFetching: false,
                });
            }, 10);
        } else {
            if(posts.length > 0 && !this.props.firstPage){
                console.log('当前的页面是',this.props.groupId)
            }
        }





        /*
          * 2、有数据
         */

        const separator = (sectionID, rowID) => (
            <div key={`${sectionID}-${rowID}`} className={styles.MsgListBG} />
        );





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





        // 内容

        const row = (rowData, sectionID, rowID) => {
            const obj = posts[rowID];


            let webUrl = `/post/${obj.groupId}/${obj.postsId}/${obj.catid}`

            let AppUrl = `${obj.url}`


            {/*
         * 判断tab是否为 ‘社区’，
         * 最新 groupId=97
         * 问答 groupId=96
         * 吐槽 groupId=99 
         * 资讯 groupId=98
         * 剩下为社区，因为社区根据类型是可变的
         * */ }
            switch (this.props.groupId) {

                case '98':
                    //资讯

                    return (
                        <div key={rowID} onClick={url => common.openNewBrowserWithURL(AppUrl)}>

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

                            <WhiteSpace size='sm' /> {/*  上下间隔 */}


                            <WhiteSpace size='sm' className='bor-T-gray' /> {/*  上下间隔 */}


                            {/*  时间，点赞和评论 */}
                            <Stats
                                {...obj}
                                siteType='HomePageList'
                                datas={obj}
                                notLikeIcon={true}
                                />

                            <WhiteSpace /> {/*  上下间隔 */}

                        </div>


                    );

                case '96':
                    //  问答



                    return (
                        <div key={rowID} className='bg-white w-count-96'>

                            <div onClick={url => common.openNewBrowserWithURL(webUrl)}>
                                {/*  用户信息  : 用户头像和用户名 */}
                                <div

                                    >

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

                                    <UserInfo
                                        img={obj.headImgUrl}
                                        nickname={obj.authorUsername ? obj.authorUsername : '匿名易友'}
                                        catid={obj.catid}
                                        />
                                </div>

                                {/*  内容  : 根据catid改变布局  */}

                                <CommentType data={obj} />


                                <WhiteSpace size='xs' /> {/*  上下间隔 */}
                            </div>

                            {/*  图片列表 */}
                            <ImgsGrid
                                data={obj.thumbImgList ? obj.thumbImgList : obj.imgList}
                                columnNum={3}
                                imgList={obj.imgList}
                                clickImgsGrid={url => common.openNewBrowserWithURL(this.props.groupId == '99' ? AppUrl : webUrl)}
                                />

                            <div onClick={url => common.openNewBrowserWithURL(webUrl)}>
                                {/*  问答：已解决的效果 */}
                                {showQueListARR12
                                    ?
                                    <div className={styles.ReplyList}>
                                        <div
                                            className={styles.ReplyListitem + ' font-26 font-darkgray'}
                                            style={{background:'#f1f1f1'}}
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



                                {/*  时间，点赞和评论 */}
                                <Stats
                                    {...obj}
                                    siteType='HomePageList'
                                    datas={obj}
                                    />
                                <WhiteSpace /> {/*  上下间隔 */}
                            </div>

                        </div>

                    );

                default:


                    return (
                        <div key={rowID} className={'bg-white w-count-' + this.props.groupId}>
                            <div onClick={url => common.openNewBrowserWithURL(this.props.groupId == '99' ? AppUrl : webUrl)}>
                                <WhiteSpace size='xs' /> {/*  上下间隔 */}

                                {/*  用户信息  : 用户头像和用户名 */}

                                <div>
                                    <UserInfo
                                        img={obj.headImgUrl}
                                        nickname={obj.authorUsername ? obj.authorUsername : '匿名易友'}
                                        catid={obj.catid}
                                        />
                                </div>

                                {/*  内容  : 根据catid改变布局  */}

                                <CommentType data={obj} />


                                <WhiteSpace size='xs' /> {/*  上下间隔 */}

                            </div>
                            {/*  图片列表 */}
                            <ImgsGrid
                                data={obj.thumbImgList ? obj.thumbImgList : obj.imgList}
                                columnNum={3}
                                imgList={obj.imgList}
                                clickImgsGrid={url => common.openNewBrowserWithURL(this.props.groupId == '99' ? AppUrl : webUrl)}
                                />

                            <div onClick={url => common.openNewBrowserWithURL(this.props.groupId == '99' ? AppUrl : webUrl)}>

                                {/*  时间，点赞和评论 */}
                                <Stats
                                    {...obj}
                                    siteType='HomePageList'
                                    datas={obj}
                                    />
                                <WhiteSpace /> {/*  上下间隔 */}

                            </div>
                        </div>
                    );
            }

        };






        return (

            <ListView
                dataSource={this.state.dataSource}
                renderFooter={() => <div style={{ position: 'absolute', width: '100%', marginTop: '-5px', textAlign: 'center' }}>
                    {this.state.isLoading ? '推荐中...' : ''}
                </div>}
                renderRow={row}
                renderSeparator={separator}
                className={styles.MsgList}
                pageSize={1}
                scrollRenderAheadDistance={0}
                scrollEventThrottle={10}
                useBodyScroll
                onEndReached={this.onEndReached}
                onEndReachedThreshold={0}
                />
        );
    },
});

export default connect()(MsgList);


