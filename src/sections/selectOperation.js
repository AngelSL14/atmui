import React,{Component} from 'react';
import './stylesSection.css';
import PropsTypes from 'prop-types';
import { SB , BL } from '../Lib/utils/values';
import {pingpad} from '../Lib/socketService/socketServices';
import { logic , history ,hanlog } from '../Lib/utils/construction';
import { SOCKET } from '../Lib/utils/socketComunication';
import BB from '../components/BB';

class SelectOperation extends Component{

    constructor(props){
        super(props);
        this.state={
            buttonHover:null,
            Hover:null,
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

    componentDidUpdate = ()=>{
        if(this.props.timerMessage===true){
            this.props.modifyState("pantallaAnterior","selectOperation");
            this.props.history.push('/timerModuleComponent');
        }
    }

    componentWillMount(){
        this.props.modifyState("timerModule",0);
        let o = logic(this.props,pingpad,"SELECTOPERATION");
        if(o===null || o===undefined){history("",this.props.history);}
        else{this.setState({capabilities:o.capabilities,typeScreen:o.typeScreen,buttonHover:o.buttonHover});
        setTimeout(() => {this.handleLogicComponent();}, 300);}
    }

    handleLogicComponent = () =>{
        SOCKET(pingpad,"CREATEFDKCLASS",this.state);
        let bl = BL("SON",[null,null,null,null,null,null,null,null]);
        pingpad.onmessage = (msg) =>{
            hanlog(msg.data,this.state.touchFDK,this.props.history,null,null,this.hl,bl);
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
            case "FDK5FISICO":
                    this.props.modifyState("transactionCode","65");
                    this.handleHoverButtom("FDK5");
                    history("companiasComponent",this.props.history);
                break;
            case "FDK6FISICO":
                    this.props.modifyState("transactionCode","96");
                    this.handleHoverButtom("FDK6");
                    history("CambioNipComponent",this.props.history);
                break;
            case "FDK7FISICO":
                    this.props.modifyState("transactionCode","01");
                    this.handleHoverButtom("FDK7");
                    history("retiroOpcionComponent",this.props.history);
                break;
            case "FDK8FISICO":
                    this.handleHoverButtom("FDK8");
                    history("selectConsultaMovimientoComponent",this.props.history);
                break;
            case "FDK4TOUCH":
                    this.handleTouch(FDK);
                break;
            case "FDK5TOUCH":
                    this.props.modifyState("transactionCode","65");
                    this.handleTouch(FDK);
                break;
            case "FDK6TOUCH":
                    this.props.modifyState("transactionCode","96");
                    this.handleTouch(FDK);
                break;
            case "FDK7TOUCH":
                    this.props.modifyState("transactionCode","01");
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

    render(){
            return(
                <BB chain={this.state.capabilities} buttonHover={this.state.buttonHover} onMouse={this.handleHoverButtom} action={this.hl} texto={[null,null,null,"Salir","Tiempo Aire","Cambiar Nip","Retiro","Consulta"]} component={<h1>Selecciona la operación</h1>}/>
            );
    }
}
SelectOperation.defaultProps={
    ip:null,nip:null,tipoTarjeta:null,track:null,token:null
}
SelectOperation.PropsTypes={
    ip:PropsTypes.string.isRequired,
    nip:PropsTypes.string.isRequired,
    tipoTarjeta:PropsTypes.string.isRequired,
    track:PropsTypes.string.isRequired,
    token:PropsTypes.string.isRequired
}
export default SelectOperation;
