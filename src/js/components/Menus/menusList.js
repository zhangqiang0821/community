import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { Toast, Modal, WhiteSpace, WingBlank, Button, Icon } from 'antd-mobile';
import AppHeader from './AppHeader'
import Style from './style.scss'
import { getMenusAsync, updateMemberFollowAsync, setMenus, noLike, addLike } from  'app/actions/menus'
import userHelper from '../../utils/userHelper'

let tiemId = 0;
class MenusList extends Component {

	constructor(props, context) {
        super(props, context);

    	this.state = {
			menus: [], //所有社区
			likeMenus: [], //关注的社区
			isClickHeaderBtn: false, //避免频繁点击
		}
	}

    toURL(url) {
        this.context.router.push(url);
    }

    //成功
    successToast(text) {
		Toast.success(text);
	}
    //失败
    failToast(text) {
		Toast.fail(text, 1);
	}

    //删除已选社区
    noLike(index) {
    	if(this.refs.likeMenus.querySelectorAll("div").length > 1){
    		this.props.dispatch(noLike(index,0)); //取消已选社区
    		console.log("取消已选社区：" + index);
    	}else{
    		this.failToast("至少选择一个社区");
    	}
    }

    //添加社区
    addLike(index) {
    	if(this.refs.likeMenus.querySelectorAll("div").length < 5){
			let date = new Date().getTime(); //利用当前时间来做排序的索引
    		this.props.dispatch(addLike(index,date)); //增加社区
    		console.log("增加社区" + index);
    	}else{
    		this.failToast("您最多只能选择5个社区");
    	}
    }

    //保存
    sendMenus() {
		let userInfo = userHelper.getUserIdAndToken();
		if (userInfo.userId != '' && userInfo.token != '') {
			//用户已经登录的时候 避免频繁提交数据 禁止频繁点击
			this.setState({ isClickHeaderBtn: true });
			if (this.state.isClickHeaderBtn) {
				clearTimeout(tiemId);
				tiemId = setTimeout(() => this.setState({ isClickHeaderBtn: false }), 1000); //2秒后才能重新触发新的请求
				return false; //处于点击按钮状态
			}
			let groupIds = this.props.likeMenus.map(item => item.id);
    		this.props.dispatch(updateMemberFollowAsync(groupIds, () => this.toURL("/"))); //保存
		}else{
			this.setState({ isClickHeaderBtn: false })
			userHelper.Login(); //跳转到登录页面
		}    	
    }

	componentWillMount() {
		document.querySelector("title").innerHTML = "兴趣社区管理";
		this.props.dispatch(getMenusAsync()); //获取数据
	}

	componentDidMount() {
		userHelper.getUserIdAndToken(); //去拿用户信息
	}

	render() {
		console.log("----this.props.---",this.props)
		const groupIds = this.props.params.groupIds.split(','); //转为数组 groupIds表示不可选的menus集合

		const header = {
			left: {
				text: <Icon type="left" />,
				onClick: () => this.toURL("/")
			},
			center: {
				text:'兴趣社区管理',
				onClick: () => false
			},
			right: {
				text:'保存',
				onClick: () => this.sendMenus()
			}
		}
		
		return(
		<div className={Style.menusBg}>
			<AppHeader {...header}/>
			<div className='appBody'>
				<div className={Style.menusBox}>
					<div className={Style.menusTitle}>已选社区</div>
					<div ref="likeMenus" className={Style.menuList}>
						{
							this.props.likeMenus.map((listItem, i2) => 
								<div key={i2}>
									<span>{listItem.title}</span>
									{listItem.like ? <i onClick={(index) => this.noLike(listItem.id)} className={Style.close}></i> : '' }
								</div>
							)
						}
					</div>
				</div>

				{
					this.props.menus.map((item, i) => 
						<div key={i} className={Style.menusBox}>
							<div className={Style.menusTitle}>{item.menusTitle}</div>
							<div className={Style.menuList}>
								{
									item.list.map((listItem, i2) => 
										listItem.like ? '' :
										<div key={i2} onClick={(index) => groupIds.indexOf(listItem.id) > -1 ? false : this.addLike(listItem.id)} >
											<span className={groupIds.indexOf(listItem.id) > -1 ? Style.defaultMenu : ''}>{listItem.title}</span>
										</div>
									)
								}
							</div>
						</div>
					)
				}
			</div>
        </div>
		)
	}
}

//使用context
MenusList.contextTypes = {
    router: React.PropTypes.object.isRequired
}

//defaultProps
MenusList.defaultProps = {
	likeMenus: [],
		menus: []
}

const initLikeMenus = (datas=[]) => {
	let likes = [];
	datas.map((data, i) => {
		data.list.map((item, i) => {
			if(item.like){
				likes.push(item);
			}
		})
	})
	//排序
	let arr_length = likes.length - 1; //排序次数-1,因为最后一次比较会超出数据下标
	if(arr_length < 1){
		return likes; //没有已选社区时，不用排序，直接返回空数组即可
	}
	//冒泡排序
	for(let i=0; i<arr_length; i++){
		for(let k=0; k<arr_length-i; k++){
			if(likes[k].index > likes[k+1].index){
				let temp = likes[k]; //临时保存
				likes[k] = likes[k+1];
				likes[k+1] = temp; //交换位置
			}
		}
	}
	console.log("排序后：",likes);
	return likes;
}

//从redux中获取需要的props
const select = (state) => {
	return {
		likeMenus: initLikeMenus(state.menus),
		menus: state.menus
	}
}

export default connect(select)(MenusList)