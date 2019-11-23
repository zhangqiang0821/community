//   九宫格图片 和 点击看大图的事件
import React, { Component } from 'react'
import { Link } from 'react-router'
import styles from './index.scss'

import { Grid, WingBlank, WhiteSpace } from 'antd-mobile'

// 添加点击弹出大图的组件
import ImgsCarousel from 'app/components/ImgsCarousel'
import common from '../../../utils/common'

let openNewBrowserWithURL = false;
export default class ImgsGrid extends Component {
  // 初始值
  constructor(props) {
    super(props);
  }

  /**
   * 打开图片集合
   */
  openNewBrowserWithURL(url) {
    openNewBrowserWithURL = true;
    common.openNewBrowserWithURL(url);
  }

  /**
   * 打开详情页
   */
  toUrl() {
    this.props.clickImgsGrid();
  }

  render() {
    const { data, columnNum, imgList, ...states } = this.props;



    return (
      <div style={{ width: '100%' }} onClick={() => openNewBrowserWithURL ? openNewBrowserWithURL = false : this.toUrl()}>
        {this.props.imgList && this.props.imgList.length > 0 ?
          <Grid
            {...states}
            data={this.props.data}
            columnNum={this.props.imgList.length > 1 ? this.props.columnNum : 1}
            hasLine={false}
            className={styles.MsgListGrid}
            renderItem={(data, index) => (
              <div className={styles.MsgListGridImgList + (this.props.imgList.length > 1 ? '' : ' ' + styles.MsgListGridImgBox)}
                onClick={() => this.openNewBrowserWithURL('/ImgsCarousel?imgs=' + this.props.imgList + '&index=' + index)}
                to={'/ImgsCarousel?imgs=' + this.props.imgList + '&index=' + index}>
                <img src={this.props.imgList.length > 1 ? this.props.data[index] : this.props.imgList[index]} className={styles.MsgListGridImg + ' ' + 'img'} />
              </div>
            )}
          />
          : ''}
      </div>
    )
  }
}