import React,{Component} from 'react';
import {initPingpad,pingpad} from '../../Lib/socketService/socketServices';
import {jsonValidator} from '../../Lib/utils/utils';
import { history , FDKFKLogic } from '../../Lib/utils/construction';
import { SB } from '../../Lib/utils/values';
import BB from '../../components/BB';
import ST from '../../components/ST';

class Remesas extends Component{
    constructor(props){
        super(props);
        this.state={
            codigoRemesas:"            ",
            codigoRemesasContador:0,
            claveRemesas:"    ",
            claveRemesasOculto:"   ",
            claveRemesasContador:0,
            capabilities:"10001000",
            touchFDK:null,
            buttonHover:null
        }
    }

    componentDidUpdate = ()=>{
        if(this.props.timerMessage===true){
            this.props.modifyState("pantallaAnterior","remesas");
            this.props.history.push('/timerModuleComponent');
        }
    }
    componentWillMount(){
        this.props.modifyState("timerModule",0);
        this.props.modifyState("timerMessage",false);
        
        if(this.props.ip===null || this.props.ip===undefined ||
                this.props.GBS===null || this.props.GBS===undefined){
                    
                 this.props.history.push('/');

         }else if(pingpad===null || pingpad===undefined){
             
             initPingpad(this.props.ip,"pingpad","reconexion");
             setTimeout(() => {
                 this.handleLogic();
             }, 300);
         }else{
                        this.setState({
                            buttonHover:{
                                FDK4:this.props.GBS.style,
                                FDK8:this.props.GBS.style
                            }
                        });
                     setTimeout(() => {
                        this.handleLogic();
                     }, 400);
         }
    }

    handleLogic = ()=>{
            this.handleCallFDKXFS("10001000",this.props.screenType);
            pingpad.onmessage = (msg)=>{
                if(jsonValidator(msg.data)){
                    if(msg.data.includes("CANCEL")){
                        history('',this.props.history);
                }else{
                        const JsonBack = JSON.parse(msg.data);
                        if(JsonBack.code===401){
                                FDKFKLogic(JsonBack.event.action,this.handleGeneratingCode,this.handleTakeAwayRemesa,this.hl); 
                    }else if(JsonBack.code === 900){
                        this.props.history.push("/");
                    }else if(JsonBack.code==="099"){
                        switch (this.state.touchFDK) {
                            case "FDK4TOUCH":
                                    history("",this.props.history);
                                break;
                            case "FDK8TOUCH":
                                    this.handleControlAceptar();
                                break;
                            default:
                                break;
                        }
                    }
                }
            }
        }
    }
    handleHoverButtom = (fdk) =>{
        let buttons = SB(fdk,this.props.GBS);
        this.setState({
            buttonHover:buttons
        });
    }
    handleCallFDKXFS = (activeFDKs,typeScreen)=>{
        pingpad.send(JSON.stringify({
            operationComponent:"CREATEPINFDK48CLASS",
            activeFDKs,
            typeScreen
        }));
    }
    handleControlAceptar = ()=>{
        setTimeout(() => {
                if(!this.state.codigoRemesas.includes(" ") || !this.state.claveRemesas.includes(" ")){
                    let or = { /*objectRemesa*/
                        codigoRemesa:this.state.codigoRemesas,
                        claveRemesa:this.state.claveRemesas
                    }
                    this.props.modifyState("remesas",or);
                    history('WaitRemesasRealizandoComponent',this.props.history);
                }else{
                    this.handleHoverButtom("NONE");
                    this.handleCallFDKXFS("10001000",this.props.screenType);
                }
        }, 150);
}
    hl = (FDK)=>{
        switch (FDK) {
            case "FDK4FISICO":
                    this.handleHoverButtom("FDK4");
                    history('',this.props.history);
                break;
            case "FDK8FISICO":
                    if(this.state.codigoRemesas.includes(" ") || this.state.claveRemesas.includes(" ")){
                        this.handleHoverButtom("FDK8");
                        this.setState({
                            verificacion:true
                        });
                        this.handleCallFDKXFS("10001000",this.props.screenType);
                        setTimeout(() => {
                            this.handleHoverButtom("NONE");
                        }, 150);
                    }else{
                        this.handleHoverButtom("FDK8");
                        this.handleControlAceptar();
                    }
                break;
            case "FDK4TOUCH":
                    this.setState({
                        touchFDK:FDK
                    });
                    pingpad.send(JSON.stringify({
                        operationComponent:"CANCELPINXFS"
                    }));
                break;
            case "FDK8TOUCH":
                    if(this.state.codigoRemesas.includes(" ") || this.state.claveRemesas.includes(" ")){
                        this.handleHoverButtom("FDK8");
                        this.setState({
                            verificacion:true
                        });
                        setTimeout(() => {
                            this.handleHoverButtom("NONE");
                        }, 150);
                    }else{
                        this.setState({
                            touchFDK:FDK
                        });
                        this.handleHoverButtom("FDK8");
                        pingpad.send(JSON.stringify({
                            operationComponent:"CANCELPINXFS"
                        }));
                    }
                break;
            default:
                break;
        }
    }

    handleGeneratingCode = (value)=>{
        this.props.modifyState("timerModule",0);
        this.props.modifyState("timerMessage",false);
        if(this.state.codigoRemesasContador<12 && this.state.codigoRemesas.includes(" ")){
            let rf = [...this.state.codigoRemesas];
            rf[this.state.codigoRemesasContador]=value;
            let r = rf.join("");
            this.setState({
                codigoRemesas:r
            });
            if(this.state.codigoRemesasContador<12){
                this.setState({
                    codigoRemesasContador:this.state.codigoRemesasContador+1
                });
            }
        }else if(this.state.claveRemesasContador<4 && this.state.claveRemesas.includes(" ")){
            let cf = [...this.state.claveRemesas];
            cf[this.state.claveRemesasContador]=value;
            let c = cf.join("");
            this.setState({
                claveRemesas:c
            });
            if(this.state.claveRemesasContador<4){
                this.setState({
                    claveRemesasContador:this.state.claveRemesasContador+1
                });
            }
        }
    }

    handleTakeAwayRemesa = ()=>{
        this.setState({
            codigoRemesas:"            ",
            codigoRemesasContador:0,
            claveRemesas:"    ",
            claveRemesasContador:0
        });
        this.handleCallFDKXFS();
    }

    render(){
        return (
            <div id="remesas">
                <div id="up-container">
                        <div id="up-main-container">
                                <h1>Cobro de Remesas</h1>
                                { 
                                    this.state.verificacion &&
                                    <h2>Completa los campos</h2>
                                }
                                <h3>Ingresa el Código de Remesa(12 Dígitos)</h3>
                                <div id="box-container">
                                        <ST id={"left"} idE={"cr"} value={this.state.codigoRemesas.substring(0,4)} number={4}/>
                                        <ST id={"middle"} idE={"cr"} value={this.state.codigoRemesas.substring(4,8)} number={4}/>
                                        <ST id={"right"} idE={"cr"} value={this.state.codigoRemesas.substring(8,12)} number={4}/>
                                </div>
                                <h3>Ingresa la Clave de Remesa(4 Dígitos)</h3>
                                <ST id={"box-middle"} idE={"cc"} value={this.state.claveRemesas.substring(0,4)} number={4}/>
                        </div>
                </div>
                <BB chain={this.state.capabilities} buttonHover={this.state.buttonHover} onMouse={this.handleHoverButtom} action={this.hl} texto={[null,null,null,"Cancelar",null,null,null,"Aceptar"]} component={null}/>
            </div>
        );
    }
}

export default Remesas;