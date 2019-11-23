import React, { Component, PropTypes } from 'react'
import { AppHeader } from 'app/components/'
import { List, TextareaItem, Icon, InputItem, Toast, Carousel, Modal, Checkbox } from 'antd-mobile';
import { createForm } from 'rc-form';
import Style from './style.scss'
import common from '../../utils/common'
require("lrz")

/**
 * 手指的坐标
 */
let coordinateInfo = {
	y: 0, //滑动开始时的Y坐标
	x: 0, //滑动开始时的X坐标
	endY: 0, //滑动结束时的Y坐标
	endX: 0, //滑动结束时的X坐标
	touchY: 0, //滑动的距离
	startTime: 0, //触发开始的时间
	endTime: 0, //触发结束的时间
	click: false, //是否触发点击事件
	scrollTop: 0, //当前滚动条的位置
}
let winH = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight; //窗口高度

class ImgsCarousel extends Component {

	constructor(props, context) {
		super(props, context);

		let imgs = this.props.location.query.imgs ? this.props.location.query.imgs.split(",") : [];
		let index = this.props.location.query.index ? this.props.location.query.index : 0;
		this.state = {
			imgs: imgs, //图片集合
			imgBoxIndex: index, //图片页面的序号
		}
	}

	//跳转到对应的url
	toURL(url) {
		this.context.router.push(url);
	}

	//显示大图
	showImgBox(num) {
		this.setState({
			imgBoxIndex: num,
			showPage: 'imgBox'
		})
	}

	//展开图片后的标题
	showImgBoxTitle(num) {
		//避免页面实时渲染，到时没有过度动画
		setTimeout(() => {
			this.setState({
				imgBoxIndex: num
			})
		}, 10);
	}

	/**
	 * 手指放到图片上
	 */
	imgTouchStart(e) {
		winH = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight; //窗口高度
		if (e.target.height + 45 < winH) {
			return; //图片在容器内 则不需要移动
		}
		if (coordinateInfo.click) {
			e.preventDefault(); //阻止默认事件
			coordinateInfo.startTime = new Date().getTime();
			coordinateInfo.x = e.targetTouches[0].clientX;
			coordinateInfo.endX = e.targetTouches[0].clientX;
		}

		coordinateInfo.y = e.targetTouches[0].clientY;
		coordinateInfo.endY = e.targetTouches[0].clientY;
		coordinateInfo.touchY = 0;
		coordinateInfo.scrollTop = document.body.scrollTop; //当前滚动条的位置

		e.target.style.transitionDuration = '0s'; //屏蔽过渡效果
	}

	/**
	 * 手指在图片上滑动
	 */
	imgTouchMove(e) {
		if (e.target.height + 45 < winH) {
			return; //图片在容器内 则不需要移动
		}
		e.preventDefault(); //阻止默认事件

		coordinateInfo.endY = e.targetTouches[0].clientY; //当前手指的位置
		coordinateInfo.touchY = (coordinateInfo.endY - coordinateInfo.y - coordinateInfo.scrollTop) / 2; //真正的下拉距离 = (滑动距离 - 滚动条距离)/拉力度

		if (coordinateInfo.click) { //兼容安卓4.4及以下版本 滚动条无法滑动的bug
			coordinateInfo.endX = e.targetTouches[0].clientX; //保存X轴坐标，用于判断是否重复点击事件
			if (coordinateInfo.y - coordinateInfo.endY > 0) {
				//上滑
				document.body.scrollTop = (coordinateInfo.y - coordinateInfo.endY) + coordinateInfo.scrollTop;
			} else if (coordinateInfo.endY - coordinateInfo.y - coordinateInfo.scrollTop < 0) {
				//下滑却scrollTop不等于0
				document.body.scrollTop = coordinateInfo.scrollTop - (coordinateInfo.endY - coordinateInfo.y);
			}
		}

		// coordinateInfo.touchY = coordinateInfo.touchY > 0 ? coordinateInfo.touchY : 0;

		this.setRefTransform(e.target, `translate3d(0px, ${coordinateInfo.touchY}px, 0px)`); //兼容低版本浏览器
	}

	/**
	 * 手指离开图片
	 */
	imgTouchEnd(e) {
		if (e.target.height + 45 < winH) {
			return; //图片在容器内 则不需要移动
		}
		if (coordinateInfo.click) {
			//如果滑动事件小于300毫秒，并且未移动 则触发点击事件
			coordinateInfo.endTime = new Date().getTime();
			if ((coordinateInfo.endTime - coordinateInfo.startTime < 300) && coordinateInfo.endY === coordinateInfo.y && coordinateInfo.endX === coordinateInfo.x) {
				e.target.click(); //触发点击事件
			}
		}
		e.target.style.transitionProperty = 'transform'; //加载中过渡效果
		e.target.style.transitionTimingFunction = "linear";
		e.target.style.transitionDuration = '0.3s';
		this.setRefTransform(e.target, `translate3d(0px, 0px, 0px)`); //兼容低版本浏览器
	}

	/**
     * 设置transform
     * @param ref对象
     * @param style 样式
     */
	setRefTransform(ref, style) {
		ref.style.transform = style;
		ref.style.webkitTransform = style;
		ref.style.mozTransform = style;
		ref.style.oTransform = style;
	}

	componentWillMount() {
	}

	componentDidMount() {
		let version = common.getAndroidVersion();
		if (version) {
			version = version.split(".");
			if ((version[0] * 1) < 5 && (version[1] * 1) < 5) {
				coordinateInfo.click = true;; //4.4及以下的系统需要触发点击事件
			}
		}
	}

	render() {
		//图片
		// const header = {
		// 	left: {
		// 		text: <Icon type="left" />,
		// 		onClick: () => common.closeAppView(true)
		// 	},
		// 	center: {
		// 		text: ((this.state.imgBoxIndex * 1) + 1) + "/" + this.state.imgs.length,
		// 		onClick: () => false
		// 	},
		// 	right: {
		// 		text: '',
		// 		onClick: () => false //删除图片
		// 	},
		// 	height: '90',
		// }
		//console.log(this.state.imgs,'------');
		return (
			<div className={Style.showImgBox + " w-carousel"}>
				{/* <AppHeader {...header} /> */}
				<Carousel className={"my-carousel " + Style.myCarousel}
					dots={this.state.imgs.length == 1 ? false : true}
					selectedIndex={this.state.imgBoxIndex * 1}
					beforeChange={(from, to) => this.showImgBoxTitle(to)}
				>
					{ //图片集
						this.state.imgs.map((img, i) =>
							<div key={i} className="item">
								<img src={img}
									onClick={() => common.closeAppView(true)}
									onTouchStart={(e) => this.imgTouchStart(e)}
									onTouchMove={(e) => this.imgTouchMove(e)}
									onTouchEnd={(e) => this.imgTouchEnd(e)}
								/>
							</div>
						)
					}
				</Carousel>
			</div>
		)
	}
}

//使用context
ImgsCarousel.contextTypes = {
	router: React.PropTypes.object.isRequired
}

//props默认值
ImgsCarousel.defaultProps = {

}

export default ImgsCarousel