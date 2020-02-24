import React,{Component} from 'react';
import '../stylesSection.css';
import TableConsultaMovimientos from '../tables/tableConsultaMovimientos';
import PropsTypes from 'prop-types';
import { SB , FDKTouch } from '../../Lib/utils/values';
import {pingpad} from '../../Lib/socketService/socketServices';
import {jsonValidator} from '../../Lib/utils/utils';
import { logic , history , FDKFKLogic } from '../../Lib/utils/construction';
import BB from '../../components/BB';

class movimientosComponent extends Component{
    constructor(props){
        super(props);
        this.state={
            operationComponent:{
                operationComponent:"MOVIMIENTOSCOMPONENT"
            },
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
            this.props.modifyState("pantallaAnterior","movimientosComponent");
            this.props.history.push('/timerModuleComponent');
        }
    }
    componentWillMount(){
        this.props.modifyState("timerModule",0);
        let mc = logic(this.props,pingpad,"MOVIMIENTOSCOMPONENT");
        if(mc===null || mc===undefined){history("",this.props.history);}
        else{this.setState({capabilities:mc.capabilities,typeScreen:mc.typeScreen,buttonHover:mc.buttonHover});
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
                    }else if(selectOperation.code ===9000){
                        this.props.history.push("/");
                    }else if(selectOperation.code==="099"){
                        let routes = [null,null,null,"retireTarjetaComponent",null,null,"imprimirTicketComponent","selectOperation"];
                        FDKTouch(this.state.touchFDK,routes,this.props.history);
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
            case "FDK7FISICO":
                    this.handleHoverButtom("FDK7");
                    history("imprimirTicketComponent",this.props.history);
                break;
            case "FDK8FISICO":
                    this.handleHoverButtom("FDK8");
                    history("selectOperation",this.props.history);
                break;
            case "FDK4TOUCH":
                    this.handleHoverButtom("FDK4");
                    this.handleChangeState("touchFDK",FDK);
                    this.handleSendSocketCancel();
                break;
            case "FDK7TOUCH":
                    this.handleHoverButtom("FDK7");
                    this.handleChangeState("touchFDK",FDK);
                    this.handleSendSocketCancel();
                break;
            case "FDK8TOUCH":
                    this.handleHoverButtom("FDK8");
                    this.handleChangeState("touchFDK",FDK);
                    this.handleSendSocketCancel();
                break;
            default:
                break;
        }
    }
    render(){
        return(
            <div id="Movimientos-consulta">
                <div id="up-container">
                        <div id="text-container">
                            <h1>Consulta de Movimientos </h1>
                        </div>
                        <div id="table-container">
                            <TableConsultaMovimientos id="tab" final={this.props.objetoMovimientos}/>
                        </div>
                </div>
                <BB chain={this.state.capabilities} buttonHover={this.state.buttonHover} onMouse={this.handleHoverButtom} action={this.hl} texto={[null,null,null,"Salir",null,null,"Imprimir","Menu Pricipal"]} component={null}/>
            </div>
        );
    }
}
movimientosComponent.defaultProps={
    comisionMovimientos:null,tipoTarjeta:null,nip:null,ip:null,track:null,token:null
}
movimientosComponent.PropsTypes={
    comisionMovimientos:PropsTypes.string.isRequired,
    tipoTarjeta:PropsTypes.string.isRequired,
    nip:PropsTypes.string.isRequired,
    ip:PropsTypes.string.isRequired,
    track:PropsTypes.string.isRequired,
    token:PropsTypes.string.isRequired
}
export default movimientosComponent;