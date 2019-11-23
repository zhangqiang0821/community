//   时间，点赞和评论
import React, { Component } from 'react'
import { Link } from 'react-router'
import styles from './index.scss'
import common from '../../../utils/common'

import { WingBlank } from 'antd-mobile'

export default class Stats extends Component {
  // 初始值
  constructor(props) {
    super(props);
    this.state = {}
  }


  componentWillMount() {

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

  //点赞
  praise(data) {
    console.log("点赞传递给父元素的数据是：", data);
    if (this.props.praise) {
      this.props.praise(data); //返回给父元素
    }
  }

  //删除
  delete(data) {
    if (this.props.delete) {
      this.props.delete(data); //返回给父元素
    }
  }

  render() {

    const { siteType, poster, datas } = this.props;
    const obj = this.props;




    {/*
      * {item.catid}，这个是分类ID
      *      （1：违章热点/吐槽 2：资讯 3：违章详情 4:话题 5：问答 6：投票，7：社区资讯）
     */ }

    {/*
      * siteType=
      *      HomePageList,这个说明帖子在社区首页，是社区列表
      *      PostDetails, 说明帖子在详情页面，最上面的帖子详情
      *      CommentList, 说明帖子在详情页面，下面的评论列表
      *      
     */ }


    {/*
      * showLike=是否出现点赞功能
      *      HomePageList, 不出现：吐槽，问答的跟我相关
      *      PostDetails, 都出现：吐槽
      *      CommentList , 都不出现
      *      
     */ }
    let showLike = true; //是否出现点赞
    if ((siteType === 'HomePageList' && obj.datas.catid === '1') || (siteType === 'HomePageList' && obj.datas.extends === '10') || siteType === 'CommentList') {
      showLike = false;
    }

    let showLikeActive = false; //是否已经点赞

    let LikeActiveDATA = this.props.datas.is_praise; //资讯，吐槽列表
    if (LikeActiveDATA === '1') {
      showLikeActive = true;
    }

    // DOM 输出
    let showLikeDOM = showLike
      ? <div onClick={data => this.praise(this.props.datas)} >
        <i className={showLikeActive ? styles.likeActive + ' ' + styles.icon : styles.like + ' ' + styles.icon}></i>
        <span>{obj.datas.supports}</span>
      </div>
      : <span ></span>







    {/*
      * showComment=是否出现评论功能
      *      HomePageList, 不出现：吐槽
      *      PostDetails, 都不出现
      *      CommentList , 都出现
      *      
     */ }
    let showComment = true; //是否出现评论
    if (siteType === 'PostDetails') {
      showComment = false;
    }

    // DOM 输出
    let showCommentDOM = <span></span>;


    if (showComment) {

      // 在首页列表中，问答图标和其他不同
      if (siteType == 'HomePageList') {


        if (obj.datas.catid === '5') {

          // console.log("帮帮TA - " + obj.datas.catid + "  - " + obj.datas.extends);


          if (obj.datas.extends === '10') {
            // 这里是 首页- 问答-和我相关
            showCommentDOM =
              <span
                className='float-right font-blue'
                style={{ lineHeight: '18PX', borderRadius: '2PX', marginTop: '12PX', marginRight:'.3rem', border: '1PX solid #ababab', padding: ' 0 8PX' }}
              >
                帮帮TA</span>

          } else {
            // 这里是首页 -问答- 其他两个tag，图标为comment
            showCommentDOM =
              <span>
                <i className={styles.comment + ' ' + styles.icon}></i>
                <span className='font-lightgray'>{obj.datas.comments}</span>
              </span>

          }

        } else {
          //其他正常的效果
          showCommentDOM =
            <span>
              <i className={styles.comment + ' ' + styles.icon}></i>
              <span className='font-lightgray'>{obj.datas.comments}</span>
            </span>

        }

      }
      // 在评论列表中，问答图标都出现,但有自己的效果
      else if (siteType === 'CommentList') {
        showCommentDOM =
          <span>
            <i className={styles.commentBlue + ' ' + styles.icon}></i>
            <span className='font-blue'>回复</span>
          </span>

      }

    }







    {/*
      * showDel=是否出现删除功能
      *      HomePageList, 都不出现
      *      PostDetails, 只有本人才出现
      *      CommentList , 都不出现（评论列表出现）
      *      
     */ }
    let showDel = false; //是否出现删除
    if ((siteType === 'PostDetails' && obj.datas.isOwner === '1') || (siteType === 'CommentList' && obj.datas.is_owner === '1')) {
      showDel = true;
    }

    // DOM 输出
    let showDelDOM = showDel
      ? <span onClick={data => this.delete(this.props.datas)} className={'font-24 font-gray '}> 删除 </span>
      : <span ></span>





    {/*
      * showBest=是否出现 最佳功能
      *      HomePageList, 都不出现
      *      PostDetails, 都不出现
      *      CommentList , 只有is_best才出现
      *      
     */ }

    let showBest = false; //是否出现最佳
    if (obj.datas.is_best === '1') {
      showBest = true;
    }

    // DOM 输出
    let showBestDOM = showBest
      ? <span className='font-white bg-orange'
        style={{ lineHeight: '16PX', borderRadius: '4PX', marginTop: '2PX', padding: '2PX 0' }}>&nbsp;最佳&nbsp;</span>
      : <span></span>;




    {/*
      * showBest=是否出现 设置最佳 功能
      *      HomePageList, 都不出现
      *      PostDetails, 都不出现
      *      CommentList , 只有本人才出现
      *      
     */ }



    let showSetBest = false; //是否出现 设置最佳

    if (siteType === 'CommentList') {
      if (obj.poster.catid === '5' && obj.poster.isOwner === '1' && obj.poster.qa.isResolve === '0' && obj.poster.authorId != obj.datas.author_uid) {
        showSetBest = true;
      }
    }

    // DOM 输出
    let showSetBestDOM = showSetBest && !showBest
      ? <div className='font-24 font-blue float-right' onClick={data => this.isOptimum(obj.datas)}>
        <u className={'float-right' + styles.delBtn}>设为最佳</u>
      </div>
      : <span></span>;




    {/*
      * 组件输出     
     */ }

    return (
      <div className={styles.stats + ' ' + 'font-24 font-gray'}>

        {/*  时间  */}
        <div className='float-left' style={{ paddingLeft: '.3rem' }}>
          {obj.datas.datetime ? obj.datas.datetime : obj.datas.addtime}

        </div>

        {/*  删除 */}
        <WingBlank size='md' className='float-left'>
          {showDelDOM}
        </WingBlank>




        {/*  右侧内容：评论 width*/}
        <div className={'font-24 font-blue float-right ' + (siteType !== 'CommentList' ? styles.width : styles.width2)} onClick={siteType === 'HomePageList' && this.props.openNewBrowserWithURL ? this.props.openNewBrowserWithURL : false}>
          {showComment
            ? <div className='inputFocusHandle' onClick={data => this.clickReply(this.props.datas)}>
              {showCommentDOM}
            </div>
            : ''
          }</div>


        {/*  右侧内容：点赞 */}
        {
          this.props.notLikeIcon ? "" :
            <div className={'font-24 font-lightgray float-right ' + styles.width}>
              {showLikeDOM}
            </div>
        }


        {/*  右侧内容：最佳 */}

        <WingBlank size='md' className='font-24 font-lightgray float-right'>
          {showBestDOM}
        </WingBlank>

        <WingBlank size='md' className='font-24 font-lightgray float-right'>
          {showSetBestDOM}
        </WingBlank>


        <div className='float-clear'></div>

      </div>
    )




  }
}


//props默认值
Stats.defaultProps = {
  poster: "",
  notLikeIcon: false, //是否需要点赞功能
}