//   回复列表
import React, { Component } from 'react'
import { Link } from 'react-router'

import { WhiteSpace, WingBlank } from 'antd-mobile'
import styles from './index.scss'




// 回复列表
class ReplyList extends Component {

  // 初始值
  constructor(props) {
    super(props);
  }

  //点击回复
  clickReply(data) {
    if (this.props.clickReply) {
      this.props.clickReply(data); //返回给父元素
    }
  }

  //删除
  delete(data) {
    if (this.props.delete) {
      this.props.delete(data); //返回给父元素
    }
  }


  componentWillMount() {
    //console.log("回复列表 组件出现前 就是dom还没有渲染到html文档里面");
    //  document.querySelector("title").innerHTML = "话题详情";
  }

  componentDidMount() {
    //  console.log("回复列表 组件渲染完成 已经出现在dom文档里");

  }


  render() {

    const { arr } = this.props;



    // 1、如果list没有内容，出现：没有回复效果
    if (!arr || !arr.length) {
      return (
        <div></div>
      );
    }

    // 2、如果list有内容，出现：回复列表页面
    //  循环插入子组件
    //item.isOwner ,判断是否是本人，本人有删除按钮
    const itemsContent = arr.map(
      (item, i) => (
        <div
          className={styles.ReplyListitem + (item.is_owner == '1' ? ' font-26' : ' inputFocusHandle font-26')}
          key={item.id}
          onClick={data =>
          { item.is_owner == '1' ? this.delete(item) : this.clickReply(item) }
          }
        >
          <div className={styles.ReplyListUser + ' font-blue'}>
            {item.author_username}
          </div>

          <div className={item.pid == '0' ? styles.NoToAuthor : styles.ToAuthor}>
            <span className={styles.plr6}>回复</span>
          <div className={styles.ReplyListUser + ' font-blue'}>
            {item.to_author_username}
          </div>
        </div>

        <span>: </span>

        <span
          dangerouslySetInnerHTML={{ __html: item.new_content }}
        >
        </span>

        <div className='float-clear'></div>

        </div >
      )
    );


    return (
      <WingBlank className={styles.ReplyList} >
        {itemsContent}
      </WingBlank>
    );


  }
}

export default ReplyList;
