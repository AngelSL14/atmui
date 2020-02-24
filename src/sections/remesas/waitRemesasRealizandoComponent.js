import React,{ Component } from 'react';
import '../stylesSection.css';
import {pingpad, initPingpad} from '../../Lib/socketService/socketServices';
import CardBank from '../../components/cardBank';

class WaitRemesasRealizandoComponent extends Component{
    constructor(props){
        super(props);
        this.state={
            
        }
    }
    componentWillMount(){
        if(this.props.ip===null || this.props.ip===undefined || this.props.GBS===null || this.props.GBS===undefined ||
            this.props.remesas===null || this.props.remesas===undefined){
            this.props.history.push("/");
        }else if(pingpad===null || pingpad===undefined){
            initPingpad(this.props.ip,"pingpad","reconexion");
            setTimeout(() => {
                    this.handleLogicComponent();
            }, 300);
        }else{
            this.handleLogicComponent();
        }
    }

    handleLogicComponent = ()=>{
        const requestRemesa = {
            codigoRemesa:this.props.remesas.codigoRemesa,
            claveRemesa:this.props.remesas.claveRemesa,
            ip:this.props.ip,
            cashWithAmount:"00.00"
        }
        this.handleRemesaRealizando(requestRemesa);
    }
    async handleRemesaRealizando(objRetiroRemesa){
        
        // let responseRemesa = await verificarRemesas(objRetiroRemesa , this.props.token );
        // setTimeout(()=>{
        //     if(responseRemesa.code==="200"){
        //         if(responseRemesa.body[0]['flagdcc'] !== undefined){
        //             this.props.modifyState("dcc",responseRemesa.body[0].remesa);
        //             this.props.history.push('/dcc');
        //         }else{
        //             this.props.modifyState("dcc",null);
        //             this.props.modifyState("dccRequest",null);
        //             this.props.modifyState("billsRetiro",responseRemesa.body[0].billsModel.bills);
        //             this.props.history.push('/retireEfectivoMensajeComponent');
        //         }
        //     }else{
        //         if(responseRemesa["errorWS"] !== undefined){ this.props.modifyState("mensajeErrorGlobal",responseRemesa.errorWS[0].errorMessage);}
        //         else{this.props.modifyState("mensajeErrorGlobal","Error en la comunicacion");}
        //         this.props.history.push('/errorProcessComponent');
        //     }
        // },500);
    }
    render(){
        return (
            <div id="waitRemesasRealizandoComponent">
                <h1>Espere un Momento Por Favor</h1>
                <h2>Realizando Retiro de la remesa</h2>
                <CardBank bank={this.props.style}/>
            </div>
        );
    }
}

export default WaitRemesasRealizandoComponent;