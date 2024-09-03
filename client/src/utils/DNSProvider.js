"use client";
import React, { useState } from "react";
import { ethers } from "ethers";
import abi from "./DomainService.json";

export const DNSContext = React.createContext();

export const DNSProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formDomain, setFormDomain] = useState({ owner: "", domainName: "", ARecord: "" });
  const [currentAccount, setCurrentAccount] = useState("");
  const [domains, setDomains] = useState([]);

  const handleChange = (e, name) => {
    setFormDomain((prevState) => ({ ...prevState, [name]: e.target.value }));
  };

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        throw new Error("No Ethereum provider found");
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      const signer = provider.getSigner();
      const account = await signer.getAddress();
      const dnsContract = new ethers.Contract(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS, abi.abi, signer);
      console.log(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS)
      setCurrentAccount(accounts[0]);

      const domainEvents = await dnsContract.queryFilter(dnsContract.filters.DomainCreated(null));
      const domains = domainEvents.map((event) => ({
        owner: event.args.owner,
        domainName: event.args.domainName,
        ARecord: event.args.ARecord,
        exist: event.args.exist,
        transactionHash: event.transactionHash, // Store the transaction hash
      }));

      setDomains(domains);
      console.log(domains);

      return { provider, signer, account, dnsContract, domains };
    } catch (error) {
      console.log(error);

      throw new Error("No ethereum object");
    }
  };

  const createDomain = async (dnsContract) => {
    try {
      if (window.ethereum) {
        const owner = currentAccount;
        const { domainName, ARecord } = formDomain;

        console.log({ owner });
        const dnsHash = await dnsContract.createDomain(owner, domainName, ARecord);

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

  const dnsLookup = async (dnsContract, domainName) => {
    try {
      const alamatIP = await dnsContract.domainLookup(domainName);
      return { alamatIP };
      console.log(alamatIP);
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
        domains,
        handleChange,
        connectWallet,
        createDomain,
        dnsLookup,
      }}
    >
      {children}
    </DNSContext.Provider>
  );

};
