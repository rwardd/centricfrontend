import React, { Component } from 'react'
import {COWTRIAL_ABI, COWTRIAL_ADDRESS} from './config'
import Web3 from 'web3'
import './App.css'
import detectEthereumProvider from '@metamask/detect-provider';
import { thistle } from 'color-name';

const METAMASK_PUBLIC_KEY = process.env.METAMASK_PUBLIC_KEY;
const METAMASK_PRIVATE_KEY = process.env.METAMASK_PRIVATE_KEY;



class App extends Component {

  constructor(props) {
    super(props)
    this.state = { account: '' }
    
    this.state = {value: ''}
    this.state = {attributeValue: ''}
    this.state = {ownerAccount: ''}
    this.state = {Attributes: []}
    this.state = {mintNLIS: ''}
    this.state = {mintPIC: ''}
    this.state = {mintDNAHASH: ''}
    this.state = {mintADDRESS: ''}
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleMintInputChange = this.handleMintInputChange.bind(this)

  }

  componentWillMount() {
    this.loadBlockchainData()
    document.body.style.backgroundColor = "darkgrey"
    console.log(METAMASK_PRIVATE_KEY, METAMASK_PUBLIC_KEY)
  }

  async loadBlockchainData() {
    const provider = await detectEthereumProvider();
    //console.log(provider)
    const web3 = new Web3(provider);
    let getAccount = await window.ethereum.request({ method: 'eth_requestAccounts' });
    this.setState({account: getAccount[0]});
    //console.log(this.state.account)

    const CowContract = new web3.eth.Contract(COWTRIAL_ABI, COWTRIAL_ADDRESS);
    
    this.setState({contract: CowContract});
    
  }
    
  async getTokenOwner(tokenID) {
    //console.log(this.state)
    let owner;
    if (tokenID == "") {
      return 0
    }
    owner = await this.state.contract.methods.TokenIDToOwner(tokenID).call(function (err, res) {
    if (err) {
      console.log("An Error has occured", err);
      return
      }
      console.log("The Owner is", res);
      //owner = res
    })

    //console.log(owner)
    return owner

  }

  async handleChange(event) {
    let owner;
    try {
      owner = await this.getTokenOwner(parseInt(event.target.value))
    } catch (err) {
      console.log(err)
    }
    console.log(owner)
    this.setState({ownerAccount: owner})
  }

  async handleAttributes(event) {
    
    let attributes;
    try {
      attributes = await this.getAttributes(parseInt(event.target.value))
    } catch (err) {
      console.log(err)
    }
    this.setState({NLIS: attributes[0]})
    this.setState({PIC: attributes[1]})
    this.setState({DNAHASH: attributes[2]})
    this.setState({OWNER: attributes[3]})
    
    

  }

  handleSubmit(event) {
    //alert("The owner is " + this.state.ownerAccount);
    event.preventDefault()
  }

  async getAttributes(tokenID) {
    let attributes;
    if (tokenID == "") {
      return 0;
    }

    const DNAHash = await this.state.contract.methods.TokenIDToDNAHash(tokenID).call(function (err, res) {
      if (err) {
        console.log("An Error has occured", err);
        return
        }
        console.log("The DNAHash is", res);
        //owner = res
      })
    


    attributes = await this.state.contract.methods.DNAHashToAttributes(DNAHash).call(function (err, res) {
      if (err) {
        console.log("An Error has occured", err);
        return
        }
        console.log("The Owner is", res);
        //owner = res
      })
      
      return attributes
  }

  handleMintInputChange(event) {
    const value = event.target.value;
    const name = event.target.name;

    this.setState({
      [name]: value
    })
  }

  async handleCreation(event){
    const NLIS = this.state.mintNLIS;
    const PIC = this.state.mintPIC;
    const DNAHash = this.state.mintDNAHASH;
    const owner = this.state.mintADDRESS;

    const mint = await this.state.contract.methods.mintNFT(NLIS, PIC, DNAHash, owner).send({
      from: this.state.account,
      to: "0x62Ae2D6804496CB238288BF47C3bC5912025461F",
      gasPrice: '20000000000'
    })
    console.log(mint)
    
  }

 

  render() {
    return (
      <div className="container">
        
        <h1>Centric Trial Contract</h1>
        <p>Your MetaMask account: {this.state.account}</p>
        <div className="getOwners">
          <form onSubmit={this.handleSubmit}>
            <label>
              TokenID:
              <input type="text" value={this.state.value} onChange={this.handleChange}/>
            </label>
            <input type="submit" value="Submit"/>
          </form>
          <p>Token Owner: {this.state.ownerAccount}</p>

        </div>
        <div className="getOwners">
          <form onSubmit={this.handleSubmit}>
            <label>
              Get Attributes from tokenID:
              <input type="text" value={this.state.attributeValue} onChange={this.handleAttributes.bind(this)}/>
            </label>
            <input type="submit" value="Submit"/>
          </form>
          <p>ATTRIBUTES</p>
          <p>NLIS: {this.state.NLIS} </p>
          <p>PIC: {this.state.PIC}</p>
          <p>DNAHASH: {this.state.DNAHASH}</p>
          <p>OWNER: {this.state.OWNER}</p>
        </div>
        <div>
          <h3>MINT TOKEN</h3>
          <form onSubmit={this.handleCreation.bind(this)}>
            <label>
              NLIS:  &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
              <input name="mintNLIS" type="text" value={this.state.mintNLIS} onChange={this.handleMintInputChange}/>
            </label>
            <br></br>
            <label>
              PIC: &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp;
              <input name="mintPIC" type="text" value={this.state.mintPIC} onChange={this.handleMintInputChange}/>
            </label>
            <br></br>
            <label>
              DNAHASH:
              <input name="mintDNAHASH" type="text" value={this.state.mintDNAHASH} onChange={this.handleMintInputChange}/>
            </label>
            <br></br>
            <label>
              OWNER: &nbsp; &nbsp;&nbsp;
              <input name="mintADDRESS" type="text" value={this.state.mintADDRESS} onChange={this.handleMintInputChange}/>
            </label>
            <br></br>
            <input type="submit" value="MINT"/>
          </form>

        </div>


      </div>
    );
    }
  }


export default App;