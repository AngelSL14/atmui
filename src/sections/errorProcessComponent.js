import React,{Component} from 'react';
import './stylesSection.css';
import LogoError from '../components/logoError';
import PropsTypes from 'prop-types';
import { logic , history } from '../Lib/utils/construction';
import { pingpad } from '../Lib/socketService/socketServices';
class errorProcessComponent extends Component{
    componentWillMount(){
        let ep = logic(this.props,pingpad,"ERRORPROCESSCOMPOENT");
        if(ep!==true){history("",this.props.history);}
        else{setTimeout(() => { history("retireTarjetaComponent",this.props.history); }, 3000);}
    }
    render(){
        return(
            <div id="error-component">
                    <h1>Error durante el proceso</h1>
                    <h1>{this.props.message}</h1>
                    <LogoError/>
            </div>
        );
    }
}
errorProcessComponent.defaultProps={
    ip:null,message:null
}
errorProcessComponent.PropsTypes={
    ip:PropsTypes.string.isRequired,
    message:PropsTypes.string.isRequired
}
export default errorProcessComponent;