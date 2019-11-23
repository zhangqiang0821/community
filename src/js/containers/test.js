import React, { Component } from 'react';

class Test extends Component {

    constructor(props) {
        super(props);

        this.state = {
            num: 0, //滑动次数
            y: 0, //滑动开始时的Y坐标
            endY: 0, //滑动结束时的Y坐标
        }

    }

    handleTouchStart(e) {
        console.log("手指按下");
        this.setState({
            num: 0,
            y: e.targetTouches[0].clientY,
            endY: e.targetTouches[0].clientY,
        })
    }

    handleTouchMove(e) {
        if (document.body.scrollTop === 0 && this.state.endY - this.state.y > 4) {
            e.preventDefault(); //阻止默认事件
        }

        console.log(e, '----', event)
        console.log(e.targetTouches[0].clientY);
        let num = this.state.num;
        this.setState({
            num: ++num,
            endY: e.targetTouches[0].clientY
        })
    }

    handleTouchEnd(e) {
        this.setState({
            num: 0,
            y: 0,
            endY: 0
        })
    }

    render() {
        let translateY = 0;
        if (document.body.scrollTop === 0 && this.state.endY - this.state.y > 4) {
            translateY = (this.state.endY - this.state.y) / 4;
            translateY = translateY < 100 ? translateY : 100; //最多滑动100px
        }
        let style = { height: '100%', background: '#ccc', transform: `translate3d(0px, ${translateY}px, 0px)` };

        return (
            <div style={{ height: '3000px' }}>
                <div style={{ height: '300px' }}>
                    <div style={style} onTouchStart={(e) => this.handleTouchStart(e)} onTouchMove={(e) => this.handleTouchMove(e)} onTouchEnd={(e) => this.handleTouchEnd(e)} >
                        <p>一共滑动了{this.state.num}次</p>
                    </div>
                </div>
            </div>
        );
    }
}

export default Test;