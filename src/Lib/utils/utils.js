export function urlSocketService(host,endpoint){
    const port="8181";
    return `http://${host}:${port}/${endpoint}`;
}
export function jsonValidator(jsonReceived){
    if(jsonReceived.charAt(0)==="{" && jsonReceived.charAt(jsonReceived.length-1)==="}") return true;
    return false;
}
export function asciiToHexa(str){
    var arr = [];
	for (var n = 0, l = str.length; n < l; n ++) 
     {
		var hex = Number(str.charCodeAt(n)).toString(16);
		arr.push(hex);
	 }
	return arr.join('');
}
export const emv = {
    operationComponent:"ACCIONEMV",
    extra:{
        tipoTranzaccion:"01",
        currencyCode:"0484",
        currencyExpo:"00",
        amountAutorized:"00",
        amountOther:"00"
    }
}
export const buttons = {
    style:{
        color:"white",
        backgroundColor:'gray',
        width:"100%",
        height:"100%",
        fontFamily:"Arial",
        borderRadius:"8px",
        fontSize:"1.2rem",
        border:"solid 1px black",
        cursor:"Pointer"
    },
    styleHover:{
        color:"white",
        backgroundColor:'black',
        width:"100%",
        height:"100%",
        borderRadius:"8px",
        fontSize:"1.2rem",
        border:"solid 1px black",
        cursor:"Pointer"
    }
}
export function errorValidation(message){
    if(message.includes("CdmService")){
        return "Hay un problema al dispensar efectivo";
    }
    if(message.includes("PINService")){
        return "Hay un porblema con el teclado";
    }
    if(message.includes("IDCService")){
        return "Hay un problema con el lector de tarjetas";
    }
    if(message.includes("PTRService")){
        return "Hay un problema con la impresora";
    }
    if(message.includes("SIUService")){
        return "Hay un problema con los sensores";
    }
}