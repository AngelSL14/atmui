/**
 * @class La clase VerificacionCambioNipComponent muestra mensaje de exito al usuario
 */
import React,{Component} from 'react';
import PropsTypes from 'prop-types';
import {pingpad} from '../../Lib/socketService/socketServices';
import '../stylesSection.css';
import { logic , history } from '../../Lib/utils/construction';
class VerificacionCambioNipComponent extends Component{
    componentWillMount(){
        let wcc = logic(this.props,pingpad,"VERIFICACIONCAMBIONIPCOMPONENT");
        if(wcc!==true) history("",this.props.history);
        setTimeout(() => { history("imprimirTicketComponent",this.props.history); }, 300);
    }
    render(){
        return(
            <div id="VerificacionCambioNip">
                    <h1>Cambio de nip realizado Correctamente</h1>
            </div>
        );
    };
}

VerificacionCambioNipComponent.defaultProps={
    ip:null,nip:null,tipoTarjeta:null,track:null,token:null
}
VerificacionCambioNipComponent.PropsTypes={
    ip:PropsTypes.string.isRequired,
    nip:PropsTypes.string.isRequired,
    tipoTarjeta:PropsTypes.string.isRequired,
    track:PropsTypes.string.isRequired,
    token:PropsTypes.string.isRequired
}

export default VerificacionCambioNipComponent;