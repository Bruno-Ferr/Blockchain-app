import { Contract } from "ethers";
import { ethers } from "ethers";
import { createContext, useEffect, useState } from "react";
import { contractABI } from "../utils/Constants.js";
import { ReactNode } from 'react'


export const TransactionContext = createContext({} as any);

const { ethereum } = window;

const getEthereumContract = async () => {
  const provider = new ethers.BrowserProvider(ethereum);
  const signer = await provider.getSigner();
  const transactionContract = new ethers.Contract(process.env.CONTRACT_ADDRESS as string, contractABI, signer);

  console.log({
    provider,
    signer,
    transactionContract
  })
}

interface TransactionProviderProps {
  children: ReactNode
}

export const TransactionProvider = ({children}: TransactionProviderProps) => {
  const [connectedAccount ,setConnectedAccount] = useState()
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

  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])

  return (
    <TransactionContext.Provider value={{ connectWallet }}>
      {children}
    </TransactionContext.Provider>
  )
}