import React, { Component } from 'react'
import {COWTRIAL_ABI, COWTRIAL_ADDRESS} from './config'
import Web3 from 'web3'
import App from './App.js'
import detectEthereumProvider from '@metamask/detect-provider';
import { thistle } from 'color-name';


class NFTFetcher extends Component {
    constructor(props) {
        super(props)
        this.state = {account: ''}
        this.state = {contract: ''}
        this.state = {
            AssetAttributes: []
        }
        
    }


    async handleAttributes(tokenID) {
    
        let attributes;
        try {
          attributes = await this.getAttributes(parseInt(tokenID))
        } catch (err) {
          console.log(err)
        }

        console.log(attributes)
        return attributes
    
      }

    

    async getAllNFTs() {
        let assets;
        const AppProps = await this.props.getAppProps();
        
        const account1 = AppProps[1];
        const contract1 = AppProps[0];
        console.log(account1, contract1)
        this.setState({contract: contract1})
        this.setState({account: account1})
        
        console.log(this.state.contract)
        assets = await contract1.methods.tokensOfOwner(this.state.account).call(function (err, res) {
        if (err) {
            console.log("An Error has occured", err);
            return
        }
        console.log("The Tokens are", res);
              //owner = res
        });


        console.log("assets:" + assets)
        //this.setState({Assets: assets})
        let returnedAssets;
        let assetJSON = [];
        for (let i = 0; i < assets.length; i++) {
            returnedAssets = await this.handleAttributes(assets[i]);
            let text = "Asset" + (i+1);
            console.log(text)
            let nft1 = `{"Number": ${i+1}, "NLIS": "${returnedAssets[0]}", 
                "PIC": "${returnedAssets[1]}",  
                "DNAHash": "${returnedAssets[2]}",
                "Owner": "${returnedAssets[3]}",
                "TokenID": "${assets[i]}"
            }`;
            console.log(nft1)
            const obj = JSON.parse(nft1);
            assetJSON.push(obj)
           
        }
        console.log(assetJSON)
        this.setState({AssetAttributes: assetJSON})
        console.log(this.state.AssetAttributes)

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
            //console.log("The DNAHash is", res);
            //owner = res
          })
        
    
    
        attributes = await this.state.contract.methods.DNAHashToAttributes(DNAHash).call(function (err, res) {
          if (err) {
            console.log("An Error has occured", err);
            return
            }
            //console.log("The Owner is", res);
            //owner = res
          })
          
        return attributes
    }
    
    

    render() {
        return (
            <div className="container1">
                <h1>MY ASSETS:</h1>
                <div className="buttonWrapper">
                <button onClick={this.getAllNFTs.bind(this)}>Get My Assets</button>
                </div>
                <div>
                    {this.state.AssetAttributes.map((attribute, index)=>(
                        <p key={index}>
                            Number: {attribute.Number} 
                            <br />
                            TokenID: {attribute.TokenID}
                            <br />
                            NLIS: {attribute.NLIS}
                            <br />
                            PIC: {attribute.PIC}
                            <br/>
                            DNAHash: {attribute.DNAHash}
                            <br/>
                            Owner: {attribute.Owner}
                            <br />
                            ------------------------------------------------------------------------------------------------------------
                        </p>
                        
                    ))}
                </div>
                
            </div>
        )
    }
}
export default NFTFetcher;
