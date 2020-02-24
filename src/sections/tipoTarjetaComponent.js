import React,{Component} from 'react';
import PropsTypes from 'prop-types';
import './stylesSection.css';
import {pingpad} from '../Lib/socketService/socketServices';
import { SB , BL } from '../Lib/utils/values';
import { logic , history , hanlog } from '../Lib/utils/construction';
import { SOCKET } from '../Lib/utils/socketComunication';
import BB from '../components/BB';
class tipoTarjetaComponent extends Component{
    
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

    componentDidUpdate = ()=>{
        if(this.props.timerMessage===true){
            this.props.modifyState("pantallaAnterior","tipoTarjetaComponent");
            this.props.history.push('/timerModuleComponent');
        }
    }

    componentWillMount(){
        this.props.modifyState("timerModule",0);
        let tt = logic(this.props,pingpad,"TIPOTARJETACOMPONENT");
        if(tt===null || tt===undefined){history("",this.props.history);}
        else{this.setState({capabilities:tt.capabilities,typeScreen:tt.typeScreen,buttonHover:tt.buttonHover});
        setTimeout(() => {this.handleLogicComponent();}, 40);}
    }
    handleLogicComponent = () =>{
        SOCKET(pingpad,"CREATEFDKCLASS",this.state);
        let bl = BL("TTC",[null,null,null,null,null,this.wrc,this.wrc,this.wrc]);
        pingpad.onmessage = (msg)=>{
            hanlog(msg.data,this.state.touchFDK,this.props.history,null,null,this.hl,bl);
        }
    }
    handleHoverButtom = (fdk) =>{
        let buttons = SB(fdk,this.props.GBS);
        this.setState({
            buttonHover:buttons
        });
    }
    wrc = (tipoCuenta) =>{
        switch (tipoCuenta) {
            case "Cuenta de Ahorro":
                    this.props.modifyState("tipoTarjeta","10");
                    history("selectOperation",this.props.history);
                break;
            case "Cuenta de Credito":
                    this.props.modifyState("tipoTarjeta","30");
                    history("selectOperation",this.props.history);
                break;
            case "Cuenta de Debito":
                    this.props.modifyState("tipoTarjeta","20");
                    history("selectOperation",this.props.history);
                break;
            default:
                break;
        }
    }
    hl = (FDK)=>{
        switch (FDK) {
            case "FDK6FISICO":
                    this.handleHoverButtom("FDK6")
                    this.wrc("Cuenta de Ahorro");
                break;
            case "FDK7FISICO":
                    this.handleHoverButtom("FDK7")
                    this.wrc("Cuenta de Credito");
                break;
            case "FDK8FISICO":
                    this.handleHoverButtom("FDK8")
                    this.wrc("Cuenta de Debito");
                break;
            case "FDK6TOUCH":
                    this.handleTouch(FDK);
                break;
            case "FDK7TOUCH":
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
        SOCKET(pingpad,"CANCELPINXFS",null)
    }
    
    render(){
            return(
                <BB chain={this.state.capabilities} buttonHover={this.state.buttonHover} onMouse={this.handleHoverButtom} action={this.hl} texto={[null,null,null,null,null,"Cuenta de Ahorro","Cuenta de Crédito","Cuenta de Débito"]} component={<h1>Seleccione tipo de tarjeta</h1>}/>
            );
    }
}
tipoTarjetaComponent.defaultProps={
            ip:null,nip:null,track:null,token:null
}
tipoTarjetaComponent.PropsTypes={
    ip:PropsTypes.string.isRequired,
    nip:PropsTypes.string.isRequired,
    track:PropsTypes.string.isRequired,
    token:PropsTypes.string.isRequired
}
export default tipoTarjetaComponent;