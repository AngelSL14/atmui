import React,{Component} from 'react';

import '../stylesViews.css';

import AvisoComisionComponent from '../../sections/comision/avisoComisionComponent';

import ImprimirTicketComponent from '../../sections/imprimirTicketComponent';
import NipComponent from '../../sections/nipComponent';
import RetireEfectivoMensajeComponent from '../../sections/RetiroEfectivo/retireEfectivoMensajeComponent';
import RetireTarjetaComponent from '../../sections/retireTarjetaComponent';

import RetiroOpcionComponent from '../../sections/RetiroEfectivo/retiroOptionComponent';
import SelectConsultaMovimientoComponent from '../../sections/selectConsultaMovimientosComponent';
import SelectOperation from '../../sections/selectOperation';
import TipoTarjetaComponent from '../../sections/tipoTarjetaComponent';

import DccComponent from '../../sections/RetiroEfectivo/dcc/dccComponent';

import WaitInicialComponent from '../../sections/waitInicialComponent';
import WaitComisionComponent from '../../sections/comision/waitComisionComponent';

import WaitRetiroRealizandoComponent from '../../sections/RetiroEfectivo/waitRetiroRealizandoComponent';
import WaitConsultaMovimientoRealizandoComponent from '../../sections/consultaMovimientos/waitConsultaMovimientoRealizandoComponent';
import WaitConsultaSaldoRealizandoComponent from '../../sections/consultaSaldo/waitConsultaSaldoRealizandoComponent';
import WaitTiempoAireRealizandoComponent from '../../sections/air-time/waitTiempoAireRealizandoComponent';

import RetornoMenuComponent from '../../sections/retornoMenuComponent';

import MovimientosComponent from '../../sections/consultaMovimientos/movimientosComponent';
import SaldoComponent from '../../sections/consultaSaldo/saldoComponent';
import CompaniasComponent from '../../sections/air-time/companias';
import NumeroTelefonoComponent from '../../sections/air-time/numeroTelefono';
import MontoTiempoAire from '../../sections/air-time/montoTiempoAire';
import VerificacionRecargaComponent from '../../sections/air-time/verificacionRecarga';

import CambioNip from '../../sections/cambio_nip/cambioNip';
import WaitCambioNipRealizandoComponent from '../../sections/cambio_nip/waitCambioNipRealizandoComponent';
import VerificacionCambioNipComponent from '../../sections/cambio_nip/VerificacionCambioNipComponent';

import TimerModuleComponent from '../../sections/timerModule/timerModule';

import Index from '../../sections/indexComponent';
import RemesasComponent from '../../sections/remesas/remesas';
import WaitRemesasRealizandoComponent from '../../sections/remesas/waitRemesasRealizandoComponent';

import ErrorProcessComponent from '../../sections/errorProcessComponent';

import {HashRouter  as Router,Route} from 'react-router-dom';

import {initPingpad,pingpad} from '../../Lib/socketService/socketServices';
import {jsonValidator} from '../../Lib/utils/utils';
import PropsTypes from 'prop-types';

import { SB } from '../../Lib/utils/values';
import { buttons } from '../../Lib/utils/utils';

class Dashboard extends Component{
    
    constructor(props){
        super(props);
        this.state={
            ip:this.props.ip,
            hostName:null,

            /*VARIABLES DE LAS SECCIONES*/
            GBS:null,//GLOBAL BUTTONS STYLES
            GDS:null,//GLOBAL DASHBOARD STYLES

            dccProcess:null,
            dcc:null,//DCC SERVICE
            dccRequest:null,//DCC REQUEST 

            pantallaAnterior:"",
            timerModule:0,
            timerMessage:false,

            nip:null,
            track:null,
            seguridadTarjeta:null,
            mensajeErrorGlobal:null,
            tipoTarjeta:null,
            capabilitiesScreen:null,
            screenType:null,
            compania:null,
            numTelefono:null,
            montoRecarga:null,
            montoRetiroEfectivo:null,
            billsRetiro:null,

            comision:null,//COMISION
            transactionCode:null,//CODIGO DE TRANZACCION

            objetoSaldo:null,
            objetoMovimientos:null,

            pinblockUno:"",
            pinblockDos:"",
            tarjetaChip:false,
            token:null,
            /*VARIABLES DE LAS SECCIONES*/

            message:null,
            contador:0,
            Dashboard:null,
            globalKey:null,
            OperationComponent:{
                OperationComponent:"LOCALHOSTINFORMATION"
            },
            socketStatus:null,
            takeLocalInfo:true,
            reconection:false,

            test:null
            
        }
    }
    timerApp=()=>{
        setInterval(() => {
            this.setState({
                timerModule:this.state.timerModule+1
            });
            if(this.state.timerModule>=6){
                this.modifyState("timerMessage",true);
            }else{
                this.modifyState("timerMessage",false);
            }
        }, 5000);
    }

