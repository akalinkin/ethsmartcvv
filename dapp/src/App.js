import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

var ETH_CLIENT = window.web3;

var ValueOwnersContractAddress = '0xb00238e63f9db77d8c38baa9beb6d68a8a6befb7';
var ValueOwnersContract;
var ValueOwnersContractAbi = [{"constant":true,"inputs":[],"name":"cost","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"kill","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"value","type":"uint256"}],"name":"setCost","outputs":[{"name":"newCost","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"buyValue","outputs":[{"name":"success","type":"bool"}],"payable":true,"type":"function"},{"constant":true,"inputs":[],"name":"payedAmount","outputs":[{"name":"amount","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"account","type":"address"}],"name":"getBalance","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"type":"function"},{"inputs":[],"payable":false,"type":"constructor"},{"payable":false,"type":"fallback"}]
var userAccount;

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isWeb3: false,
      costInEther: 0,
      payedAmount: 0,
      defaultAccount: "n/a",
      amountToPay: 0,
    }
  }

  componentDidMount() {
    if (typeof window.web3 !== 'undefined') {
      this.setState({isWeb3: true});

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

      setInterval(this.refreshAccount, 300);

      // ETH_CLIENT.eth.filter('latest', function(error, result){
      //   if (!error) {
      //     console.log('Filter:latest');
      //     var curAmount = this.state.payedAmount;
      //     this.refreshPayedAmount();
      //     var newAmount = this.state.payedAmount;
      //
      //     console.log("prevAmount:", curAmount, "newAmount", newAmount);
      //   } else {
      //     console.error(error)
      //   }
      // });
    }
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
          // TODO: Show: Your transaction sended
          // TODO: Whait for transaction block mined event
          // TODO: Refresh payedAmount() and show success message
          console.log('Pay success:', result);
          //console.log('tx',tx);
        }
        else {
          // TODO: Send error message
          // TODO: Process Tx Signature (UserDenied, etc)
          console.log('Pay error', error);
        }
      }
    );
  }

  render() {
    const isPayed = (this.state.payedAmount > 0) ? true : false;
    const isWeb3 = this.state.isWeb3;
    //console.log(isWeb3, isPayed);

    var payedPartial;
    if (isPayed) {
      payedPartial = (
        <div>
          <h1>Successfully payed</h1>
          You already payed: {this.state.payedAmount} Eth
        </div>
      )
    } else {
      payedPartial = (
        <div>
          <h1>Not payed</h1>
          Please pay to get access

          <input type="number" name="amount" value={this.state.amountToPay} onChange={this.amountChange.bind(this)} min="0" />
          <button onClick={this.pay.bind(this)}>Pay</button>
        </div>
      )
    }

    var partial;

    if (isWeb3) {
      partial = (
        <div>
          <p>Current CV access cost id <strong>{this.state.costInEther}</strong> Ether</p>
          {payedPartial}
          <hr />
          <h4>Addintional info:</h4>

          <div className="text-success">Mist Metamask detected. Congrats - you are connected to blockchain!</div>
          <br />
          Your current account: {this.state.defaultAccount}
        </div>
      )
    } else {
      partial = <div className="text-warning">
      <h1>No web3? You should consider trying MetaMask!</h1>
      <p>Description how to install and use MetaMask</p>
      </div>
    }

    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Get my CV</h2>
        </div>
        <div className="App-intro">
        {partial}
        </div>
      </div>
    );
  }
}

export default App;
