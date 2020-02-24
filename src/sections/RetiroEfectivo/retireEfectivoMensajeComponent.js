import React,{Component} from 'react';
import {pingpad} from '../../Lib/socketService/socketServices';
import LogoRetiroEfectivoMensaje from '../../components/logoRetiroEfectivoMensaje';
import PropsTypes from 'prop-types';
import {jsonValidator} from '../../Lib/utils/utils';
import '../stylesSection.css';
import { logic , history , errorXFS } from '../../Lib/utils/construction';
import { SOCKET } from '../../Lib/utils/socketComunication';
class retireEfectivoMensajeComponent extends Component{
    constructor(props){
        super(props);
        this.state={
            statusComponent:"RUN",
        }
    }
    componentWillMount(){
        let rec = logic(this.props,pingpad,"RETIREEFECTIVOCOMPONENT");
        if(rec!==true){history("",this.props.history);}
        else{setTimeout(() => { this.handleLogicComponent(); }, 300);}
    }
    handleLogicComponent = () =>{
            /********************************WEBSOCKET************************************************/
            if(this.state.statusComponent==="RUN"){
                this.setState({
                    statusComponent:"NOT RUN"
                });
                SOCKET(pingpad,"RETIREEFECTIVOMENSAJECOMPONENT",this.props);
            }
            pingpad.onmessage = (msg)=>{
                if(jsonValidator(msg.data)){
                    const server = JSON.parse(msg.data);
                    if(server.code < 0 ){
                        errorXFS(server.message,this.props);
                    }else if(server.code===300){
                            history("imprimirTicketComponent",this.props.history);
                    }else{
                        errorXFS(server.message,this.props);
                    }
                }else{
                        console.log("Json no valido");
                }
            }
            pingpad.onerror = (error)=>{
                console.log("Error : "+error);
            }
            /******************************--WEBSOCKET************************************************/
    }
    render(){
        return(
            <div id="retire-su-efectivo">
                    <h1>Retire su efectivo</h1>
                    <LogoRetiroEfectivoMensaje/>
            </div>
        );
    }
}
retireEfectivoMensajeComponent.defaultProps={
            ip:null,nip:null,tipoTarjeta:null,track:null,billsRetiro:null,token:null,monto:null
}
retireEfectivoMensajeComponent.PropsTypes={
    ip:PropsTypes.string.isRequired,
    nip:PropsTypes.string.isRequired,
    tipoTarjeta:PropsTypes.string.isRequired,
    track:PropsTypes.string.isRequired,
    billsRetiro:PropsTypes.string.isRequired,
    token:PropsTypes.string.isRequired,
    monto:PropsTypes.string.isRequired
}
export default retireEfectivoMensajeComponent;