    componentWillMount(){
        SB("NONE",buttons);
        this.handleStartInit();
    }
    componentDidMount(){
        this.timerApp();
    }

    clear = ()=>{
        this.setState({
            GBS:null,//GLOBAL BUTTONS STYLES
            GDS:null,//GLOBAL DASHBOARD STYLES

            dcc:null,//DCC SERVICE
            dccRequest:null,//DCC REQUEST 

            pantallaAnterior:"",
            timerModule:0,
            timerMessage:false,

            nip:null,
            track:null,
            seguridadTarjeta:null,
            mensajeErrorGlobal:null,
            tipoTarjeta:null,
            capabilitiesScreen:null,
            screenType:null,
            compania:null,
            numTelefono:null,
            montoRecarga:null,
            montoRetiroEfectivo:null,
            billsRetiro:null,

            comision:null,//COMISION
            transactionCode:null,//CODIGO DE TRANZACCION

            objetoSaldo:null,
            objetoMovimientos:null,

            pinblockUno:"",
            pinblockDos:"",
            tarjetaChip:false,
        });
    }

    handleStartInit = ()=>{
        try{
                initPingpad(this.state.ip,"pinpad");
                setTimeout(() => {
                        this.handleLoad();
                }, 5000);
        }catch(error){
            this.handleReConnectService();
        }
    }

    handleLoad = ()=>{
        setTimeout(() => {
              try{
                    if(this.state.takeLocalInfo){
                        pingpad.send(JSON.stringify({
                            operationComponent:"TAKEKEY"
                        }));
                    }
                    this.handleSocketStatus();
                    pingpad.onmessage = (msg)=>{
                        if(jsonValidator(msg.data)){
                          let json = JSON.parse(msg.data);
                          if(json['hostName'] !== undefined){
                                this.setState({
                                    globalKey:json.tmk,
                                    hostName:json.hostName
                                });
                          }
                        }
                    }
                    pingpad.onclose = (event)=>{
                        console.log("Socket closed : ",event);
                        this.handleReConnectService();
                    }
                    pingpad.onerror = (error)=>{
                        console.log("Error durante la conexion : ",error);
                        this.handleReConnectService();
                    }
                }catch(error){
                      this.handleReConnectService();
                }
            },500);
    }

    handleReConnectService = ()=>{
        this.setState({
            message:"NOT SERVICE AVAILABLE",
            contador:this.state.contador+1
        });
        setTimeout(() => {
                this.handleStartInit();
        }, 5000);
    }

    componentStyleApp =(banco) =>{
        switch (banco) {
            case "bancomer":
                    this.handleStateBank("bancomer-component");    
                break;
            case "santander":
                    this.handleStateBank("santander-component");
                break;
            case "azteca":
                    this.handleStateBank("azteca-component");
                break;
            case "bansefi":
                    this.handleStateBank("bansefi-component");
                break;
            case "prosa":
                    this.handleStateBank("prosa-component");
                break;
            default:
                break;
        }
    }

    modifyState = (state,value)=> {
        this.setState({
          [state]:value
        });
    }

    handleStateBank = (bank)=>{
        this.setState({
            Dashboard:bank
        });
    }

