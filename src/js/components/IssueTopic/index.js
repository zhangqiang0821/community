import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { AppHeader } from 'app/components/'
import { List, TextareaItem, Icon, InputItem, Toast, Carousel, Modal, Checkbox } from 'antd-mobile';
import { createForm } from 'rc-form';
import { getMemberFollowAsync } from 'app/actions/menus'
import CommunityService from 'app/services/communityService'
import PostService from 'app/services/postService'
import UploadService from '../../services/uploadService'
import common from '../../utils/common'
import userHelper from '../../utils/userHelper'
import Style from './style.scss'
require("lrz")

let tiemId = 0;
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

class IssueTopic extends Component {

	constructor(props, context) {
		super(props, context);

		this.state = {
			type: {
				index: 0, // 0、话题 1、问题 2、投票
				list: ["话题", "求助", "投票"],
				info: '', //详情
			},
			optionBox: [
				//{ title: "选项一" },{ title: "选项二" },{ title: "选项三" },{ title: "选项四" },
			],
			setText: {
				text: '', //输入框的文本
				index: -1 //所需投票序号
			},
			showPage: 'default', //default: 默认、setOptionBox：文本输入、imgBox: 图片放大、postAddress: 发布地址
			imgs: [], //图片集合 @param src 服务器上的图片地址 @param tempSrc 本地的base64
			imgBoxIndex: 0, //图片页面的序号
			postAddress: { id: 1, title: "广东", checked: true }, //默认发布地址
			postAddressList: [ //可选发布地址
				{ id: 1, title: "广东", checked: true },
			],
			isClickHeaderBtn: false, //点击头部按钮
			optionBoxAutoFocus: false, //输入框获取焦点
			isLoad: false, //加载完毕
		}
	}

	//跳转到对应的url
	toURL(url) {
		this.context.router.push(url);
	}

	//取消发布
	cancelPost() {
		this.setState({ isClickHeaderBtn: true })
		if (this.state.isClickHeaderBtn) {
			return false; //处于点击按钮状态
		}
		Modal.alert('', <span style={{ fontSize: '16px', padding: '15px 0', color: '#1a1a1a', display: 'block' }}>退出此次编辑?</span>, [
			{ text: '取消', onPress: () => this.setState({ isClickHeaderBtn: false }), style: { color: '#108ee9' } },
			{
				text: '退出', onPress: () => {
					this.setState({ isClickHeaderBtn: false });
					_cxytj.recordUserBehavior('', 'closeTopicBtn', '话题取消退出按钮'); //用户行为统计
					common.closeAppView(true);
					// this.toURL('/');
				}, style: { color: '#108ee9' }
			}
		])
	}

	//发布
	post() {
		let userInfo = userHelper.getUserIdAndToken();
		if (!userInfo.userId && !userInfo.token) {
			userHelper.Login();
			return false; //跳转到登录页面
		}
		let text = this.refs.postTextarea.refs.textarea.innerHTML;
		if (text.length < 5) {
			Toast.info('内容不能少于5个字符', 1);
			return false;
		}

		//分类ID
		let catid = 4; //话题
		let vote_options = []; //投票选项
		if (this.state.type.index == 1) {
			if (text.length > 100) {
				Toast.info('内容不能超过100个字符', 1);
				return false;
			}
			catid = 5; //问答
		} else if (this.state.type.index == 2) {
			if (text.length > 100) {
				Toast.info('内容不能超过100个字符', 1);
				return false;
			}
			catid = 6; //投票
			vote_options = this.state.optionBox.map(item => item.title);
		}

		let imgList = this.state.imgs.map(img => img.src); //图片集
		let postData = {
			"groupId": this.state.postAddress.id,
			"catid": catid,
			"content": text,
			"imgList": imgList,
		}
		if (catid === 6) {
			postData.vote_options = vote_options; //投票选项数组
		}

		//禁止频繁点击
		this.setState({ isClickHeaderBtn: true });
		if (this.state.isClickHeaderBtn) {
			return false; //处于点击按钮状态
		}

		console.log(postData, "postData");
		Toast.hide(); //隐藏加载中
		Toast.loading("", 30, () => Toast.info("网络错误", 2));
		PostService.createPost(postData).then(data => {
			Toast.hide(); //隐藏加载中
			console.log(data);

			_cxytj.recordUserBehavior('', 'postTopicBtn', '话题发布按钮', catid, this.state.postAddress.id); //用户行为统计

			if (data.code == 1000) {
				data = data.data;
				if (data.points && data.points > 0) {
					Toast.info(`发布成功 +${data.points}分`, 1);
				} else {
					Toast.info('发布成功', 1);
				}

				localStorage.setItem("tabsCallback", "1"); //需要刷新列表数据
				setTimeout(() => {
					common.closeAppView();
				}, 1000)
				// this.toURL("/"); //返回首页
			} else {
				Toast.info(data.msg, 2);
			}
		}, () => {
			Toast.hide(); //隐藏Toast
			Toast.info("系统繁忙，请稍后再试");
		}).then(() => this.setState({ isClickHeaderBtn: false }));
	}

