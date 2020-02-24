import React,{Component} from 'react';
import './stylesSection.css';
import PropsTypes from 'prop-types';
import { SB , BL } from '../Lib/utils/values';
import {pingpad} from '../Lib/socketService/socketServices';
import { history , logic , hanlog } from '../Lib/utils/construction';
import BB from '../components/BB';
import { SOCKET } from '../Lib/utils/socketComunication';

class selectConsultaMovimientosComponent extends Component{

    constructor(props){
        super(props)
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
            this.props.modifyState("pantallaAnterior","selectConsultaMovimientoComponent");
            this.props.history.push('/timerModuleComponent');
        }
    }

    componentWillMount(){
        this.props.modifyState("timerModule",0);
        let l = logic(this.props,pingpad,"SELECTCONSULTAMOVIMIENTOSCOMPONENT");
        if(l===null || l===undefined){history("",this.props.history);}
        else{this.setState({capabilities:l.capabilities,typeScreen:l.typeScreen,buttonHover:l.buttonHover});
        setTimeout(() => {this.selectConsulta();}, 40);}
    }
    selectConsulta = () =>{
        SOCKET(pingpad,"CREATEFDKCLASS",this.state);
        let bl = BL("SCMC",[null,null,null,null,null,null,null,null]);
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
                case "FDK3FISICO":
                        this.handleHoverButtom("FDK3");
                        this.props.modifyState("transactionCode","31");
                        history("waitComisionComponent",this.props.history);
                    break;
                case "FDK4FISICO":
                        this.handleHoverButtom("FDK4");
                        history("retireTarjetaComponent",this.props.history);
                    break;
                case "FDK7FISICO":
                        this.handleHoverButtom("FDK7");
                        this.props.modifyState("transactionCode","94");
                        history("waitComisionComponent",this.props.history);
                    break;
                case "FDK8FISICO":
                        this.handleHoverButtom("FDK8");
                        history("selectOperation",this.props.history);
                    break;
                case "FDK3TOUCH":
                        this.props.modifyState("transactionCode","31");
                        this.handleTouch(FDK);
                    break;
                case "FDK4TOUCH":
                        this.handleTouch(FDK);
                    break;
                case "FDK7TOUCH":
                        this.props.modifyState("transactionCode","94");
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
        SOCKET(pingpad,"CANCELPINXFS",this.props);
    }

    render(){
        return(
            <BB chain={this.state.capabilities} buttonHover={this.state.buttonHover} onMouse={this.handleHoverButtom} action={this.hl} texto={[null,null,"Consulta de Saldos","Salir",null,null,"Consulta de Movimientos","Menu Principal"]} component={<h1>Selecciona la operación</h1>}/>
        );
    }
}
selectConsultaMovimientosComponent.defaultProps={
            tipoTarjeta:null,nip:null,ip:null,track:null,token:null
}
selectConsultaMovimientosComponent.PropsTypes={
    tipoTarjeta:PropsTypes.string.isRequired,
    nip:PropsTypes.string.isRequired,
    ip:PropsTypes.string.isRequired,
    track:PropsTypes.string.isRequired,
    token:PropsTypes.string.isRequired
}
export default selectConsultaMovimientosComponent;