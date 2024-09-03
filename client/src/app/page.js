"use client";
import { useContext, useState } from "react";
import { Button } from "@nextui-org/react";
import { DNSContext } from "@/utils/DNSProvider.js";

const Input = ({ placeholder, name, type, value, handleChange }) => <input placeholder={placeholder} type={type} step="0.0001" value={value} onChange={(e) => handleChange(e, name)} className="my-2 w-full rounded-sm p-2 bg-transparent text-black text-sm border" />;

export default function Home() {
  const { isLoading, formDomain, handleChange, connectWallet, createDomain, dnsLookup } = useContext(DNSContext);
  const [account, setAccount] = useState(null);
  const [dnsContract, setDnsContract] = useState(null);
  const [domains, setDomains] = useState([]);
  const [namaDomain, setNamaDomain] = useState("");
  const [alamatIP, setAlamatIP] = useState("");
  const handleInput = (e) => {
    const fieldName = e.target.name;
    const fieldValue = e.target.value;

    setFormData((prevState) => ({
      ...prevState,
      [fieldName]: fieldValue,
    }));
  };

  // const [formDomain, setFormDomain] = useState({ owner: "", domainName: "", A: "", CNAME: "", MX: "", NS: "" });
  const { owner, domainName, A, CNAME, MX, NS } = formDomain;
  // const handleChange = (e) => {
  //   setFormDomain((prevState) => ({ ...prevState, [e.target.name]: e.target.value }));
  // };
  const handleSubmit = (e) => {
    const { owner, domainName, A, CNAME, MX, NS } = formDomain;

    // if (!domainName || !A || !CNAME || !MX || !NS) {
    //   alert("Please fill all the fields");
    //   return;
    // }

    createDomain(dnsContract);
  };

  const connect = async () => {
    try {
      const { account, dnsContract, domains } = await connectWallet();
      setAccount(account);
      setDnsContract(dnsContract);
      setDomains(domains);
      // fetchDomain(dnsContract, account);
    } catch (e) {
      console.error(e);
    }
  };

  const cariDNS = async (dnsContract, namaDomain) => {
    try {
      const { alamatIP } = await dnsLookup(dnsContract, namaDomain);
      setAlamatIP(alamatIP);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchDomain = async (dnsContract, account) => {
    try {
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
    } catch (e) {
      console.error(e);
    }
  };

  // const dnsLookup = async (dnsContract, namaDomain) => {
  //   try {
  //     const a = await dnsContract.dnsLookup(namaDomain);
  //     console.log(a);
  //     console.log(namaDomain)
  //     console.log(dnsContract.dnsLookup)
  //   } catch (e) {
  //     console.error(e);
  //   }
  // };

  // useEffect(() => {
  //   const init = async () => {
  //     try {
  //       const { dnsContract } = await connectWallet();
  //       setDnsContract(dnsContract);

  //       fetchPurchasedListings(token, account);
  //       fetchSoldListings(token, account);
  //     } catch (error) {
  //       toast.error(error.message);
  //     }
  //   };
  //   init();
  // }, [fetchListings]);
  console.log(namaDomain);
  return (
    <div className="flex flex-col bg-white w-full min-h-screen p-20 text-black gap-6">
      <Button onPress={connect}>Connect</Button>
      <p>wallet address: {account}</p>
      {/* <Input type="text" name="owner" placeholder="Alamat pemilik" handleChange={handleChange}/> */}
      <Input type="text" name="domainName" placeholder="Nama domain" handleChange={handleChange} />
      <Input type="text" name="ARecord" placeholder="A record" handleChange={handleChange} />
      <Button onPress={handleSubmit}>create domain</Button>
      <div className="py-6">
        {domains.length > 0 ? (
          domains.map((domain, index) => (
            <div key={index} className="py-3">
              <p>owner: {domain.owner}</p>
              <p>domain name: {domain.domainName}</p>
              <p>ex: {String(domain.exist)}</p>
              <p className="mb-4">a record: {domain.ARecord}</p>
              <a href={`https://sepolia.etherscan.io/tx/${domain.transactionHash}`} target="_blank" rel="noopener noreferrer" className="bg-slate-400 text-white px-4 py-2 rounded-lg hover:bg-[#088395] transition duration-300 ease-in-out">
                Etherscan
              </a>
            </div>
          ))
        ) : (
          <div className="text-lg">No domain.</div>
        )}
      </div>
      <input
        type="text"
        placeholder="Nama domain"
        onChange={(e) => {
          setNamaDomain(e.currentTarget.value);
        }}
      />
      <Input type="text" name="namaDomain" placeholder="nama domain" handleChange={handleChange} />
      <Button onPress={() => cariDNS(dnsContract, namaDomain)}>dns lookup</Button>
      <p>
        alamat IP web {namaDomain}: {alamatIP}
      </p>
    </div>
  );
}
