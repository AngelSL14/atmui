import React,{Component} from 'react';
import '../stylesSection.css';
import Button from '../../components/button';
import PropsTypes from 'prop-types';
import TableConsultaSaldo from '../tables/tableConsultaSaldo';
import { SB , FDKTouch } from '../../Lib/utils/values';
import {pingpad} from '../../Lib/socketService/socketServices';
import {jsonValidator} from '../../Lib/utils/utils'; 
import { logic , history , FDKFKLogic } from '../../Lib/utils/construction';

class saldoComponent extends Component{
    constructor(props){
        super(props);
        this.state={
            operationComponent:{
                operationComponent:"SALDOCOMPONENT"
            },
            buttonHover:null,
            capabilities:"00000000",
            typeScreen:"",
            touchFDK:""
        }
        this.handleLogicComponent=this.handleLogicComponent.bind(this);
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
            this.props.modifyState("pantallaAnterior","saldoComponent");
            this.props.history.push('/timerModuleComponent');
        }
    }
    async componentWillMount(){
        this.props.modifyState("timerModule",0);
        let sc = logic(this.props,pingpad,"SALDOCOMPONENT");
        if(sc===null || sc===undefined){history("",this.props.history);}
        else{this.setState({capabilities:sc.capabilities,typeScreen:sc.typeScreen,buttonHover:sc.buttonHover});
        setTimeout(() => {this.handleLogicComponent();}, 40);}
    }
    async handleLogicComponent(){
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
                            FDKFKLogic(selectOperation.event.action,null,null,this.handleClicFDK);
                    }else if(selectOperation.code === 9000){
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
    handleClicFDK = (FDK)=>{
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
            <div id="Saldo-consulta">
                        <div id="contenedor">
                            <div id="table-container">
                                <h1>Consulta de Saldo</h1>
                                <TableConsultaSaldo id="tableSaldo" dataTable={this.props.objetoSaldo}/>
                            </div>
                        </div>
                        <div id="button-container">
                                <div id="left-button">
                                        <div>
                                        {this.state.capabilities.substring(4,5)==="1" &&
                                                <Button style={this.state.buttonHover.FDK4} onMouseEnter={()=>this.handleHoverButtom("FDK4")} onMouseLeave={()=>this.handleHoverButtom("NONE")} id="FDK4" action={()=>this.handleClicFDK("FDK4TOUCH")} texto="Salir"></Button>
                                        }
                                                </div>
                                </div>
                                <div id="middle-button">
                                    
                                </div>
                                <div id="right-button">
                                            <div>
                                                {this.state.capabilities.substring(1,2)==="1" &&
                                                    <Button style={this.state.buttonHover.FDK7} onMouseEnter={()=>this.handleHoverButtom("FDK7")} onMouseLeave={()=>this.handleHoverButtom("NONE")} id="FDK7" action={()=>this.handleClicFDK("FDK7TOUCH")} texto={"Imprimir"}></Button>
                                                }
                                            </div>
                                            <div>
                                                {this.state.capabilities.substring(0,1)==="1" &&
                                                    <Button style={this.state.buttonHover.FDK8} onMouseEnter={()=>this.handleHoverButtom("FDK8")} onMouseLeave={()=>this.handleHoverButtom("NONE")} id="FDK8" action={()=>this.handleClicFDK("FDK8TOUCH")} texto="Menu Principal"></Button>
                                                }
                                            </div>
                                </div>
                                
                                
                        </div>
            </div>
        );
    }
}
saldoComponent.defaultProps={
    tipoTarjeta:null,nip:null,ip:null,comision:null,track:null,token:null
}
saldoComponent.PropsTypes={
    tipoTarjeta:PropsTypes.string.isRequired,
    nip:PropsTypes.string.isRequired,
    ip:PropsTypes.string.isRequired,
    comision:PropsTypes.string.isRequired,
    track:PropsTypes.string.isRequired,
    token:PropsTypes.string.isRequired
}
export default saldoComponent;