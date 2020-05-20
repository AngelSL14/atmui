import React, { Component } from 'react';
import '../stylesSection.css';
import PropsTypes from 'prop-types';
import { getComision } from '../../Lib/services';
import { pingpad } from '../../Lib/socketService/socketServices';
import CardBank from '../../components/cardBank';
import { logic, history, modelConstructor, errorWS } from '../../Lib/utils/construction';
class WaitComisionComponent extends Component {
    constructor(props) {
        super(props);
        this.handleLogicComponent = this.handleLogicComponent.bind(this);
    }
    async componentWillMount() {
        let wc = logic(this.props, pingpad, "WAITCOMISIONCOMPONENT");
        if (wc !== true) history("", this.props.history);
        setTimeout(() => { this.handleLogicComponent(); }, 300);
    }

    async handleLogicComponent() {
        const objAvisoComision = modelConstructor("COMISION", this.props, null);
        const comision = await getComision(objAvisoComision, this.props.token);
        if (comision.code !== "200") {
            errorWS(comision, this.props);
        } else {
            this.props.modifyState("comision", comision.body[0].txCommission);
            history("avisoComisionComponent", this.props.history);
        }
    }

    render() {
        return (
            <div id="WaitConsultaSaldoComponent">
                <h1>Espere un momento Por Favor</h1>
                <h2>Procesando su solicitud de consulta</h2>
                <CardBank bank={"prosa"} />
            </div>
        );
    }
}
WaitComisionComponent.defaultProps = {
    tipoTarjeta: null, nip: null, ip: null, track: null, token: null
}
WaitComisionComponent.PropsTypes = {
    tipoTarjeta: PropsTypes.string.isRequired,
    nip: PropsTypes.string.isRequired,
    ip: PropsTypes.string.isRequired,
    track: PropsTypes.string.isRequired,
    token: PropsTypes.string.isRequired
}
export default WaitComisionComponent;