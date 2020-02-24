export var enums = {
    PinService_14: "Hay un porblema con el teclado",
    CDMService_14: "Hay un problema al dispensar efectivo",
    PTRService_14: "Hay un problema con la impresora",
    TDCService_14: "Hay un problema al leer su tarjeta",
    SIUService_14: "Hay un problema con los sensores"
 }

 export function errorWSV (response){
    let message;
    if(response["errorWS"] !==undefined){
        message = response.errorWS[0].errorMessage;
    }else{
        message = "Hubo un error en la tranzacción"
    }
    return message;
 }
 