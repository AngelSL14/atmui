import React,{Component} from 'react';
import '../stylesSection.css';
import PropsTypes from 'prop-types';
import { SB } from '../../Lib/utils/values';
import {pingpad} from '../../Lib/socketService/socketServices';
import { logic , history , hanlog } from '../../Lib/utils/construction';
import BB from '../../components/BB';

class companias extends Component{
    constructor(props){
        super(props);
        this.state={
                operationComponent:{
                    operationComponent:"COMPANIASCOMPONENT"
                },
                buttonHover:null,
                compania:null,
                capabilities:"00000000",
                typeScreen:"",
                touchFDK:""
            }
        }
        handleChangeState = (state,value)=>{
            this.setState({
                [state]:value
            });
        }
        handleSendSocketCancel = ()=>{
            pingpad.send(JSON.stringify({
                operationComponent:"CANCELPINXFS"
            }));
        }
        componentDidUpdate = ()=>{
            if(this.props.timerMessage===true){
                this.props.modifyState("pantallaAnterior","companiasComponent");
                this.props.history.push('/timerModuleComponent');
            }
        }
        componentWillMount(){
            this.props.modifyState("timerModule",0);
            let c = logic(this.props,pingpad,"COMPANIASCOMPONENT");
            if(c===null || c===undefined){history("",this.props.history);}
            else{this.setState({capabilities:c.capabilities,typeScreen:c.typeScreen,buttonHover:c.buttonHover});
            setTimeout(() => {this.handleLogicComponent();}, 40);}
        }
        handleLogicComponent = ()=>{
            pingpad.send(JSON.stringify({
                operationComponent:"CREATEFDKCLASS",
                activeFDKs:this.state.capabilities,
                typeScreen:this.state.typeScreen
            }));
            let arrayt = {
                texto:[null,null,"unefon","movistar",null,null,"telcel","at&t"],
                F:[null,null,this.wrc,this.wrc,null,null,this.wrc,this.wrc],
                route:[null,null,null,null,null,null,null,null]
            }
            pingpad.onmessage = (msg) =>{
                hanlog(msg.data,this.state.touchFDK,this.props.history,null,null,this.hl,arrayt);
            }
        }

        wrc = (company)=>{
            if(company==="unefon" || company==="movistar" || company==="telcel" || company==="at&t"){
                this.handleSaveCompany(company);
            }else{
                let compania = company.target.textContent;
                this.handleSaveCompany(compania);
            }
        }

        handleSaveCompany = (com)=>{
            this.props.modifyState("compania",com);
            history("numeroTelefonoComponent",this.props.history);
        }

        handleHoverButtom = (fdk) =>{
            let buttons = SB(fdk,this.props.GBS);
            this.setState({
                buttonHover:buttons
            });
        }

        hl = (FDK)=>{
            switch (FDK) {
                case "FDK3FISICO":
                        this.handleHoverButtom("FDK3");
                        this.wrc("unefon");
                    break;
                case "FDK4FISICO":
                        this.handleHoverButtom("FDK4");
                        this.wrc("movistar");  
                    break;
                case "FDK7FISICO":
                        this.handleHoverButtom("FDK7");
                        this.wrc("telcel");
                    break;
                case "FDK8FISICO":
                        this.handleHoverButtom("FDK8");
                        this.wrc("at&t");
                    break;
                case "FDK3TOUCH":
                        this.handleHoverButtom("FDK3");
                        this.handleChangeState("touchFDK",FDK);
                        this.handleSendSocketCancel();
                    break;
                case "FDK4TOUCH": 
                        this.handleHoverButtom("FDK4");
                        this.handleChangeState("touchFDK",FDK);
                        this.handleSendSocketCancel();
                    break;
                case "FDK7TOUCH":
                        this.handleHoverButtom("FDK7");
                        this.handleChangeState("touchFDK",FDK);
                        this.handleSendSocketCancel();
                    break;
                case "FDK8TOUCH":
                        this.handleHoverButtom("FDK8");
                        this.handleChangeState("touchFDK",FDK);
                        this.handleSendSocketCancel();
                    break;
                default:
                    break;
            }
        }

        render(){
            return(
                <BB chain={this.state.capabilities} buttonHover={this.state.buttonHover} onMouse={this.handleHoverButtom} action={this.hl} texto={[null,null,"Unefon","Movistar",null,null,"Telcel","AT&T"]} component={<h1>Seleccioné la compañía telefónica</h1>}/>
            );
        };
}

companias.defaultProps={
    tipoTarjeta:null,nip:null,ip:null,track:null,token:null
}
companias.PropsTypes={
    tipoTarjeta:PropsTypes.string.isRequired,
    nip:PropsTypes.string.isRequired,
    ip:PropsTypes.string.isRequired,
    track:PropsTypes.string.isRequired,
    token:PropsTypes.string.isRequired
}

export default companias;