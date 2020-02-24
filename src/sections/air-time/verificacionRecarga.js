import React,{Component} from 'react';
import '../stylesSection.css';
import Button from '../../components/button';
import {pingpad} from '../../Lib/socketService/socketServices';
import PropsTypes from 'prop-types';
import { SB  } from '../../Lib/utils/values';
import { logic , history , hanlog } from '../../Lib/utils/construction';

class VerificacionRecarga extends Component{
    constructor(props){
        super(props);
        this.state={
            operationComponent:{
                operationComponent:"VERIFICARTIEMPOAIRECOMPONENT"
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
            this.props.modifyState("pantallaAnterior","verificarRecargaComponent");
            this.props.history.push('/timerModuleComponent');
        }
    }
    componentWillMount(){
        this.props.modifyState("timerModule",0);
        let vr = logic(this.props,pingpad,"VERIFICARTIEMPOAIRECOMPONENT");
        if(vr===null || vr===undefined){history("",this.props.history);}
        else{this.setState({capabilities:vr.capabilities,typeScreen:vr.typeScreen,buttonHover:vr.buttonHover});
        setTimeout(() => {this.handleLogicComponent();}, 40);}  
    }

    handleLogicComponent = ()=>{
        pingpad.send(JSON.stringify({
            operationComponent:"CREATEFDKCLASS",
            activeFDKs:this.state.capabilities,
            typeScreen:this.state.typeScreen
        }));
        let arrayt = {
            texto:[null,null,null,null,null,null,null,null],
            F:[null,null,null,null,null,null,null,null],
            route:[null,null,null,null,null,null,"waitTiempoAireRealizandoComponent","retireTarjetaComponent"]
        }
        pingpad.onmessage = (msg)=>{
            hanlog(msg.data,this.state.touchFDK,this.props.history,null,null,this.hl,arrayt);
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
            case "FDK7FISICO":
                    this.handleHoverButtom("FDK7");
                    history("waitTiempoAireRealizandoComponent",this.props.history);
                break;
            case "FDK8FISICO":
                    this.handleHoverButtom("FDK8");
                    history("retireTarjetaComponent",this.props.history);
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
    render()
    {
        return(
            <div id="VerificarRecarga">
                    <div id="up-container">
                            <div id="up">
                            </div>
                            <div id="middle">
                                    <h1 id="spanish">Confirme que los datos sean correctos</h1>
                                    
                            </div>
                            <div id="down">                                    
                                    <h1 id="telefono">Teléfono: {this.props.numTelefono}</h1>
                                    <h1 id="monto">Monto: $ {this.props.montoRecarga}</h1>
                                    <h1 id="companias">Compañía: {this.props.compania}</h1>
                            </div>
                    </div>
                    <div id="down-container">
                            <div id="left-container">
                            </div>
                            <div id="middle-container">
                            </div>
                            <div id="right-container">
                                    <div id="right-button-container">
                                            <div>
                                            {this.state.capabilities.substring(1,2)==="1" &&
                                                    <Button style={this.state.buttonHover.FDK7} onMouseEnter={()=>this.handleHoverButtom("FDK7")} onMouseLeave={()=>this.handleHoverButtom("NONE")} id="FDK7" action={()=>this.hl("FDK7TOUCH")} texto={"SI"}/>
                                            }
                                                    </div>
                                            <div>
                                            {this.state.capabilities.substring(0,1)==="1" &&
                                                    <Button style={this.state.buttonHover.FDK8} onMouseEnter={()=>this.handleHoverButtom("FDK8")} onMouseLeave={()=>this.handleHoverButtom("NONE")} id="FDK8" action={()=>this.hl("FDK8TOUCH")} texto={"NO"}/>
                                        }
                                                    </div>
                                    </div>
                            </div>
                    </div>
            </div>
        );
    };
}

VerificacionRecarga.defaultProps={
    tipoTarjeta:null,nip:null,ip:null,track:null,compania:null,numTelefono:null,montoRecarga:null,token:null
}
VerificacionRecarga.PropsTypes={
    tipoTarjeta:PropsTypes.string.isRequired,
    nip:PropsTypes.string.isRequired,
    ip:PropsTypes.string.isRequired,
    track:PropsTypes.string.isRequired,
    compania:PropsTypes.string.isRequired,
    numTelefono:PropsTypes.string.isRequired,
    montoRecarga:PropsTypes.string.isRequired,
    token:PropsTypes.string.isRequired
}

export default VerificacionRecarga;