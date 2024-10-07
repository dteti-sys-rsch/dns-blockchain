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

const PORT = 53;
const CACHE_TTL = 3600;
let cache = {};

const provider = new ethers.WebSocketProvider(
  `wss://sepolia.infura.io/ws/v3/${process.env.INFURA_API_KEY}`
);

const contract = new ethers.Contract(
  process.env.CONTRACT_ADDRESS,
  abi,
  provider
);

function cacheDomain(domain, ip, ttl) {
  const expiresAt = Date.now() + ttl * 1000;
  cache[domain] = { ip, expiresAt };
}

function getCachedDomain(domain) {
  const entry = cache[domain];
  if (entry && entry.expiresAt > Date.now()) {
    return entry.ip;
  }
  return null;
}

async function queryBlockchainDNS(domain) {
  const cachedAddress = getCachedDomain(domain);
  if (cachedAddress) {
    return cachedAddress;
  }

  try {
    let address = await contract.domainLookup(domain);
    if (address) {
      cacheDomain(domain, address, CACHE_TTL);
      return address;
    }
  } catch (error) {
    console.error("Tidak ada domain di blockchain");
    return null;
  }
}

function queryExternalDNS(domain) {
  return new Promise((resolve, reject) => {
    dns.setServers(["1.1.1.1", "8.8.8.8"]);

    dns.resolve4(domain, (err, addresses) => {
      if (err) {
        console.error(`Error resolving ${domain} with external DNS:`);
        return reject(err);
      }
      resolve(addresses[0]);
    });
  });
}

server.on("message", async (msg, rinfo) => {
  try {
    const incomingReq = dnsPacket.decode(msg);
    const domain = incomingReq.questions[0].name;

    console.log(`Query for domain: ${domain}`);

    let address = getCachedDomain(domain);

    if (!address) {
      const [blockchainAddress, externalAddress] = await Promise.all([
        queryBlockchainDNS(domain),
        queryExternalDNS(domain),
      ]);

      address = blockchainAddress || externalAddress;

      if (!address) {
        console.error(`DNS lookup failed for ${domain}`);
        return;
      }

      cacheDomain(domain, address, CACHE_TTL);
    } else {
      console.log(`Cache hit for domain: ${domain}`);
    }

    const response = dnsPacket.encode({
      type: "response",
      id: incomingReq.id,
      flags: dnsPacket.AUTHORITATIVE_ANSWER,
      questions: incomingReq.questions,
      answers: [
        {
          type: "A",
          class: "IN",
          name: domain,
          ttl: CACHE_TTL,
          data: address,
        },
      ],
    });

    server.send(response, rinfo.port, rinfo.address, (err) => {
      if (err) {
        console.error("Error sending DNS response:", err);
      }
    });

    console.log(`Resolved IP for ${domain}: ${address}`);
  } catch (err) {
    console.error("Error handling DNS request:", err);
  }
});

server.bind(PORT, () => {
  console.log(`DNS server is running on port: ${PORT}`);
});