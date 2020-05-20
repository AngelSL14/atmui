import React, { Component } from 'react';
import Button from '../components/button';
import './stylesSection.css';
import { CapabilitiesPublicity, Authorization, singleImage, SingleAtmIso } from '../Lib/services';
import { initPingpad, pingpad } from '../Lib/socketService/socketServices';
import { jsonValidator } from '../Lib/utils/utils';
import { buttons } from '../Lib/utils/utils';
import LogoError from '../components/logoError';
import { history, modelConstructor } from '../Lib/utils/construction';
import { SOCKET } from '../Lib/utils/socketComunication';

import ReactSWF from 'react-swf'

import PropsTypes from 'prop-types';
import { isArray } from 'util';

class indexComponent extends Component {

    handleKeyDown(event) {
        if (event.which === 73) {
            pingpad.send(JSON.stringify({
                operationComponent: "TESTCARDREADER"
            }));
        } else if (event.which === 82) {
            pingpad.send(JSON.stringify({
                operationComponent: "RETIRARTARJETA"
            }));
        } else if (event.which === 78) {
            pingpad.send(JSON.stringify({
                operationComponent: "INSERTARDENUEVO"
            }));
        }
    }

    intervaliD = null;
    constructor(props) {
        super(props);
        this.state = {
            ip: this.props.ip,
            tarjetaIntroducida: null,
            textoTarjeta: "ESPERE UN MOMENTO",
            pingStatus: true,
            hostName: this.props.hostName,
            executionProcess: true,
            publicidad_Extension: "gif",
            publicidad_Nombre: "publicidad",
            serverActive: true,
            falloDelServer: false,
            typeCancelXFS: null,
            buttonHover: null,
            Hover: null,
            capabilities: "00000000",
            typeScreen: "",
            touchFDK: "",
            newPublicity: "",
            newExtension: "",
            GBSL: null //GLOBAL BUTTON STYLES LOCALS
        }
        this.handleImg = this.handleImg.bind(this);
        this.setImageDB = this.setImageDB.bind(this);
    }

    async componentWillMount() {
        document.addEventListener("keydown", this.handleKeyDown);
        SOCKET(pingpad, "CANCELREADROWATA", null);
        SOCKET(pingpad, "CANCELPINXFS", null);
        const authHexa = modelConstructor("AUTH", this.props, null);
        const auth = await Authorization(authHexa);
        const singleAtmIso = await SingleAtmIso(auth.accessToken, this.props.hostName);
        const data = await CapabilitiesPublicity({ "termId": this.props.hostName });
        if (data['code'] !== undefined) {
            if (data.code === "200") {
                if (data['body']) {
                    if (this.state.capabilities.includes("1")) {
                        this.handleCreateFDK(data.body[0].screenType, this.state.capabilities);
                    }
                    this.props.modifyState("screenType", data.body[0].screenType);
                    if (data.body[0]['bankStyle']) {
                        let sty = JSON.parse(data.body[0].bankStyle.buttons);
                        var publicityAtm = singleAtmIso.body[0].atm.screen.screenGroup.publicityName;
                        this.props.modifyState("GDS", JSON.parse(data.body[0].bankStyle.dashboard));
                        this.props.modifyState("GBS", sty);
                        this.setState({
                            publicidad_Nombre: publicityAtm,
                            serverActive: true,
                            buttonHover: {
                                FDK8: sty.style
                            },
                            GBSL: sty
                        });
                    } else {
                        this.props.modifyState("GBS", buttons);
                        this.setState({
                            publicidad_Nombre: publicityAtm,
                            serverActive: true,
                            buttonHover: {
                                FDK8: buttons.style
                            },
                            GBSL: buttons
                        });
                    }
                    this.setImageDB(auth.accessToken);
                    setTimeout(() => {
                        try {
                            if (pingpad === null || pingpad === undefined) {
                                initPingpad(this.props.ip, "pingpad", "reconexion");
                                setTimeout(() => {
                                    this.handleLogicComponent();
                                }, 500);
                            }
                            else {
                                this.handleLogicComponent();
                            }
                        } catch (error) {
                            console.log("Error : ", error);
                        }
                    }, 200);
                }
            } else if (data.code.includes("-")) {
                this.handleServerError("DISPOSITIVO NO AUTORIZADO");
            } else if (data.code === "404") {
                this.handleServerError("SERVIDOR NO DISPONIBLE");
            }
        }
        this.intervaliD = setInterval(() => {
            this.handleImg();
        }, 30000);
    }
    handleCreateFDK = (type, activeFDKs) => {
        pingpad.send(JSON.stringify({
            operationComponent: "CREATEFDKCLASS",
            activeFDKs,
            typeScreen: type
        }));
    }

