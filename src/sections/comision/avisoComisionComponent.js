import React,{Component} from 'react';
import LogoComision from '../../components/logoComision';
import '../stylesSection.css';
import PropsTypes from 'prop-types';
import { SB } from '../../Lib/utils/values';
import {pingpad} from '../../Lib/socketService/socketServices';
import {jsonValidator} from '../../Lib/utils/utils';
import { logic , history , FDKFKLogic } from '../../Lib/utils/construction'; 
import BB from '../../components/BB';  

class AvisoComisionComponent extends Component{
    constructor(props){
        super(props);
            this.state={
                buttonHover:null,
                capabilities:"00000000",
                typeScreen:"",
                touchFDK:""
            }
    }
    handleChangeState = (state,value)=>{
        this.setState({
            [state]:value
        });
    }
    handleSendSocketCancel = ()=>{
        pingpad.send(JSON.stringify({
            operationComponent:"CANCELPINXFS"
        }));
    }

    componentDidUpdate = ()=>{
        if(this.props.timerMessage===true){
            this.props.modifyState("timerMessage",false);
            this.props.modifyState("pantallaAnterior","avisoComisionComponent");
            history("timerModuleComponent",this.props.history);
        }
    }

    componentWillMount(){
        this.props.modifyState("timerModule",0);
        this.props.modifyState("timerMessage",false);
        let ac = logic(this.props,pingpad,"AVISOCOMISIONSALDOCOMPONENT");
        if(ac===null || ac===undefined){history("",this.props.history);}
        else{this.setState({capabilities:ac.capabilities,typeScreen:ac.typeScreen,buttonHover:ac.buttonHover});
        setTimeout(() => {this.handleLogicComponent();}, 40);}
    }
    handleLogicComponent = () =>{
        pingpad.send(JSON.stringify({
            operationComponent:"CREATEFDKCLASS",
            activeFDKs:this.state.capabilities,
            typeScreen:this.state.typeScreen
        }));
        pingpad.onmessage = (msg) =>{
            if(jsonValidator(msg.data)){
                if(msg.data.includes("CANCEL")){
                    history("retireTarjetaComponent",this.props.history);
                }else{
                    const selectOperation = JSON.parse(msg.data);
                    if(selectOperation.code===401){
                            FDKFKLogic(selectOperation.event.action,null,null,this.hl);
                    }else if(selectOperation.code === 9000){
                        this.props.history.push("/");
                    } else if(selectOperation.code==="099"){
                        switch (this.state.touchFDK) {
                            case "FDK4TOUCH":
                                    history("retireTarjetaComponent",this.props.history);
                                break;
                            case "FDK8TOUCH":
                                    this.handleProcessSelected(this.props.transactionCode);
                                break;
                            default:
                                break;
                        }
                    }
                }
            }else{
                console.log("JSON no valido");
            }
        }
    }
    handleHoverButtom = (fdk) =>{
        let buttons = SB(fdk,this.props.GBS);
        this.setState({
            buttonHover:buttons
        });
    }
    hl = (FDK)=>{
        switch (FDK) {
            case "FDK4FISICO":
                    this.handleHoverButtom("FDK4");
                    history("retireTarjetaComponent",this.props.history);
                break;
            case "FDK8FISICO":
                    this.handleHoverButtom("FDK8");
                    this.handleProcessSelected(this.props.transactionCode);
                break;
            case "FDK4TOUCH":
                    this.handleHoverButtom("FDK4");
                    this.handleChangeState("touchFDK",FDK);
                    this.handleSendSocketCancel();
                break
            case "FDK8TOUCH":
                    this.handleHoverButtom("FDK8");
                    this.handleChangeState("touchFDK",FDK);
                    this.handleSendSocketCancel();
                break;
            default:
                break;
        }
    }
    handleProcessSelected = (operation)=>{
        switch (operation) {
            case "31":
                    history("waitConsultaSaldoRealizandoComponent",this.props.history);
                break;
            case "01":
                    history("waitRetiroRealizandoComponent",this.props.history);
                break;
            case "94":
                    history("waitConsultaMovimientoRealizandoComponent",this.props.history);
                break;
            default:
                break;
        }
    }
    render(){
        let m = (
                <div>
                    <h1>¡Aviso!</h1>
                    <LogoComision/>
                    <h2>Por esta operación de consulta de saldo pagará $<span>{this.props.comision} </span>  por comisión con IVA incluido</h2> 
                </div>
        );
        return(
            <BB chain={this.state.capabilities} buttonHover={this.state.buttonHover} onMouse={this.handleHoverButtom} action={this.hl} texto={[null,null,null,"Cancelar",null,null,null,"Aceptar"]} component={m}/>
        );
    }
}
AvisoComisionComponent.defaultProps={
    tipoTarjeta:null,nip:null,ip:null,comision:null,track:null,token:null
}
AvisoComisionComponent.PropsTypes={
    tipoTarjeta:PropsTypes.string.isRequired,
    nip:PropsTypes.string.isRequired,
    ip:PropsTypes.string.isRequired,
    comision:PropsTypes.string.isRequired,
    track:PropsTypes.string.isRequired,
    token:PropsTypes.string.isRequired
}
export default AvisoComisionComponent;