import React,{Component} from 'react';
import logoError from '../assets/img/Error.png';
import './main.css';
class LogoError extends Component{
    constructor(props){
        super(props);
        this.state={

        }
    }
    render(){
        return(
            <div>
                <img id="logoError" src={logoError} alt={"logoError"}></img>
            </div>
        );
    }
}

export default LogoError;