import React,{Component} from 'react';
import './main.css';
import targetCart from '../assets/img/TDC.png';
class TargetCart extends Component{
    render(){
        return(
            <div id="targetCartComponent">
                <img id="tdc-cart" src={targetCart} alt={""}></img>
            </div>
        );
    }
}

export default TargetCart;