    handleServerError = (texto) => {
        this.setState({
            falloDelServer: true,
            textoTarjeta: texto
        });
    }
    handleChangeState = (state, value) => {
        this.setState({
            [state]: value
        });
    }

    async handleImg() {
        const newImg = await CapabilitiesPublicity({ "termId": this.props.hostName });
        const authHexa = modelConstructor("AUTH", this.props, null);
        const auth = await Authorization(authHexa);
        const singleAtmIso = await SingleAtmIso(auth.accessToken, this.props.hostName);
        if (newImg['code'] !== undefined) {
            if (newImg.code === "200") {
                if (this.state.falloDelServer === true) {
                    SOCKET(pingpad, "INDEXCOMPONENT", null);
                    this.handleCreateFDK(newImg.body[0].screenType, "10000000");
                    this.setState({
                        falloDelServer: false
                    });
                }
                var publicityAtm = singleAtmIso.body[0].atm.screen.screenGroup.publicityName;
                this.props.modifyState("screenType", newImg.body[0].screenType);
                this.props.modifyState("GDS", JSON.parse(newImg.body[0].bankStyle.dashboard));
                this.props.modifyState("GBS", JSON.parse(newImg.body[0].bankStyle.buttons));
                setTimeout(() => {
                    this.setState({
                        publicidad_Nombre: publicityAtm,
                        textoTarjeta: "INTRODUZCA SU TARJETA"
                    });
                }, 100);
                this.setImageDB(auth.accessToken);
            } else if (newImg.code.includes("-")) {
                SOCKET(pingpad, "CANCELREADROWATA", null);
                SOCKET(pingpad, "CANCELPINXFS", null);
                this.handleServerError("DISPOSITIVO NO AUTORIZADO");
            } else if (newImg.code === "404") {
                SOCKET(pingpad, "CANCELREADROWATA", null);
                SOCKET(pingpad, "CANCELPINXFS", null);
                this.handleServerError("SERVIDOR NO DISPONIBLE");
            }
        }
    }

