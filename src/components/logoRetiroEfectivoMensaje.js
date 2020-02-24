import React,{Component} from 'react';
import lrem from '../assets/img/logoRetiro.png';
import './main.css';

class logoRetiroEfectivoMensaje extends Component{
    constructor(props){
        super(props);
        this.state={

        }
    }
    render(){
        return(
            <div>
                <img id="logoRetiroEfectivoMensaje" src={lrem} alt={"logoRetiroEfectivoMensaje"}></img>
            </div>
        );
    }
}

export default logoRetiroEfectivoMensaje;