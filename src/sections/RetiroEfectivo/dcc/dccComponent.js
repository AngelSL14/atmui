import React,{Component} from  'react';
import '../../stylesSection.css';
import PropsTypes from 'prop-types';
import {pingpad} from '../../../Lib/socketService/socketServices';
import { SB , BL } from '../../../Lib/utils/values';
import { logic , history , hanlog } from '../../../Lib/utils/construction';
import { SOCKET } from '../../../Lib/utils/socketComunication';
import BB from '../../../components/BB';

class dccComponent extends Component{
    constructor(props){
        super(props);
        this.state={
            buttonHover:null,
            capabilities:"00000000",
            typeScreen:"",
            touchFDK:""
        }
    }
    componentDidUpdate = ()=>{
        if(this.props.timerMessage===true){
            this.props.modifyState("pantallaAnterior","dcc");
            this.props.history.push('/timerModuleComponent');
        }
    }
    componentWillMount(){
        this.props.modifyState("timerModule",0);
        this.props.modifyState("timerMessage",false);
    }
    componentDidMount(){
        let dcc = logic(this.props,pingpad,"DCCCOMPONENT");
        if(dcc===null || dcc===undefined){history("",this.props.history);}
        else{this.setState({capabilities:dcc.capabilities,typeScreen:dcc.typeScreen,buttonHover:dcc.buttonHover});
        setTimeout(() => {this.handleLogicComponent();}, 40);}
    }
    handleLogicComponent = ()=>{
        SOCKET(pingpad,"CREATEFDKCLASS",this.state);
        let bl = BL("DCC",[null,null,null,this.wrc,null,null,null,this.wrc]);
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
                    this.wrc("A");
                break;
            case "FDK8FISICO":
                    this.handleHoverButtom("FDK8");
                    this.wrc("B")
                break;
            case "FDK4TOUCH":
                    this.handleHoverButtom("FDK4");
                    this.handleChangeState("touchFDK",FDK);
                    SOCKET(pingpad,"CANCELPINXFS",null);
                break;
            case "FDK8TOUCH":
                    this.handleHoverButtom("FDK8");
                    this.handleChangeState("touchFDK",FDK);
                    SOCKET(pingpad,"CANCELPINXFS",null);
                break;
            default:
                break;
        }
    }
    wrc = (selected)=>{
        const m = {
            message:"mensaje ISO 0210",
            state:selected
        }
        this.props.modifyState("dccRequest",m);
        this.props.history.push('/waitRetiroRealizandoComponent');
    }

    render(){
        const { dcc }=this.props.dcc;
        return (
            <div id="dcc">
                    <div id="upContainer">
                        <h1>Conversion Dinamica de Moneda</h1>
                        <div id="imgContainer">
                            <img id="local" src={import(`../../../assets/img/flags/${dcc.countryCodeLocal}.png`)} alt=""></img>
                            <div>
                                <h3>Tipo de cambio</h3>
                                <h3>{dcc.localCurrency} = {dcc.changeCurrency}</h3>
                            </div>
                            <img id="foraneo" src={import(`../../../assets/img/flags/${dcc.countryCodeChange}.png`)} alt=""></img>
                        </div>
                        <div id="box-container">
                            <div id="left-container">
                                <h3>Monto solicitado : {dcc.amountRequest}</h3>
                                <h3>Comisión: {dcc.surcharge}</h3>
                                <h3>Monto Total : {dcc.amountTotal}</h3>
                            </div>
                            <div id="right-container">
                                <h3>Monto total convertido</h3>
                                <h3>{dcc.convertedAmount1}</h3>
                            </div>
                        </div>
                    </div>
                    <BB chain={this.state.capabilities} buttonHover={this.state.buttonHover} onMouse={this.handleHoverButtom} action={this.hl} texto={[null,null,null,"Declinar conversion",null,null,null,"Aceptar Conversion"]} component={null}/>
            </div>
        );
    }
}

dccComponent.defaultProps={
    ip:null,nip:null,tipoTarjeta:null,track:null,token:null
}
dccComponent.PropsTypes={
    ip:PropsTypes.string.isRequired,
    nip:PropsTypes.string.isRequired,
    tipoTarjeta:PropsTypes.string.isRequired,
    track:PropsTypes.string.isRequired,
    token:PropsTypes.string.isRequired
}

export default dccComponent;