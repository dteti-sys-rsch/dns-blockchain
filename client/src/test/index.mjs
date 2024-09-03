import dgram from 'dgram';
import dnsPacket from 'dns-packet';
import { ethers } from 'ethers';
// const { ethers } = require("ethers");
// const dnsPacket = require("dns-packet");
const server = dgram.createSocket("udp4");

// Konfigurasi server DNS
const PORT = 53;

// Koneksi ke jaringan Sepolia melalui Infura
const INFURA_PROJECT_ID = "94e8b66147a54321b014addb5a8e8aa5";
const provider = new ethers.providers.WebSocketProvider(`wss://sepolia.infura.io/ws/v3/${INFURA_PROJECT_ID}`);

// Smart contract address dan ABI
const contractAddress = "0xA0669160e5bE1126DFea9DCD78c7b7c4881F1609"; // Ganti dengan alamat kontrak Anda
const contractABI = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "domainName",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "ARecord",
        type: "string",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "exist",
        type: "bool",
      },
    ],
    name: "DomainCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "string",
        name: "domainName",
        type: "string",
      },
    ],
    name: "DomainDeleted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "string",
        name: "ARecord",
        type: "string",
      },
    ],
    name: "DomainUpdated",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "string",
        name: "domainName",
        type: "string",
      },
      {
        internalType: "string",
        name: "ARecord",
        type: "string",
      },
    ],
    name: "createDomain",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "string",
        name: "domainName",
        type: "string",
      },
    ],
    name: "deleteDomain",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "domainName",
        type: "string",
      },
    ],
    name: "domainLookup",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    name: "domains",
    outputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "string",
        name: "domainName",
        type: "string",
      },
      {
        internalType: "string",
        name: "ARecord",
        type: "string",
      },
      {
        internalType: "bool",
        name: "exist",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "string",
        name: "domainName",
        type: "string",
      },
      {
        internalType: "string",
        name: "ARecord",
        type: "string",
      },
    ],
    name: "updateDomain",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const contract = new ethers.Contract(contractAddress, contractABI, provider);
const cache = {};

// Fungsi untuk query ke smart contract
async function queryBlockchain(domain) {
  if (cache[domain]) {
    return cache[domain];
  }
  try {
    const ip = await contract.domainLookup(domain);
    cache[domain] = ip;
    return ip;
  } catch (error) {
    console.error("Error querying blockchain: ", error);
    return null;
  }
}

// Ketika server menerima pesan
server.on("message", async (msg, rinfo) => {
  const incomingReq = dnsPacket.decode(msg);
  const domain = incomingReq.questions[0].name;

  // Mengambil data dari smart contract di Sepolia
  const ip = await queryBlockchain(domain);

  const ans = dnsPacket.encode({
    type: "response",
    id: incomingReq.id,
    flags: dnsPacket.AUTHORITATIVE_ANSWER,
    questions: incomingReq.questions,
    answers: [
      {
        type: "A",
        class: "IN",
        name: domain,
        data: ip,
      },
    ],
  });

  console.log(`IP: ${ip}`);

  // Kirim respons kembali ke client
  server.send(ans, rinfo.port, rinfo.address, (err) => {
    if (err) console.error(err);
  });
});

// Menghubungkan server DNS
server.bind(PORT, () => {
  console.log(`DNS server is running at port: ${PORT}`);
});
