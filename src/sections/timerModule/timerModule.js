import React,{Component} from 'react';
import '../stylesSection.css';
import PropsTypes from 'prop-types';
import { SB } from '../../Lib/utils/values';
import {initPingpad,pingpad} from '../../Lib/socketService/socketServices';
import {jsonValidator} from '../../Lib/utils/utils';
import { FDKFKLogic } from '../../Lib/utils/construction';
import { history } from '../../Lib/utils/construction';
import { SOCKET } from '../../Lib/utils/socketComunication';
import BB from '../../components/BB';

class TimerModule extends Component{
    constructor(props){
        super(props);
        this.state={
            operationComponent:{
                operationComponent:"TIMERMODULECOMPONENT"
            },
            buttonHover:null,
            capabilities:"00000000",
            typeScreen:"",
            touchFDK:""
        }
    }

    componentWillMount(){
        if(this.props.pantallaAnterior===null || this.props.GBS===null){
                this.props.history.push('/');
        }else if(pingpad===null || pingpad===undefined){
                initPingpad(this.props.ip,"pingpad","reconexion");
                setTimeout(() => {
                        this.handleLogicComponent();
                }, 300);
        }else{
            //this.props.capabilitiesScreen.screenCapabilities.forEach(s => {
                //if(s.screen==="TIMERMODULECOMPONENT"){
                    let buttonHover = SB("NONE",this.props.GBS);
                    this.setState({
                        capabilities:"10001000",
                        typeScreen:this.props.screenType,
                        buttonHover
                    });
                    setTimeout(() => {
                        this.handleLogicComponent();
                    }, 40);
                //}
            //  }); 
        }    
    }

    handleTimerVerify = () => {
        setInterval(() => {
            if(this.props.timerModule>=12){
                this.props.modifyState("timerMessage",false);
                this.props.modifyState("timerModule",0)
                this.setState({
                    touchFDK:"TIMEROUT"
                });
                SOCKET(pingpad,"CANCELPINXFS",this.props);
            }
        }, 1000);
    }

    handleLogicComponent = () =>{
        this.handleTimerVerify();
        pingpad.onmessage = (msg) =>{
            if(jsonValidator(msg.data)){
                if(msg.data.includes("CANCEL")){
                    history("retireTarjetaComponent",this.props.history);
                }else{
                    const wsp = JSON.parse(msg.data);
                    if(wsp.code===401){
                        FDKFKLogic(wsp.event.action,null,null,this.hl);
                    }else if(wsp.code===9000){
                        this.props.history.push("/");
                    } else if(wsp.code==="099"){
                            switch (this.state.touchFDK) {
                                case "FDK4TOUCH"://SE USA EL TOUCH EN EL FDK4
                                        this.handleRetornos(this.props.pantallaAnterior);
                                    break;
                                case "FDK8TOUCH"://SE USA EL TOUCH EN EL FDK8
                                        this.handleRetornoPantalla(this.props.pantallaAnterior);
                                    break;
                                case "TIMERFDK"://VALIDACION PARA CANCELAR EL COMANDO FDK ACTIVO
                                        SOCKET(pingpad,"CREATEFDKCLASS",this.state);
                                    break;
                                case "TIMEROUT"://CANCELA AL TERMINAR EL TIMER
                                        this.handleRetornos(this.props.pantallaAnterior);
                                    break;
                                default:
                                    break;
                            }
                    }
                }
            }
        }
        this.setState({
            touchFDK:"TIMERFDK"
        });
        SOCKET(pingpad,"CANCELPINXFS",null);
    }

    handleHoverButtom = (fdk) =>{
        let buttons = SB(fdk,this.props.GBS);
        this.setState({
            buttonHover:buttons
        });
    }
    handleRetornos = (data)=>{
        if(data==="remesas"){
            history("",this.props.history);
        }else{
            history("retireTarjetaComponent",this.props.history);
        }
    }

    hl = (FDK)=>{
        switch (FDK) {
            case "FDK4FISICO":
                    this.handleHoverButtom("FDK4");
                    this.handleRetornos(this.props.pantallaAnterior);
                break;
            case "FDK8FISICO":
                    this.handleHoverButtom("FDK8");
                    this.handleRetornoPantalla(this.props.pantallaAnterior);
                break;
            case "FDK4TOUCH":
                    this.handleTouch(FDK);
                break;
            case "FDK8TOUCH":
                    this.handleTouch(FDK);
                break;
            default:
                break;
        }
    }

    handleTouch = (FDK)=>{
        this.handleChangeState("touchFDK",FDK);
        SOCKET(pingpad,"CANCELPINXFS",null);
    }

    handleChangeState = (state,value)=>{
        this.setState({
            [state]:value
        });
    }

    handleRetornoPantalla = (pantallaAnterior) =>{
        this.props.modifyState("timerMessage",false);
        this.props.modifyState("timerModule",0);
        history(pantallaAnterior,this.props.history);
    }

    render(){
        return(
            <BB chain={this.state.capabilities} buttonHover={this.state.buttonHover} onMouse={this.handleHoverButtom} action={this.hl} texto={[null,null,null,"NO",null,null,null,"SI"]} component={<h1>Necesitas mas tiempo ?</h1>}/>
        );
    }
}

TimerModule.defaultProps={
    pantallaAnterior:null,GBS:null
}
TimerModule.PropsTypes={
    pantallaAnterior:PropsTypes.string.isRequired,
    GBS:PropsTypes.string.isRequired
}

export default TimerModule;