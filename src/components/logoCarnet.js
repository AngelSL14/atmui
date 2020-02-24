import React,{Component} from 'react';
import logoCarnet from '../assets/img/Carnet.png';
import './main.css';
class LogoCarnet extends Component{
    render(){
        return(
            <div>
                <img id="logoCarnet" src={logoCarnet} alt="logoCarnet"></img>
            </div>
        );
    }
}

export default LogoCarnet;