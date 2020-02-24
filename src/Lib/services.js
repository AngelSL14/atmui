import apiFetch from './apiService/apiFetch';

export function tarjetaIntroducida(data,token){
    return apiFetch('/crdrdr/crdincmg',{
        method:'POST',
        headers:{
            'Content-Type':'application/json',
            'Authorization':token
        },
        body: JSON.stringify(data)
    });
}

export function getTargeta(data,token){
    return apiFetch('/crdrdr/crdvldt',{
        method:'POST',
        headers:{
            'Content-Type':'application/json',
            //'Access-Control-Allow-Origin':'*',
            'Authorization':token
        },
        body: JSON.stringify(data)
    });
}

export function verificarRetiro(data,token){
    return apiFetch('/athz/wthdw',{
        method:'POST',
        headers:{
            'Content-Type':'application/json',
            //'Access-Control-Allow-Origin':'*',
            'Authorization':token
        },
        body: JSON.stringify(data)
    });
}

export function verificarRemesas(data,token){
    return apiFetch('/remesas',{
        method:'POST',
        headers:{
            'Content-Type':'application/json',
            'Authorization':token
        },
        body:JSON.stringify(data)
    });
}

export function verificarConsulta(data,token){
    return apiFetch('/athz/blnInq',{
        method:'POST',
        headers:{
            'Content-Type':'application/json',
            //'Access-Control-Allow-Origin':'*',
            'Authorization':token
        },
        body: JSON.stringify(data)
    });
}

export function verificarMovimientos(data,token){
    return apiFetch('/athz/lstTrx',{
        method:'POST',
        headers:{
            'Content-Type':'application/json',
            //'Access-Control-Allow-Origin':'*',
            'Authorization':token
        },
        body: JSON.stringify(data)
    });
}

export function verificarChip(data,token){
    return apiFetch('/crdrdr/crdvldt',{
        method:'POST',
        headers:{
            'Content-Type':'application/json',
            //'Access-Control-Allow-Origin':'*',
            'Authorization':token
        },
        body: JSON.stringify(data)
    });
}

export function getComision(data,token){
    return apiFetch('/athz/cmmssn',{
        method:'POST',
        headers:{
            'Content-Type':'application/json',
            //'Access-Control-Allow-Origin':'*',
            'Authorization':token
        },
        body:JSON.stringify(data)
    });
}

export function consultaSaldoCaseteros(data,token){
    return apiFetch('/mngmt/chck',{
        method:'POST',
        headers:{
            'Content-Type':'application/json',
            //'Access-Control-Allow-Origin':'*',
            'Authorization':token
        },
        body: JSON.stringify(data)
    });
}

export function concentracionCaseteros(data,token){
    return apiFetch('/mngmt/cnctratn ',{
        method:'PUT',
        headers:{
            'Content-Type':'application/json',
            //'Access-Control-Allow-Origin':'*',
            'Authorization':token
        },
        body: JSON.stringify(data)
    });
}

export function adicion(data,token){
    return apiFetch('/mngmt/add',{
        method:'PUT',
        headers:{
            'Content-Type':'application/json',
            //'Access-Control-Allow-Origin':'*',
            'Authorization':token
        },
        body: JSON.stringify(data)
    });
}

export function decremento(data,token){
    return apiFetch('/mngmt/dcrmnt',{
        method:'PUT',
        headers:{
            'Content-Type':'application/json',
            //'Access-Control-Allow-Origin':'*',
            'Authorization':token
        },
        body: JSON.stringify(data)
    });
}

export function validacionCaseteros(data,token){
    return apiFetch('/dspnscsh/vldtCshHld',{
        method:'POST',
        headers:{
            'Content-Type':'application/json',
            //'Access-Control-Allow-Origin':'*',
            'Authorization':token
        },
        body: JSON.stringify(data)
    });
}

export function caseteroMenorDenominacion(data,token){
    return apiFetch('/vldtn/mntMnm',{
        method:'POST',
        headers:{
            'Content-Type':'application/json',
            'Access-Control-Allow-Origin':'*',
            'Authorization':token
        },
        body:JSON.stringify(data)
    });
}

export function recargaSaldo(data,token){
    return apiFetch('/athz/gnrcSl',{
        method:'POST',
        headers:{
            'Content-Type':'application/json',
            //'Access-Control-Allow-Origin':'*',
            'Authorization':token
        },
        body:JSON.stringify(data)
    });
}

export function PrinterService(data,token){
    return apiFetch('/prntrcntrllr/prntng',{
        method:'POST',
        headers:{
            'Content-Type':'application/json'
            ,'Authorization':token
        },
        body:JSON.stringify(data)
    });
}

export function CambioDeNip(data,token){
    return apiFetch('/athz/chngPNb',{
        method:'POST',
        headers:{
            'Content-Type':'application/json'
            ,'Authorization':token
        },
        body:JSON.stringify(data)
    });
}

export function CapabilitiesScreen(data,token){
    return apiFetch('/capa/bilities',{
        method:'POST',
        headers:{
            'Content-Type':'application/json'
            ,'Authorization':token
        },
        body:JSON.stringify(data)
    });
}

export function CapabilitiesPublicity(data,token){
    return apiFetch('/capa/publicity',{
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify(data)
    });
}

export function Authorization(data){//VALIDACION POR DATOS HEXADECIMAL
    return apiFetch('/auth',{
        method:'POST',
        headers:{
            'Content-Type':'text/plain'
        },
        body:data
    })
}

export var localIp;

export function getLocalIp(){
    window.RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;  
	var pc = new RTCPeerConnection({iceServers:[]}), 
	noop = function(){}; 
     
   	pc.createDataChannel("");  
	pc.createOffer(pc.setLocalDescription.bind(pc), noop);   
    	pc.onicecandidate = function(ice){ 
   	if(!ice || !ice.candidate || !ice.candidate.candidate)  return;

            var myIP = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/.exec(ice.candidate.candidate)[1];
            pc.onicecandidate = noop;
            localIp = myIP;
            return localIp;
	 }; 
}