    async handleLogicComponent() {
        try {
            if (this.state.executionProcess) {
                SOCKET(pingpad, "INDEXCOMPONENT", null);
            }
            pingpad.onmessage = (msg) => {
                if (jsonValidator(msg.data)) {
                    let json = JSON.parse(msg.data);
                    if (json['code'] !== undefined) {
                
                            switch (json.code) {
                                case 200:
                                    //SUCCESSFUL
                                    if ( json.command === 307){
                                        if (json['message'] !== undefined) {
                                            if (isArray(json.message))//PROCESO PARA LA INTERACCION CON LA TARJETA
                                            {
                                                json.message.forEach(uno => {
                                                    if (uno['DataSource'] !== undefined && uno['Status']) {
                                                        if (uno.DataSource === "TRACK2" && uno.Status === "OK") {
                                                            this.props.modifyState("track", uno.Data);
                                                            this.setState({
                                                                executionProcess: false
                                                            });
                                                            if (uno.Data.substring(21, 22) !== "2" && uno.Data.substring(21, 22) !== "6") {
                                                                setTimeout(() => {
                                                                    setTimeout(() => {
                                                                        clearInterval(this.intervaliD);
                                                                        SOCKET(pingpad, "CANCELPINXFS", null);
                                                                        this.props.modifyState("timerModule", 0);
                                                                        history('waitInicialComponent', this.props.history);
                                                                    }, 70);
                                                                }, 200);
                                                            } else {
                                                                if (this.props.entryMode === 'MOTOR') {
                                                                    this.setState({
                                                                        textoTarjeta: "LEYENDO TARJETA"
                                                                    });
                                                                } else {
                                                                    this.setState({
                                                                        textoTarjeta: "INSERTE DE NUEVO SU TARJETA"
                                                                    })
                                                                }
                                                                this.props.modifyState("tarjetaChip", true);
                                                                pingpad.send(JSON.stringify({
                                                                    operationComponent: "INDEXCOMPONENT",
                                                                    extra: {
                                                                        datasource: "CHIP"
                                                                    }
                                                                }));
                                                            }
                                                        } else if (uno.DataSource === "CHIP" && uno.Status === "OK" && (this.props.track.substring(21, 22) === "2" || this.props.track.substring(21, 22) === "6")) {
                                                            setTimeout(() => {
                                                                clearInterval(this.intervaliD);
                                                                SOCKET(pingpad, "CANCELPINXFS", null);
                                                                this.props.modifyState("timerModule", 0);
                                                                history('waitInicialComponent', this.props.history);
                                                            }, 200);
                                                        } else if (uno.DataSource === "CHIP" && uno.Status === "INVALID") {
                                                            this.handleInputSendSocket();
                                                        } else if (uno.DataSource === "TRACK2" && uno.Status === "INVALID") {
                                                            this.setState({
                                                                textoTarjeta: "INTRODUZCA SU TARJETA"
                                                            });
                                                            SOCKET(pingpad, "INDEXCOMPONENT", null);
                                                        } else if (uno.DataSource === "TRACK2" && uno.Status === "MISSING") {
                                                            this.handleInputSendSocket();
                                                        } else if (uno.DataSource === "CHIP" && uno.Status === "SRCMISSING") {
                                                            this.handleInputSendSocket();
                                                        }
                                                    }
                                                });
                                            }
                                        }
                                    }else if( json.command === 203){
                                        setTimeout(() => {
                                            this.setState({
                                                textoTarjeta:"RETIRE SU TARJETA"
                                            });
                                            SOCKET(pingpad,"RETIRETARJETACOMPONENT",null);
                                        }, 1000);
                                    }
                                    break;
                                case 203:
                                    //CARD INSERTED
                                    if (json['event'] !== undefined) {
                                        if (json.event['dataSource']) {
                                            if (json.event.dataSource === "[TRACK2]") {
                                                if (this.props.entryMode === 'MOTOR') {
                                                    this.setState({
                                                        textoTarjeta: "LEYENDO TARJETA"
                                                    });
                                                } else {
                                                    this.setState({
                                                        textoTarjeta: "INSERTE DE NUEVO SU TARJETA",
                                                        tarjetaIntroducida: true,
                                                        pingStatus: false
                                                    })
                                                }
                                            }
                                        }
                                    }
                                    break;
                                case 207:
                                    //INVALID MEDIA
                                    this.setState({
                                        textoTarjeta:"TARJETA NO VALIDA",
                                        pingStatus:false
                                    });
                                    setTimeout(() => {
                                        this.setState({
                                            textoTarjeta:"INTRODUZCA SU TARJETA"
                                        });
                                        SOCKET(pingpad,"RETIRETARJETACOMPONENT",null);
                                    }, 1000);
                                    break;
                                case 215:
                                    //TRACK DETECTED
                                    this.setState({
                                        textoTarjeta: "TRACK"
                                    });
                                    break;
                                case 212:
                                    //INSERT CARD
                                    if (json['event'] !== undefined) {
                                        if (json.event['dataSource'] !== undefined) {
                                            if (json.event.dataSource === "[TRACK2]") {
                                                this.setState({
                                                    textoTarjeta: "INTRODUZCA SU TARJETA"
                                                });
                                            }
                                        }
                                    }
                                    break;
                                case 401:
                                    if (json['event'] !== undefined) {
                                        if (json.event['action'] !== undefined) {
                                            if (json.event.action === "WFS_PIN_FK_FDK06") {
                                                this.handleClicFDK("FDK8FISICO");
                                            }
                                        }
                                    }
                                    break;
                                case -14:
                                    if (json['message'] !== undefined) {
                                        this.props.modifyState("mensajeErrorGlobal", json.message);
                                        this.props.history.push('/errorProcessComponent');
                                    }
                                    break;
                                case -201:
                                    this.setState({
                                        textoTarjeta: "INTRODUZCA SU TARJETA"
                                    });
                                    SOCKET(pingpad, "INDEXCOMPONENT", null);
                                    break;
                                case 9000:
                                    SOCKET(pingpad, "INDEXCOMPONENT", null);
                                    break;
                                case "099":
                                    if (this.state.typeCancelXFS === "ButtonXFS") {
                                        history('remesas', this.props.history);
                                    }
                                    break;
                                default:
                                    break;
    
                            }
                    }
                }
            }
            pingpad.onerror = (error) => {
                console.log("Error : ", error);
            }
            pingpad.onclose = (e) => {
                console.log("Socket cerrado : ", e);
            }
        } catch (error) {
            setTimeout(() => {
                this.handleLogicComponent();
            }, 5000);
        }
    }

    handleClicLogic = (FDK) => {
        switch (FDK) {
            case "FDK8FISICO":
                this.handleHoverButtom("FDK8", this.state.GBSL);
                clearInterval(this.intervaliD);
                history('remesas', this.props.history);
                break;
            case "FDK8TOUCH":
                this.handleChangeState("typeCancelXFS", "ButtonXFS");
                this.handleHoverButtom("FDK8", this.state.GBSL);
                clearInterval(this.intervaliD);
                this.handleChangeState("touchFDK", FDK);
                SOCKET(pingpad, "CANCELPINXFS", null);
                SOCKET(pingpad, "CANCELREADROWATA", null);
                break;
            default:
                break;
        }
    }

