import React,{Component} from 'react';
import cloud from '../assets/img/cloud.svg';
import './main.css';
class GenericImg extends Component{
    constructor(props){
        super(props);
        this.state={

        }
    }
    render(){
        if(this.props.img==="cloud") {
                    return(
                        <div>
                            <img id="cloud" src={cloud} alt={"cloud"}></img>
                        </div>
                    );
        }
    }
}

export default GenericImg;