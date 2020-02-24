import React,{Component} from 'react';
import PropsTypes from 'prop-types';
import CardBank from '../../components/cardBank';
import {pingpad} from '../../Lib/socketService/socketServices';
import {jsonValidator} from '../../Lib/utils/utils';
import {CambioDeNip} from '../../Lib/services';
import '../stylesSection.css';
import { emv } from '../../Lib/utils/utils';
import { logic , history , modelConstructor , errorWS} from '../../Lib/utils/construction';
class waitCambioNipRealizandoComponent extends Component{
    constructor(props){
        super(props);
        this.handleLogicComponent=this.handleLogicComponent.bind(this);
        this.handleCambioNipRealizando=this.handleCambioNipRealizando.bind(this);
    }

    async componentDidMount(){
        let wcn = logic(this.props,pingpad,"WAITCAMBIONIPREALIZANDOCOMPONENT");
        if(wcn!==true){history("",this.props.history);}
        else{setTimeout(() => { this.handleLogicComponent(); }, 300);}
    }

    async handleLogicComponent(){
        if(this.props.tarjetaChip){
                pingpad.send(JSON.stringify(emv));
                pingpad.onmessage=(msg)=>{
                    if(jsonValidator(msg.data)){
                        const response = JSON.parse(msg.data);
                        if(response.code==="783"){
                            const emvO = response.message;
                            const requestEMV = modelConstructor("CANIPEMV",this.props,emvO);
                            this.handleCambioNipRealizando(requestEMV);
                        }
                    }
                }
        }else{
            const request = modelConstructor("CANIP",this.props,null);
            this.handleCambioNipRealizando(request);
        } 
    }

    async handleCambioNipRealizando(jsonCambioNip){
            const cambioNip = await CambioDeNip( jsonCambioNip , this.props.token );
            setTimeout(() => {
                if(cambioNip.code==="200"){
                    this.props.modifyState("nip",this.props.pinblockDos);
                    this.props.modifyState("pinblockUno","");
                    this.props.modifyState("pinblockDos","");
                    setTimeout(() => {
                        this.props.history.push('/VerificacionCambioNipComponent');
                    }, 50);
                }else{
                    this.props.modifyState("pinblockUno","");
                    this.props.modifyState("pinblockDos","");
                    errorWS(cambioNip,this.props);
                }
            }, 500);
    }

    render(){
        return(
            <div id="WaitCambioNipComponent">
                    <h1>Espere un Momento Por Favor</h1>
                    <h2>Procesando su solicitud</h2>
                    <CardBank bank={"prosa"}/>
            </div>
        );
    }
}
waitCambioNipRealizandoComponent.defaultProps={
    ip:null,nip:null,tipoTarjeta:null,track:null,token:null,pinblockUno:null,pinblockDos:null
}
waitCambioNipRealizandoComponent.PropsTypes={
    ip:PropsTypes.string.isRequired,
    nip:PropsTypes.string.isRequired,
    tipoTarjeta:PropsTypes.string.isRequired,
    track:PropsTypes.string.isRequired,
    token:PropsTypes.string.isRequired,
    pinblockUno:PropsTypes.string.isRequired,
    pinblockDos:PropsTypes.string.isRequired
}

export default waitCambioNipRealizandoComponent;