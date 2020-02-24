import React,{Component} from 'react';
import LogoTarjeta from '../components/logoTarjeta';
import {pingpad} from '../Lib/socketService/socketServices';
import './stylesSection.css';
import PropsTypes from 'prop-types';
import {jsonValidator} from '../Lib/utils/utils';
import { logic , history } from '../Lib/utils/construction';
import { SOCKET } from '../Lib/utils/socketComunication';

class retireTarjetaComponent extends Component{
    constructor(props){
        super(props);
        this.state={
            operationComponent:{
                operationComponent:"RETIRETARJETACOMPONENT"
            },
            textoTarjeta:"Retire su Tarjeta",
            devices:[]
        }
    }
    componentWillMount(){
        let rtc = logic(this.props,pingpad,"RETIRETARJETACOMPONENT");
        if(rtc!==true){history("",this.props.history);}
        else{setTimeout(() => {this.handleLogicComponent();}, 300);}
    }
    handleLogicComponent = () =>{
        SOCKET(pingpad,"RETIRETARJETACOMPONENT",null);
        pingpad.onmessage = (msg)=>{
                if(jsonValidator(msg.data)){
                    const json = JSON.parse(msg.data);
                    switch (json.code) {
                        case 200:
                                SOCKET(pingpad,"RESETXFSPTR",null);
                            break;
                        case -201:
                                this.handleResetPIN();
                            break;
                        case -205:
                                this.handleResetPIN();
                            break;
                        case 17:
                                this.props.history.push('/');
                            break;
                        case 18:
                                this.props.history.push('/');
                            break;
                        case 19:
                                this.props.history.push('/');
                            break;
                        case 20:
                                this.props.history.push('/');
                            break;
                        case -17://PRINTER
                                SOCKET(pingpad,"RESETXFSPIN",null);
                            break;
                        case -18://PIN
                                SOCKET(pingpad,"RESETXFSIDC",null);
                            break;
                        case -19://IDC
                                this.props.history.push('/');
                            break;
                        case -48:
                                SOCKET(pingpad,"RESETXFSIDC",null);
                            break;
                        case 9000:
                            this.props.history.push("/");
                            break;
                        default:
                            break;
                    }
                }
        }
        pingpad.onerror = (error)=>{
            console.log("Error Socket : ",error);
        }
    }
    handleResetPIN = ()=>{
        this.setState({
            textoTarjeta:"Vuelva pronto"
        });
        SOCKET(pingpad,"RESETXFSPIN",null);
    }
    render(){
        return(
            <div id="retire-tarjeta">
                    <h1>{this.state.textoTarjeta}</h1>
                    <LogoTarjeta id="logoTarjeta"/>
            </div>
        );
    }
}
retireTarjetaComponent.defaultProps={
    ip:null
}
retireTarjetaComponent.PropsTypes={
    ip:PropsTypes.string.isRequired
}
export default retireTarjetaComponent;