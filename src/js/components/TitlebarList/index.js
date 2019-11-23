//   资讯列表 - 问答标题栏 ,置顶效果，按groupId分
import React from 'react'
import { Link } from 'react-router'

import { List, WhiteSpace, WingBlank } from 'antd-mobile'

import userHelper from '../../utils/userHelper';
import * as postActions from '../../actions/postActions'
import common from '../../utils/common'


import styles from './index.scss'

const Item = List.Item  // Item



const TitlebarList = React.createClass({

  // 初始值
  getInitialState() {
    return {
      postFetching: true,
    };
  },

  getPosts() {
    let UserIdAndToken = userHelper.getUserIdAndToken();
    let params = {
      groupId: this.props.groupId,
      pageNo: this.state.pageIndex,
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


  render() {
    const { groupId, getPosts, type, posts } = this.props;



    /*
         * 1、无数据情况
         */
    if (posts == undefined || posts.length == 0) {
      return (<div></div>)
      // return <NoMsg /> //无数据则返回空
    }
    if (!this.props.postFetching && this.state.dataSource && this.state.dataSource.cloneWithRows) {
      setTimeout(() => {
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(posts.map(item => {
            return item.postsId
          })),
          isLoading: false,
          postFetching: false
        });
      }, 10);
    }


    /*
      * 2、有数据
     */



    return (
      <div>
        {
          this.props.posts.map((item, i) => {
            if (item.isTop == '1') {
              return (<div onClick={() => common.openNewBrowserWithURL(`/post/${item.groupId}/${item.postsId}/${item.catid}`)} to={`/post/${this.props.groupId}/${item.postsId}/${item.catid}`} key={i}>

                <List className='Community-list-top bor-B-gray'>
                  <Item thumb='./images/icon-top.png' className={styles.h70}>
                    <span className='font-darkgray font-26'>{item.title ? item.title : item.content}</span>
                  </Item>

                </List>

              </div>);

            }

          })
        }
      </div>
    );
  }


})



export default TitlebarList;
