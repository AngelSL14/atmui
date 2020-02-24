import React, {Component} from 'react';
import '../stylesSection.css';
import {jsonValidator} from '../../Lib/utils/utils';
import {pingpad} from '../../Lib/socketService/socketServices';
import { SB } from '../../Lib/utils/values';
import { logic , history } from '../../Lib/utils/construction';
import BB from '../../components/BB';
import ST from '../../components/ST';
class cambioNip extends Component{

    constructor(props){
        super(props); 
        this.state={
            sizePing:"",
            secondPing:"",
            buttonHover:null,
            confirmarNip:false,
            messageCambioNip:"Confirma tu nuevo Nip",
            nipMessage:"Ingresa tu nuevo nip",
            touchFDK:"",
            validacionNip:false,
            capabilities:"00000000",
            typeScreen:""
        }
    }

    handleHoverButtom = (fdk) =>{
        let buttons = SB(fdk,this.props.GBS);
        this.setState({
            buttonHover:buttons
        });
    }
    componentDidUpdate = ()=>{
         if(this.props.timerMessage===true){
             this.props.modifyState("pantallaAnterior","CambioNipComponent");
             this.props.history.push('/timerModuleComponent');
         }
     }
    componentWillMount(){
        this.props.modifyState("timerModule",0);
        let cn = logic(this.props,pingpad,"CAMBIONIPCOMPONENT");
        if(cn===null || cn===undefined){history("",this.props.history);}
        else{this.setState({capabilities:cn.capabilities,typeScreen:cn.typeScreen,buttonHover:cn.buttonHover});
        setTimeout(() => {this.handleLogicComponent();}, 40);}
    }

    handleLogicComponent = ()=>{
        pingpad.send(JSON.stringify({
            operationComponent:"NIPCOMPONENT"
        }));
        pingpad.onmessage = (msg)=>{
            if(jsonValidator(msg.data)){
                    if(msg.data.includes("CANCEL")){
                            history("retireTarjetaComponent",this.props.history);
                    }else{
                        const jsonNip = JSON.parse(msg.data);
                        if(jsonNip.code===401){
                            switch (jsonNip.event.action) {
                                case "FK_1":
                                    this.handleNip("1");
                                    break;
                                case "FK_2":    
                                    this.handleNip("2");
                                    break;
                                case "FK_3":
                                    this.handleNip("3");
                                    break;
                                case "FK_4":
                                    this.handleNip("4");
                                    break;
                                case "FK_5":
                                    this.handleNip("5");
                                    break;
                                case "FK_6":
                                    this.handleNip("6");
                                    break;
                                case "FK_7":
                                    this.handleNip("7");
                                    break;
                                case "FK_8":
                                    this.handleNip("8");
                                    break;
                                case "FK_9":
                                    this.handleNip("9");
                                    break;
                                case "FK_0":
                                    this.handleNip("0");        
                                    break;
                                case "WFS_PIN_FK_FDK04":
                                    this.hl("FDK4FISICO");
                                    break;
                                case "WFS_PIN_FK_FDK08":
                                    this.hl("FDK8FISICO");
                                    break;
                                case "FK_BACKSPACE":
                                    this.handleDeleteNip();
                                    break;
                                case "FK_CLEAR":
                                    this.handleDeleteNip();
                                    break;
                                case "FK_UNUSED":
                                        this.handleCompletePin("add");
                                    break;
                                default:
                                    break;
                            }
                    }else if(jsonNip.code ===9000){
                        this.props.history.push("/");
                    }else if(jsonNip.code===400){
                        let pan = this.props.track.split("=");
                        const GETPINPAD ={
                            operationComponent:"GETPINPAD",
                            subtrack:pan[0],
                            pin:jsonNip.message
                        }
                        setTimeout(() => {
                            pingpad.send(JSON.stringify(GETPINPAD));
                        }, 300);
                    }else if(jsonNip.code==="016"){
                            if(this.state.validacionNip===true){
                                this.props.modifyState("pinblockDos",jsonNip.message);
                            }else{
                                this.props.modifyState("pinblockUno",jsonNip.message);
                            }
                            if(this.state.validacionNip===false){
                                    pingpad.send(JSON.stringify({
                                        operationComponent:"NIPCOMPONENT"
                                    }));
                            }else{
                                pingpad.send(JSON.stringify({
                                    operationComponent:"CREATEFDKFKCLASS",
                                    activeFDKs:this.state.capabilities,
                                    typeScreen:this.state.typeScreen
                                }));
                            }
                            this.setState({
                                validacionNip:true
                            });
                    }else if(jsonNip.code==="099"){
                            switch (this.state.touchFDK) {
                                case "FDK4TOUCH":
                                        history("retireTarjetaComponent",this.props.history);
                                    break;
                                case "FDK8TOUCH":
                                        this.handleWaitCambioNipRealizandoComponent();
                                    break;
                                default:
                                    break;
                            }
                    }
                
                }
            }
        }
    }

