import React, { Component } from 'react'
import {COWTRIAL_ABI, COWTRIAL_ADDRESS} from './config'
import Web3 from 'web3'
import './App.css'
import detectEthereumProvider from '@metamask/detect-provider';




class App extends Component {
  componentWillMount() {
    this.loadBlockchainData()
  }

  async loadBlockchainData() {
    const provider = await detectEthereumProvider();
    //console.log(provider)
    const web3 = new Web3(provider);
    let getAccount = await window.ethereum.request({ method: 'eth_requestAccounts' });
    this.setState({account: getAccount[0]});

    const CowContract = new web3.eth.Contract(COWTRIAL_ABI, COWTRIAL_ADDRESS);
    
    this.setState({CowContract});
    CowContract.methods.TokenIDToOwner(1).call(function (err, res) {
      if (err) {
        console.log("An Error has occured", err);
        return
      }
      console.log("The Owner is", res);
    })
  }
    

    //console.log(CowContract);



  



  constructor(props) {
    super(props)
    this.state = { account: '' }
  }

  render() {
    return (
      <div className="container">
        <h1>Hello, World!</h1>
        <p>Your account: {this.state.account}</p>
      </div>
    );
  }
}

export default App;