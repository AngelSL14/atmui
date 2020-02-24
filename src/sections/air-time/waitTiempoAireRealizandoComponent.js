import React,{Component} from 'react';
import CardBank from '../../components/cardBank';
import {recargaSaldo} from '../../Lib/services';
import PropsTypes from 'prop-types';
import {pingpad} from '../../Lib/socketService/socketServices';
import {jsonValidator} from '../../Lib/utils/utils';
import { emv } from '../../Lib/utils/utils';
import { logic , history , modelConstructor , errorWS } from '../../Lib/utils/construction';

class waitTiempoAireRealizandoComponent extends Component{
    constructor(props){
        super(props);
        this.handleTiempoAire=this.handleTiempoAire.bind(this);
        this.handleTiempoAireRealizando=this.handleTiempoAireRealizando.bind(this);
    }
    componentWillMount(){
        let wtr = logic(this.props,pingpad,"WAITTIEMPOAIREREALIZANDOCOMPONENT");
        if(wtr!==true) history("",this.props.history);
        setTimeout(() => { this.handleTiempoAire(); }, 300);
    }

    async handleTiempoAire(){
        if(this.props.tarjetaChip){
                pingpad.send(JSON.stringify(emv));
                pingpad.onmessage=(msg)=>{
                    if(jsonValidator(msg.data)){
                        const response = JSON.parse(msg.data);
                        if(response.code==="783"){
                            const emvO = response.message;
                            const requestEmv = modelConstructor("RECARGAEMV",this.props,emvO);
                            this.handleTiempoAireRealizando(requestEmv);
                        }
                    }
                }
        }else{
            const request = modelConstructor("RECARGA",this.props,null);
            this.handleTiempoAireRealizando(request);
        }
    }

    async handleTiempoAireRealizando(jsonRecarga){
            const recarga = await recargaSaldo(jsonRecarga , this.props.token );
            setTimeout(() => {
                if(recarga.code==="200"){
                    history("imprimirTicketComponent",this.props.history);
                }else{
                    errorWS(recarga,this.props);
                }
            }, 500);
    }

    render(){
        return(
            <div id="WaitTiempoAireRealizando">
                <h1>Espere un Momento Por Favor</h1>
                <h2>Procesando la recarga de saldo</h2>
                <CardBank bank={"Prosa"}/>
            </div>
        );
    }
}

waitTiempoAireRealizandoComponent.defaultProps={
    tipoTarjeta:null , nip:null , ip:null, track:null , compania:null , numTelefono:null,
    style:null , montoRecarga:null , token:null
}

waitTiempoAireRealizandoComponent.PropsTypes={
    tipoTarjeta:PropsTypes.string.isRequired,
    nip:PropsTypes.string.isRequired,
    ip:PropsTypes.string.isRequired,
    track:PropsTypes.string.isRequired,
    compania:PropsTypes.string.isRequired,
    numTelefono:PropsTypes.string.isRequired,
    style:PropsTypes.string.isRequired,
    montoRecarga:PropsTypes.string.isRequired,
    token:PropsTypes.string.isRequired
}

export default waitTiempoAireRealizandoComponent;