"use client";
import React, { useState } from "react";
import { ethers } from "ethers";
import abi from "./DomainService.json";

export const DNSContext = React.createContext();

export const DNSProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formDomain, setFormDomain] = useState({
    domainName: "",
    ARecord: "",
  });
  const [currentAccount, setCurrentAccount] = useState("");
  const [domains, setDomains] = useState([]);

  const handleInput = (e, name) => {
    setFormDomain((prevState) => ({ ...prevState, [name]: e.target.value }));
  };

  const isValidDomain = (domainName) => {
    const domainRegex = /^(?!\-)([A-Za-z0-9-]{1,63}\.)*[A-Za-z0-9-]{2,63}$/;
    return domainRegex.test(domainName);
  };

  const isValidIP = (ARecord) => {
    const ipRegex =
      /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return ipRegex.test(ARecord);
  };

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        throw new Error("No Ethereum provider found");
      }
      setIsLoading(true);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const signer = provider.getSigner();
      const account = await signer.getAddress();
      const dnsContract = new ethers.Contract(
        process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
        abi,
        signer
      );
      setCurrentAccount(account);

      const allDomains = await dnsContract.getAllDomains();
      const domains = allDomains.map((domain) => ({
        owner: domain.owner,
        domainName: domain.domainName,
        ARecord: domain.ARecord,
        exist: domain.exist,
        transactionHash: domain.transactionHash,
      }));

      setDomains(domains);
      setIsLoading(false);

      return { provider, signer, account, dnsContract, domains };
    } catch (error) {
      console.log(error);

      throw new Error("No ethereum object");
    }
  };

  const fetchDomains = async (dnsContract) => {
    try {
      setIsLoading(true);
      const allDomains = await dnsContract.getAllDomains();
      const domains = allDomains.map((domain) => ({
        owner: domain.owner,
        domainName: domain.domainName,
        ARecord: domain.ARecord,
        exist: domain.exist,
        transactionHash: domain.transactionHash,
      }));

      setDomains(domains);
      setIsLoading(false);
      return { domains };
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

        if (!isValidDomain(domainName)) {
          console.log("Invalid domain name format");
          return;
        }
        if (!isValidIP(ARecord)) {
          console.log("Invalid IP address format");
          return;
        }

        const dnsHash = await dnsContract.createDomain(
          owner,
          domainName,
          ARecord
        );

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

  const domainLookup = async (dnsContract, domainName) => {
    try {
      const alamatIP = await dnsContract.domainLookup(domainName);
      return { alamatIP };
    } catch (error) {
      console.log(error);

      throw new Error("No ethereum object");
    }
  };

  const updateDomain = async (dnsContract, domainName, owner) => {
    try {
      if (window.ethereum) {
        if (currentAccount == owner) {
          setFormDomain({
            ...formDomain,
            domainName: domainName,
          });
          const { ARecord } = formDomain;

          if (!isValidIP(ARecord)) {
            console.log("Invalid IP address format");
            return;
          }

          const dnsHash = await dnsContract.updateDomain(
            owner,
            domainName,
            ARecord
          );

          setIsLoading(true);
          console.log(`Loading - ${dnsHash.hash}`);
          await dnsHash.wait();
          console.log(`Success - ${dnsHash.hash}`);
          setIsLoading(false);
        } else {
          console.log("Not the owner");
        }
      } else {
        console.log("No ethereum object");
      }
    } catch (error) {
      console.log(error);
      console.log(domainName);
      console.log(formDomain);
      throw new Error("No ethereum object");
    }
  };

  const deleteDomain = async (dnsContract, domainName, owner) => {
    try {
      if (window.ethereum) {
        if (owner == currentAccount) {
          const dnsHash = await dnsContract.deleteDomain(owner, domainName);

          setIsLoading(true);
          console.log(`Loading - ${dnsHash.hash}`);
          await dnsHash.wait();
          console.log(`Success - ${dnsHash.hash}`);
          setIsLoading(false);
        }
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
        domains,
        handleInput,
        connectWallet,
        fetchDomains,
        createDomain,
        domainLookup,
        updateDomain,
        deleteDomain,
      }}
    >
      {children}
    </DNSContext.Provider>
  );
};
