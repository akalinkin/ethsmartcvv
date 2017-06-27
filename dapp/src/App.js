import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import web3 from 'web3';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>DApp for EthSmartCvv contract</h2>
        </div>
        <p className="App-intro">
          Info will be here.

          Form which will ask smart contract about current treasure cost and
          button toggled to "Buy" if current user was not payed before or
          toggled to "Get" if current user already payed
        </p>
      </div>
    );
  }
}

export default App;
