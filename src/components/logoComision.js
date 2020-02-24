import React,{Component} from 'react';
import logoComision from '../assets/img/logoComision.svg';
import './main.css';

class LogoComision extends Component{
    constructor(props){
        super(props)
        this.state={

        }
    }
    render(){
        return(
            <div>
                <img id="logoComision" src={logoComision} alt={"logoComision"}></img>
            </div>
        );
    }
}

export default LogoComision;