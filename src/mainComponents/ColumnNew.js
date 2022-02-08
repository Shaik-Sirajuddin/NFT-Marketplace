import React, { Component } from "react";
import Clock from "../components/components/Clock";
import { ethers } from 'ethers'
import axios from 'axios'
import Web3Modal, { getChainId } from "web3modal"
import { Link } from "@reach/router";

import {
    nftContractAddress,
    marketplaceContractAdress,
    nftContractABI,
    marketplaceABI,
    walletAddress,
    connectedChainId
} from '../Blockchain/config'

export default class Responsive extends Component {

    nftsList = []

    constructor(props) {
        super(props);
        let isHome = props.home
        this.state = {
            nfts: this.nftsList.slice(0, 8),
            height: 0
        };
        this.fectchAndLoadNfts(isHome)
        this.onImgLoad = this.onImgLoad.bind(this);
    }
    async fetchMarketItems(){
          
        let provider = ethers.getDefaultProvider('rinkeby');
        const tokenContract = new ethers.Contract(nftContractAddress, nftContractABI, provider)
        const marketContract = new ethers.Contract(marketplaceContractAdress, marketplaceABI, provider)
        const data = await marketContract.fetchMarketItems()
        const items = await Promise.all(data.map(async i => {
            const tokenUri = await tokenContract.tokenURI(i.tokenId)
            const meta = await axios.get(tokenUri)
            let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
            let item = {
              price,
              itemId: i.itemId.toNumber(),
              seller: i.seller,
              owner: i.owner,
              image: meta.data.image,
              name: meta.data.name,
              description: meta.data.description,
            }
            return item
          }))
          this.nftsList = items
        this.setState({
            nfts: this.nftsList.slice(0, 8),
        });
        
    }
    async fecthMyAssets(){
        const web3Modal = new Web3Modal({
            network: "mainnet",
            cacheProvider: true,
          })
    
          const connection = await web3Modal.connect()
          const provider = new ethers.providers.Web3Provider(connection)
          const signer = provider.getSigner()
          const { chainId } = await provider.getNetwork()
          if(chainId!=4){
              alert("You are connected to wrong network! Please switch your connection to rinkeby testnetwork")
             return
            }
          
          const tokenContract = new ethers.Contract(nftContractAddress, nftContractABI, signer)
          const marketContract = new ethers.Contract(marketplaceContractAdress, marketplaceABI, signer)
          const data = await marketContract.fetchMyNFTs()
          if(!data){
              this.setState({
                  nfts:[]
              })
              return
          } 
          const items = await Promise.all(data.map(async i => {
            const tokenUri = await tokenContract.tokenURI(i.tokenId)
            const meta = await axios.get(tokenUri)
            let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
            let item = {
              price,
              tokenId: i.tokenId.toNumber(),
              seller: i.seller,
              owner: i.owner,
              image: meta.data.image,
            }
            return item
          }))
          this.nftsList = items
          this.setState({
              nfts: this.nftsList.slice(0, 8),
          });

    }
    async fectchAndLoadNfts(home){
        if(home){
            await this.fetchMarketItems()
        }
        else{
            await this.fecthMyAssets()
        }
    }
    loadMore = () => {
        let nftState = this.state.nfts
        let start = nftState.length
        let end = nftState.length + 4
        this.setState({
            nfts: [...nftState, ...(this.nftsList.slice(start, end))]
        });
    }

    onImgLoad({ target: img }) {
        let currentHeight = this.state.height;
        if (currentHeight < img.offsetHeight) {
            this.setState({
                height: img.offsetHeight
            })
        }
    }
    render() {
        return (
            <div className='row'>
                <div className="my-3">Explore </div>
                {this.state.nfts.map((nft, index) => (
                    <div key={index} className="d-item col-lg-3 col-md-6 col-sm-6 col-xs-12 mb-4">
                        <Link to='/ItemDetail' state={{ from:nft }}>
                        <div className="nft__item m-0">
                           
                            {/* <div className="author_list_pp">
                                <span onClick={() => window.open(nft.authorLink, "_self")}>
                                    <img className="lazy" src={nft.authorImg} alt="" />
                                    <i className="fa fa-check"></i>
                                </span>
                            </div> */}
                            <div className="nft__item_wrap" style={{ height: `${this.state.height}px` }}>
                                <span>
                                    <img onLoad={this.onImgLoad} src={nft.image} className="lazy nft__item_preview" alt="" />
                                </span>
                            </div>
                            <div className="nft__item_info">
                                <Link to='/ItemDetail' state={{ from:nft }}>
                                    <span>
                                        <h4>{nft.name}</h4>
                                    </span>
                                </Link>
                                <div className="nft__item_price">
                                    {nft.price + " ETH"} 
                                </div>
                                <div className="nft__item_action" style={{"marginBlock":15}}>
                                    <span onClick={() => window.open(nft.bidLink, "_self")}>Buy now </span>
                                
                                </div>
                                
                                
                            </div>
                        </div>
                        </Link>
                    </div>
                ))}
                {this.state.nfts.length !== this.nftsList.length &&
                    <div className='col-lg-12'>
                        <div className="spacer-single"></div>
                        <span onClick={() => this.loadMore()} className="btn-main lead m-auto">Load More</span>
                    </div>
                }
            </div>
        );
    }
}