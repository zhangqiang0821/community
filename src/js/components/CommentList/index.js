//   评论列表
import React, { Component } from 'react'
import { Link } from 'react-router'

import { WhiteSpace, WingBlank } from 'antd-mobile'
import styles from './index.scss'

// 添加 用户信息
import UserInfo from '../MsgList/UserInfo'

// 添加 时间，点赞，评论组件篮子
import Stats from '../MsgList/Stats'


// 添加 回复组件
import ReplyList from './ReplyList'

let isFirstLoading = true;
// 评论列表
class CommentList extends Component {

  // 初始值
  constructor(props) {
    super(props);
    isFirstLoading = this.props.post.comments !== "0";
  }

  //点击回复
  clickReply(data) {
    if (this.props.clickReply) {
      this.props.clickReply(data); //返回给父元素
    }

  }

  //点击设为最佳
  isOptimum(data) {
    if (this.props.isOptimum) {
      this.props.isOptimum(data); //返回给父元素
    }
  }

  //点击删除评论
  delete(data) {
    if (this.props.delete) {
      this.props.delete(data); //返回给父元素
    }
  }


  componentWillMount() {
    //console.log("评论列表 组件出现前 就是dom还没有渲染到html文档里面");
    // document.querySelector("title").innerHTML = "话题详情";
  }

  componentDidMount() {
    //console.log("评论列表 组件渲染完成 已经出现在dom文档里");

  }


  render() {

    const { type, data, post } = this.props;



    /**
    *1、如果list没有内容，出现：空白评论页面
    */
    // if ((!data || !data.list.length || data.list.length == 0) && isFirstLoading && post.groupId) {
    //   setTimeout(() => {
    //     isFirstLoading = false;
    //   }, 10000); //延迟10秒 避免数据请求过慢

    //   // this.props.getComments({ //这里不应该请求数据，请求数据应该直接在父组件操作
    //   //   groupId: post.groupId,
    //   //   postsId: post.postsId,
    //   //   pageNo: 0,
    //   //   pagesize: 10
    //   // })

    //   // 

    //   return (
    //     <div className={styles.NOCommentList + ' font-24 font-gray ft-center'}>加载中...</div>
    //   );
    // }
    if (data.list.length == 0) {


      if (this.props.post.catid == '5') {
        if (this.props.post.isOwner == '1') {
          console.log("评论列表   " + '暂无回答');
          return (
            <div className={styles.NOCommentList + ' font-24 font-gray ft-center'}>暂无回答</div>
          );

        } else {
          console.log("评论列表    " + '写下您的答案，为TA解决难题吧');
          return (
            <div className={styles.NOCommentList + ' font-24 font-gray ft-center'}>写下您的答案，为TA解决难题吧。</div>
          );

        }
      }

      console.log("评论列表   " + '您的意见很重要，留下些建议吧。');

      return (
        <div className={styles.NOCommentList + ' font-24 font-gray ft-center'}>您的意见很重要，留下些建议吧。</div>
      );




    }

    /**
    * 2、如果list有内容，出现：评论列表页面
    */
    //  循环插入子组件
    const itemsContent = data.list.map(
      (item, index) => (

        <div
          className={styles.CommentList + ' font-24 font-black'}
          key={item.id}
        >

          {/* 1、 用户信息  : 用户头像和用户名 ,楼层 */}
          <UserInfo
            img={item.headImgUrl}
            nickname={item.author_username}
            floor={index + 1}
          />

          {/* 2、 该用户评论内容 */}

          <WingBlank className={styles.CommentListContent + ' font-black font-28 '}>
            <div dangerouslySetInnerHTML={{ __html: item.content }}></div>
          </WingBlank>

          {/* 4、 该帖子回复列表 */}

          <ReplyList
            {...item}
            arr={item.replyList}
            clickReply={data => this.clickReply(data)}
            delete={data => this.delete(data)}
          />



          {/* 3、帖子详情 的 评论列表 里面的 时间，回复按钮 */}

          <div className={'font-lightgray font-24 ' + styles.padL}>
            <Stats
              {...item}
              siteType='CommentList'
              poster={this.props.post}
              datas={item}
              delete={data => this.delete(data)}
              clickReply={data => this.clickReply(data)}
              isOptimum={data => this.isOptimum(data)}
            />

          </div>

        </div >
      )
    );


    return (
      <div className={styles.commentListBox} >
        <div className={styles.totalComment}>
          <span>评论({this.props.totalComment || '0'})</span>
        </div>
        {itemsContent}
      </div>
    );


  }
}

export default CommentList;
