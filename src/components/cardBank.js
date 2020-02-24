import React,{Component} from 'react';
import './main.css';
import tarjetaProsa from '../assets/img/tarjetas/tarjetaProsa.svg';
import tarjetaBancomer from '../assets/img/tarjetas/tarjetaBancomer.svg';
import tarjetaAzteca from '../assets/img/tarjetas/tarjetaAzteca.svg';
import tarjetaSantander from '../assets/img/tarjetas/tarjetaSantander.svg';

class CardBank extends Component{
    constructor(props){
        super(props)
        this.state={
            cardBank:"cardBank"
        }
    }
    render(){
        switch (this.props.bank) {
            
            case "bancomer":
                    return(
                        <div>
                            <img id={this.state.cardBank} src={tarjetaBancomer} alt={this.state.cardBank}></img>
                        </div>
                    );
            case "santander":
                    return(
                        <div>
                            <img id={this.state.cardBank} src={tarjetaSantander} alt={this.state.cardBank} ></img>
                        </div>
                    );
            case "azteca":
                    return(
                        <div>
                            <img id={this.state.cardBank} src={tarjetaAzteca} alt={this.state.cardBank}></img>
                        </div>
                    );
            case "prosa":
                    return(
                        <div>
                            <img id={this.state.cardBank} src={tarjetaProsa} alt={this.state.cardBank}></img>
                        </div>
                    );
            case "bansefi":
                        return(
                            <div>
                                <img id={this.state.cardBank} src={tarjetaProsa} alt={this.state.cardBank}></img>
                            </div>
                        );
            default:
                    return null;
        }
    }
}

export default CardBank;