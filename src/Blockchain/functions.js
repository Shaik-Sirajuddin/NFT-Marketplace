import {ethers} from 'ethers'


import{
    nftContractAddress,
    marketplaceContractAdress,
    nftContractABI,
    marketplaceABI,
    walletAddress,
    connectedChainId,
    handleAccountChange
} from './config.js'
 const ethereum = window.ethereum
//const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')


export function connect(addressChange) {
    ethereum
      .request({ method: 'eth_requestAccounts' })
      .then((accounts)=>{
          handleAccountChange(accounts)
         if(accounts.length>0){
            addressChange(accounts[0])
         }   
       })
      .catch((err) => {
        if (err.code === 4001) {
          alert('Please connect to MetaMask.');
        } else {
          alert(err);
        }
      });
}