import React, { Component } from 'react';
import Dashboard from './views/Dashboard';
//import {BrowserRouter as Router,Route} from 'react-router-dom';
import {HashRouter  as Router} from 'react-router-dom';
import {getLocalIp,localIp} from './Lib/services';
import './App.css';

class App extends Component {
  constructor(props){
      super(props);
      this.state={
          ip:null
      }
  }
   componentWillMount(){
        getLocalIp();
        setTimeout(() => {
            getLocalIp();
            getLocalIp();
            console.log(localIp);
            this.setState({
                ip:localIp
            });
        }, 2000);
   }
  render() {
    if(this.state.ip!==null){
        return (
          <Router>
                <div>
                    <Dashboard history={this.props.history} ip={this.state.ip}/>
                </div>
          </Router>
        );
    }else{
      return null
    }
  }
}

export default App;
