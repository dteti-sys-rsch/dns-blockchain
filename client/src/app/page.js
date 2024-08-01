"use client";
import { useContext, useState } from "react";
import { Button } from "@nextui-org/react";
import { DNSContext } from "@/utils/DNSProvider";

const Input = ({ placeholder, name, type, value, handleChange }) => (
  <input
    placeholder={placeholder}
    type={type}
    step="0.0001"
    value={value}
    onChange={(e) => handleChange(e, name)}
    className="my-2 w-full rounded-sm p-2 bg-transparent text-black text-sm border"
  />
);

export default function Home() {
  const { isLoading, formDomain, handleChange, connectWallet, createDomain } = useContext(DNSContext);
  const [account, setAccount] = useState("");
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

    createDomain();

  }

  const connect = async () => {
    try {
      const { account } = await connectWallet();
      setAccount(account);
    } catch (e) {
      console.error(e);
    }
  };
  console.log(owner)
  return (
    <div className="flex flex-col bg-white w-full min-h-screen p-20 text-black gap-6">
      <Button onPress={connect}>Connect</Button>
      <p>wallet address: {account}</p>
      <Input type="text" name="owner" placeholder="Alamat pemilik" handleChange={handleChange}/>
      <Input type="text" name="domainName" placeholder="Nama domain" handleChange={handleChange}/>
      <Input type="text" name="A" placeholder="A record" handleChange={handleChange}/>
      <Input type="text" name="CNAME" placeholder="CNAME record" handleChange={handleChange}/>
      <Input type="text" name="MX" placeholder="MX record" handleChange={handleChange}/>
      <Input type="text" name="NS" placeholder="NS record" handleChange={handleChange}/>
      <Button onPress={handleSubmit}>create domain</Button>
    </div>
  );
}
