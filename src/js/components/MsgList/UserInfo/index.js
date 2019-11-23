//   用户信息：头像和昵称
import React, { Component } from 'react'
import styles from './index.scss'

export default class UserInfo extends Component {
  // 初始值
  constructor(props) {
    super(props);
  }


  render() {

    // img:头像, nickname：用户名 , floor：楼层 ,hideCatidImg:隐藏右上角小图标
    const { img, nickname, floor, catid, hideCatidImg } = this.props;

    //楼层显示
    let floorText = '';
    switch (floor + '') {
      case '1':
        floorText = '沙发'; break;
      case '2':
        floorText = '板凳'; break;
      case '3':
        floorText = '地板'; break;
      default:
        floorText = floor ? '#' + floor : '';
    }

    // catid  分类ID（1：违章热点 2：资讯 3：违章详情 4:话题 5：问答 6：投票，7：社区资讯）
    const headImgUrl = (this.props.img == "" || this.props.img == undefined || this.props.img == null) ? './images/Default-Avatar.png' : this.props.img

    let catidImg = ''
    switch (catid) {
      case '4': catidImg = <img src='./images/topic-icon2.png' className={styles.imgAsk} />
        break;
      case '5': catidImg = <img src='./images/qa-icon2.png' className={styles.imgAsk} />
        break;
      case '6': catidImg = <img src='./images/vote-icon2.png' className={styles.imgAsk} />
        break;
    }

    return (

      <dl className={floor >= 1 ? styles.MsgListUser + ' ' + styles.CommentListUser : styles.MsgListUser}>

        <dt>
          <img src={headImgUrl} className='img' />
        </dt>

        <dd>

          {this.props.nickname}

          <div className='font-lightgray float-right'>

            {hideCatidImg ? '' : catidImg}
            {floorText}

          </div>

        </dd>

      </dl>

    )
  }
}