	//删除选项
	deleteOption(index) {
		if (this.state.isClickHeaderBtn) {
			return false; //处于点击按钮状态
		} else {
			this.setState({ isClickHeaderBtn: true })
		}
		Modal.alert('', <span style={{ fontSize: '16px', padding: '15px 0', color: '#1a1a1a', display: 'block' }}>确定删除此选项么?</span>, [
			{ text: '取消', onPress: () => this.setState({ isClickHeaderBtn: false }), style: { color: '#108ee9' } },
			{
				text: '确定', onPress: () => {
					console.log("你删除了第" + ((index * 1) + 1) + "个选项");
					let optionBox = this.state.optionBox;
					optionBox.splice(index, 1); //删除
					this.setState({
						optionBox: optionBox,
						isClickHeaderBtn: false
					})
				}, style: { color: '#108ee9' }
			}
		])

	}

	//修改选项
	setOption(index, text) {
		console.log("修改第" + ((index * 1) + 1) + "个选项，原内容为：" + text);
		this.setState({
			setText: {
				text: text,
				index: index
			},
			showPage: 'setOptionBox',
			optionBoxAutoFocus: true,
		})
	}

	//显示添加文字选项
	showSetText() {
		this.setState({
			setText: {
				text: '',
				index: -1
			},
			showPage: 'setOptionBox',
			optionBoxAutoFocus: true,
		})
	}

	//保存文字选项
	setText() {
		let text = this.refs.setText.refs.input.value;
		let optionBox = this.state.optionBox;
		if (text.replace(/\s*/g, '') === '') {
			Toast.info("投票选项不能为空", 1);
			return false;
		}
		if (this.state.setText.index === -1) {
			//添加文字选项
			optionBox.push({ title: text });

		} else {
			//修改文字选项
			optionBox.splice(this.state.setText.index, 1, { title: text });
		}
		this.setState({
			optionBox: optionBox,
			setText: {
				text: '',
				index: -1
			},
			showPage: 'default'
		})
	}

	//动态改变input的内容
	handleChange(e) {
		this.setState({
			setText: Object.assign({}, this.state.setText, {
				text: e
			})
		});
	}

	//选择发布类型
	selectType(num) {
		console.log("选择发布类型：", num, this.state.type.list)
		let info = ''; //投票详情
		if (num !== 2 && this.state.optionBox.length > 0) {
			info = `(${this.state.optionBox.length})`;
		}
		this.setState({
			type: Object.assign({}, this.state.type, {
				index: num,
				info: info
			})
		})
	}

	/**
	 * 图片上传
	 */
	picture(base64) {
		this.postImgToUploadImg(base64);
	}
	uploadImgs(e) {
		console.log(e.target.files, '图片上传');
		let files = e.target.files;
		if (files.length + this.state.imgs.length > 9) {
			Toast.info("最多只能上传9张图片", 2);
			return;
		}
		for (let i = 0; i < files.length; i++) {
			console.log(files[i]);
			this._lrz(files[i], i);
		}
	}