    handleNip = ()=>{
        if(this.state.sizePing.length>=3){
            this.setState({
                confirmarNip:true
            });
        }
        if(this.state.sizePing.length<=3){
            this.setState({
                sizePing:this.state.sizePing.concat("*")
            });
        }else if(this.state.secondPing.length<=3){
            this.setState({
                secondPing:this.state.secondPing.concat("*")
            });
        }
    }

    handleCompletePin = (process)=>{
        if(this.props.pinblockUno.length===16){
            this.setState({
                confirmarNip:true
            });
        }
        if(process==="add" && this.props.pinblockUno.length!==16){
            this.setState({
                sizePing:this.state.sizePing.concat("*")
            });
        }else if(process==="add" && this.props.pinblockDos.length!==16){
            this.setState({
                secondPing:this.state.secondPing.concat("*")
            });
        }
    }

    handleDeleteNip = ()=>{
        this.setState({
            pinblockUno:"",
            pinblockDos:"",
            sizePing:"",
            secondPing:""
        });
        pingpad.send(JSON.stringify({
            operationComponent:"NIPCOMPONENT"
        }));
    }

    handleWaitCambioNipRealizandoComponent = ()=>{
        if(this.props.pinblockUno.length===16 && this.props.pinblockDos.length===16){
            history("WaitCambioNipRealizandoComponent",this.props.history);
        }else{
            this.setState({
                messageCambioNip:"Por favor complete el Nip"
            });
        }
    }

    handleNipNoIguales = ()=>{
        this.setState({
            nipMessage:"LOS DATOS NO COINCIDEN",
            validacionNip:false,
            sizePing:"",
            secondPing:""
        });
        this.props.modifyState("pinblockUno","");
        this.props.modifyState("pinblockDos","");
        pingpad.send(JSON.stringify({
            operationComponent:"NIPCOMPONENT"
        }));
    }

    hl =(FDK)=>{
                switch (FDK) {
                    case "FDK4FISICO":
                            this.handleHoverButtom("FDK4");
                            history("retireTarjetaComponent",this.props.history);
                        break;
                    case "FDK8FISICO":
                            if(this.props.pinblockUno.length===16 && this.props.pinblockDos.length===16){
                                if(this.props.pinblockUno===this.props.pinblockDos){
                                    this.handleHoverButtom("FDK8");
                                    this.handleWaitCambioNipRealizandoComponent();
                                }else{
                                    this.handleNipNoIguales();
                                }
                            }else{
                                this.handleHoverButtom("FDK8");
                                setTimeout(() => {
                                    this.handleHoverButtom("NONE");
                                    pingpad.send(JSON.stringify({operationComponent:"CAMBIONIPCOMPONENT"}));
                                }, 150);
                            }
                        break;
                    case "FDK4TOUCH":
                            this.setState({
                                touchFDK:FDK
                            });
                            this.handleHoverButtom("FDK4");
                            pingpad.send(JSON.stringify({
                                operationComponent:"CANCELPINXFS"
                            }));
                        break;
                    case "FDK8TOUCH":
                            if(this.props.pinblockUno.length===16 && this.props.pinblockDos.length===16){
                                    if(this.props.pinblockUno===this.props.pinblockDos){
                                        this.setState({
                                            touchFDK:FDK
                                        });
                                        this.handleHoverButtom("FDK8");
                                        pingpad.send(JSON.stringify({
                                            operationComponent:"CANCELPINXFS"
                                        }));
                                    }else{
                                        this.handleNipNoIguales();
                                    }
                            }else{
                                this.handleHoverButtom("FDK8");
                                setTimeout(() => {
                                    this.handleHoverButtom("NONE");
                                }, 150);
                            }
                        break;
                    default:
                        break;
                }
    }
    render (){
        return(
                <div id="cambioNip-Container">
                    <div id="the_nip_container">
                        <div>
                            <h1>{this.state.nipMessage}</h1>
                                <div id="squareContainer">
                                    <ST id={"divContainerUp"} idE={"nip"} value={this.state.sizePing} number={4}/>
                                </div>
                                {this.props.pinblockUno.length===16 && <h1>{this.state.messageCambioNip}</h1>}
                                <div id="squareContainerDown">
                                    {this.props.pinblockUno.length===16 &&
                                            <ST id={"divContainerDown"} idE={"nip"} value={this.state.secondPing} number={4}/>
                                    }
                                </div>
                        </div>
                    </div>
                    <BB chain={this.state.capabilities} buttonHover={this.state.buttonHover} onMouse={this.handleHoverButtom} action={this.hl} texto={[null,null,null,"Cancelar",null,null,null,"Aceptar"]} component={null}/>
                </div>
        );
        }
}

export default cambioNip;
