import {
	GET_MENUS,
	SET_MENUS,
	NO_LIKE,
	ADD_LIKE,
} from 'app/actions/actionsTypes'

let init = [
	{
		menusTitle: '已选社区',
		list: [
			{
				id: 0,
				title: "北京1",
				url: './beijing',
				type: 'like', //所属模块
				defaultMenu: false, //默认选中
				like: true, //已选社区
			},
			{
				id: 1,
				title: "违章",
				url: './beijing',
				type: 'like', //所属模块
				defaultMenu: false, //默认选中
				like: true, //已选社区
			},
			{
				id: 2,
				title: "美女",
				url: './beijing',
				type: 'like', //所属模块
				defaultMenu: false, //默认选中
				like: true, //已选社区
			},
			{
				id: 3,
				title: "大众",
				url: './beijing',
				type: 'like', //所属模块
				defaultMenu: false, //默认选中
				like: true, //已选社区
			},
		]
	},
	{
		menusTitle: '地区',
		list: [
			{
				id: 4,
				title: "黑龙江",
				url: './beijing',
				type: 'addr', //所属模块
				defaultMenu: false, //默认选中
				like: false, //已选社区
			},
			{
				id: 5,
				title: "吉林",
				url: './beijing',
				type: 'addr', //所属模块
				defaultMenu: false, //默认选中
				like: false, //已选社区
			},
			{
				id: 6,
				title: "广州",
				url: './beijing',
				type: 'addr', //所属模块
				defaultMenu: false, //默认选中
				like: false, //已选社区
			},
			{
				id: 7,
				title: "上海",
				url: './beijing',
				type: 'addr', //所属模块
				defaultMenu: false, //默认选中
				like: false, //已选社区
			},
			{
				id: 8,
				title: "湛江",
				url: './beijing',
				type: 'addr', //所属模块
				defaultMenu: false, //默认选中
				like: false, //已选社区
			},
		]
	}
]

export default function menus(state = [], action){
	switch(action.type) {
		case GET_MENUS:
			return action.data
		case SET_MENUS:
			return action.data
		case NO_LIKE:
			return state.map(item => {
				let list = item.list.map(menu => {
					if(menu.id == action.id){
						menu.like = false;
						menu.index = action.index;
					}
					return menu;
				})
				return Object.assign({}, item, {
					list: list
				})
			})
		case ADD_LIKE:
			return state.map(item => {
				let list = item.list.map(menu => {
					if(menu.id == action.id){
						menu.like = true;
						menu.index = action.index;
					}
					return menu;
				})
				return Object.assign({}, item, {
					list: list
				})
			})
		default:
			return state;
	}
}