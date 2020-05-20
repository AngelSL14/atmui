import React, { Component } from "react";
import './stylesSection.css';
import { verificarChip, SingleAtmIso } from '../Lib/services';
import PropsTypes from 'prop-types';
import CardBank from '../components/cardBank';
import { Authorization, singleImage } from '../Lib/services';
import { pingpad } from '../Lib/socketService/socketServices';
import { logic, history, errorWS, errorXFS, modelConstructor, dasStyle } from '../Lib/utils/construction';

class WaitInicialComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            imagesDB: [],
            newBackground: "",
            newExtension: "",
        }
        this.handleLogicComponent = this.handleLogicComponent.bind(this);
    }

    componentDidMount() {
        this.props.modifyState("timerMessage", false);
        let wic = logic(this.props, pingpad, "WAITINITIALCOMPONENT");
        if (wic !== true) { history("", this.props.history); }
        else { setTimeout(() => { this.handleLogicComponent(); }, 300); }
    }
    async handleLogicComponent() {
        const authHexa = modelConstructor("AUTH", this.props, null);
        const auth = await Authorization(authHexa);
        if (auth.message === "Authentication Failed: Bad credentials") {
            errorXFS("Cajero no Autorizado", this.props);
        }
        if (auth.message === "authorization") {
            this.props.modifyState("token", auth.accessToken);
            const capabilities = await SingleAtmIso(auth.accessToken, this.props.hostName);
            if (capabilities.code.includes("-")) {
                errorWS(capabilities);
            } else {
                const mainBody = {
                    typeOfScreen: this.props.screenType,
                    screenCapabilities: capabilities.body[0].atm.screen.screenGroup.buttonsAllowed.buttons
                }
                this.props.modifyState("capabilitiesScreen", mainBody);
                const objVT = modelConstructor("STYLES", this.props, null);
                const response = await verificarChip(objVT, auth.accessToken);
                setTimeout(async () => {
                    if (response.code === "200") {
                        let o = JSON.parse(response.body[0].styles.buttons);
                        const arrayButtonStyle = o.style.border.split(' ');
                        const newArrayButtonStyle = arrayButtonStyle[0].split(',');
                        const arrayButtonStyleHover = o.styleHover.border.split(' ');
                        const newArrayButtonStyleHover = arrayButtonStyleHover[0].split(',');
                        const arrayButtonStyleDisabled = o.styleDisabled.border.split(' ');
                        const newArrayButtonStyleDisabled = arrayButtonStyleDisabled[0].split(',');
                        const objNewBStyles = {
                            style: {
                                backgroundColor: o.style.backgroundColor,
                                border: '',
                                borderStyle: `${newArrayButtonStyle[0]} ${newArrayButtonStyle[1]} ${newArrayButtonStyle[2]} ${newArrayButtonStyle[3]}`,
                                borderWidth: arrayButtonStyle[1],
                                borderColor: arrayButtonStyle[2],
                                borderRadius: o.style.backgroundColor,
                                color: o.style.color,
                                cursor: o.style.cursor,
                                fontFamily: o.style.fontFamily,
                                fontSize: o.style.fontSize,
                                height: o.style.height,
                                width: o.style.width,
                            },
                            styleHover: {
                                backgroundColor: o.styleHover.backgroundColor,
                                border: '',
                                borderStyle: `${newArrayButtonStyleHover[0]} ${newArrayButtonStyleHover[1]} ${newArrayButtonStyleHover[2]} ${newArrayButtonStyleHover[3]}`,
                                borderWidth: arrayButtonStyleHover[1],
                                borderColor: arrayButtonStyleHover[2],
                                borderRadius: o.styleHover.backgroundColor,
                                color: o.styleHover.color,
                                cursor: o.styleHover.cursor,
                                fontFamily: o.styleHover.fontFamily,
                                fontSize: o.styleHover.fontSize,
                                height: o.styleHover.height,
                                width: o.styleHover.width,
                            },
                            styleDisabled: {
                                backgroundColor: o.styleDisabled.backgroundColor,
                                border: '',
                                borderStyle: `${newArrayButtonStyleDisabled[0]} ${newArrayButtonStyleDisabled[1]} ${newArrayButtonStyleDisabled[2]} ${newArrayButtonStyleDisabled[3]}`,
                                borderWidth: arrayButtonStyleDisabled[1],
                                borderColor: arrayButtonStyleDisabled[2],
                                borderRadius: o.styleDisabled.backgroundColor,
                                color: o.styleDisabled.color,
                                cursor: o.styleDisabled.cursor,
                                fontFamily: o.styleDisabled.fontFamily,
                                fontSize: o.styleDisabled.fontSize,
                                height: o.styleDisabled.height,
                                width: o.styleDisabled.width,
                            }
                        };
                        let GBS = {
                            style: objNewBStyles.style,
                            styleHover: objNewBStyles.styleHover,
                            styleDisabled: objNewBStyles.styleDisabled
                        };
                        const styleTemp = response.body[0].styles.dashboard;
                        const backgroundImage = response.body[0].styles.backgroundImage;
                        const oneImage = await singleImage(auth.accessToken, backgroundImage, 'background');
                        const newStyles = this.setImageDB(oneImage.body[0]);
                        let GDS = dasStyle(styleTemp, newStyles.back, newStyles.newExtension);
                        this.props.modifyState("GBS", GBS);
                        this.props.modifyState("GDS", GDS);
                        this.props.modifyState("seguridadTarjeta", response.body[0].message);
                        this.props.history.push('/nipComponent');
                    } else if (response.code.includes("-")) {
                        errorWS(response);
                    }
                }, 1500);
            }
        } else if (auth.code === "404") {
            errorXFS(auth.message, this.props);
        }
    }

    setImageDB = (oneImage) => {
        var back = oneImage.wrapper.codec;
        var extension = oneImage.wrapper.extension;
        const newExtension = extension.substring(1);
        const newDash = { back, newExtension }
        return newDash;
    }

    render() {
        return (
            <div id="wait-inicio-component">
                <h1>Espere un momento Por Favor</h1>
                <h2>Validando Tarjeta</h2>
                <CardBank bank={"prosa"} />
            </div>
        );
    }
}

WaitInicialComponent.defaultProps = {
    ip: null,
    track: null,
    hostName: null
}

WaitInicialComponent.PropsTypes = {
    ip: PropsTypes.string.isRequired,
    track: PropsTypes.string.isRequired,
    hostName: PropsTypes.string.isRequired
}
export default WaitInicialComponent;
