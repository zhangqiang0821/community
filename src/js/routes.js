import React from 'react'
import { Route, IndexRoute, RouterContext } from 'react-router'
// 加载路由
import {
  App,
  Home, //首页
  Msg, // 话题详情
  CommunityList,//关注社区列表
  MyPost, //我的发帖
} from './containers'

//加载组件
import {
  Menus, //管理关注功能 导航条
  IssueTopic, //发布话题、问题、投票
  ImgsCarousel, //图片预览效果 模仿微信
} from './components/'

import Test from './containers/test'

//  每个路由都有Enter和Leave钩子，用户进入或离开该路由时触发
export default (
  <Route path="/" component={App}>
    <IndexRoute component={Home}/>
    <Route path="community/:groupId(/:groupName)" component={CommunityList} />
    <Route path="Menus(/:groupIds)" component={Menus} />
    <Route path="IssueTopic/:groupIds/:groupName" component={IssueTopic} />
    <Route path="ImgsCarousel" component={ImgsCarousel} />
    <Route path="post/:groupId/:id(/:catid)" component={Msg} />
    <Route path="myPost" component={MyPost} />
    <Route path="*" component={Home} />
  </Route>
);