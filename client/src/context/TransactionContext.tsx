import { Contract } from "ethers";
import { ethers } from "ethers";
import { ChangeEvent, createContext, useEffect, useState } from "react";
import { contractABI } from "../utils/Constants.js";
import { ReactNode } from 'react'
import 'dotenv';

export const TransactionContext = createContext({} as any);

const { ethereum } = window;

const getEthereumContract = async () => {
  const provider = new ethers.BrowserProvider(ethereum);
  const signer = await provider.getSigner();
  const transactionContract = new ethers.Contract('0x2e0194144A6b972666d221d896560eD4eDcc3784', contractABI, signer);
  console.log(transactionContract)
  return transactionContract
}

interface TransactionProviderProps {
  children: ReactNode
}

export const TransactionProvider = ({children}: TransactionProviderProps) => {
  const [connectedAccount ,setConnectedAccount] = useState('')
  const [formData, setFormData] = useState({addressTo: '', amount: '', keyword: '', message: ''});
  const [isLoading, setIsLoading] = useState(false)
  const [transactionCount, setTransactionCount] = useState(0)

  function handleChange(e: ChangeEvent<HTMLInputElement>, name: string) {
    setFormData((prevState) => ({...prevState, [name]: e.target.value}))
  }
  
  const checkIfWalletIsConnected = async () => {
    if(!ethereum) return alert("Please install metamask");

    const accounts = await ethereum.request({ method: 'eth_accounts' });

    if(accounts.length) {
      setConnectedAccount(accounts[0])

      //Get all transactions
    } else {
      console.log('No accounts found.')
    }

    console.log(accounts)
  }

  const connectWallet = async () => {
    try {
      if(!ethereum) return alert("Please install metamask");

      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });

      setConnectedAccount(accounts[0])
    } catch (error) {

      throw new Error("No Ethereum object.")
    }
  }

  const sendTransaction = async () => {
    try {
      if(!ethereum) return alert("Please install metamask");

      const { addressTo, amount, keyword, message } = formData;
      const transactionContract = await getEthereumContract(); //Pode estar errado pelo tipo Browser e não Web3
      const parsedAmount = ethers.parseEther(amount)

      await ethereum.request({
        method: 'eth_sendTransaction',
        params: [{
          from: connectedAccount,
          to: addressTo,
          gas: '0x5208', // Use GWEI
          value: ethers.hexlify('0x'+parsedAmount),
        }]
      });
      
      const transactionHash = await transactionContract.addToBlockchain( addressTo, amount, keyword, message);

      setIsLoading(true);
      console.log(`loading - ${transactionHash}`);
      await transactionHash.wait();
      setIsLoading(true);
      console.log(`success - ${transactionHash}`);

      const transactionCount = await transactionContract.getTransactionCount();

      setTransactionCount(parseInt(transactionCount))
    } catch (error) {
      throw new Error("No Ethereum object.")
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])

  return (
    <TransactionContext.Provider value={{ connectWallet, connectedAccount, formData, handleChange, sendTransaction }}>
      {children}
    </TransactionContext.Provider>
  )
}