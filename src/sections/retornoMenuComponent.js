import React, { Component } from 'react';
import './stylesSection.css';
import PropsTypes from 'prop-types';
import { SB, BL } from '../Lib/utils/values';
import { pingpad } from '../Lib/socketService/socketServices';
import { logic, history, hanlog } from '../Lib/utils/construction';
import { SOCKET } from '../Lib/utils/socketComunication';
import BB from '../components/BB';

class retornoMenuComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            operationComponent: {
                operationComponent: "RETORNOMENUCOMPONENT"
            },
            buttonHover: null,
            capabilities: "00000000",
            typeScreen: "",
            touchFDK: ""
        }
    }
    handleChangeState = (state, value) => {
        this.setState({
            [state]: value
        });
    }

    componentDidUpdate = () => {
        if (this.props.timerMessage === true) {
            this.props.modifyState("pantallaAnterior", "retornoMenuComponent");
            this.props.history.push('/timerModuleComponent');
        }
    }
    componentWillMount() {
        this.props.modifyState("timerModule", 0);
        this.props.modifyState("timerMessage", false);
        let rm = logic(this.props, pingpad, "RETORNOMENUCOMPONENT");
        if (rm === null || rm === undefined) { history("", this.props.history); }
        else {
            this.setState({ capabilities: rm.capabilities, typeScreen: rm.typeScreen, buttonHover: rm.buttonHover });
            setTimeout(() => { this.handleLogicComponent(); }, 40);
        }
    }
    handleLogicComponent = () => {
        SOCKET(pingpad, "CREATEFDKCLASS", this.state);
        let bl = BL("RMC", [null, null, null, null, null, null, null, null]);
        pingpad.onmessage = (msg) => {
            hanlog(msg.data, this.state.touchFDK, this.props.history, null, null, this.hl, bl);
        }
    }
    handleHoverButtom = (fdk) => {
        let buttons = SB(fdk, this.props.GBS);
        this.setState({
            buttonHover: buttons
        });
    }
    hl = (FDK) => {
        switch (FDK) {
            case "FDK4FISICO":
                this.handleHoverButtom("FDK4");
                history("retireTarjetaComponent", this.props.history);
                break;
            case "FDK8FISICO":
                this.handleHoverButtom("FDK8");
                history("selectOperation", this.props.history);
                break;
            case "FDK4TOUCH":
                this.handleHoverButtom("FDK4");
                history("retireTarjetaComponent", this.props.history);
                this.handleChangeState("touchFDK", FDK);
                SOCKET(pingpad, "CANCELPINXFS", null);
                break;
            case "FDK8TOUCH":
                this.handleHoverButtom("FDK8");
                history("selectOperation", this.props.history);
                this.handleChangeState("touchFDK", FDK);
                SOCKET(pingpad, "CANCELPINXFS", null);
                break;
            default:
                break;
        }
    }
    render() {
        return (
            <BB chain={this.state.capabilities} buttonHover={this.state.buttonHover} onMouse={this.handleHoverButtom} action={this.hl} texto={[null, null, null, "Salir", null, null, null, "Otra Operacion"]} component={<h1>Menu de Opciones</h1>} />
        );
    }
}
retornoMenuComponent.defaultProps = {
    ip: null, nip: null, tipoTarjeta: null, track: null, token: null
}
retornoMenuComponent.PropsTypes = {
    ip: PropsTypes.string.isRequired,
    nip: PropsTypes.string.isRequired,
    tipoTarjeta: PropsTypes.string.isRequired,
    track: PropsTypes.string.isRequired,
    token: PropsTypes.string.isRequired
}
export default retornoMenuComponent;