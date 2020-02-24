import React,{Component} from 'react';
import './stylesSection.css';
import {jsonValidator} from '../Lib/utils/utils';
import {pingpad} from '../Lib/socketService/socketServices';
import PropsTypes from 'prop-types';
import { logic , history , errorXFS } from '../Lib/utils/construction';
import { SOCKET } from '../Lib/utils/socketComunication';
import ST from '../components/ST';
class nipComponent extends Component{

    constructor(props){
        super(props);
        this.state={
            nip:null,
            nipComplete:'',
            nipMuestra:'',
            errorMessage:false,

            sizePing:"",
            mensaje:"Ingresa tu Nip",
            mensajePing:'',
            subtrack:'',
            backMessage:'',
            operationComponent:{
                operationComponent:"NIPCOMPONENT"
            },
            buttonHover:null,
        }
    }
    handleKeyDown(event){
        if(event.which===73){
            pingpad.send(JSON.stringify({
                operationComponent:"TESTPIN"
            }));
        }
    }

     componentDidUpdate = ()=>{
         if(this.props.timerMessage===true){
             this.props.modifyState("pantallaAnterior","nipComponent");
             this.props.history.push('/timerModuleComponent');
         }
     }
        componentWillMount(){
            this.props.modifyState("timerModule",0);
            document.addEventListener("keydown", this.handleKeyDown);
            let nc = logic(this.props,pingpad,"NIPCOMPONENT");
            if(nc!==true){history("",this.props.history);}
            else{setTimeout(() => { this.handleLogicComponent(); }, 300);}
        }

        handleREPEATNIPCOMPONENTPROVICIONAL = ()=>{
            SOCKET(pingpad,"CANCELPINXFS",null);
            this.setState({
                sizePing:"",
                mensaje:"Completa el nip"
            });
            SOCKET(pingpad,"NIPCOMPONENT",null);
        }

        handleLogicComponent = () =>{
            try{
                /**************************************WEBSOCKET****************************************/
                let subTrack = this.props.track.split("=");
                this.setState({
                    subtrack:subTrack[0],
                    buttonHover:{
                        FDK4:this.props.GBS.style,
                    }
                });
                if(this.state.operationComponent.operationComponent==="NIPCOMPONENT"){
                    SOCKET(pingpad,"NIPCOMPONENT",null);
                }
                /****************************************** */
                if(this.state.nipComplete==="" || this.state.nipComplete === null){
                    pingpad.onmessage = (msg)=>{
                        if(jsonValidator(msg.data)){
                            if(msg.data.includes("CANCEL")){
                                history("retireTarjetaComponent",this.props.history);
                            }else if(msg.data.includes("ENTER")){
                                this.handleREPEATNIPCOMPONENTPROVICIONAL();
                            }else if(msg.data.includes("BACKSPACE")){
                                this.handleCompletePin("less");
                            }else{
                                const server = JSON.parse(msg.data);
                                if(server.code < 0){
                                        errorXFS(server.message,this.props);
                                }else if(server.code===401){
                                    switch(server.event.action){
                                        case "FK_1":
                                            this.handleCompletePin("add");
                                            break;
                                        case "FK_2":
                                            this.handleCompletePin("add");
                                            break;
                                        case "FK_3":
                                            this.handleCompletePin("add");
                                            break;
                                        case "FK_4":
                                            this.handleCompletePin("add");
                                            break;
                                        case "FK_5":
                                            this.handleCompletePin("add");
                                            break;
                                        case "FK_6":
                                            this.handleCompletePin("add");
                                            break;
                                        case "FK_7":
                                            this.handleCompletePin("add");
                                            break;
                                        case "FK_8":
                                            this.handleCompletePin("add");
                                            break;
                                        case "FK_9":
                                            this.handleCompletePin("add");
                                            break;
                                        case "FK_0":
                                            this.handleCompletePin("add");
                                            break;
                                        case "FK_UNUSED":
                                            this.handleCompletePin("add");
                                            break;
                                        case "FK_BACKSPACE":
                                            this.handleCompletePin("less");
                                            break;
                                        default:
                                            break;
                                    }
                                }else if(server.code===400){
                                            const GETPINPAD ={
                                                subtrack:this.state.subtrack,
                                                pin:server.message
                                            }
                                            this.setState({
                                                operationComponent:{
                                                    operationComponent:"GETPINPAD"
                                                }
                                            });
                                            SOCKET(pingpad,"GETPINPAD",GETPINPAD);
                                        
                                }else if(server.code==="016"){
                                        this.props.modifyState("nip",server.message);
                                        setTimeout(() => {   
                                            switch (this.props.seguridadTarjeta) {
                                                case "Tarjeta de CHIP":
                                                    this.handleNipNormal();
                                                    break;
                                                case "Tarjeta de Banda":
                                                    this.handleNipNormal();
                                                    break;
                                                case "Tarjeta Administrativa":
                                                    history("adminMenu",this.props);
                                                    break;
                                                default:
                                                    break;
                                            }
                                            
                                        }, 500);
                                }else if(server.code===-408){
                                    this.setState({
                                        sizePing:""
                                    });
                                    const RELOADPIN={
                                        operationComponent:"NIPCOMPONENT",
                                        errorMessage:true
                                    }
                                    setTimeout(() => {
                                        pingpad.send(JSON.stringify(RELOADPIN));
                                    }, 300);
                                }else if (server.code===-14) {
                                    errorXFS(server.message,this.props);
                                }else if(server.code === 9000 ){
                                    this.props.history.push("/");
                                }
                            }
                        }
                    }
                }
                /***********************************-WEBSOCKET***********************************************/
            }catch(error){
                console.log("Error del socket : "+error);
            }
        }

        handleCompletePin = (process)=>{

            if(process==="add" && this.state.sizePing.length<=3){
                let nipAdd = this.state.sizePing;
                let newAdd = nipAdd.concat("*");
                this.setState({
                    sizePing:newAdd
                });
            }else if(process==="less" && this.state.sizePing.length>=1){
                this.setState({
                    sizePing:""
                });
                setTimeout(() => {
                    SOCKET(pingpad,"NIPCOMPONENT",null);
                }, 150);
            }
        }

        handleNipNormal = () =>{
                    this.setState({
                        nipComplete:"si"
                    });
                    history("tipoTarjetaComponent",this.props.history);
        }

    render(){
        const {errorMessage}=this.state;
            return(
                    <div id="nipComponent-Container">
                        <div id="up-container">
                                <div>   
                                        <h1>{this.state.mensaje}</h1>
                                        <div id="squareContainer">
                                            <ST id={"divContainer"} idE={"nip"} value={this.state.sizePing} number={4}/>
                                        </div>
                                        <div>{this.state.mensajePing}</div>
                                        <h2>{
                                            errorMessage && "Error al crear el nip, Intente de nuevo"
                                        }</h2>
                                </div>
                        </div>
                    </div>
            );
    }
}
nipComponent.defaultProps={
    track:null,ip:null,seguridadTarjeta:null,token:null
}
nipComponent.PropsTypes={
    track:PropsTypes.string.isRequired,
    ip:PropsTypes.string.isRequired,
    seguridadTarjeta:PropsTypes.string.isRequired,
    token:PropsTypes.string.isRequired
}
export default nipComponent;