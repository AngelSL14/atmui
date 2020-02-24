import React,{Component} from 'react';
import logoTicket from '../assets/img/ticket.png';
import './main.css';
class LogoTicket extends Component{
    constructor(props){
        super(props);
        this.state={

        }
    }
    render(){
        return(
            <div>
                <img id="logoTicket" src={logoTicket} alt={"logoTicket"}></img>
            </div>
        );
    }
}

export default LogoTicket;