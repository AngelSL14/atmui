import React,{Component} from 'react';
import '../stylesSection.css';
import PropsTypes from 'prop-types';
import {pingpad} from '../../Lib/socketService/socketServices';
import CardBank from '../../components/cardBank';
import { jsonValidator } from '../../Lib/utils/utils';
import { emv } from '../../Lib/utils/utils';
import { logic , history , modelConstructor , errorWS } from '../../Lib/utils/construction';
class WaitConsultaMovimientoRealizandoComponent extends Component{
    constructor(props){
        super(props);
        this.handleConsultaMovimientosRealizando=this.handleConsultaMovimientosRealizando.bind(this);
        this.handleMovimientposRealizando=this.handleMovimientposRealizando.bind(this);
    }
    componentWillMount(){
        let a = logic(this.props,pingpad,"WAITCONSULTAMOVIMIENTOSCOMPONENT");
        if(a!==true) history("",this.props.history);
        setTimeout(() => { this.handleConsultaMovimientosRealizando(); }, 300);
    }
    async handleConsultaMovimientosRealizando(){

        if(this.props.tarjetaChip){
            pingpad.send(JSON.stringify(emv));
            pingpad.onmessage=(msg)=>{
                if(jsonValidator(msg.data)){
                    const response = JSON.parse(msg.data);
                    if(response.code==="783"){
                        const emvO = response.message;
                        const request = modelConstructor("MOVIMIENTOSEMV",this.props,emvO);
                        this.handleMovimientposRealizando(request);
                    }
                }
            }
        }else{
            let consultaMovimientos = modelConstructor("MOVIMIENTOSEMV",this.props,null);
            this.handleMovimientposRealizando(consultaMovimientos);
        }
    }
    async handleMovimientposRealizando(consultaMovimientos){
            //const data= await verificarMovimientos(consultaMovimientos , this.props.token );
            const data = {
                code: "200",
                errorWS: null,
                body: [
                    "Ultima actualizacion: 170109 1P",
                    "GUSTAVO MANCILLA FLORES ",
                    "SALDO AL 09/01/17 266352.87 ",
                    " ",
                    "FECHA CONCEPTO MONTO",
                    "170105 TRASP FONDOS -50.00",
                    "190901 IZZI PAGO -420.00",
                    "190902 TELCEL PAGO ON LINE -999.00",
                    "190903 RETIRO ATM -8000.00",
                    "190904 RETIRO ATM -1000.00",
                    "190905 RETIRO ATM -100.00"
                    ]
                }
            if(data['code'] !==undefined){
                    if(data.code==="200"){
                        this.props.modifyState("objetoMovimientos",data.body);
                        history("movimientosComponent",this.props.history);
                    }else{
                        errorWS(data,this.props);
                    }
            }
    }
    render(){
        return(
            <div id="WaitConsultaMovimientoRealizandoComponent">
                <h1>Espere un momento Por Favor</h1>
                <h2>Realizando consulta de movimientos</h2>
                <CardBank bank={"prosa"}/>
            </div>
        );
    }
}
WaitConsultaMovimientoRealizandoComponent.defaultProps={
    tipoTarjeta:null,nip:null,ip:null,comision:null,track:null,style:null,token:null
}
WaitConsultaMovimientoRealizandoComponent.PropsTypes={
    tipoTarjeta:PropsTypes.string.isRequired,
    nip:PropsTypes.string.isRequired,
    ip:PropsTypes.string.isRequired,
    comision:PropsTypes.string.isRequired,
    track:PropsTypes.string.isRequired,
    style:PropsTypes.string.isRequired,
    token:PropsTypes.string.isRequired
}
export default WaitConsultaMovimientoRealizandoComponent;