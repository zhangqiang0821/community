//   资讯内容列表 - 内容  : 根据catid改变布局 
import React, { Component } from 'react'
import { Link } from 'react-router'

import { List, Button, WhiteSpace, WingBlank } from 'antd-mobile'
import 'style/PostDetails.scss'

// 添加九宫格图片组件
import ImgsGrid from '../MsgList/ImgsGrid'

// 添加 投票组件
import PollOptions from './PollOptions'


// 评论列表 : <PostDetails data={obj}/> 

const PostDetails = React.createClass({



  componentWillMount() {
    //console.log("资讯内容列表 - 内容CommentType 组件出现前 就是dom还没有渲染到html文档里面");
    // document.querySelector("title").innerHTML = "话题详情";
  },

  componentDidMount() {
    //console.log("资讯内容列表 - 内容CommentType 组件渲染完成 已经出现在dom文档里");

  },

  /**
   * 投票 
   */
  vote(data) {
    if (this.props.vote) {
      this.props.vote(data); //传递给父组件
    }
  },


  render() {

    const { data } = this.props;

    const obj = this.props.data;



    /*
    *分类ID（1：违章热点,违章吐槽 2：资讯 3：违章详情 4:话题 5：问答 6：投票，7：社区资讯）
    */

    switch (obj.catid) {

      case '1':
        //1：违章热点,违章吐槽

        return (
          <div>

            <WingBlank
              className={'font-black font-30 MsgListBodyOther'}
              >

              <div
                className={'MsgListBodyWord'}
                dangerouslySetInnerHTML={{ __html: obj.content }}
                >
              </div>

              <p className='font-gray font-24'>{'参与人数：' + this.props.data.attends}</p>

            </WingBlank>



            <WhiteSpace size='xs' /> {/*  上下间隔 */}


            {/*  图片列表 */}
            <ImgsGrid
              data={obj.thumbImgList ? obj.thumbImgList : obj.imgList}
              columnNum={3}
              imgList={obj.imgList}
              />

            <WhiteSpace size='xs' /> {/*  上下间隔 */}

            <Link
              to={`/post/${this.props.data.groupId}/${this.props.data.postsId}`}
              className={'font-black font-28 MsgListBody'}
              style={{background:'#f1f1f1'}}
              >
              <div className={'MsgListBodyImgList'}>
                <img
                  src='./images/icon-list-1.png'
                  className={'MsgListBodyImg img'}
                  />
              </div>
              <div
                className={'MsgListBodyWord'}
                dangerouslySetInnerHTML={{ __html: this.props.data.title }}
                >
              </div>
            </Link>



          </div>

        )




      case '6':
        //6：投票
        return (
          <div>

            <WingBlank
              className={'font-black font-30 MsgListBodyOther'}
              >

              <div
                className={'MsgListBodyWord'}
                dangerouslySetInnerHTML={{ __html: obj.content }}
                >
              </div>

              <p className='font-gray font-24'>{'参与人数：' + this.props.data.attends}</p>

            </WingBlank>


            <WhiteSpace size='xs' /> {/*  上下间隔 */}


            {/*  图片列表 */}
            <ImgsGrid
              data={obj.thumbImgList}
              columnNum={3}
              imgList={obj.imgList}
              />


            <WhiteSpace size='xs' /> {/*  上下间隔 */}


            <WingBlank className='font-gray font-24'>选项 （单选）</WingBlank>

            <WhiteSpace size='xs' /> {/*  上下间隔 */}


            <PollOptions data={obj.vote} vote={data => this.vote(data)} />


            <WhiteSpace /> {/*  上下间隔 */}

          </div>
        );


      default:

        return (
          <div>
            <WingBlank
              className={'font-black font-30 MsgListBodyOther'}
              >
              <div
                className={'MsgListBodyWord'}
                dangerouslySetInnerHTML={{ __html: obj.content }}
                >
              </div>

            </WingBlank>

            {/*  图片列表 */}
            <ImgsGrid
              data={obj.thumbImgList ? obj.thumbImgList : obj.imgList}
              columnNum={3}
              imgList={obj.imgList}
              />


          </div>
        );

    }



  }
});

export default PostDetails;

