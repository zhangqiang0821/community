//导航条、兴趣社区管理
import {
	GET_MENUS,
	SET_MENUS,
	NO_LIKE,
	ADD_LIKE,
	GET_MEMBER_FOLLOW, //已关注社区
} from './actionsTypes'
//Toast提示
import { Toast } from 'antd-mobile';
//ajax请求
import CommunityService from 'app/services/communityService/'

export const getMenus = data => ({ type: GET_MENUS, data: data }) //获取导航条列表
export const setMenus = data => ({ type: SET_MENUS, data: data }) //更新导航条列表
export const noLike = (id,index=0) => ({ type: NO_LIKE, id: id, index:index }) //取消已选社区 @param (ID,排序)
export const addLike = (id,index=0) => ({ type: ADD_LIKE, id: id, index:index }) //添加关注社区 @param (ID,排序)
export const getMemberFollow = data => ({ type: GET_MEMBER_FOLLOW, data: data}) //已关注的社区


//获取导航条列表 异步请求
export const getMenusAsync = () => {
	Toast.loading("", 30, () => Toast.info("网络错误",2));
	return function(dispatch) {
		CommunityService.getMemberFollow().then(data => {
			console.log(data,"获取已关注的社区");
			Toast.hide(); //关闭加载中
			if(data.code == "1000"){
				let groupIds = data.data.groups.map(item => item.groupId);
				return groupIds;
			}else{
				Toast.info(data.msg);
				return false;
			}
		}, () => {
            Toast.hide(); //隐藏Toast
            Toast.info("系统繁忙，请稍后再试");
        }).then(groupIds => {
			CommunityService.getGroupList().then(data => {
				console.log(data,"获取所有社区");
				Toast.hide(); //关闭加载中
				if(data.code == "1000"){
					let _data = [{
						menusTitle: '地区',
						list: [],
					},{
						menusTitle: '热门社区',
						list: [],
					},{
						menusTitle: '热门车型',
						list: [],
					}];
					data.data.groups.map((item, i) => {
						let like = false;
						if(groupIds.indexOf(item.groupId) > -1){
							//已关注
							like = true;
						}
						let _item = {
							id: item.groupId,
							title: item.groupName,
							url: '',
							type: item.groupType, //社区类型
							defaultMenu: false, //默认选中
							like: like, //已选社区
							index: 0, //排序
						}
						if(item.groupType == 1){
							_data[0].list.push(_item); //地区
						}else if(item.groupType == 2){ 
							_data[2].list.push(_item); //热门车型
						}else if(item.groupType == 3){
							_data[1].list.push(_item); //热门社区
						}
					})
					dispatch(getMenus(_data));
				}else{
					Toast.hide();
					Toast.info(data.msg,2);
				}
			}, () => {
				Toast.hide(); //隐藏Toast
				Toast.info("系统繁忙，请稍后再试");
			});
		});
	}
}

//更新关注 异步请求
export const updateMemberFollowAsync = (groupIds, toUrl) => {
	Toast.loading("", 30, () => Toast.info("网络错误",2));
	return function(dispatch) {
		let postData = {
			// "userId": "13800138000", //用户id
			// "token": "ADJKSKJNKJASLKSKLS", //token
			groupIds: groupIds
		}
		CommunityService.updateMemberFollow(postData).then(data => {
			console.log(data,"更新关注");
			Toast.hide(); //隐藏加载中...
			if(data.code == "1000"){
				Toast.info("保存成功", 1);
				setTimeout(() => toUrl(), 500); //延迟0.5秒再跳转
			}else{
				Toast.info(data.msg, 2);
			}
		}, () => {
            Toast.hide(); //隐藏Toast
            Toast.info("系统繁忙，请稍后再试");
        });
	}
}

//获取所有社区
export const getGroupListAsync = () => {
	return function(dispatch) {
		CommunityService.getGroupList().then(data => {
			console.log(data,"获取所有社区");
			Toast.hide(); //关闭加载中
			if(data.code == "1000"){
				let _data = [{
					menusTitle: '地区',
					list: [],
				},{
					menusTitle: '热门社区',
					list: [],
				},{
					menusTitle: '热门车型',
					list: [],
				}];
				data.data.groups.map((item, i) => {	
					let _item = {
						id: item.groupId,
						title: item.groupName,
						url: '',
						type: item.groupType, //社区类型
						defaultMenu: false, //默认选中
						like: false, //已选社区
					}
					if(item.groupType == 1){
						_data[0].list.push(_item); //地区
					}else if(item.groupType == 2){ 
						_data[2].list.push(_item); //热门车型
					}else if(item.groupType == 3){
						_data[1].list.push(_item); //热门社区
					}
				})
				dispatch(getMenus(_data));
			}else{
				Toast.hide();
				Toast.info(data.msg,2);
			}
		}, () => {
            Toast.hide(); //隐藏Toast
            Toast.info("系统繁忙，请稍后再试");
        });
	}
}

//获取已关注的社区
export const getMemberFollowAsync = () => {
	return function(dispatch) {
		// Toast.loading("加载中...", 30 , () => Toast.info("网络错误",2)); //因为其他地方也调用，所以这里不显示加载中 兼容IOS
		CommunityService.getMemberFollow().then(data => {
			console.log(data,"获取已关注的社区");
			Toast.hide(); //关闭加载中
			if(data.code == "1000"){
				let groupIds = data.data.groups.map(item => item.groupId);
				dispatch(getMemberFollow(data.data.groups)); //已关注的社区
				return groupIds;
			}else{
				Toast.info(data.msg);
				return false;
			}
		}, () => {
            Toast.hide(); //隐藏Toast
            Toast.info("系统繁忙，请稍后再试");
        });
	}
}