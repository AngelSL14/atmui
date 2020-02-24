export const SOCKET = (socket,operation,props)=>{
        switch (operation) {
            case "CREATEFDKCLASS":
                    socket.send(JSON.stringify({
                        operationComponent:"CREATEFDKCLASS",
                        activeFDKs:props.capabilities,
                        typeScreen:props.typeScreen
                    }));
                break;
            case "CANCELPINXFS":
                    socket.send(JSON.stringify({
                        operationComponent:"CANCELPINXFS"
                    }));
                break;
            case "RETIRETARJETACOMPONENT":
                    socket.send(JSON.stringify({
                        operationComponent:"RETIRETARJETACOMPONENT"
                    }));
                break;
            case "RESETXFSPTR":
                    socket.send(JSON.stringify({
                        operationComponent:"RESETXFSPTR"
                    }));
                break;
            case "RESETXFSPIN":
                    socket.send(JSON.stringify({
                        operationComponent:"RESETXFSPIN"
                    }));
                break;
            case "RESETXFSIDC":
                    socket.send(JSON.stringify({
                        operationComponent:"RESETXFSIDC"
                    }));
                break;
            case "NIPCOMPONENT":
                    socket.send(JSON.stringify({
                        operationComponent:"NIPCOMPONENT"
                    }));
                break;
            case "GETPINPAD":
                    socket.send(JSON.stringify({
                        operationComponent:"GETPINPAD",
                        subtrack:props.subtrack,
                        pin:props.pin
                    }));
                break;
            case "IMPRIMIRTICKETCOMPONENT":
                    socket.send(JSON.stringify({
                        operationComponent:"IMPRIMIRTICKETCOMPONENT",
                        message:props
                    }));
                break;
            case "ACCIONEMV":
                    socket.send(JSON.stringify({
                        operationComponent:"ACCIONEMV",
                        extra:{
                            tipoTranzaccion:"01",
                            currencyCode:"0484",
                            currencyExpo:"00",
                            amountAutorized:"00",
                            amountOther:"00"
                        }
                    }));
                break;
            case "RETIROOPTIONCOMPONENT":
                    socket.send(JSON.stringify({
                        operationComponent:"RETIROOPTIONCOMPONENT",
                        activeFDKs:props.capabilities,
                        typeScreen:props.typeScreen
                    }));
                break;
            case "RETIREEFECTIVOMENSAJECOMPONENT":
                    socket.send(JSON.stringify({
                        operationComponent:"RETIREEFECTIVOMENSAJECOMPONENT",
                        amount:props.billsRetiro
                    }));
                break;
            case "CREATEPINFDK48CLASS":
                    socket.send(JSON.stringify({
                        operationComponent:"CREATEPINFDK48CLASS",
                        activeFDKs:props.activeFDKs,
                        typeScreen:props.typeScreen
                    }));
                break;
            case "INDEXCOMPONENT":
                    socket.send(JSON.stringify({
                        operationComponent:"INDEXCOMPONENT",
                        extra:{
                            datasource:"TRACK2"
                        }
                    }));
                break;
            case "CANCELREADROWATA":
                    socket.send(JSON.stringify({
                        operationComponent:"CANCELREADROWATA"
                    }));
                break;
            default:
                break;
        }
}