    handleSocketStatus = ()=>{
        setInterval(() => {
            if(pingpad!==null || pingpad!==undefined){
                if(pingpad.readyState===1){   
                    this.setState({
                          socketStatus:1,
                          takeLocalInfo:false
                    });  
                }else if(pingpad.readyState===3){
                    this.setState({
                          socketStatus:3
                    });
                    this.handleStartInit();
                }
            }else{
                console.log("Objeto pinpad aun no disponible");
            }
        }, 1000);
    }
    render(){
        if(this.state.ip !==null && this.state.ip!==undefined && this.state.hostName!==null && this.state.hostName !==undefined && pingpad.readyState===1){
            return(
                <Router>
                        <div className="dashboard" style={this.state.GDS}>

                                <Route exact path="/avisoComisionComponent" render={(props)=><AvisoComisionComponent {...props} timerMessage={this.state.timerMessage} GBS={this.state.GBS} capabilitiesScreen={this.state.capabilitiesScreen} ip={this.state.ip} nip={this.state.nip} tipoTarjeta={this.state.tipoTarjeta} comision={this.state.comision} track={this.state.track} token={this.state.token} transactionCode={this.state.transactionCode} modifyState={this.modifyState}/>}/>
        
                                <Route exact path='/imprimirTicketComponent' render={(props)=><ImprimirTicketComponent {...props} ip={this.state.ip} nip={this.state.nip} hostName={this.state.hostName} tipoTarjeta={this.state.tipoTarjeta} track={this.state.track} token={this.state.token} montoRecarga={this.state.montoRecarga} compania={this.state.compania} numTelefono={this.state.numTelefono} modifyState={this.modifyState}/>}/>
                                <Route exact path='/nipComponent' render={(props)=><NipComponent {...props} timerMessage={this.state.timerMessage} GBS={this.state.GBS} ip={this.state.ip} track={this.state.track} token={this.state.token} seguridadTarjeta={this.state.seguridadTarjeta} modifyState={this.modifyState}/>}/>
                                <Route exact path='/retireEfectivoMensajeComponent' render={(props)=><RetireEfectivoMensajeComponent {...props} ip={this.state.ip} nip={this.state.nip} tipoTarjeta={this.state.tipoTarjeta} track={this.state.track} billsRetiro={this.state.billsRetiro} token={this.state.token} transactionCode={this.state.transactionCode} modifyState={this.modifyState}/>}/>
                                <Route exact path='/retireTarjetaComponent' render={(props)=><RetireTarjetaComponent {...props} ip={this.state.ip} modifyState={this.modifyState} clear={this.clear}/>}/>
                                <Route exact path='/retiroOpcionComponent' render={(props)=><RetiroOpcionComponent {...props} timerMessage={this.state.timerMessage} GBS={this.state.GBS} capabilitiesScreen={this.state.capabilitiesScreen} ip={this.state.ip} nip={this.state.nip} tipoTarjeta={this.state.tipoTarjeta} track={this.state.track} token={this.state.token} transactionCode={this.state.transactionCode} modifyState={this.modifyState}/>}/>
                                <Route exact path='/selectConsultaMovimientoComponent' render={(props)=><SelectConsultaMovimientoComponent timerMessage={this.state.timerMessage} {...props} GBS={this.state.GBS} capabilitiesScreen={this.state.capabilitiesScreen} ip={this.state.ip} nip={this.state.nip} tipoTarjeta={this.state.tipoTarjeta} track={this.state.track} token={this.state.token} modifyState={this.modifyState}/>}/>
                                <Route exact path='/selectOperation' render={(props)=><SelectOperation {...props} timerMessage={this.state.timerMessage} GBS={this.state.GBS} capabilitiesScreen={this.state.capabilitiesScreen} ip={this.state.ip} nip={this.state.nip} tipoTarjeta={this.state.tipoTarjeta} track={this.state.track} modifyState={this.modifyState}/>}/>
                                <Route exact path='/tipoTarjetaComponent' render={(props)=><TipoTarjetaComponent {...props} timerMessage={this.state.timerMessage} GBS={this.state.GBS} capabilitiesScreen={this.state.capabilitiesScreen} ip={this.state.ip} nip={this.state.nip} track={this.state.track} modifyState={this.modifyState}/>}/>

                                <Route exact path='/dcc' render={(props)=><DccComponent {...props} timerMessage={this.state.timerMessage} GBS={this.state.GBS} capabilitiesScreen={this.state.capabilitiesScreen} ip={this.state.ip} modifyState={this.modifyState}/>}/>

                                <Route exact path="/waitInicialComponent" render={(props)=><WaitInicialComponent {...props} screenType={this.state.screenType} ip={this.state.ip} hostName={this.state.hostName} track={this.state.track} modifyState={this.modifyState}/>}/>
                                <Route exact path="/waitComisionComponent" render={(props)=><WaitComisionComponent {...props} ip={this.state.ip} nip={this.state.nip} tipoTarjeta={this.state.tipoTarjeta} track={this.state.track} token={this.state.token} transactionCode={this.state.transactionCode} modifyState={this.modifyState}/>}/>

                                <Route exact path="/waitRetiroRealizandoComponent" render={(props)=><WaitRetiroRealizandoComponent {...props} tarjetaChip={this.state.tarjetaChip} GBS={this.state.GBS} ip={this.state.ip} hostName={this.state.hostName} nip={this.state.nip} tipoTarjeta={this.state.tipoTarjeta} montoRetiroEfectivo={this.state.montoRetiroEfectivo} comision={this.state.comision} track={this.state.track} token={this.state.token} transactionCode={this.state.transactionCode} seguridadTarjeta={this.state.seguridadTarjeta} modifyState={this.modifyState}/>}/>
                                <Route exact path="/waitConsultaMovimientoRealizandoComponent" render={(props)=><WaitConsultaMovimientoRealizandoComponent {...props} tarjetaChip={this.state.tarjetaChip} ip={this.state.ip} hostName={this.state.hostName} nip={this.state.nip} tipoTarjeta={this.state.tipoTarjeta} comision={this.state.comision} track={this.state.track} token={this.state.token} transactionCode={this.state.transactionCode} modifyState={this.modifyState}/>}/>
                                <Route exact path="/waitConsultaSaldoRealizandoComponent" render={(props)=><WaitConsultaSaldoRealizandoComponent {...props} tarjetaChip={this.state.tarjetaChip} ip={this.state.ip} hostName={this.state.hostName} nip={this.state.nip} tipoTarjeta={this.state.tipoTarjeta} comision={this.state.comision} track={this.state.track} token={this.state.token} transactionCode={this.state.transactionCode} modifyState={this.modifyState}/>}/>
                                <Route exact path="/waitTiempoAireRealizandoComponent" render={(props)=><WaitTiempoAireRealizandoComponent {...props} tarjetaChip={this.state.tarjetaChip} ip={this.state.ip} hostName={this.state.hostName} nip={this.state.nip} tipoTarjeta={this.state.tipoTarjeta} comision={this.state.comision} track={this.state.track} compania={this.state.compania} numTelefono={this.state.numTelefono} montoRecarga={this.state.montoRecarga} token={this.state.token} transactionCode={this.state.transactionCode} modifyState={this.modifyState}/>}/>

                                <Route exact path="/retornoMenuComponent" render={(props)=><RetornoMenuComponent {...props} timerMessage={this.state.timerMessage} GBS={this.state.GBS} capabilitiesScreen={this.state.capabilitiesScreen} ip={this.state.ip} nip={this.state.nip} tipoTarjeta={this.state.tipoTarjeta} track={this.state.track} token={this.state.token} pinblockUno={this.state.pinblockUno} pinblockDos={this.state.pinblockDos} modifyState={this.modifyState}/>}/>
        
                                <Route exact path="/movimientosComponent" render={(props)=><MovimientosComponent {...props} timerMessage={this.state.timerMessage} GBS={this.state.GBS} capabilitiesScreen={this.state.capabilitiesScreen} ip={this.state.ip} nip={this.state.nip} tipoTarjeta={this.state.tipoTarjeta} comision={this.state.comision} track={this.state.track} token={this.state.token} transactionCode={this.state.transactionCode} objetoMovimientos={this.state.objetoMovimientos} modifyState={this.modifyState}/>}/>
                                <Route exact path="/saldoComponent" render={(props)=><SaldoComponent {...props} timerMessage={this.state.timerMessage} GBS={this.state.GBS} capabilitiesScreen={this.state.capabilitiesScreen} ip={this.state.ip} nip={this.state.nip} tipoTarjeta={this.state.tipoTarjeta} comision={this.state.comision} track={this.state.track} token={this.state.token} transactionCode={this.state.transactionCode} objetoSaldo={this.state.objetoSaldo} modifyState={this.modifyState}/>}/>
                                <Route exact path="/companiasComponent" render={(props)=><CompaniasComponent {...props} timerMessage={this.state.timerMessage} GBS={this.state.GBS} hostName={this.state.hostName} capabilitiesScreen={this.state.capabilitiesScreen} ip={this.state.ip} nip={this.state.nip} track={this.state.track} tipoTarjeta={this.state.tipoTarjeta} token={this.state.token} transactionCode={this.state.transactionCode} modifyState={this.modifyState}/>}/>
                                <Route exact path="/numeroTelefonoComponent" render={(props)=><NumeroTelefonoComponent {...props} timerMessage={this.state.timerMessage} GBS={this.state.GBS} capabilitiesScreen={this.state.capabilitiesScreen} ip={this.state.ip} nip={this.state.nip} tipoTarjeta={this.state.tipoTarjeta} track={this.state.track} compania={this.state.compania} token={this.state.token} transactionCode={this.state.transactionCode} modifyState={this.modifyState}/>}/>
                                <Route exact path="/montoTiempoAireComponent" render={(props)=><MontoTiempoAire {...props} timerMessage={this.state.timerMessage} GBS={this.state.GBS} hostName={this.state.hostName} capabilitiesScreen={this.state.capabilitiesScreen} ip={this.state.ip} nip={this.state.nip} tipoTarjeta={this.state.tipoTarjeta} track={this.state.track} compania={this.state.compania} numTelefono={this.state.numTelefono} token={this.state.token} transactionCode={this.state.transactionCode} modifyState={this.modifyState}/>}/>
                                <Route exact path="/verificarRecargaComponent" render={(props)=><VerificacionRecargaComponent {...props} timerMessage={this.state.timerMessage} GBS={this.state.GBS} hostName={this.state.hostName} capabilitiesScreen={this.state.capabilitiesScreen} ip={this.state.ip} nip={this.state.nip} tipoTarjeta={this.state.tipoTarjeta} track={this.state.track} compania={this.state.compania} numTelefono={this.state.numTelefono} montoRecarga={this.state.montoRecarga} token={this.state.token} transactionCode={this.state.transactionCode} modifyState={this.modifyState}/>}/>

                                <Route exact path="/CambioNipComponent" render={(props)=><CambioNip {...props} timerMessage={this.state.timerMessage} GBS={this.state.GBS} capabilitiesScreen={this.state.capabilitiesScreen} ip={this.state.ip} nip={this.state.nip} track={this.state.track} token={this.state.token} transactionCode={this.state.transactionCode} tipoTarjeta={this.state.tipoTarjeta} pinblockUno={this.state.pinblockUno} pinblockDos={this.state.pinblockDos} modifyState={this.modifyState}/>}/>
                                <Route exact path="/WaitCambioNipRealizandoComponent" render={(props)=><WaitCambioNipRealizandoComponent {...props} hostName={this.state.hostName} tarjetaChip={this.state.tarjetaChip} ip={this.state.ip} nip={this.state.nip} track={this.state.track} tipoTarjeta={this.state.tipoTarjeta} token={this.state.token} transactionCode={this.state.transactionCode} pinblockUno={this.state.pinblockUno} pinblockDos={this.state.pinblockDos} modifyState={this.modifyState}/>}/>
                                <Route exact path="/VerificacionCambioNipComponent" render={(props)=><VerificacionCambioNipComponent {...props} GBS={this.state.GBS} ip={this.state.ip} nip={this.state.nip} tipoTarjeta={this.state.tipoTarjeta} track={this.state.track} token={this.state.token} transactionCode={this.state.transactionCode} modifyState={this.modifyState}/>}/>

                                <Route exact path="/timerModuleComponent" render={(props)=><TimerModuleComponent {...props} timerModule={this.state.timerModule} GBS={this.state.GBS} pantallaAnterior={this.state.pantallaAnterior} screenType={this.state.screenType} modifyState={this.modifyState}/>}/>

                                <Route exact path="/"        render={(props)=><Index {...props} StyleButtons={SB} hostName={this.state.hostName} ip={this.state.ip} track={this.state.track} modifyState={this.modifyState}/>}/>
                                <Route exact path="/remesas" render={(props)=><RemesasComponent {...props} timerMessage={this.state.timerMessage} ip={this.state.ip} GBS={this.state.GBS} screenType={this.state.screenType} modifyState={this.modifyState}/>}/>
                                <Route exact path="/WaitRemesasRealizandoComponent" render={(props)=><WaitRemesasRealizandoComponent {...props} ip={this.state.ip} GBS={this.state.GBS} remesas={this.state.remesas}/>}/>

                                <Route exact path="/errorProcessComponent" render={(props)=><ErrorProcessComponent {...props} ip={this.state.ip} message={this.state.mensajeErrorGlobal} modifyState={this.modifyState}/>}/>
        
                        </div>
                </Router>
                );
        }else{
            return(
                <div id="super-container">
                      <div id="main-container">
                          <div className="lds-default"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
                          {this.state.message==="NOT SERVICE AVAILABLE" ?
                              <h1>Error en el proceso de conexion local, reintentando :  {this.state.contador}</h1> 
                              :
                              <h1>Estableciendo Conexion, por favor espere un momento ....</h1>
                          }
                      </div>
                </div>
              );
        }
    }
}

Dashboard.defaultProps={
    ip:null
}
Dashboard.PropsTypes={
    ip:PropsTypes.string.isRequired
}
export default Dashboard;