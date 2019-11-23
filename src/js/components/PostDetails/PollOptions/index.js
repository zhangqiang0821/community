//   资讯内容- 投票
import React, { Component } from 'react'
import { Link } from 'react-router'
import userHelper from '../../../utils/userHelper'
import { List, Radio, Button, Toast, Flex, WhiteSpace, WingBlank } from 'antd-mobile'
import 'style/PostDetails.scss'


const RadioItem = Radio.RadioItem;  // Radio
const Item = List.Item;  // Item



const PollOptions = React.createClass({

  getInitialState() {
    return {
      value: 1,
    };
  },

  // Radio 点击事件
  onChange(pollValue) {
    this.setState({
      pollValue,
    });
  },


  // '投票’按钮事件
  SubmitVoteResult(value) {
    let userInfo = userHelper.getUserIdAndToken();
    if (!userInfo.userId || !userInfo.token) {
      userHelper.Login(); //先登录
      return false;
    }
    if (!value) {
      Toast.info('请选择某一选项', 1);
    } else {
      this.vote(value);
    }

  },

  /**
    * 投票 
    */
  vote(data) {
    if (this.props.vote) {
      this.props.vote(data); //传递给父组件
    }
  },


  componentWillMount() {
    //console.log("资讯内容列表 - 内容CommentType 组件出现前 就是dom还没有渲染到html文档里面");
    // document.querySelector("title").innerHTML = "话题详情";
  },

  componentDidMount() {
    //console.log("资讯内容列表 - 内容CommentType 组件渲染完成 已经出现在dom文档里");

  },





  render() {

    const { data } = this.props;

    const obj = this.props.data;

    // Radio 模拟数据
    const { pollValue } = this.state;


    // console.log("--资讯内容列表 勾选 voteId --", pollValue);
    // console.log("--资讯内容列表 列表 obj.itemList --",obj.hasVote);


    //6：投票
    switch (this.props.data.hasVote) {
      case "1":
        //已经投票
        return (

          <WingBlank>

            <List>

              {obj.itemList.map((item, index) => (
                <Item data-seed="logId" key={item.voteId} className='RadioItem' multipleLine >

                  <Flex justify="between">
                    <div className='font-28 font-darkgray' style={{ paddingLeft: '0.3rem', wordBreak: 'break-all' }} dangerouslySetInnerHTML={{ __html: (index + 1) + '、' + item.content }}></div>
                    <div className='font-30 font-black ft-right' style={{ minWidth: '79PX' }}>
                      {item.voteResult.cnt ? item.voteResult.cnt + '票 ' : '0票'}
                    </div>
                  </Flex>

                </Item>
              ))}

            </List>

            <Button className="btn" type="primary" disabled >投票</Button>

          </WingBlank>

        );

      default:
        //未投票

        return (

          <WingBlank>
            <List>
              {obj.itemList.map((item, index) => (
                <RadioItem key={item.voteId} className='RadioItem' checked={pollValue === item.voteId} onChange={() => this.onChange(item.voteId)}>
                  <div className='font-28 font-darkgray' style={{ paddingLeft: '0.3rem', paddingRight:'.5rem', wordBreak: 'break-all' }} dangerouslySetInnerHTML={{ __html: (index + 1) + '、' + item.content }}></div>
                </RadioItem>
              ))}

            </List>
            <Button className="btn" type="primary" onClick={() => this.SubmitVoteResult(pollValue)}>投票</Button>
          </WingBlank>

        );
    }



  }
});

PollOptions.defaultProps = {
  data: {
    itemList: []
  }
}

export default PollOptions;

