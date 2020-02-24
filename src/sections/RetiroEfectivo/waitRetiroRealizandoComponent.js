import React,{Component} from 'react';
import '../stylesSection.css';
import { verificarRetiro } from '../../Lib/services';
import PropsTypes from 'prop-types';
import {pingpad} from '../../Lib/socketService/socketServices';
import {jsonValidator} from '../../Lib/utils/utils';
import CardBank from '../../components/cardBank';
import { logic , history , modelConstructor , errorWS } from '../../Lib/utils/construction';
import { SOCKET } from '../../Lib/utils/socketComunication';
class waitRetiroRealizandoComponent extends Component{
    constructor(props){
        super(props);
        this.handleLogicComponent=this.handleLogicComponent.bind(this);
        this.handleRetiroRealizando=this.handleRetiroRealizando.bind(this);
    }
    async componentWillMount(){
        let wrr = logic(this.props,pingpad,"WAITRETIROREALIZANDOCOMPONENT");
        if(wrr!==true) history("",this.props.history);
        setTimeout(() => { this.handleLogicComponent(); }, 300);
    }

    async handleLogicComponent(){
        
        if(this.props.tarjetaChip){
                SOCKET(pingpad,"ACCIONEMV",null);
                pingpad.onmessage=(msg)=>{
                    if(jsonValidator(msg.data)){
                        const response = JSON.parse(msg.data);
                        if(response.code==="783"){
                            const emvO = response.message;
                            let objretiroEmv=null;
                            if(this.props.dccProcess){
                                objretiroEmv = modelConstructor("DCCEMV",this.props,emvO);
                            }else{
                                objretiroEmv = modelConstructor("RETIROEMV",this.props,emvO);
                            }
                            this.handleRetiroRealizando(objretiroEmv);
                        }
                    }
                }
        }else{
            let objretiro = null;
            if(this.props.dccProcess){
                    objretiro = modelConstructor("DCC",this.props,null);
            }else{
                    objretiro = modelConstructor("RETIRO",this.props,null);
            }
            this.handleRetiroRealizando(objretiro);
        }
    }

    async handleRetiroRealizando(objRetiroEfectivo){
            
            let responseRetiro = await verificarRetiro(objRetiroEfectivo , this.props.token );
            setTimeout(()=>{
                if(responseRetiro.code==="200"){
                    if(responseRetiro.body[0]['flagdcc'] !== undefined){
                        this.props.modifyState("dcc",responseRetiro.body[0].dcc);
                        this.props.history.push('/dcc');
                    }else{
                        this.props.modifyState("dcc",null);
                        this.props.modifyState("dccRequest",null);
                        this.props.modifyState("billsRetiro",responseRetiro.body[0].bills);
                        this.props.history.push('/retireEfectivoMensajeComponent');
                    }
                }else{
                    errorWS(responseRetiro,this.props);
                }
            },500);
    }

    render(){
        return(
            <div id="waitRetiroRealizandoComponent">
                <h1>Espere un Momento Por Favor</h1>
                <h2>Realizando Retiro</h2>
                <CardBank bank={"prosa"}/>
            </div>
        );
    }
}
waitRetiroRealizandoComponent.defaultProps = {
    ip:null,nip:null,tipoTarjeta:null,monto:null,comision:null,track:null,token:null
}
waitRetiroRealizandoComponent.PropsTypes = {
    ip:PropsTypes.string.isRequired,
    nip:PropsTypes.string.isRequired,
    tipoCuenta:PropsTypes.string.isRequired,
    monto:PropsTypes.number.isRequired,
    comision:PropsTypes.string.isRequired,
    track:PropsTypes.string.isRequired,
    token:PropsTypes.string.isRequired
}
export default waitRetiroRealizandoComponent;