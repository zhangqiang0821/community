//   用户信息：头像和昵称
import React, { Component } from 'react'
import { Flex, WingBlank, WhiteSpace } from 'antd-mobile'
import styles from './index.scss'

export default class NoMsg extends Component {

    render() {

        return (

            <div className='bg-white'>

                <dl className={styles.dl+' '+styles.top}>
                    <dt>.</dt>
                    <dd></dd>
                </dl>

                <WingBlank className={styles.p}></WingBlank>
                <WhiteSpace /> {/*   上下间隔 */}
                <WingBlank className={styles.p}></WingBlank>
                <WhiteSpace /> {/*   上下间隔 */}

                <WingBlank><Flex>
                    <p className={styles.div}></p>
                    <p className={styles.div}></p>
                    <p className={styles.div + ' ' +styles.divLast}></p>
                </Flex>

                <WhiteSpace size='xl' /> {/*   上下间隔 */}

                </WingBlank>


            </div>

        )
    }
}