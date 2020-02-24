import React,{ Component } from 'react';

class ST extends Component{
    constructor(props){
        super();
        this.state={
            //number AMOUNT OF SQUARES IN THE COMPONENT
            //id IDENTIFICATOR OF THE MAIN COMPONENT
            //idE IDENTIFICATOR OF EACH COMPONENT
            //value STATE VALUE OF THE FATHER STRING COMPONENT
        }
    }
    render(){
        let ev = [];
        for(let i=0;i<=this.props.number-1;i++){
            let row = <div id={`${this.props.idE}${i+1}`}><span>{this.props.value.substring(i,i+1)}</span></div>;
            ev.push(row);
        }
        return(
            <div id={`${this.props.id}`}>
                {ev}
            </div>
        );
    }
}

export default ST;