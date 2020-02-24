import React,{Component} from 'react';
import '../stylesSection.css';
import {pingpad} from '../../Lib/socketService/socketServices';
import PropsTypes from 'prop-types';
import { SB } from '../../Lib/utils/values';
import { logic , history , hanlog } from '../../Lib/utils/construction';
import BB from '../../components/BB';
import ST from '../../components/ST';

class NumeroTelefono extends Component{
    constructor(props){
        super(props);
        this.state={
                capabilities:"00000000",
                typeScreen:null,
                buttonHover:null,
                numTelefono:"          ",
                //numTelefono:"3221812552",
                phoneContador:0,
                extraContador:null,
                touchFDK:""
        }
    }
    componentDidUpdate = ()=>{
        // if(this.props.timerMessage===true){
        //     this.props.modifyState("pantallaAnterior","numeroTelefonoComponent");
        //     this.props.history.push('/timerModuleComponent');
        // }
    }
    componentWillMount(){
        this.props.modifyState("timerModule",0);
        let nt = logic(this.props,pingpad,"NUMEROTELEFONOCOMPONENT");
        if(nt===null || nt===undefined){history("",this.props.history);}
        else{this.setState({capabilities:nt.capabilities,typeScreen:nt.typeScreen,buttonHover:nt.buttonHover});
        setTimeout(() => {this.handleGivePhone();}, 40);}
    }
        
    handleGivePhone = ()=>{
        pingpad.send(JSON.stringify({operationComponent:"NUMEROTELEFONOCOMPONENT"}));
        let arrayt = {
            texto:[null,null,null,"",null,null,null,""],
            F:[null,null,null,this.handleControlNo,null,null,null,this.handleControlSi],
            route:[null,null,null,null,null,null,null,null]
        }
        pingpad.onmessage = (msg)=>{
            hanlog(msg.data,this.state.touchFDK,this.props.history,this.handleGeneratingPhone,this.handleTakeAwayPhone,this.hl,arrayt);
        }
    }

    handleHoverButtom = (fdk) =>{
        let buttons = SB(fdk,this.props.GBS);
        this.setState({
            buttonHover:buttons
        });
    }
    handleGeneratingPhone = (numero)=>{
        if(this.state.phoneContador<10 && this.state.numTelefono.includes(" ")){
            if(this.state.extraContador===1){
                this.setState({
                    phoneContador:this.state.phoneContador+1,
                    extraContador:0
                });
            }
            let telefonoFinal = [...this.state.numTelefono];
            telefonoFinal[this.state.phoneContador]=numero;
            let telefono = telefonoFinal.join("");
            this.setState({
                numTelefono:telefono
            });
            if(this.state.phoneContador<9){
                this.setState({
                    phoneContador:this.state.phoneContador+1
                });
            }
        }
    }
    handleTakeAwayPhone = ()=>{
        if(this.state.phoneContador>=0){
            if(this.state.numTelefono.substring(this.state.phoneContador,this.state.phoneContador+1)===" "){
                let RestaTelefono = [...this.state.numTelefono];
                RestaTelefono[this.state.phoneContador]=" "
                let Resta = RestaTelefono.join("");
                this.setState({
                    phoneContador:this.state.phoneContador-1,
                    numTelefono:Resta
                });
            }else{
                this.setState({
                    extraContador:1
                });
                let RestaTelefono = [...this.state.numTelefono];
                RestaTelefono[this.state.phoneContador]=" "
                let Resta = RestaTelefono.join("");
                this.setState({
                    phoneContador:this.state.phoneContador-1,
                    numTelefono:Resta
                });
            }
        }
    }

    handleControlSi = (a)=>{
            setTimeout(() => {
                    if(!this.state.numTelefono.includes(" ")){
                        this.props.modifyState("numTelefono",this.state.numTelefono);
                        this.props.history.push('/montoTiempoAireComponent');
                    }else{
                        this.handleHoverButtom("NONE");
                        pingpad.send(JSON.stringify({operationComponent:"NUMEROTELEFONOCOMPONENT"}));
                    }
            }, 150);
    }

    handleControlNo = (a)=>{
        this.setState({
            numTelefono:"          ",
            phoneContador:0,
            extraContador:null
        });
        pingpad.send(JSON.stringify({operationComponent:"NUMEROTELEFONOCOMPONENT"}));
        setTimeout(() => {
            this.handleHoverButtom("NONE");
        }, 150);
    }

    handleChangeState = (variable,value)=>{
        this.setState({
            [variable]:value
        });
    }

    hl = (FDK)=>{
            switch (FDK) {
                case "FDK4FISICO":
                        this.handleHoverButtom("FDK4");
                        this.handleControlNo("");
                    break;
                case "FDK8FISICO":
                        if(this.state.numTelefono.includes(" ")){
                            this.handleHoverButtom("FDK8");
                            pingpad.send(JSON.stringify({operationComponent:"NUMEROTELEFONOCOMPONENT"}));
                            setTimeout(() => {
                                this.handleHoverButtom("NONE");
                            }, 150);
                        }else{
                            this.handleHoverButtom("FDK8");
                            this.handleControlSi("");
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
                        if(this.state.numTelefono.includes(" ")){
                            this.handleHoverButtom("FDK8");
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

        render()
        {
            return(
                <div id="NumeroTelefonoComponent">
                    <div id="up-container">
                            <div id="text-container">
                                    <h2>Digite el número de teléfono al que desea realizar la Recarga</h2>
                                    <h2>(10 digitos)</h2>
                            </div>
                            <div id="container-num">
                                    <ST id={"numTelefonico"} idE={"nu"} value={this.state.numTelefono} number={10}/>
                            </div>
                            {!this.state.numTelefono.includes(" ")&&(
                                <h1>¿ Su número es correcto ?</h1>
                            )}
                    </div>
                    <BB chain={this.state.capabilities} buttonHover={this.state.buttonHover} onMouse={this.handleHoverButtom} action={this.hl} texto={[null,null,null,"NO",null,null,null,"SI"]} component={null}/>
                </div>
            );
        };
}

NumeroTelefono.defaultProps={
    tipoTarjeta:null,nip:null,ip:null,comision:null,track:null,token:null
}

NumeroTelefono.PropsTypes={
    tipoTarjeta:PropsTypes.string.isRequired,
    nip:PropsTypes.string.isRequired,
    ip:PropsTypes.string.isRequired,
    comision:PropsTypes.string.isRequired,
    track:PropsTypes.string.isRequired,
    token:PropsTypes.string.isRequired
}

export default NumeroTelefono;