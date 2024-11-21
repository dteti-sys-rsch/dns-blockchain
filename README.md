# DeNS App

## Overview

The DeNS App is a decentralized DNS application based on Ethereum, integrated with a DNS server and a client-side interface. The application is built using smart contracts written in Solidity, with Node.js and Next.js for the server and front-end, connected to Ethereum via Ethers.js. Traditional DNS features, such as domain addition, modification, deletion, and DNS lookup, are implemented in the developed application.

## Features

- Add, modify, and delete domains using smart contracts.
- Transparent and immutable records stored on the Ethereum blockchain.
- Perform DNS lookups through the decentralized system.
- Secure login via Ethereum wallet (e.g., MetaMask).
- Transaction signing for domain operations.
- Seamless compatibility with existing DNS infrastructure.

## Prerequisites

Before getting started, ensure you have the following installed:

- Node.js
- npm
- A supported wallet like MetaMask for testing blockchain interactions
- Git

## Getting Started

### 1. Clone the Repository

```
git clone https://github.com/dteti-sys-rsch/dns-blockchain.git
cd dns-blockchain
```

### 2. Smart Contract

1. Change Directory

```
cd smart-contract
```

2. Set .env Variables for Smart Contract

```
ETHERSCAN_API_KEY="YOUR_ETHERSCAN_API_KEY"
INFURA_API_KEY="YOUR_INFURA_API_KEY"
SEPOLIA_PRIVATE_KEY="YOUR_SEPOLIA_PRIVATE_KEY"
```

3. Install Dependencies

```
npm install
```

4. Run Hardhat Locally

```
npx hardhat node
```

5. Compile Smart Contracts

```
npx hardhat compile
```

6. Deploy Smart Contracts

```
npx hardhat run scripts/deploy.js --network localhost
```

### 3. Client Interface

1. Change Directory

```
cd client
```

2. Set .env variables for Next.js

```
NEXT_PUBLIC_CONTRACT_ADDRESS="YOUR_CONTRACT_ADDRESS"
NEXT_PUBLIC_INFURA_API_KEY="YOUR_INFURA_API_KEY"
```

3. Install Dependencies

```
npm install
```

4. Run the Next.js Application

```
npm start
```

5. View the Application on Localhost (http://localhost:3000)

### 4. DNS Server

1. Change Directory

```
cd server
```

2. Set .env variables for Node.js

```
INFURA_API_KEY="YOUR_INFURA_API_KEY"
CONTRACT_ADDRESS="YOUR_CONTRACT_ADDRESS"
```

3. Install Dependencies

```
npm install
```

4. Run the DNS Server

```
node index.mjs
```

5. Test DNS Lookup

```
dig @localhost <domain-name>
```

## Project Structure

- smart-contract/: Smart contract files using Solidity and Hardhat
- client/: Client interface files using Next.js
- server/: DNS server files for testing using Node.js

## Contributing

Contributions are welcome! Please submit a pull request or open an issue to discuss proposed changes.

## License

This project is licensed under the MIT License.
