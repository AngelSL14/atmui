import React,{Component} from 'react';
import '../stylesSection.css';
import PropsTypes from 'prop-types';
import {caseteroMenorDenominacion} from '../../Lib/services';
import {pingpad} from '../../Lib/socketService/socketServices';
import { SB , BL } from '../../Lib/utils/values';
import { logic , history , errorWS , hanlog} from '../../Lib/utils/construction';
import { SOCKET } from '../../Lib/utils/socketComunication';
import BB from '../../components/BB';
class retiroOptionComponent extends Component{
    constructor(props){
        super(props);
        this.state={
            monto:[],
            errorMonto:false,
            montoMinimoMultiplo:null,
            operationComponent:{
                operationComponent:"RETIROOPTIONCOMPONENT"
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
    componentDidUpdate = ()=>{
        if(this.props.timerMessage===true){
            this.props.modifyState("pantallaAnterior","retiroOpcionComponent");
            this.props.history.push('/timerModuleComponent');
        }
    }
    async componentWillMount(){
        this.props.modifyState("timerModule",0);
        let s = logic(this.props,pingpad,"RETIROOPTIONCOMPONENT");
        if(s===null || s===undefined){history("",this.props.history);}
        else{this.setState({capabilities:s.capabilities,typeScreen:s.typeScreen,buttonHover:s.buttonHover});
        setTimeout(() => {this.handleLogicComponent();}, 40);}
    }

    async handleLogicComponent(){
        const montoMinimo = await caseteroMenorDenominacion({"ip":this.props.ip} ,this.props.token );
        if(montoMinimo['code'] !== undefined){
            if(montoMinimo.code.includes("-")){
                    errorWS(montoMinimo);
            }else if(montoMinimo.code==="404"){
                    errorWS(montoMinimo);
            }
            else{
                this.setState({
                    montoMinimoMultiplo:montoMinimo.body[0].denominacion
                });
                SOCKET(pingpad,"RETIROOPTIONCOMPONENT",this.state);
                let bl = BL("ROC",[ this.wrc , this.wrc , this.wrc , this.wrc , this.wrc , this.wrc , this.wrc , this.wrc , this.wrc]);
                pingpad.onmessage = (msg) =>{
                        hanlog(msg.data,this.state.touchFDK,this.props.history,this.handleFixAmount,this.handleChangeLessMonto,this.hl,bl);
                }
            }
        }
    }

    handleChangeLessMonto = ()=>{
        this.setState({
            monto:[]
        });
    }

    handleHoverButtom = (fdk) =>{
        let buttons = SB(fdk,this.props.GBS);
        this.setState({
            buttonHover:buttons
        });
    }
    stateFunction = (valor) =>{
            this.setState({
                monto:valor
            });
    }
    handleMensajeError = (error) =>{
        this.setState({
            errorMonto:error
        });
    }
    handleValidation = () =>{
        this.props.modifyState("montoRetiroEfectivo",this.state.monto);
        this.props.modifyState("transactionCode","01");
        history("waitComisionComponent",this.props.history);
    }

    wrc = (seleccion) =>{
        switch (seleccion) {
            case "$2,000":
                this.handleMontoValidation(2000);
                break;
            case "$1,000":
                this.handleMontoValidation(1000);
                break;
            case "$500":
                this.handleMontoValidation(500);
                break;
            case "$200":
                this.handleMontoValidation(200);
                break;
            case "Corregir":
                this.handleCorregirButton();
                break;
            case "ENTER":
                this.handleEnterFDK();
                break;
            case "Continuar":
                let value = this.state.monto.toString();
                let final = value.replace(/,/g,'');
                let montoUno = parseInt(final);
                this.handleMontoValidation(montoUno);
                break;
            default:
                break;
        }
    }

    handleMontoValidation = (monto)=>{
       if(monto%(this.state.montoMinimoMultiplo)===0 && monto<8001){
            this.handleMensajeError(false);
            this.stateFunction(monto);
            setTimeout(() => {
                this.handleValidation();
            }, 20);
       }else{
           this.handleMensajeError(true);
           setTimeout(() => {
                this.setState({
                    monto:[]
                });
                this.handleHoverButtom("NONE");
           }, 150);
           SOCKET(pingpad,"RETIROOPTIONCOMPONENT",this.state);
       }
    }
    handleFixAmount = (valor) =>{
        if(this.state.monto.length<=4){
            let value = this.state.monto.concat(valor);
            this.setState({
                monto:value
            });
        }
    }

    handleCorregirButton=()=>{
        setTimeout(() => {
            this.handleHoverButtom("NONE");
            SOCKET(pingpad,"RETIROOPTIONCOMPONENT",this.state);
        }, 150);
    }

    handleEnterFDK = ()=>{
        let value = this.state.monto.toString();
                let final = value.replace(/,/g,'');
                let montoUno = parseInt(final);
                if(((montoUno%(this.state.montoMinimoMultiplo))===0) && (montoUno<8001)){
                    this.handleMensajeError(false);
                    this.stateFunction(montoUno);
                    this.handleValidation();

                }else{
                    this.handleMensajeError(true);
                    setTimeout(() => {
                        this.handleHoverButtom("NONE");
                    }, 150);
                    SOCKET(pingpad,"RETIROOPTIONCOMPONENT",this.state);
                }
    }

    hl = (FDK)=>{
        switch (FDK) {
            case "FDK1FISICO":
                    this.handleHoverButtom("FDK1");
                    this.wrc("$200");
                break;
            case "FDK2FISICO":
                    this.handleHoverButtom("FDK2");
                    this.wrc("$500");
                break;
            case "FDK3FISICO":
                    this.handleHoverButtom("FDK3");
                    this.wrc("Corregir");
                break;
            case "FDK4FISICO":
                    this.handleHoverButtom("FDK4");
                    history("retireTarjetaComponent",this.props.history);
                break;
            case "FDK5FISICO":
                    this.handleHoverButtom("FDK5");
                    this.wrc("$1,000");
                break;
            case "FDK6FISICO":
                    this.handleHoverButtom("FDK6");
                    this.wrc("$2,000");
                break;
            case "FDK7FISICO":
                    this.handleHoverButtom("FDK7");
                    this.wrc("Continuar"); 
                break;
            case "FDK8FISICO":
                    this.handleHoverButtom("FDK8");
                    history("selectOperation",this.props.history);
                break;
            case "FDK1TOUCH":
                    this.handleTouch(FDK);
                break;
            case "FDK2TOUCH":
                    this.handleTouch(FDK);
                break;
            case "FDK3TOUCH":
                    this.handleTouch(FDK);
                break;
            case "FDK4TOUCH":
                    this.handleTouch(FDK);
                break;
            case "FDK5TOUCH":
                    this.handleTouch(FDK);
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
        SOCKET(pingpad,"CANCELPINXFS",null);
    }

    render(){
            const m = (
                <div>
                    <h1>Retiro en Efectivo</h1>
                    <h1 id="amountContainer"><span>$  {this.state.monto}</span> </h1>
                    {this.state.errorMonto && <h2 id="montoMensage">Hasta 8000 y billetes de {this.state.montoMinimoMultiplo}</h2>}
                </div>
            );      
            return(
                        <BB chain={this.state.capabilities} buttonHover={this.state.buttonHover} onMouse={this.handleHoverButtom} action={this.hl} texto={["$200","$500","Corregir","Salir","$1,000","$2,000","Continuar","Menu Principal"]} component={m}/>
                    );
    }
}
retiroOptionComponent.defaultProps={
            ip:null,nip:null,tipoTarjeta:null,track:null,token:null
}
retiroOptionComponent.PropsTypes={
    ip:PropsTypes.string.isRequired,
    nip:PropsTypes.string.isRequired,
    tipoTarjeta:PropsTypes.string.isRequired,
    track:PropsTypes.string.isRequired,
    token:PropsTypes.string.isRequired
}
export default retiroOptionComponent;