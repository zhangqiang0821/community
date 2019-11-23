import React, { Component, PropTypes } from 'react'
import MenusList from './menusList'
import { connect } from 'react-redux'
import { getMenusAsync, setMenus, noLike, addLike } from  'app/actions/menus'

export default class Menus extends Component {

	constructor(props, context) {
        super(props, context);

    	this.state = {}
	}

    toURL(url) {
        this.context.router.push(url);
    }

	componentWillMount() {
		
	}

	componentDidMount() {
	}

	render() {
		return(
			<div>
				<MenusList {...this.props} />
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
	
}
