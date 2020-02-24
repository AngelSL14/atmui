import React,{ Component } from "react";
import logoTarjeta from '../assets/img/tarjeta.png';
class LogoTarjeta extends Component{
    constructor(props){
        super(props);
        this.state={

        }
    }
    render(){
        return(
            <div>
                <img id="logoTarjeta" src={logoTarjeta} alt={"logoTarjeta"}></img>
            </div>
        );
    }
}
export default LogoTarjeta;