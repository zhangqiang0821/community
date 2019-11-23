import React from 'react'
import { Provider } from 'react-redux'
import routes from '../routes'
import { Router } from 'react-router'
import 'moment/locale/zh-cn'

// 加载全局样式
import 'style/style.scss'
import 'style/default.scss'



const Root = ({ store, history }) => {
  
  return (
  <Provider store={store}>
    <Router history={history} routes={routes} />
  </Provider>
 )
}


export default Root