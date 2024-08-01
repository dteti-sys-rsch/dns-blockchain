"use client";
import React, { useState } from "react";
import { ethers } from "ethers";
import abi from "./DomainService.json";

export const DNSContext = React.createContext();

const { ethereum } = window;

const createDNSContract = () => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const dnsContract = new ethers.Contract(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS, abi.abi, signer);

  return dnsContract;
};

export const DNSProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formDomain, setFormDomain] = useState({ owner: "", domainName: "", A: "", CNAME: "", MX: "", NS: "" });
  const [currentAccount, setCurrentAccount] = useState("");

  const handleChange = (e, name) => {
    setFormDomain((prevState) => ({ ...prevState, [name]: e.target.value }));
  };

  const connectWallet = async () => {
    try {
      if (!ethereum) {
        throw new Error("No Ethereum provider found");
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      const signer = provider.getSigner();
      const account = await signer.getAddress();

      setCurrentAccount(accounts[0]);

      return { provider, signer, account };
    } catch (error) {
      console.log(error);

      throw new Error("No ethereum object");
    }
  };

  const createDomain = async () => {
    try {
      if (ethereum) {
        // const { owner } = currentAccount;
        const { owner, domainName, A, CNAME, MX, NS } = formDomain;
        const dnsContract = createDNSContract();

        // await ethereum.request({
        //   method: "eth_sendTransaction",
        //   params: [{
        //     from: account,
        //     to: addressTo,
        //     gas: "0x5208",
        //     value: parsedAmount._hex,
        //   }],
        // });

        await dnsContract.createDomain(owner, domainName, A, CNAME, MX, NS);

        setIsLoading(true);
        console.log(`Loading - ${dnsHash.hash}`);
        await dnsHash.wait();
        console.log(`Success - ${dnsHash.hash}`);
        setIsLoading(false);

      } else {
        console.log("No ethereum object");
      }
    } catch (error) {
      console.log(error);

      throw new Error("No ethereum object");
    }
  };

  return (
    <DNSContext.Provider
      value={{
        isLoading,
        formDomain,
        handleChange,
        connectWallet,
        createDomain,
      }}
    >
      {children}
    </DNSContext.Provider>
  );
};