	/**
	 * 图片压缩上传
	 * @param e 图片资源
	 */
	_lrz(e) {
		try {
			let files = e;
			let quality = 1;
			if (files.size > 1024 * 1024 * 5) {
				quality = .5;
			}
			else if (files.size > 1024 * 1024 * 2) {
				quality = .5;
			}
			else if (files.size > 1024 * 1024) {
				quality = .5;
			}
			else if (files.size > 1024 * 500) {
				quality = .4;
			}
			else if (files.size > 1024 * 100) {
				quality = .5;
			} else {
				quality = .7;
			}
			lrz(files, {
				width: 1024,
				quality: quality
			}).then((rst) => {
				// 处理成功会执行
				console.log('拿到的图片数据', rst);
				this.postImgToUploadImg(rst.base64);

			}).catch((err) => {
				// 处理失败会执行
				Toast.fail('上传失败!', 1);
			}).always(() => {
				// 不管是成功失败，都会执行
				this.refs.uploadImgInput.value = ""; //清空文件上传的内容 避免上传同一张照片或是拍照时出现的图片无法展示的bug
			});
		} catch (e) {
			Toast.info("图片上传失败", 2)
			console.log(e);
		}

	}

	/**
	 * 上传图片到服务器
	 * @param base64 base64图片
	 */
	postImgToUploadImg(base64) {
		//添加图片
		let imgs = this.state.imgs;
		let index = imgs.push({
			tempSrc: base64
		});
		this.setState({
			imgs: imgs
		})

		//上传图片到服务器
		let uploadimgData = {
			content: base64.substr((base64.indexOf('base64,') + 7)), //只上传图片流
			format: 'jpg',
			channel: 'app',
			thumbnail: '200x200', //缩略图尺寸
			watermark: true //加水印
		}
		UploadService.uploadImg(uploadimgData).then(data => {
			console.log("图片上传接口：", data);
			if (data.code === 0) {
				console.log("上传成功")
				imgs[index - 1].src = data.data.url;
				this.setState({
					imgs: imgs
				})
			} else {
				Toast.info(data.msg, 2);
			}
		}, () => {
			Toast.info("系统繁忙，请稍后再试");
		})
	}

	/**
	 * 显示图片上传动画
	 */

	//显示大图
	showImgBox(num) {
		this.setState({
			imgBoxIndex: num,
			showPage: 'imgBox'
		})
	}

