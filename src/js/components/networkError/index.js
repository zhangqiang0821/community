/*
	网络错误组件说明：
	props={//属性待定
		
	}
*/
import styles from './index.scss'

import img from './images/networkError-icon.png'

//刷新页面
/*
const refresh = ()=>{
	window.location.reload()
}

const NetworkError = (props) => {
	console.log(props)
	return (
		<div className={styles.IconNetworkError}>
            <img src='./images/networkError-icon.png'/>
            <div className={styles.networkErrorMsg}>网络错误</div>
            <div className={styles.refreshBtn} onClick={()=>refresh()}>刷新看看</div>
        </div>
	)
}*/

const NetworkError = (props) => {
	document.body.innerHTML = '<div data-reactroot=""><div class="' + styles.IconNetworkError + '"><img src="' + img + '"><div class="' + styles.networkErrorMsg + '">网络错误</div><div class="' + styles.refreshBtn + '" onClick="window.location.reload()">刷新看看</div></div></div>'
}

export default NetworkError