    handleInputSendSocket = () => {
        this.setState({
            textoTarjeta: "INTRODUZCA SU TARJETA"
        });
        SOCKET(pingpad, "INDEXCOMPONENT", null);
    }

    handleClicFDK = (FDK) => {
        switch (FDK) {
            case "FDK8FISICO":
                this.handleHoverButtom("FDK8", this.state.GBSL);
                history('remesas', this.props.history);
                break;
            case "FDK8TOUCH":
                this.handleChangeState("touchFDK", FDK);
                SOCKET(pingpad, "CANCELPINXFS", null);
                break;
            default:
                break;
        }
    }
    handleHoverButtom = (fdk, GBS) => {
        switch (fdk) {
            case "FDK8":
                this.setState({
                    buttonHover: {
                        FDK8: GBS.styleHover
                    }
                });
                break;
            case "NONE":
                this.setState({
                    buttonHover: {
                        FDK8: GBS.style
                    }
                });
                break;
            default:
                break;
        }
    }

    async setImageDB(token) {
        const oneImage = await singleImage(token, this.state.publicidad_Nombre, 'publicity');
        let extension = "";
        this.setState({
            newPublicity: oneImage.body[0].wrapper.codec,
        });
        extension = oneImage.body[0].wrapper.extension;
        this.subExtension(extension);
    }

    subExtension = (extension) => {
        const newSubExt = extension.substring(1);
        this.setState({
            newExtension: newSubExt
        })
    }

    render() {
        if (this.state.falloDelServer === true) {
            return (
                <div id="index" style={{ backgroundColor: "#ff4d4d" }}>
                    <LogoError />
                    <div id="index-container">
                        <h2>{this.state.textoTarjeta}</h2>
                    </div>
                </div>
            );
        } else if (this.state.publicidad_Extension === "png" || this.state.publicidad_Extension === "gif" || this.state.publicidad_Extension === "jpg" || this.state.publicidad_Extension === "svg" || this.state.publicidad_Extension === "swf") {
            if (this.state.publicidad_Extension === "swf") {
                return (
                    <div id="index">
                        <div id="up-container">
                            <ReactSWF
                                container={<div style={{ background: '#cccccc' }} />}
                                src={`data:image/${this.state.newExtension};base64,${this.state.newPublicity}`}

                                id="swf"
                                width="100%"
                                height="100%"

                                flashVars={{ foo: 'A', bar: 1 }}
                            />
                        </div>
                        <div id="down-container">
                            <div id="left-container">

                            </div>
                            <div id="middle-container">
                                <h2>{this.state.textoTarjeta}</h2>
                            </div>
                            <div id="right-container">
                                <div id="right-button-container">
                                    <div>
                                        {/* {
                                                                this.state.capabilities.substring(0,1)==="1" && this.state.buttonHover!==null &&
                                                                <Button style={this.state.buttonHover.FDK8} onMouseEnter={()=>this.handleHoverButtom("FDK8",this.state.GBSL)} onMouseLeave={()=>this.handleHoverButtom("NONE",this.state.GBSL)} id="FDK8" action={()=>this.handleClicLogic("FDK8TOUCH")} texto={"Remesas"}></Button>
                                                            } */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            } else {
                return (
                    <div id="index">
                        <div id="up-container" style={{
                            backgroundImage: `url(data:image/${this.state.newExtension};base64,${this.state.newPublicity})`,
                            backgroundSize: "100% 100%",
                            backgroundRepeat: "no-repeat"
                        }}>
                        </div>
                        <div id="down-container">
                            <div id="left-container">

                            </div>
                            <div id="middle-container">
                                <h2>{this.state.textoTarjeta}</h2>
                            </div>
                            <div id="right-container">
                                <div id="right-button-container">
                                    <div>
                                        {
                                            this.state.capabilities.substring(0, 1) === "1" && this.state.buttonHover !== null &&
                                            <Button style={this.state.buttonHover.FDK8} onMouseEnter={() => this.handleHoverButtom("FDK8", this.state.GBSL)} onMouseLeave={() => this.handleHoverButtom("NONE", this.state.GBSL)} id="FDK8" action={() => this.handleClicLogic("FDK8TOUCH")} texto={"Remesas"}></Button>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            }
        }
    }
}


indexComponent.defaultProps = {
    ip: null, hostName: null
}
indexComponent.PropsTypes = {
    ip: PropsTypes.string.isRequired,
    hostName: PropsTypes.string.isRequired
}

export default indexComponent;