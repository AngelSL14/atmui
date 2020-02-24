import React,{Component} from 'react';
import Button from '../../components/button';
import LogoProsa from '../../components/logoProsa';
import LogoCarnet from '../../components/logoCarnet';
import {getLocalIp} from '../../Lib/services';
import './../stylesViews.css'

class Index extends Component{
    constructor(props){
        super(props);
        this.state={

        }
        this.handleClickIndex=this.handleClickIndex.bind(this);
    }
    componentDidMount(){
        getLocalIp();
    }
     handleClickIndex(){
            const dato="Edwin";
             this.props.history.push('/Dashboard',dato);
    }
    render(){
        return (
                <div id="index">
                    <div id="index-container">
                        <LogoProsa></LogoProsa>
                        {/*<h1>Bienvenido</h1>*/}
                        <Button action={this.handleClickIndex} texto="Toca la Pantalla"></Button>
                        <LogoCarnet id="logoCarnet"></LogoCarnet>
                    </div>
                </div>
        );
    }
}

export default Index;