import React, { Component, PropTypes } from 'react'
import MenusList from './menusList'
import 'style/w-style.scss'
import Common from '../../utils/common'

export default class Menus extends Component {

	constructor(props, context) {
		super(props, context);

		this.state = {
			addHeader: Common.needAddAppHeaderHeight(), //需要增加高度
		}
	}

	toURL(url) {
		this.context.router.push(url);
	}

	componentWillMount() {
	}

	componentDidMount() {

	}

	render() {
		let addHeader = this.state.addHeader ? '' : 'notAddHeader';
		let { height, show, left, center, right } = this.props;

		if (height == '90') {
			addHeader = 'notAddHeader';
		} else if (height == '130') {
			addHeader = '';
		}

		return (
			<div style={{ zIndex: '998' }}>
				{show ?
					<div className={addHeader}>
						<div className="appHeader">
							<span onClick={() => left.onClick()} className="headerLeft">{left.text}</span>
							<span onClick={() => center.onClick()} style={{ color: '#1a1a1a' }}>
								{center.text.length > 12 ? center.text.substr(0, 12) + '...' : center.text}
							</span>
							<span onClick={() => right.onClick()} className="headerRight">{right.text}</span>
						</div>
						<div className="h130"></div>
					</div>
					: ''}
			</div>
		)
	}
}

//使用context
Menus.contextTypes = {
	router: React.PropTypes.object.isRequired
}

//props默认值
Menus.defaultProps = {
	show: true, //是否显示 兼容APP的沉浸模式
	left: {
		text: '',
		onClick: () => false
	},
	center: {
		text: '',
		onClick: () => false
	},
	right: {
		text: '',
		onClick: () => false
	},
	height: '', //头部高度，可选 90 和 130 。默认自动判断
}