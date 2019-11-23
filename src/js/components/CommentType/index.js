//   资讯内容列表 - 列表单个内容  : 根据catid改变布局 
import React, { Component } from 'react'
import { Link } from 'react-router'

import { WhiteSpace, WingBlank } from 'antd-mobile'
import styles from './index.scss'
import common from '../../utils/common'


// 评论列表 : <CommentType datas={obj}/>  
class CommentType extends Component {

  // 初始值
  constructor(props) {
    super(props);
  }


  componentWillMount() {
    //console.log("资讯内容列表 - 内容CommentType 组件出现前 就是dom还没有渲染到html文档里面");
    // document.querySelector("title").innerHTML = "话题详情";
  }

  componentDidMount() {
    //console.log("资讯内容列表 - 内容CommentType 组件渲染完成 已经出现在dom文档里");

  }


  render() {


    const { data } = this.props;

   // console.log("--CommentType-- ", this.props.data.url);

    //分类ID（1：违章热点 2：资讯 3：违章详情 4:话题 5：问答 6：投票，7：社区资讯）

    let webUrl = `/post/${this.props.data.groupId}/${this.props.data.postsId}/${this.props.data.catid}`;

    let AppUrl = this.props.data.url;


    if (this.props.data.catid == 1) {

      // 1、catid，出现：显示内容 + 热点
      //分类ID（ 1：违章热点,吐槽 ）

      return (

        <div>
          <div className={'font-black font-30 ' + styles.MsgListBodyOther}>

            <div
              className={styles.MsgListBodyWord}
              dangerouslySetInnerHTML={{ __html: this.props.data.content }}
              >
            </div>

          </div>

          <WhiteSpace size='sm' /> {/*  上下间隔 */}



          <div
            className={'font-black font-28 ' + styles.MsgListBody}
            style={{background:'#f1f1f1'}}
            >

            <div className={styles.MsgListBodyImgList}>
              <img
                src='./images/icon-list-1.png'
                className={styles.MsgListBodyImg + ' ' + 'img'}
                />
            </div>

            <div
              className={styles.MsgListBodyWordONE}
              dangerouslySetInnerHTML={{ __html: this.props.data.title }}
              >
            </div>

            <p className='font-gray font-24'>{'违章人数：' + this.props.data.illegals}</p>

          </div>



        </div>

      )

    } else if (this.props.data.catid == 4 || this.props.data.catid == 5) {

      // 2、catid，出现：直接显示内容
      //分类ID（ 4:话题 5：问答）

      return (
        <div
          className={'font-black font-30 ' + styles.MsgListBodyOther}
          >
          <div
            className={styles.MsgListBodyWord}
            dangerouslySetInnerHTML={{ __html: this.props.data.content }}
            >
          </div>
        </div>
      )

    } else if (this.props.data.catid == 6) {

      // 3、catid，出现：图片 + 内容 + 投票人数
      //分类ID（ 6：投票）

      return (

        <div
          className={'font-black font-28 ' + styles.MsgListBody}
          style={{background:'#f1f1f1'}}
          >

          <div className={styles.MsgListBodyImgList}>
            <img
              src={this.props.data.thumbimgList ? this.props.data.thumbimgList : './images/icon-list-6.png'}
              className={styles.MsgListBodyImg + ' ' + 'img'}
              />
          </div>
          <div
            className={styles.MsgListBodyWordONE}
            dangerouslySetInnerHTML={{ __html: this.props.data.content }}
            >

          </div>
          <p className='font-gray font-24'>{'参与人数：' + this.props.data.attends}</p>
        </div>

      )

    } else {

      // 4、catid，出现：图片 + 内容

      return (
        <div
          className={'font-black font-28 ' + styles.MsgListBody}
          style={{background:'#f1f1f1'}}
          >
          <div className={styles.MsgListBodyImgList}>
            <img
              src={this.props.data.catid == 6 ? './images/icon-list-' + this.props.data.catid + '.png' : './images/icon-list-0.png'}
              className={styles.MsgListBodyImg + ' ' + 'img'}
              />
          </div>
          <div
            className={styles.MsgListBodyWord}
            dangerouslySetInnerHTML={{ __html: this.props.data.content }}
            >
          </div>
        </div>
      )

    }

  }
}

export default CommentType