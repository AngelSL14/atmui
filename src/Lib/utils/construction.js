
import { SB, FDKTouch } from './values';
import { jsonValidator, asciiToHexa } from './utils';
import { SOCKET } from './socketComunication';

let dataFDK;
export const setDataFDK = (data) => {
    dataFDK = data;
}

export const history = (route, history) => {
    setTimeout(() => {
        history.push(`/${route}`);
    }, 150);
}
export const dasStyle = (styles, back, ext) => {
    return {
        color: styles.color,
        fontFamily: styles.fontFamily,
        backgroundImage: `url(data:image/${ext};base64,${back})`
    }
}
const errorMessage = "Error en la comunicacion";
export const errorWS = (response, props) => {
    if (response['errorWS'] !== undefined) {
        props.modifyState("mensajeErrorGlobal", response.errorWS[0].errorMessage);
    } else {
        props.modifyState("mensajeErrorGlobal", errorMessage);
    }
    history("errorProcessComponent", props.history);
}
export const errorXFS = (message, props) => {
    if (message !== null) {
        props.modifyState("mensajeErrorGlobal", message);
    } else {
        props.modifyState("mensajeErrorGlobal", errorMessage);
    }
    history("errorProcessComponent", props.history);
}

export const hanlog = (data, FDK, his, numbers, backless, hl, bl, component, socket) => {
    if (jsonValidator(data)) {
        if (data.includes("CANCEL")) {
            history("retireTarjetaComponent", his);
        } else {
            const json = JSON.parse(data);
            if (json['code'] !== undefined) {
                switch (json.code) {
                    case -14:

                        break;
                    case 14:

                        break;
                    case -17:

                        break;
                    case 17:
                        history("", his);
                        break;
                    case -18:
                        break;
                    case 18:
                        history("", his);
                        break;
                    case -19:

                        break;
                    case 19:
                        history("", his);
                        break;
                    case 200:
                        if (component === "RTC") {//RETIRETARJETA COMPONENT
                            SOCKET(socket, "RESETXFSPTR", null);
                        }
                        break;
                    case -201:

                        break;
                    case -205:

                        break;
                    case 401:
                        if (json['event'] !== undefined) {
                            if (json.event['action'] !== undefined) {
                                FDKFKLogic(json.event.action, numbers, backless, hl);
                            }
                        }
                        break;
                    case 400:
                        if (json['message'] !== undefined) {
                            if (json.message['completion'] !== undefined) {
                                if (json.message.completion === "ENTER") {
                                    hl("ENTER");
                                }
                            }
                        }
                        break;
                    case 9000:
                        history("", his);
                        break;
                    case "099":
                        TC(FDK, bl.F[0], bl.F[1], bl.F[2], bl.F[3], bl.F[4], bl.F[5], bl.F[6], bl.F[7], bl.texto);
                        FDKTouch(FDK, bl.route, his);
                        break;
                    default:
                        break;
                }
            }
        }
    }
}

