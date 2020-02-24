import React,{Component} from 'react';
import LogoTicket from '../components/logoTicket';
import {pingpad} from '../Lib/socketService/socketServices';
import './stylesSection.css';
import PropsTypes from 'prop-types';
import {jsonValidator} from '../Lib/utils/utils';
import {PrinterService} from '../Lib/services';
import { logic , history , errorWS , errorXFS , modelConstructor } from '../Lib/utils/construction';
import { SOCKET } from '../Lib/utils/socketComunication';
class imprimirTicketComponent extends Component{
    constructor(props){
        super(props);
        this.state={
            operationComponent:{
                operationComponent:"IMPRIMIRTICKETCOMPONENT",
                message:""
            },
            mensajeTiket:"IMPRIMIENDO TICKET",
        }
        this.handleLogicComponent=this.handleLogicComponent.bind(this);
    }
    componentWillMount(){
        let itc = logic(this.props,pingpad,"IMPRIMIRTICKETCOMPONENT");
        if(itc!==true){history("",this.props.history);}
        else{setTimeout(() => { this.handleLogicComponent(); },300);}
    }
    async handleLogicComponent(){
        let ticket = modelConstructor("TICKET",this.props,null);
        let ticketResult = await PrinterService(ticket,this.props.token);
        if(ticketResult.code==="200"){
            SOCKET(pingpad,"IMPRIMIRTICKETCOMPONENT",ticketResult.body[0].bodyTicket);
            pingpad.onmessage = (msg)=>{
                if(jsonValidator(msg.data)){
                    if(msg.data.includes("CANCEL")){
                        history("retireTarjetaComponent",this.props.history);
                    }else{
                        const json = JSON.parse(msg.data);
                        if(json.code < 0){
                            this.setState({
                                mensajeTiket:"IMPRESORA NO DISPONIBLE"
                            });
                            setTimeout(() => {
                                history("retornoMenuComponent",this.props);
                            }, 2000);
                            this.props.modifyState("mensajeErrorGlobal",json.message);
                        }else if(json.code===100){
                            setTimeout(() => {
                                history("retornoMenuComponent",this.props.history);
                            }, 2000);
                        }else if(json.code===-13){
                            this.setState({
                                mensajeTiket:"IMPRESORA NO DISPONIBLE"
                            });
                            setTimeout(() => {
                                history("retornoMenuComponent",this.props.history);
                            }, 2000);
                        }else if (json.code=== -14) {
                                errorXFS(json.message);
                        }else if(json.code === 9000){
                            this.props.history.push("/");
                        }
                    }
                }
            }
            pingpad.onerror = (error)=>{
                console.log("Error : "+error);
            }
        }else{
            errorWS(ticketResult,this.props);
        }
    }
    render(){
        return(
            <div id="imprimir-ticket-component">
                    <h1>{this.state.mensajeTiket}</h1>
                    <LogoTicket id="logoTicket"/>
            </div>
        );
    }
}
imprimirTicketComponent.defaultProps={
    ip:null,nip:null,tipoTarjeta:null,track:null,token:null
}
imprimirTicketComponent.PropsTypes={
    ip:PropsTypes.string.isRequired,
    nip:PropsTypes.string.isRequired,
    tipoTarjeta:PropsTypes.string.isRequired,
    track:PropsTypes.string.isRequired,
    token:PropsTypes.string.isRequired
}
export default imprimirTicketComponent;