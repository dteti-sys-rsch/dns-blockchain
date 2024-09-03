import dgram from "dgram";
import dotenv from "dotenv";
import dnsPacket from "dns-packet";
import { ethers } from "ethers";
import { readFile } from "fs/promises";

dotenv.config();

const abi = JSON.parse(await readFile(new URL("./DomainService.json", import.meta.url)));

const server = dgram.createSocket("udp4");

// Konfigurasi server DNS
const PORT = 53;

// Koneksi ke jaringan Sepolia melalui Infura
const provider = new ethers.WebSocketProvider(`wss://sepolia.infura.io/ws/v3/${process.env.INFURA_API_KEY}`);
const contract = new ethers.Contract(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS, abi, provider);

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
