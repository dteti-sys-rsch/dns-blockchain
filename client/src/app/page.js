"use client";
import { useContext, useState } from "react";
import { DNSContext } from "@/utils/DNSProvider";
import Navbar from "@/components/Navbar";
import About from "@/components/Home";
import Dashboard from "@/components/Dashboard";

export default function Home() {
  const {
    isLoading,
    handleInput,
    connectWallet,
    fetchDomains,
    createDomain,
    domainLookup,
    updateDomain,
    deleteDomain,
  } = useContext(DNSContext);

  const [account, setAccount] = useState(null);
  const [dnsContract, setDnsContract] = useState(null);
  const [domains, setDomains] = useState([]);
  const [address, setAddress] = useState("");

  const connect = async () => {
    try {
      const { account, dnsContract, domains } = await connectWallet();
      setAccount(account);
      setDnsContract(dnsContract);
      setDomains(domains);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreate = async () => {
    createDomain(dnsContract);
    const { domains } = await connectWallet();
    setDomains(domains);
  };

  const handleFetch = async () => {
    const { domains } = await fetchDomains(dnsContract);
    setDomains(domains);
  };

  const handleLookup = async (domainName) => {
    try {
      console.log(domainName);
      const { alamatIP } = await domainLookup(dnsContract, domainName);
      setAddress(alamatIP);
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdate = async (domainName) => {
    try {
      updateDomain(dnsContract, domainName, account);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (domainName) => {
    try {
      console.log(domainName);
      await deleteDomain(dnsContract, domainName, account);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <Navbar
        loading={isLoading}
        connectWallet={connect}
        handleFetch={handleFetch}
        account={account}
      />
      <div className="flex flex-col bg-white w-full min-h-screen p-20 text-black gap-6">
        {account ? (
          <Dashboard
            domains={domains}
            address={address}
            handleInput={handleInput}
            handleCreate={handleCreate}
            handleUpdate={(domainName) => handleUpdate(domainName)}
            handleLookup={(domainName) => handleLookup(domainName)}
            handleDelete={(domainName) => handleDelete(domainName)}
          />
        ) : (
          <About loading={isLoading} connectWallet={connect} />
        )}
      </div>
    </>
  );
}
