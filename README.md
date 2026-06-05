# Blockchain Based Organ Donation and Transplantation System

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Hyperledger Fabric](https://img.shields.io/badge/Hyperledger_Fabric-2F3134?style=for-the-badge&logo=hyperledger&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Redis](https://img.shields.io/badge/redis-%23DD0031.svg?style=for-the-badge&logo=redis&logoColor=white)

## Overview
This repository contains the source code for a blockchain-based Organ Donation and Transplantation System. This project was developed by us as a B.Tech Final Year Project for the Computer Science and Engineering department at the **National Institute of Technology (NIT) Silchar**.

The system leverages decentralized ledger technology to solve critical issues in organ transplantation, such as lack of transparency, data silos between hospitals, and the risk of tampering with medical waiting lists. By combining off-chain storage for sensitive medical data and on-chain storage for status and allocation history, the platform ensures an immutable, transparent, and highly secure lifecycle for organ matching.

## Key Features
* **Immutable Audit Trail:** All patient registrations, status updates, and allocation decisions are logged on a Hyperledger Fabric blockchain, ensuring provenance and tamper-evident history.
* **Smart Contract Allocation:** Automated, algorithmic matching recommendations based on blood type compatibility, urgency, and wait time.
* **Role-Based Access Control (RBAC):**
  * **Medical Staff (Doctors):** Can register donors and recipients, and update medical statuses.
  * **Transplant Coordinators:** Authorized to execute and log official organ allocation decisions between matched pairs.
  * **Auditors:** Can query the blockchain directly to verify the immutable transaction history of any asset.
* **Public Transparency Dashboard:** Real-time, anonymized view of the public waiting list and available donors, powered by Redis caching for high performance.
* **Hybrid Data Architecture:** Sensitive Patient Health Information (PHI) is stored securely off-chain in MongoDB, while cryptographic hashes and state changes are recorded on-chain.

## Tech Stack
* **Frontend:** React.js, Vite, Tailwind CSS, Lucide Icons
* **Backend:** Node.js, Express.js, Mongoose
* **Database & Caching:** MongoDB, Redis
* **Blockchain Network:** Hyperledger Fabric (v2.x), Fabric CA, Fabric Network SDK

## System Architecture
1. **React Client:** Provides tailored dashboards based on the user's RBAC role.
2. **Node.js API Gateway:** Handles authentication (JWT), routes requests, manages the Redis cache, and interacts with the Fabric network via the SDK.
3. **MongoDB:** Stores full patient profiles, encrypted medical notes, and off-chain data hashes.
4. **Hyperledger Fabric:** Executes the `OrganRegistryChaincode` to validate state changes and record immutable transactions.

## Prerequisites
To run this project locally, ensure you have the following installed:
* Node.js (v18+)
* Docker and Docker Compose
* WSL (Windows Subsystem for Linux) with an Ubuntu distribution (Recommended for Windows users running Hyperledger Fabric)
* MongoDB (Local or Atlas URI)
* Redis Server

## Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/git-ADG/Blockchain-Based-Organ-Donation-and-Transplantation-System.git
```

### 2. Start the Blockchain Network (WSL/Ubuntu)
Navigate to your `fabric-samples/test-network` directory and spin up the network with the required channel and Certificate Authorities:
```bash
./network.sh up createChannel -c mychannel -ca
./network.sh deployCC -ccn organ-donation-chaincode -ccp /path/to/your/Chaincode -ccl javascript

```
### 2. Start the Blockchain Network (WSL/Ubuntu)
Navigate to your `fabric-samples/test-network` directory and spin up the network with the required channel and Certificate Authorities:
```bash
./network.sh up createChannel -c mychannel -ca
./network.sh deployCC -ccn organ-donation-chaincode -ccp /path/to/your/Chaincode -ccl javascript
```

### 3. Backend Setup

Navigate to the `NODE_BACKEND` directory, install dependencies, and enroll the admin/users into your local Fabric wallet:

```bash
cd NODE_BACKEND
npm install

# Enroll Fabric identities
node enrollUser.js

# Start the Express server
npm run dev

```

### 4. Frontend Setup

Open a new terminal, navigate to the `REACT_APP` directory, and start the Vite development server:

```bash
cd REACT_APP
npm install
npm run dev

```

## Environment Variables

Create a `.env` file in the `NODE_BACKEND` directory:

```env
NODE_ENV=development
PORT=3000
MONGO_URI=mongodb://localhost:27017/organ-donation-db
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=1d
CONNECTION_PROFILE_PATH=config/connection-org1.json
CHANNEL_NAME=mychannel
CHAINCODE_NAME=organ-donation-chaincode
MSP_ID=Org1MSP
REDIS_URL=redis://127.0.0.1:6379

```

## License

This project is for academic purposes.

