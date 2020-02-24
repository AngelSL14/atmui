import { history } from './construction'

export const BL = (screen,FA)=>{//FUNCTIONARRAY
    let COMPONENT= null;
    switch (screen) {
        case "TTC"://TIPOTARJETACOMPONENT
                COMPONENT = {
                    texto:[null,null,null,null,null,"Cuenta de Ahorro","Cuenta de Ahorro","Cuenta de Debito"],
                    F:[FA[0],FA[1],FA[2],FA[3],FA[4],FA[5],FA[6],FA[7]],
                    route:[null,null,null,null,null,null,null,null]
                }
            break;
        case "SON"://SELECTOPERATION
                COMPONENT = {
                    texto:[null,null,null,null,null,null,null,null],
                    F:[FA[0],FA[1],FA[2],FA[3],FA[4],FA[5],FA[6],FA[7]],
                    route:[null,null,null,"retireTarjetaComponent","companiasComponent","CambioNipComponent","retiroOpcionComponent","selectConsultaMovimientoComponent"]
                }
            break;
        case "SCMC"://SELECTCONSULTAMOVIMIENTOSCOMPONENT
                COMPONENT = {
                    texto:[null,null,null,null,null,null,null,null],
                    F:[FA[0],FA[1],FA[2],FA[3],FA[4],FA[5],FA[6],FA[7]],
                    route:[null,null,"waitComisionComponent","retireTarjetaComponent",null,null,"waitComisionComponent","selectOperation"]
                }
            break;
        case "RMC"://RETORNOMENUCOMPONENT
                COMPONENT = {
                        texto:[null,null,null,"retireTarjetaComponent",null,null,null,"selectOperation"],
                        F:[FA[0],FA[1],FA[2],FA[3],FA[4],FA[5],FA[6],FA[7]],
                        route:[null,null,null,null,null,null,null,null]
                }
            break;
        case "ROC"://RETIRO OPTION COMPONENT
                COMPONENT = {
                        texto:["$200","$500","Corregir",null,"$1,000","$2,000","Continuar",null],
                        F:[FA[0],FA[1],FA[2],FA[3],FA[4],FA[5],FA[6],FA[7]],
                        route:[null,null,null,"retireTarjetaComponent",null,null,null,"selectOperation"]
                }
            break;
        case "DCC"://DCC
                COMPONENT = {
                        texto:[null,null,null,"A",null,null,null,"B"],
                        F:[FA[0],FA[1],FA[2],FA[3],FA[4],FA[5],FA[6],FA[7]],
                        route:[null,null,null,null,null,null,null,null]
                }
            break;
        default:
            break;
    }
    return COMPONENT;
}

export const FDKT = (touchFDK,functions) =>{
    switch (touchFDK) {
        case "FDK1TOUCH":
                functions.FDK1();
            break;
        case "FDK2TOUCH":
                functions.FDK2();
            break;
        case "FDK3TOUCH":
                functions.FDK3();
            break;
        case "FDK4TOUCH":
                functions.FDK4();
            break;
        case "FDK5TOUCH":
                functions.FDK5();
            break;
        case "FDK6TOUCH":
                functions.FDK6();
            break;
        case "FDK7TOUCH":
                functions.FDK7();
            break;
        case "FDK8TOUCH":
                functions.FDK8();
            break;
        default:
            break;
    }
}
export const FDKTouch = (touchFDK,route,his) =>{
    switch (touchFDK) {
        case "FDK1TOUCH":
                if(route[0]!==null){
                        history(route[0],his);
                }
            break;
        case "FDK2TOUCH":
                if(route[1]!==null){
                        history(route[1],his);
                } 
            break;
        case "FDK3TOUCH":
                if(route[2]!==null){
                        history(route[2],his);
                }
            break;
        case "FDK4TOUCH":
                if(route[3]!==null){
                        history(route[3],his);
                }
            break;
        case "FDK5TOUCH":
                if(route[4]!==null){
                        history(route[4],his); 
                }
            break;
        case "FDK6TOUCH":
                if(route[5]!==null){
                        history(route[5],his);
                }
            break;
        case "FDK7TOUCH":
                if(route[6]!==null){
                        history(route[6],his);
                }
            break;
        case "FDK8TOUCH":
                if(route[7]!==null){
                        history(route[7],his);
                }
            break;
        default:
            break;
    }
}

export const SB = (fdk,GBS) =>{
    let buttonHover = null;
    switch (fdk) {
        case "FDK1":
                    buttonHover ={
                        FDK1:GBS.styleHover,
                        FDK2:GBS.style,
                        FDK3:GBS.style,
                        FDK4:GBS.style,
                        FDK5:GBS.style,
                        FDK6:GBS.style,
                        FDK7:GBS.style,
                        FDK8:GBS.style
                    }
            break;
        case "FDK2":
                    buttonHover={
                        FDK1:GBS.style,
                        FDK2:GBS.styleHover,
                        FDK3:GBS.style,
                        FDK4:GBS.style,
                        FDK5:GBS.style,
                        FDK6:GBS.style,
                        FDK7:GBS.style,
                        FDK8:GBS.style
                }
            break;
        case "FDK3":
                    buttonHover={
                        FDK1:GBS.style,
                        FDK2:GBS.style,
                        FDK3:GBS.styleHover,
                        FDK4:GBS.style,
                        FDK5:GBS.style,
                        FDK6:GBS.style,
                        FDK7:GBS.style,
                        FDK8:GBS.style
                    }
            break;
        case "FDK4":
                    buttonHover={
                        FDK1:GBS.style,
                        FDK2:GBS.style,
                        FDK3:GBS.style,
                        FDK4:GBS.styleHover,
                        FDK5:GBS.style,
                        FDK6:GBS.style,
                        FDK7:GBS.style,
                        FDK8:GBS.style
                    }
            break;
        case "FDK5":
                    buttonHover={
                        FDK1:GBS.style,
                        FDK2:GBS.style,
                        FDK3:GBS.style,
                        FDK4:GBS.style,
                        FDK5:GBS.styleHover,
                        FDK6:GBS.style,
                        FDK7:GBS.style,
                        FDK8:GBS.style
                    }
            break;
        case "FDK6":
                    buttonHover={
                        FDK1:GBS.style,
                        FDK2:GBS.style,
                        FDK3:GBS.style,
                        FDK4:GBS.style,
                        FDK5:GBS.style,
                        FDK6:GBS.styleHover,
                        FDK7:GBS.style,
                        FDK8:GBS.style
                    }
            break;
        case "FDK7":
                    buttonHover={
                        FDK1:GBS.style,
                        FDK2:GBS.style,
                        FDK3:GBS.style,
                        FDK4:GBS.style,
                        FDK5:GBS.style,
                        FDK6:GBS.style,
                        FDK7:GBS.styleHover,
                        FDK8:GBS.style
                    }
            break;
        case "FDK8":
                    buttonHover={
                        FDK1:GBS.style,
                        FDK2:GBS.style,
                        FDK3:GBS.style,
                        FDK4:GBS.style,
                        FDK5:GBS.style,
                        FDK6:GBS.style,
                        FDK7:GBS.style,
                        FDK8:GBS.styleHover
                    }
            break;
        case "NONE":
                    buttonHover={
                        FDK1:GBS.style,
                        FDK2:GBS.style,
                        FDK3:GBS.style,
                        FDK4:GBS.style,
                        FDK5:GBS.style,
                        FDK6:GBS.style,
                        FDK7:GBS.style,
                        FDK8:GBS.style
                    }
            break;
        default:
            break;
    }
    return buttonHover;
}

