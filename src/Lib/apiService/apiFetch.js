import { ServerConfig } from '../utils/TRAN_CDE';

export default function apiFetch(endPoint,config){
    //return fetch(`http://192.168.10.82:8081${endPoint}`,{...config}).then(json=>json.json()).then(data=>data);
    //return fetch(`http://192.168.56.1:8080${endPoint}`,{...config}).then(json=>json.json()).then(data=>data);
    //return fetch(`http://10.255.21.81:8080${endPoint}`,{...config}).then(json=>json.json()).then(data=>data).catch((error)=>{
    return fetch(`http://${ServerConfig.host}${ServerConfig.jxiserverport}${endPoint}`,{...config}).then(json=>json.json()).then(data=>data).catch((error)=>{
        return  {
            code:"404",
            errorWS:[
                {
                    cause:"-JXIFRONT",
                    errorMessage:error.message
                }
            ]
        }
    });
}