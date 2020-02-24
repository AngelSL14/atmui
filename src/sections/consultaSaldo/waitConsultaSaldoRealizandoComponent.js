import React,{Component} from 'react';
import '../stylesSection.css';
import PropsTypes from 'prop-types';
import {pingpad} from '../../Lib/socketService/socketServices';
import {verificarConsulta} from '../../Lib/services';
import CardBank from '../../components/cardBank';
import { jsonValidator } from '../../Lib/utils/utils';
import { emv } from '../../Lib/utils/utils';
import { logic , history , modelConstructor , errorWS } from '../../Lib/utils/construction';
class WaitConsultaSaldoRealizandoComponent extends Component{
    constructor(props){
        super(props);
        this.state={
            objetoSaldo:''
        }
        this.handleLogicComponent=this.handleLogicComponent.bind(this);
        this.handleConsultaSaldoRealizando=this.handleConsultaSaldoRealizando.bind(this);
    }
    componentWillMount(){
        let t = logic(this.props,pingpad,"WAITCONSULTASALDOREALIZANDOCOMPONENT");
        if(t!==true) history("",this.props.history);
        setTimeout(() => { this.handleLogicComponent(); }, 300);
    }

    async handleLogicComponent(){
        if(this.props.tarjetaChip){
            pingpad.send(JSON.stringify(emv));
            pingpad.onmessage= async(msg)=>{
                
                if(jsonValidator(msg.data)){
                    const response = JSON.parse(msg.data);
                    if(response.code==="783"){
                        const emvO = response.message;
                        const requestEMV = modelConstructor("SALDOEMV",this.props,emvO);
                        this.handleConsultaSaldoRealizando(requestEMV);
                    }
                }
            }
        }else{
            const request = modelConstructor("SALDO",this.props,null);
            this.handleConsultaSaldoRealizando(request);
        }
        
    }

    async handleConsultaSaldoRealizando(objConsultaSaldo){
            const tableSaldo = await verificarConsulta(objConsultaSaldo , this.props.token );
            if(tableSaldo.code==="200"){
                this.props.modifyState("objetoSaldo",tableSaldo.body[0]);
                setTimeout(() => {
                    this.props.history.push('/saldoComponent');
                }, 500);
            }else{
                errorWS(tableSaldo,this.props);
            }
    }

    render(){
        return(
            <div id="WaitConsultaSaldoRealizandoComponent">
                <h1>Espere un momento Por Favor</h1>
                <h2>Realizando Consulta de Saldo</h2>
                <CardBank bank={this.props.style}/>
            </div>
        );
    }
}
WaitConsultaSaldoRealizandoComponent.defaultProps={
    tipoTarjeta:null,nip:null,ip:null,comision:null,track:null,token:null
}
WaitConsultaSaldoRealizandoComponent.PropsTypes={
    tipoTarjeta:PropsTypes.string.isRequired,
    nip:PropsTypes.string.isRequired,
    ip:PropsTypes.string.isRequired,
    comision:PropsTypes.string.isRequired,
    track:PropsTypes.string.isRequired,
    token:PropsTypes.string.isRequired
}
export default WaitConsultaSaldoRealizandoComponent;