	//删除图片
	deleteImg() {
		if (this.state.isClickHeaderBtn) {
			return false; //处于点击按钮状态
		} else {
			this.setState({ isClickHeaderBtn: true })
		}
		Modal.alert('', <span style={{ fontSize: '16px', padding: '15px 0', color: '#1a1a1a', display: 'block' }}>要删除这张图片吗?</span>, [
			{ text: '取消', onPress: () => this.setState({ isClickHeaderBtn: false }), style: { color: '#108ee9' } },
			{
				text: '确定', onPress: () => {
					let index = this.state.imgBoxIndex;
					let imgs = this.state.imgs;
					imgs.splice(index, 1), //删除
						this.setState({
							imgs: imgs, //删除
							showPage: 'default',
							isClickHeaderBtn: false
						})
				}, style: { color: '#108ee9' }
			}
		])
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

	//展开图片后的标题
	showImgBoxTitle(num) {
		//避免页面实时渲染，到时没有过度动画
		setTimeout(() => {
			this.setState({
				imgBoxIndex: num
			})
		}, 10);
	}

	//显示发布到
	showPostAddress() {
		console.log(this.state);
		let postAddressList = [];
		let postAddressListids = [];
		this.state.postAddressList.map((item, i) => {
			if (item.id === this.state.postAddress.id) {
				item.checked = true; //当前选中的发布地址
			} else {
				item.checked = false;
			}
			if (postAddressListids.indexOf(item.id) === -1) {
				postAddressListids.push(item.id); //保存id
				postAddressList.push(item); //保存对象
			}
			return item;
		})
		this.setState({
			showPage: 'postAddress',
			postAddressList: postAddressList
		})
	}

	//选择发布地址
	selectPostAddress(index) {
		let postAddressList = this.state.postAddressList.map((item, i) => {
			if (i === index) {
				item.checked = true;
			} else {
				item.checked = false;
			}
			return item;
		})

		this.setState({
			postAddressList: postAddressList
		})
	}

	//确定发布地址
	setPostAddress() {
		this.state.postAddressList.map((item, i) => {
			if (item.checked) {
				this.setState({
					postAddress: item,
					showPage: 'default'
				})
			}
		})
	}

	componentWillMount() {
	}

	componentDidMount() {
		common.controlLoading(); //关闭安卓的加载中
		let version = common.getAndroidVersion();
		if (version) {
			version = version.split(".");
			if ((version[0] * 1) < 5 && (version[1] * 1) < 5) {
				coordinateInfo.click = true;; //4.4及以下的系统需要触发点击事件
			}
		}
		Toast.loading("", 30, () => Toast.info("网络错误", 2));
		CommunityService.getMemberFollow().then(data => {
			console.log(data, "获取已关注的社区");
			Toast.hide(); //关闭加载中
			if (data.code == "1000") {
				let postAddressList = data.data.groups.map((item, i) => ({
					id: item.groupId,
					title: item.groupName,
					// checked: i === 0 ? true : false,
					checked: false,
				}))
				let postAddress = {
					id: this.props.params.groupIds,
					title: decodeURI(this.props.params.groupName), //转码
					checked: true,
				}
				this.setState({
					postAddressList: [postAddress, ...postAddressList],
					postAddress: postAddress,
					isLoad: true, //加载完毕
				})
			} else {
				Toast.info(data.msg);
			}
		}, () => {
			Toast.info("系统繁忙，请稍后再试");
		});
	}

	render() {
		const header = {
			left: {
				text: '取消',
				onClick: () => this.cancelPost()
			},
			center: {
				text: '',
				onClick: () => false
			},
			right: {
				text: '发布',
				onClick: () => this.post()
			}
		}
		//投票
		const header2 = {
			left: {
				text: <Icon type="left" />,
				onClick: () => this.setState({
					setText: {
						text: '',
						index: -1
					},
					showPage: 'default',
				})
			},
			center: {
				text: '文字选项',
				onClick: () => false
			},
			right: {
				text: '确定',
				onClick: () => this.setText()
			}
		}
		//图片
		const header3 = {
			left: {
				text: <Icon type="left" />,
				onClick: () => this.setState({
					setText: {
						text: '',
						index: -1
					},
					showPage: 'default'
				})
			},
			center: {
				text: ((this.state.imgBoxIndex * 1) + 1) + "/" + this.state.imgs.length,
				onClick: () => false
			},
			right: {
				text: '删除',
				onClick: () => this.deleteImg() //删除图片
			}
		}
		//发布到（地址）
		const header4 = {
			left: {
				text: <Icon type="left" />,
				onClick: () => this.setState({
					setText: {
						text: '',
						index: -1
					},
					showPage: 'default'
				})
			},
			center: {
				text: '发布到',
				onClick: () => false
			},
			right: {
				text: '',
				onClick: () => false
			}
		}
		const { getFieldProps } = this.props.form;

		return (
			<div className={(common.needAddAppHeaderHeight() ? '' : 'notAddHeader')}>
				<div style={this.state.showPage !== 'default' ? { display: "none" } : {}}>
					<AppHeader {...header} />
					<div className='appBody'>
						{/* 图文 state*/}
						<div className={Style.topBox}>
							<TextareaItem
								{...getFieldProps('count', {
									initialValue: '',
								}) }
								ref="postTextarea"
								rows={4}
								style={{ paddingRight: "0.3rem" }} />
							{/* 图片上传 start*/}
							<div className={Style.imgBox}>
								{ //图片集
									this.state.imgs.map((img, i) =>
										<div key={i} onClick={(index) => this.showImgBox(i)}>
											<img src={img.tempSrc} />
											{img.src ? '' : <Icon className={Style.loading} type="loading" />}
										</div>
									)
								}
								{ //图片上传按钮
									this.state.imgs.length < 9 ?
										<div>
											<img src="./images/upload-img.png" alt="上传图片" onClick={() => common.picture(base64 => this.picture(base64))} />
											{common.callbackPicture() ? '' :
												<input ref="uploadImgInput" type="file" accept="image/*" onChange={(e) => this.uploadImgs(e)} multiple="multiple" />
											}
										</div>
										: ''
								}
							</div>
							{/* 图片上传 end*/}
							<div className={Style.topFooter}>
								<span>发布到</span>
								<span className={Style.topAddr} onClick={() => this.showPostAddress()}>{this.state.postAddress.title}<Icon type="right" className={Style.rightIcon} /></span>
							</div>
						</div>
						{/* 图文 end*/}
						{/* 发布类型 state*/}
						<div className={Style.h24}></div>
						<div className={Style.selectTopic + " " + Style.selectTopic + this.state.type}>
							{this.state.type.list.map((item, i) =>
								<span className={this.state.type.index === i ? Style.select : ''} key={i} onClick={(index) => this.selectType(i)}>{item + (i === 2 ? this.state.type.info : '')}<img src={this.state.type.index === i ? "./images/select-true.png" : "./images/select-false.png"} /></span>
							)}
						</div>
						{/* 发布类型 end*/}
						{/* 投票 state*/}
						<div className={Style.h24}></div>
						{this.state.type.index === 2 ?
							<div>
								<div className={Style.optionBox}>
									{this.state.optionBox.map((item, i) =>
										<div key={i}><span onClick={(index, text) => this.setOption(i, item.title)} >{i + 1}.{item.title}</span><Icon onClick={(index) => this.deleteOption(i)} type="cross" className={Style.crossIcon} /></div>
									)}
								</div>
								<div className={Style.h24}></div>
								{this.state.optionBox.length < 5 ?
									<div className={Style.addOptions} onClick={() => this.showSetText()}>
										<Icon type="plus" className={Style.plusIcon} />
										添加文字选项
						</div>
									: ''
								}
							</div>
							: ''
						}
						{/* 投票 end*/}
					</div>
				</div>
				{/* 增加投票选项 state*/}
				<div className={Style.setOptionBox} style={this.state.showPage !== 'setOptionBox' ? { display: "none" } : {}}>
					<AppHeader {...header2} />
					<div className='appBody'>
						<div className={Style.h24}></div>
						{this.state.showPage !== 'setOptionBox' ? '' :
							<InputItem
								{...getFieldProps('control') }
								value={this.state.setText.text}
								onChange={e => this.handleChange(e)}
								maxLength="20"
								ref='setText'
								autoFocus={true}
								prefixListCls='setText'
							></InputItem>
						}
						<div className={Style.setOptionFooterText}>文字选项输入不能超过<span style={{ padding: '0 2px', fontFamily: 'sans-serif' }}>20</span>个中文字符</div>
					</div>
				</div>
				{/* 增加投票选项 end*/}
				{/* 显示图片 state*/}
				<div className={Style.showImgBox + " w-carousel"} style={this.state.showPage !== 'imgBox' ? { display: "none" } : {}}>
					<AppHeader {...header3} />
					<div className='appBody'>
						<Carousel className={"my-carousel " + Style.myCarousel}
							dots={false}
							selectedIndex={this.state.imgBoxIndex}
							beforeChange={(from, to) => this.showImgBoxTitle(to)}
						>
							{ //图片集
								this.state.imgs.map((img, i) =>
									<div key={i} className="item">
										<img src={img.tempSrc}
											onClick={() => this.setState({
												setText: {
													text: '',
													index: -1
												},
												showPage: 'default'
											})}
											onTouchStart={(e) => this.imgTouchStart(e)}
											onTouchMove={(e) => this.imgTouchMove(e)}
											onTouchEnd={(e) => this.imgTouchEnd(e)}
										/>
									</div>
								)
							}
						</Carousel>
					</div>
				</div>
				{/* 显示图片 emd*/}
				{/* 发布地址 state*/}
				<div className={Style.postAddress} style={this.state.showPage !== 'postAddress' ? { display: "none" } : {}}>
					<AppHeader {...header4} />
					<div className='appBody'>
						<div className={Style.h24}></div>
						<div className={Style.postAddressList}>
							{this.state.postAddressList.map((item, i) => (
								<Checkbox.CheckboxItem key={i} className={item.checked ? Style.selete : ''} checked={item.checked} onClick={(index) => this.selectPostAddress(i)}>
									{item.title}
								</Checkbox.CheckboxItem>
							))}
						</div>
						<div className={Style.h24}></div>
						<div className={Style.postAddrBtn} onClick={() => this.setPostAddress()}>确定</div>
					</div>
				</div>
				{/* 发布地址 emd*/}
			</div>
		)
	}
}

//使用context
IssueTopic.contextTypes = {
	router: React.PropTypes.object.isRequired
}

//props默认值
IssueTopic.defaultProps = {

}

const select = state => ({
	memberFollow: state.memberFollow, //已关注的社区
})
export default connect(select)(createForm()(IssueTopic))