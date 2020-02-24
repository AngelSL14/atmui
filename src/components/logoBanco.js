import React,{Component} from 'react';
import logoAzteca from '../assets/img/bancoAzteca.svg';
import logoSantander from '../assets/img/bancoSantander.svg';
import logoBancomer from '../assets/img/bancoBBVABancomer.svg';
import logoProsa from '../assets/img/logoProsa3.png';
import './main.css';
class LogoBanco extends Component{
    constructor(props){
        super(props)
        this.state={
            logoBanco:"logoBanco"
        }
    }
    render(){
        switch (this.props.style) {
            case "bancomer":
                    return(
                        <div>
                            <img id={this.state.logoBanco} src={logoBancomer} alt={this.state.logoBanco}></img>
                        </div>
                    ); 
            case "santander":
                    return(
                        <div>
                            <img id={this.state.logoBanco} src={logoSantander} alt={this.state.logoBanco}></img>
                        </div>
                    );
            case "azteca":
                    return(
                        <div>
                            <img id={this.state.logoBanco} src={logoAzteca} alt={this.state.logoBanco}></img>
                        </div>
                    );
            case "prosa":
                        return(
                            <div>
                                <img id={this.state.logoBanco} src={logoProsa} alt={this.state.logoBanco}></img>
                            </div>
                        );
            default:
                        return null;
        }
    }
}

export default LogoBanco;