"use client";
import { useContext, useState } from "react";
import { DNSContext } from "@/utils/DNSProvider";
import Navbar from "@/components/Navbar";
import About from "@/components/About";
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
  const [namaDomain, setNamaDomain] = useState("");
  const [alamatIP, setAlamatIP] = useState("");

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
      setAlamatIP(alamatIP);
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
            handleInput={handleInput}
            handleCreate={handleCreate}
            handleUpdate={(domainName) => handleUpdate(domainName)}
            handleLookup={handleLookup}
            handleDelete={(domainName) => handleDelete(domainName)}
          />
        ) : (
          <About loading={isLoading} connectWallet={connect} />
        )}
        {/* 
        <input
          type="text"
          placeholder="Nama domain"
          onChange={(e) => {
            setNamaDomain(e.currentTarget.value);
          }}
          className="my-2 w-full rounded-sm p-2 bg-transparent text-black text-sm border"
        />
        <button onClick={() => handleLookup(namaDomain)}>
          dns lookup
        </button>
        <p>
          alamat IP web {namaDomain}: {alamatIP}
        </p>

        <input
          type="text"
          placeholder="Nama domain"
          onChange={(e) => {
            setNamaDomain(e.currentTarget.value);
          }}
          className="my-2 w-full rounded-sm p-2 bg-transparent text-black text-sm border"
        />
        <button onClick={() => handleDelete(namaDomain)}>
          delete domain
        </button> */}
      </div>
    </>
  );
}
