import dgram from "dgram";
import dotenv from "dotenv";
import dnsPacket from "dns-packet";
import { ethers } from "ethers";
import { readFile } from "fs/promises";
import dns from "dns";

dotenv.config();

const abi = JSON.parse(
  await readFile(new URL("./DomainService.json", import.meta.url))
);

const server = dgram.createSocket("udp4");

// Konfigurasi server DNS
const PORT = 53;

// Koneksi ke jaringan Sepolia melalui Infura
const provider = new ethers.WebSocketProvider(
  `wss://sepolia.infura.io/ws/v3/${process.env.INFURA_API_KEY}`
);
const contract = new ethers.Contract(
  process.env.CONTRACT_ADDRESS,
  abi,
  provider
);

let cache = {};

// Fungsi untuk query ke smart contract di blockchain
async function queryBlockchainDNS(domain) {
  if (cache[domain]) {
    return cache[domain];
  }
  try {
    let address = await contract.domainLookup(domain);
    cache[domain] = address;
    return address;
  } catch (error) {
    console.error("Tidak ada alamat IP yang ditemukan di blockchain");
    return null;
  }
}

// Fungsi untuk query ke DNS server eksternal (konvensional) secara recursive
function queryExternalDNS(domain) {
  return new Promise((resolve, reject) => {
    // Menggunakan dns.resolve untuk melakukan query DNS recursive
    dns.resolve4(domain, (err, addresses) => {
      if (err) {
        console.error(`Error resolving ${domain} with external DNS:`, err);
        return reject(err);
      }
      console.log(`External DNS resolved ${domain} to IP: ${addresses[0]}`);
      resolve(addresses[0]); // Mengambil IP pertama dari hasil query
    });
  });
}

server.on("message", async (msg, rinfo) => {
  const incomingReq = dnsPacket.decode(msg);
  const domain = incomingReq.questions[0].name;

  // Mengambil data dari smart contract di Sepolia
  let address = await queryBlockchainDNS(domain);

  // Jika IP tidak ditemukan di blockchain, query ke DNS eksternal secara recursive
  if (!address) {
    try {
      address = await queryExternalDNS(domain);
    } catch (err) {
      console.error(`DNS lookup failed for ${domain}:`, err);
      return;
    }
  }

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
        data: address,
      },
    ],
  });

  console.log(`Resolved IP for ${domain}: ${address}`);

  // Kirim respons kembali ke client
  server.send(ans, rinfo.port, rinfo.address, (err) => {
    if (err) console.error(err);
  });
});

// Menghubungkan server DNS
server.bind(PORT, () => {
  console.log(`DNS server is running at port: ${PORT}`);
});
