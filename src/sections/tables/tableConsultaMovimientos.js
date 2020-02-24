import React,{Component} from 'react';

let id = 0;
function createData(cadena) {
  id += 1;
  return { id, cadena};
}

class tableConsultaMovimientos extends Component{
    constructor(props){
        super(props);
        this.state={
            data:null
        }
    }
    componentWillMount(){
        const rows= this.props.final.map((row)=>{
            return createData(row)
        });
        const table = rows.map(row =>{
          return <tr key={`t${row.id}`}>
                      <th key={`s${row.id}`}>{row.cadena}</th>
                </tr>
        });
        this.setState({
            data:table
        });
    }

    render(){
      return (
        <table id="movimientos-table">
              <tbody id="body">
                  {this.state.data}
              </tbody>
        </table>
      );
    }
}

export default tableConsultaMovimientos;