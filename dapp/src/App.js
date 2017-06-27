import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Web3 from 'web3';

var ETH_CLIENT = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

var ValueOwnersContractAddress = '0x13ca64bc9e6555b0eb4cd29142bdff7cf949aa16';
var ValueOwnersContractAbi = [{"constant":true,"inputs":[],"name":"cost","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"kill","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"value","type":"uint256"}],"name":"setCost","outputs":[{"name":"newCost","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"buyValue","outputs":[{"name":"success","type":"bool"}],"payable":true,"type":"function"},{"constant":true,"inputs":[],"name":"payedAmount","outputs":[{"name":"amount","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"account","type":"address"}],"name":"getBalance","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"type":"function"},{"inputs":[],"payable":false,"type":"constructor"},{"payable":false,"type":"fallback"}]
var ValueOwnersContract = ETH_CLIENT.eth.contract(ValueOwnersContractAbi).at(ValueOwnersContractAddress)


class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      costInEther: 0,
      payedAmount: 0,
      defaultAccount: "n/a"
    }
  }
  componentWillMount() {
    // TODO: DEBUG ONLY
    ETH_CLIENT.eth.defaultAccount = '0x974bc6db2c14498efa29cc5a6f852f6290471cc7';
    //ETH_CLIENT.eth.defaultAccount = '0x05d7113e6a78d6baa37fa8c7b239e79565cd3e3e';

    var bigNumberCost = ValueOwnersContract.cost();
    this.setState({costInEther: ETH_CLIENT.fromWei(bigNumberCost,"ether").toString()});
    this.setState( { defaultAccount: ETH_CLIENT.eth.defaultAccount });

    var bigNumberPayedAmount = 0;
    try {
      bigNumberPayedAmount = ValueOwnersContract.payedAmount();
      console.log(ETH_CLIENT.fromWei(bigNumberPayedAmount, "ether"));
    }
    catch (e) {
      console.log(e);
    }

    this.setState({payedAmount: ETH_CLIENT.fromWei(bigNumberPayedAmount, "ether").toString()});
  }

  render() {
    const isPayed = (this.state.payedAmount > 0) ? true : false;

/*    let userBox = null;
    if (isPayed) {
      userBox = <UserBoxPayForm>
    } else {
      userBox = <UserBoxPayed>
    }*/

    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>DApp for EthSmartCvv contract</h2>
        </div>
        <div className="App-intro">
          <br />
          <strong>Current value cost: {this.state.costInEther} Ether</strong>
          <hr />
          Your current account: {this.state.defaultAccount}<br />

          {isPayed ? (
            <div>
              <h1>Payed</h1>
              You already payed: {this.state.payedAmount} Eth
            </div>
          ) : (
            <div>
              <h1>Not payed</h1>
              Please pay to get access
              <input type="number" value={this.state.costInEther} min="0" />
              <button>Pay</button>
            </div>
          )}
        </div>
      </div>
    );
  }
/*
  function UserBoxPayForm(props) {
    return (
      <div>
        <h1>Please pay to get access</h1>
        <input type="number" value="0.01" />
        <button>Pay</button>
      </div>
    );
  }

  function UserBoxPayed(props) {
    return (
      <div>
        <h1>You have already got access</h1>
        <button>Get your treasure</button>
      </div>
    );
  }
*/

}

export default App;
