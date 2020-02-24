import React,{Component} from 'react';
import logoProsa from '../assets/img/logoProsa.jpg';
import './main.css';
class LogoProsa extends Component{
    render(){
        return(
            <div>
                <img id="logoProsa" src={logoProsa} alt={"logoProsa"}></img>
            </div>
        );
    }
}
export default LogoProsa;