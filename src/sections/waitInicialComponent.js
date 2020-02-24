import React,{ Component } from "react";
import './stylesSection.css';
import {verificarChip,CapabilitiesScreen} from '../Lib/services';
import PropsTypes from 'prop-types';
import CardBank from '../components/cardBank';
import { Authorization } from '../Lib/services';
import {pingpad} from '../Lib/socketService/socketServices';
import { logic , history , errorWS , errorXFS , modelConstructor , dasStyle } from '../Lib/utils/construction';

class WaitInicialComponent extends Component{
    
    constructor(props){
        super(props);
        this.handleLogicComponent=this.handleLogicComponent.bind(this);
    }

    async componentDidMount(){
        this.props.modifyState("timerMessage",false);
        let wic = logic(this.props,pingpad,"WAITINITIALCOMPONENT");
        if(wic!==true){history("",this.props.history);}
        else{setTimeout(() => { this.handleLogicComponent(); }, 300);}
    }
    async handleLogicComponent(){
        const authHexa = modelConstructor("AUTH",this.props,null);
        const auth = await Authorization(authHexa); 
        if(auth.message==="Authentication Failed: Bad credentials"){
            errorXFS("Cajero no Autorizado",this.props);
        }
        if(auth.message==="authorization"){
            this.props.modifyState("token",auth.accessToken);
            const capabilities = await CapabilitiesScreen({ip:this.props.ip});
            if(capabilities.code.includes("-")){
                errorWS(capabilities);
            }else{
                const mainBody = {
                    typeOfScreen:this.props.screenType,
                    screenCapabilities:capabilities.body
                }
                this.props.modifyState("capabilitiesScreen",mainBody);
                const objVT = modelConstructor("STYLES",this.props,null);
                const response = await verificarChip(objVT,auth.accessToken);
                 setTimeout(()=>{
                        if(response.code==="200"){
                            let o = JSON.parse(response.body[0].styles.buttons);
                            let GBS = {
                                style:o.style,
                                styleHover:o.styleHover,
                                styleDisabled:o.styleDisabled
                            }
                            let dashboardStyles = JSON.parse(response.body[0].styles.dashboard);
                            let GDS = dasStyle(dashboardStyles);
                            this.props.modifyState("GBS",GBS);
                            this.props.modifyState("GDS",GDS);
                            this.props.modifyState("seguridadTarjeta",response.body[0].message);
                            this.props.history.push('/nipComponent');
                        }else if(response.code.includes("-")){
                            errorWS(response);
                        } 
                 },1500);
            }
        }else if(auth.code==="404"){
            errorXFS(auth.message,this.props);
        }
    }
    render(){  
        return(
                    <div id="wait-inicio-component">
                        <h1>Espere un momento Por Favor</h1>
                        <h2>Validando Tarjeta</h2>
                        <CardBank bank={"prosa"}/>
                    </div>
        );
    }
}

WaitInicialComponent.defaultProps = {
    ip:null,
    track:null,
    hostName:null
}

WaitInicialComponent.PropsTypes = {
    ip: PropsTypes.string.isRequired,
    track:PropsTypes.string.isRequired,
    hostName:PropsTypes.string.isRequired
}
export default WaitInicialComponent;
