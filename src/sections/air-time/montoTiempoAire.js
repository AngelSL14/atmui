import React,{Component} from 'react';
import '../stylesSection.css';
import {pingpad} from '../../Lib/socketService/socketServices';
import PropsTypes from 'prop-types';
import { SB } from '../../Lib/utils/values';
import { logic , history , hanlog } from '../../Lib/utils/construction';
import BB from '../../components/BB';

class montoTiempoAire extends Component{
        constructor(props){
            super(props);
            this.state={
                operationComponent:{
                    operationComponent:"MONTOTIEMPOAIRECOMPONENT"
                },
                buttonHover:null,
                montoRecarga:null,
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
                this.props.modifyState("pantallaAnterior","montoTiempoAireComponent");
                this.props.history.push('/timerModuleComponent');
            }
        }
        async componentWillMount(){
            this.props.modifyState("timerModule",0);
            let mt = logic(this.props,pingpad,"MONTOTIEMPOAIRECOMPONENT");
            if(mt===null || mt===undefined) {history("",this.props.history);}
            else{this.setState({capabilities:mt.capabilities,typeScreen:mt.typeScreen,buttonHover:mt.buttonHover});
                setTimeout(() => {this.handleMontoTiempoAire();}, 40);}
        }

        handleMontoTiempoAire = ()=>{
            pingpad.send(JSON.stringify({
                operationComponent:"CREATEFDKCLASS",
                activeFDKs:this.state.capabilities,
                typeScreen:this.state.typeScreen
            }));
            let arrayt = {
                texto:[null,"$20","$50","$100",null,"$200","$500","$1000"],
                F:[null,this.wrc,this.wrc,this.wrc,null,this.wrc,this.wrc,this.wrc],
                route:[null,null,null,null,null,null,null,null]
            }
            pingpad.onmessage = (msg)=>{
                hanlog(msg.data,this.state.touchFDK,this.props.history,null,null,this.hl,arrayt);
            }
        }

        wrc = (monto)=>{
            if(monto==="$20" || monto==="$50" || monto==="$100" || monto==="$200" ||
                monto==="$500" || monto==="$1000"){
                    this.handleSaveMonto(monto);
            }else{
                 let amount = monto.target.textContent;
                 this.handleSaveMonto(amount);
            }
        }

        handleSaveMonto = (monto)=>{
                switch (monto) {
                    case "$20":
                            this.handleAmount(20);
                        break;
                    case "$50":
                            this.handleAmount(50);
                        break;
                    case "$100":
                            this.handleAmount(100);
                        break;
                    case "$200":
                            this.handleAmount(200);
                        break;
                    case "$500":
                            this.handleAmount(500);
                        break;
                    case "$1000":
                            this.handleAmount(1000);
                        break;
                    default:
                        break;
                }
        }

        handleAmount = (amount)=>{
            this.props.modifyState("montoRecarga",amount);
            setTimeout(() => {
                    history("verificarRecargaComponent",this.props.history);
            }, 200);
        }

        handleHoverButtom = (fdk) =>{
            let buttons = SB(fdk,this.props.GBS);
            this.setState({
                buttonHover:buttons
            });
        }

        hl = (FDK)=>{
            switch (FDK) {
                case "FDK2FISICO":
                        this.handleHoverButtom("FDK2");
                        this.wrc("$20"); 
                    break;
                case "FDK3FISICO":
                        this.handleHoverButtom("FDK3");
                        this.wrc("$50");
                    break;
                case "FDK4FISICO":
                        this.handleHoverButtom("FDK4");
                        this.wrc("$100");
                    break;
                case "FDK6FISICO":
                        this.handleHoverButtom("FDK6");
                        this.wrc("$200");
                    break;
                case "FDK7FISICO":
                        this.handleHoverButtom("FDK7");
                        this.wrc("$500");
                    break;
                case "FDK8FISICO":
                        this.handleHoverButtom("FDK8");
                        this.wrc("$1000");
                    break;
                case "FDK2TOUCH":
                        this.handleHoverButtom("FDK2");
                        this.handleChangeState("touchFDK",FDK);
                        this.handleSendSocketCancel();
                    break;
                case "FDK3TOUCH":
                        this.handleHoverButtom("FDK3");
                        this.handleChangeState("touchFDK",FDK);
                        this.handleSendSocketCancel();
                    break;
                case "FDK4TOUCH":
                        this.handleHoverButtom("FDK4");
                        this.handleChangeState("touchFDK",FDK);
                        this.handleSendSocketCancel();
                    break;
                case "FDK6TOUCH":
                        this.handleHoverButtom("FDK6");
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

        render()
        {
            return(
                <BB chain={this.state.capabilities} buttonHover={this.state.buttonHover} onMouse={this.handleHoverButtom} action={this.hl} texto={[null,"$20","$50","$100",null,"$200","$500","$1000"]} component={<h1>Monto de la recarga</h1>}/>
            );
        };
}

montoTiempoAire.defaultProps={
    tipoTarjeta:null,nip:null,ip:null,comision:null,track:null,compania:null,numTelefono:null,token:null
}
montoTiempoAire.PropsTypes={
    tipoTarjeta:PropsTypes.string.isRequired,
    nip:PropsTypes.string.isRequired,
    ip:PropsTypes.string.isRequired,
    comision:PropsTypes.string.isRequired,
    track:PropsTypes.string.isRequired,
    compania:PropsTypes.string.isRequired,
    numTelefono:PropsTypes.string.isRequired,
    token:PropsTypes.string.isRequired
}

export default montoTiempoAire;