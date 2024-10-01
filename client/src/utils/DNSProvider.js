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

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        throw new Error("No Ethereum provider found");
      }
      setIsLoading(true);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      // const accounts = await window.ethereum.request({
      //   method: "eth_requestAccounts",
      // });
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
      console.log(domains);
      return { domains };
    } catch (error) {
      console.log(error);

      throw new Error("No ethereum object");
    }
  }

  const createDomain = async (dnsContract) => {
    try {
      if (window.ethereum) {
        const owner = currentAccount;
        const { domainName, ARecord } = formDomain;

        console.log({ owner });
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
        console.log(currentAccount);
        console.log(owner);
        if (currentAccount == owner) {
          setFormDomain({
            ...formDomain,
            domainName: domainName,
          });
          const { ARecord } = formDomain;
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

  // const updateDomain = async (dnsContract, domainName, owner) => {
  //   try {
  //     if (window.ethereum) {
  //       console.log(currentAccount);
  //       console.log(owner);
        
  //       // Memastikan currentAccount dan owner sama
  //       if (currentAccount === owner) {
  //         // Pastikan formDomain didefinisikan
  //         if (!formDomain || !formDomain.ARecord) {
  //           throw new Error("formDomain atau ARecord tidak terdefinisi");
  //         }
  
  //         const { ARecord } = formDomain; // Mengambil ARecord dari formDomain
          
  //         // Memanggil fungsi updateDomain dari kontrak
  //         const dnsHash = await dnsContract.updateDomain(
  //           owner,
  //           domainName,
  //           ARecord
  //         );
  
  //         setIsLoading(true);
  //         console.log(`Loading - ${dnsHash.hash}`);
  //         await dnsHash.wait();
  //         console.log(`Success - ${dnsHash.hash}`);
  //         setIsLoading(false);
  //       } else {
  //         console.log("Not the owner");
  //       }
  //     } else {
  //       console.log("No ethereum object");
  //     }
  //   } catch (error) {
  //     console.error(error); // Ganti console.log dengan console.error untuk lebih jelas
  //     throw new Error("An error occurred while updating the domain");
  //   }
  // };

  const deleteDomain = async (dnsContract, domainName, owner) => {
    try {
      if (window.ethereum) {
        if (owner == currentAccount) {
          console.log(owner);
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
