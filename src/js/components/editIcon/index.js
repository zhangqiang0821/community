import Style from './index.scss'
const EditIcon = props => (
    <div onClick={() => props.onClick()} className={Style.btnBox}>
        {/*<img onClick={() => this.checkUser('/IssueTopic/' + groupIds + '/' + defaultGroupName)} src='./images/icon-edit.png' className='img' />*/}
    </div>
)

export default EditIcon