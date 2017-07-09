import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Web3 from 'web3';

var ETH_CLIENT;

var ValueOwnersContractAddress = '0xe71455506b9e94d3476290963784a2522aebaf97';
var ValueOwnersContract;
var ValueOwnersContractAbi = [{"constant":true,"inputs":[],"name":"cost","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"kill","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"value","type":"uint256"}],"name":"setCost","outputs":[{"name":"newCost","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"buyValue","outputs":[{"name":"success","type":"bool"}],"payable":true,"type":"function"},{"constant":true,"inputs":[],"name":"payedAmount","outputs":[{"name":"amount","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"account","type":"address"}],"name":"getBalance","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"type":"function"},{"inputs":[],"payable":false,"type":"constructor"},{"payable":false,"type":"fallback"}]
var userAccount;

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isTestNet: false,
      costInEther: 0,
      payedAmount: 0,
      defaultAccount: "n/a",
      amountToPay: 0,
    }
  }

  componentWillMount() {

  }

  componentDidMount() {
    if (typeof window.web3 !== 'undefined') {
      // Use Mist/MetaMask's provider
      window.web3 = new Web3(window.web3.currentProvider);
      ETH_CLIENT = window.web3;
      ETH_CLIENT.eth.defaultAccount = ETH_CLIENT.eth.accounts[0];
      userAccount = ETH_CLIENT.eth.accounts[0];
    } else {
      this.setState("isTestNet": true);
      console.log('No web3? You should consider trying MetaMask!')
      // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
      window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
      ETH_CLIENT = window.web3;
      ETH_CLIENT.eth.defaultAccount = '0xe40dda638eca59f931de8ee0b35adcce20d7b87c';
    }

    ValueOwnersContract = ETH_CLIENT.eth.contract(ValueOwnersContractAbi).at(ValueOwnersContractAddress);

    var bigNumberCost = 0;
    ValueOwnersContract.cost({form: userAccount},(error,result) => {
      if(!error) {
        bigNumberCost = result;

        this.setState({costInEther: ETH_CLIENT.fromWei(bigNumberCost,"ether").toString()});
        this.setState({amountToPay: ETH_CLIENT.fromWei(bigNumberCost,"ether").toString()});
      }
      else {
        console.error(error);
      }
    });

    this.setState({defaultAccount: userAccount });

    this.refreshPayedAmount = this.getPayedAmount.bind(this);
    this.refreshAccount = this.refreshAccountHandler.bind(this);

    this.refreshPayedAmount();
    this.refreshAccountHandler();

    var accountInterval = setInterval(this.refreshAccount, 300);
  }

  refreshAccountHandler() {
    // console.log('accountInterval', ETH_CLIENT.eth.defaultAccount);
    if (ETH_CLIENT.eth.accounts[0] !== userAccount) {
      userAccount = ETH_CLIENT.eth.accounts[0];
      this.setState({defaultAccount: userAccount });
      this.refreshPayedAmount();
    }
  }

  getPayedAmount() {
    var bigNumberPayedAmount = 0;

    ValueOwnersContract.payedAmount({from: userAccount},(error,result) => {
      if(!error) {
        console.log('getPayedAmount success', result);
        bigNumberPayedAmount = result;
        this.setState({payedAmount: ETH_CLIENT.fromWei(bigNumberPayedAmount, "ether").toString()});
      }
      else {
        console.error('getPayedAmount error',error);
      }
    });
  }

  amountChange(e) {
    this.setState({amountToPay: e.target.value});
  }

  pay() {
    console.log('pay clicked', 'Amount:', this.state.amountToPay);
    var amountInWei = ETH_CLIENT.toWei(this.state.amountToPay,"ether");
    console.log('amountInWei', amountInWei);
    ValueOwnersContract.buyValue.sendTransaction({from: userAccount, value: amountInWei},
      (error,result) => {
        if(!error) {
          this.refreshPayedAmount();
          // TODO: Send success message
          console.log('Pay success:', result);
        }
        else {
          // TODO: Send error message
          // TODO: Process Tx Signature (UserDenied, etc)
          console.error('Pay error', error);
        }
      }
    );
    //console.log('tx',tx);
  }

  render() {
    const isPayed = (this.state.payedAmount > 0) ? true : false;
    var isTestNet = this.state.isTestNet;
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Get my CV</h2>
        </div>
        <div className="App-intro">
          <br />
          <p>Current CV access cost id <strong>{this.state.costInEther}</strong> Ether</p>


          {isPayed ? (
            <div>
              <h1>Successfully payed</h1>
              You already payed: {this.state.payedAmount} Eth
            </div>
          ) : (
            <div>
              <h1>Not payed</h1>
              Please pay to get access

              <input type="number" name="amount" value={this.state.amountToPay} onChange={this.amountChange.bind(this)} min="0" />
              <button onClick={this.pay.bind(this)}>Pay</button>
            </div>
          )}

          <hr />
          <h4>Addintional info:</h4>
          {isTestNet ? (
            <div class="text-warning">No web3? You should consider trying MetaMask!</div>
          ) : (
            <div class="text-success">Mist Metamask detected. Congrats - you are connected to blockchain!</div>
          )}
          <br />
          Your current account: {this.state.defaultAccount}
        </div>
      </div>
    );
  }
}

export default App;
