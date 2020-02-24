import React,{Component} from 'react';
import './main.css'
class Button extends Component{
    render(){
        const {id, disabled ,texto,style,action,onMouseEnter,onMouseLeave}=this.props;
        return (
            <button id={id} disabled={disabled} onClick={action} style={style} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>{texto}</button>
        );
    }
}

export default Button;