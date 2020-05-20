 export var enums = {
    0:'EL SOCKET NO ESTA ENCENDIDO',
    1:'EL LOG ESTA INACTIVO',
    2:'Cajero no Autorizado',
    3:'Disposición',
    4:'connected',
    5:'Open Server Socket Executed',
    6:'add',
    7:'less',
    8:'$2,000',
    9:'$1,000',
    10:'$500',
    11:'$200',
    12:'Continuar'
};

export const ServerConfig = {
    host:"10.255.11.146:91",
    // host:"jse-nabhi.cloudapp.qa.prosa.lat/jse",
    imgport:"8090",
    jxiserverport:"",
    protocol:"http://",
    urlPublicity:"/background/img/publicidad/",
    urlBackground:"/background/img/FondoBancos/"
}
export const urlImg =`${ServerConfig.protocol}${ServerConfig.host}:${ServerConfig.imgport}${ServerConfig.urlPublicity}`;
export const url = {
    publicity:`${ServerConfig.protocol}${ServerConfig.host}:${ServerConfig.imgport}${ServerConfig.urlPublicity}`,
    background:`${ServerConfig.protocol}${ServerConfig.host}:${ServerConfig.imgport}${ServerConfig.urlBackground}`
}
export var host = environment(process.env.NODE_ENV);

function environment(enviroment){
    if(enviroment === "development"){
        return "10.255.11.148";
    }else if(enviroment === "production"){
        return "10.255.11.148";
    }else{
        return "localhost";
    }
}