export const modelConstructor = (tranzaction, props, emv) => {
    let model = null;
    switch (tranzaction) {
        case "AUTH":
            model = `${asciiToHexa(props.hostName)}1C${asciiToHexa(props.ip)}1C${asciiToHexa("0")}`;
            break;
        case "STYLES":
            model = {
                ip: props.ip,
                track: props.track,
                termId: props.hostName
            }
            break;
        case "TICKET":
            model = {
                ip: props.ip,
                termId: props.hostName
            }
            break;
        case "RECARGA":
            const c = props.compania.toUpperCase();
            model = {
                txCommission: "00.00",
                nip: props.nip,
                ip: props.ip,
                tipoCuenta: props.tipoTarjeta,
                track: props.track,
                cashWithAmount: props.montoRecarga,
                company: c,
                telefono: props.numTelefono,
                termId: props.hostName
            };
            break;
        case "RECARGAEMV":
            const co = props.compania.toUpperCase();
            model = {
                txCommission: "00.00",
                nip: props.nip,
                ip: props.ip,
                tipoCuenta: props.tipoTarjeta,
                track: props.track,
                cashWithAmount: props.montoRecarga,
                company: co,
                telefono: props.numTelefono,
                emv,
                termId: props.hostName
            };
            break;
        case "SALDO":
            model = {
                txCommission: props.comision,
                tipoCuenta: props.tipoTarjeta,
                nip: props.nip,
                ip: props.ip,
                track: props.track,
                termId: props.hostName
            };
            break;
        case "SALDOEMV":
            model = {
                txCommission: props.comision,
                tipoCuenta: props.tipoTarjeta,
                nip: props.nip,
                ip: props.ip,
                track: props.track,
                emv,
                termId: props.hostName
            };
            break;
        case "MOVIMIENTOS":
            model = {
                txCommission: props.comision,
                ip: props.ip,
                nip: props.nip,
                tipoCuenta: props.tipoTarjeta,
                track: props.track,
                termId: props.hostName
            };
            break;
        case "MOVIMIENTOSEMV":
            model = {
                txCommission: props.comision,
                ip: props.ip,
                nip: props.nip,
                tipoCuenta: props.tipoTarjeta,
                track: props.track,
                emv,
                termId: props.hostName
            };
            break;
        case "CANIP":
            model = {
                txCommission: "00.00",
                tipoCuenta: "00",
                nip: props.nip,
                ip: props.ip,
                track: props.track,
                newPin: props.pinblockUno,
                confirmNewPin: props.pinblockDos,
                termId: props.hostName
            };
            break;
        case "CANIPEMV":
            model = {
                txCommission: "00.00",
                tipoCuenta: "00",
                nip: props.nip,
                ip: props.ip,
                track: props.track,
                newPin: props.pinblockUno,
                confirmNewPin: props.pinblockDos,
                emv,
                termId: props.hostName
            };
            break;
        case "RETIRO":
            model = {
                ip: props.ip,
                cashWithAmount: props.montoRetiroEfectivo,
                txCommission: props.comision,
                tipoCuenta: props.tipoTarjeta,
                nip: props.nip,
                track: props.track,
                termId: props.hostName
            };
            break;
        case "RETIROEMV":
            model = {
                ip: props.ip,
                cashWithAmount: props.montoRetiroEfectivo,
                txCommission: props.comision,
                tipoCuenta: props.tipoTarjeta,
                nip: props.nip,
                track: props.track,
                emv,
                termId: props.hostName
            };
            break;
        case "DCC":
            model = {
                ip: props.ip,
                cashWithAmount: props.montoRetiroEfectivo,
                txCommission: props.comision,
                tipoCuenta: props.tipoTarjeta,
                nip: props.nip,
                track: props.track,
                dccResponse: {
                    localCurrency: props.dcc.localCurrency,
                    changeCurrency: props.dcc.changeCurrency,
                    amountRequest: props.dcc.amountRequest,
                    surcharge: props.dcc.surcharge,
                    amountTotal: props.dcc.amountTotal,
                    convertedAmount1: props.dcc.convertedAmount1,
                    countryCodeLocal: props.dcc.countryCodeLocal,
                    countryCodeChange: props.dcc.countryCodeChange,
                    state: props.dccRequest.state
                },
                termId: props.hostName
            };
            break;
        case "DCCEMV":
            model = {
                ip: props.ip,
                cashWithAmount: props.montoRetiroEfectivo,
                txCommission: props.comision,
                tipoCuenta: props.tipoTarjeta,
                nip: props.nip,
                track: props.track,
                emv,
                dccResponse: {
                    localCurrency: props.dcc.localCurrency,
                    changeCurrency: props.dcc.changeCurrency,
                    amountRequest: props.dcc.amountRequest,
                    surcharge: props.dcc.surcharge,
                    amountTotal: props.dcc.amountTotal,
                    convertedAmount1: props.dcc.convertedAmount1,
                    countryCodeLocal: props.dcc.countryCodeLocal,
                    countryCodeChange: props.dcc.countryCodeChange,
                    state: props.dccRequest.state
                },
                termId: props.hostName
            };
            break;
        case "COMISION":
            model = {
                track: props.track,
                transactionCode: props.transactionCode,
                ip: props.ip
            };
            break;
        default:
            break;
    }
    return model;
}
export const TC = (FDK, FDK1, FDK2, FDK3, FDK4, FDK5, FDK6, FDK7, FDK8, array) => {
    switch (FDK) {
        case "FDK1TOUCH":
            if (FDK1 !== null && array[0] !== null) {
                FDK1(array[0]);
            }
            break;
        case "FDK2TOUCH":
            if (FDK2 !== null && array[1] !== null) {
                FDK2(array[1]);
            }
            break;
        case "FDK3TOUCH":
            if (FDK3 !== null && array[2] !== null) {
                FDK3(array[2]);
            }
            break;
        case "FDK4TOUCH":
            if (FDK4 !== null && array[3] !== null) {
                FDK4(array[3]);
            }
            break;
        case "FDK5TOUCH":
            if (FDK5 !== null && array[4] !== null) {
                FDK5(array[4]);
            }
            break;
        case "FDK6TOUCH":
            if (FDK6 !== null && array[5] !== null) {
                FDK6(array[5]);
            }
            break;
        case "FDK7TOUCH":
            if (FDK7 !== null && array[6] !== null) {
                FDK7(array[6]);
            }
            break;
        case "FDK8TOUCH":
            if (FDK8 !== null && array[7] !== null) {
                FDK8(array[7]);
            }
            break;
        default:
            break;
    }
}
export const FDKFKLogic = (obj, NumbersFK, backless, ClickFDK) => {
    switch (obj) {
        case "FK_1":
            NumbersFK("1");
            break;
        case "FK_2":
            NumbersFK("2");
            break;
        case "FK_3":
            NumbersFK("3");
            break;
        case "FK_4":
            NumbersFK("4");
            break;
        case "FK_5":
            NumbersFK("5");
            break;
        case "FK_6":
            NumbersFK("6");
            break;
        case "FK_7":
            NumbersFK("7");
            break;
        case "FK_8":
            NumbersFK("8");
            break;
        case "FK_9":
            NumbersFK("9");
            break;
        case "FK_0":
            NumbersFK("0");
            break;
        case "FK_BACKSPACE":
            backless();
            break;
        case "FK_CLEAR":
            backless();
            break;
        case dataFDK[7]:
            ClickFDK("FDK1FISICO");
            break;
        case dataFDK[6]:
            ClickFDK("FDK2FISICO");
            break;
        case dataFDK[5]:
            ClickFDK("FDK3FISICO");
            break;
        case dataFDK[4]:
            ClickFDK("FDK4FISICO");
            break;
        case dataFDK[3]:
            ClickFDK("FDK5FISICO");
            break;
        case dataFDK[2]:
            ClickFDK("FDK6FISICO");
            break;
        case dataFDK[1]:
            ClickFDK("FDK7FISICO");
            break;
        case dataFDK[0]:
            ClickFDK("FDK8FISICO");
            break;
        default:
            break;
    }
}
export const logic = (props, pinpad, screen) => {
    if (pinpad === null || pinpad === undefined) {
        return null;
    } else {
        if (props.ip !== null || props.ip !== undefined) {
            if (props.hostName !== null || props.hostName !== undefined) {
                if (screen === "ERRORPROCESSCOMPOENT") {
                    if (props.message !== null || props.message !== undefined) {
                        return true;
                    } else {
                        return null;
                    }
                } else if (props.track !== null || props.track !== undefined) {
                    if (screen === "WAITINITIALCOMPONENT") {
                        return true;
                    } else if (props.tarjetaChip !== null || props.tarjetaChip !== undefined) {
                        if (props.token !== null || props.token !== undefined) {
                            if (props.GBS !== null || props.GBS !== undefined) {
                                if (screen === "NIPCOMPONENT") {
                                    return true;
                                } else if (props.seguridadTarjeta !== null || props.seguridadTarjeta !== undefined) {
                                    if (props.nip !== null || props.nip !== undefined) {
                                        if (screen === "RETIRETARJETACOMPONENT") {
                                            return true;
                                        } else if (screen === "TIPOTARJETACOMPONENT") {
                                            return stateConstruction(props, screen);
                                        } else if (props.tipoTarjeta !== null || props.tipoTarjeta !== undefined) {
                                            if (screen === "SELECTCONSULTAMOVIMIENTOSCOMPONENT") {
                                                return stateConstruction(props, screen);
                                            } else if (screen === "SELECTOPERATION") {
                                                return stateConstruction(props, screen);
                                            } else if (screen === "RETORNOMENUCOMPONENT") {
                                                return stateConstruction(props, screen);
                                            } else if (screen === "IMPRIMIRTICKETCOMPONENT") {
                                                return true;
                                            } else {
                                                if (props.transactionCode !== null || props.transactionCode !== undefined) {
                                                    switch (props.transactionCode) {
                                                        case "31":
                                                            if (screen === "WAITCOMISIONCOMPONENT") {
                                                                return true;
                                                            } else if (screen === "AVISOCOMISIONSALDOCOMPONENT") {
                                                                return stateConstruction(props, screen);
                                                            } else {
                                                                return saldoValidation(props, screen);
                                                            }
                                                        case "01":
                                                            if (screen === "WAITCOMISIONCOMPONENT") {
                                                                return true;
                                                            } else if (screen === "AVISOCOMISIONSALDOCOMPONENT") {
                                                                return stateConstruction(props, screen);
                                                            } else {
                                                                return widthdrawalValidation(props, screen);
                                                            }
                                                        case "96":
                                                            return nipChangeValidation(props, screen);
                                                        case "65":
                                                            return genericSaleValidation(props, screen);
                                                        case "94":
                                                            return movimientosValidation(props, screen);
                                                        default:
                                                            break;
                                                    }
                                                } else {
                                                    return null;
                                                }

                                            }
                                        } else {
                                            return null;
                                        }
                                    } else {
                                        return null;
                                    }
                                } else {
                                    return null;
                                }
                            } else {
                                return null;
                            }
                        } else {
                            return null;
                        }
                    } else {
                        return null;
                    }
                } else {
                    return null;
                }
            } else {
                return null;
            }
        } else {
            return null;
        }
    }
}
// const dccValidaciont = (props,screen)=>{
//     if(props.dcc!==null || props.dcc!==undefined){
//         if(screen==="DCCCOMPONENT"){
//                 return stateConstruction(props,screen);
//         }
//     }else{
//         return null;
//     }
// }
const widthdrawalValidation = (props, screen) => {
    if (screen === "RETIROOPTIONCOMPONENT") {
        return stateConstruction(props, screen);
    } else if (screen === "WAITCOMISIONCOMPONENT") {
        return true;
    } else if (screen === "AVISOCOMISIONSALDOCOMPONENT") {
        return stateConstruction(props, screen);
    } else if (props.montoRetiroEfectivo !== null || props.montoRetiroEfectivo !== undefined) {
        if (screen === "WAITRETIROREALIZANDOCOMPONENT") {
            return true;
        } else if (props.billsRetiro !== null || props.billsRetiro !== undefined) {
            if (screen === "RETIREEFECTIVOCOMPONENT") {
                return true;
            } else {
                return null;
            }
        }
    }
}
const nipChangeValidation = (props, screen) => {
    if (screen === "CAMBIONIPCOMPONENT") {
        return stateConstruction(props, screen);
    } else if (screen === "VERIFICACIONCAMBIONIPCOMPONENT") {
        return true;
    } else if (screen === "WAITCAMBIONIPREALIZANDOCOMPONENT") {
        if (props.pinblockUno !== null || props.pinblockUno !== undefined) {
            if (props.pinblockDos !== null || props.pinblockDos !== undefined) {
                return true;
            } else {
                return null;
            }
        } else {
            return null;
        }
    }
}
const movimientosValidation = (props, screen) => {
    if (screen === "WAITCOMISIONCOMPONENT") {
        return true;
    } else if (screen === "AVISOCOMISIONSALDOCOMPONENT") {
        return stateConstruction(props, screen);
    } else if (screen === "WAITCONSULTAMOVIMIENTOSCOMPONENT") {
        return true;
    } else if (props.objetoMovimientos !== null || props.objetoMovimientos !== undefined) {
        if (screen === "MOVIMIENTOSCOMPONENT") {
            return stateConstruction(props, screen);
        } else {
            return null;
        }
    }
}
const saldoValidation = (props, screen) => {
    if (screen === "WAITCONSULTASALDOREALIZANDOCOMPONENT") {
        return true;
    } else if (props.objetoSaldo !== null || props.objetoSaldo !== undefined) {
        if (screen === "SALDOCOMPONENT") {
            return stateConstruction(props, screen);
        }
    } else {
        return null;
    }
}
const genericSaleValidation = (props, screen) => {
    if (screen === "COMPANIASCOMPONENT") {
        return stateConstruction(props, screen);
    } else if (props.compania !== null || props.compania !== undefined) {
        if (screen === "NUMEROTELEFONOCOMPONENT") {
            return stateConstruction(props, screen);
        } else if (props.numTelefono !== null || props.numTelefono !== undefined) {
            if (screen === "MONTOTIEMPOAIRECOMPONENT") {
                return stateConstruction(props, screen);
            } else if (props.montoRecarga !== null || props.montoRecarga !== undefined) {
                if (screen === "VERIFICARTIEMPOAIRECOMPONENT") {
                    return stateConstruction(props, screen);
                } else if (screen === "WAITTIEMPOAIREREALIZANDOCOMPONENT") {
                    return true;
                }
            } else {
                return null;
            }
        } else {
            return null;
        }
    } else {
        return null;
    }
}

const stateConstruction = (props, screen) => {
    let values = null;
    props.capabilitiesScreen.screenCapabilities.forEach(s => {
        if (s.screenComponent === screen) {
            let buttonHover = SB("NONE", props.GBS);
            values = {
                capabilities: s.bitmap,
                typeScreen: props.capabilitiesScreen.typeOfScreen,
                buttonHover
            }
        }
    });
    return values;
}
