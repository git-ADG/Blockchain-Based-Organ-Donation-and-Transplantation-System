const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const fs = require('fs');
const config = require('../config/config');
const logger = require('../utils/logger');
const dbService = require('./dbService');

class FabricService {
    
    async getContract(identityLabel) {
        const ccpPath = path.resolve(__dirname, '..', config.org1ConnectionProfilePath);
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);

        const identity = await wallet.get(identityLabel);
        if (!identity) {
            throw new Error(`Identity "${identityLabel}" does not exist in the wallet. Please run enrollUser.js first.`);
        }

        const gateway = new Gateway();
        await gateway.connect(ccp, {
            wallet,
            identity: identityLabel,
            discovery: { enabled: true, asLocalhost: config.asLocalhost }
        });

        const network = await gateway.getNetwork(config.channelName);
        const contract = network.getContract(config.chaincodeName);

        return { gateway, contract };
    }

    async submitTransaction(identityLabel, userRole, functionName, ...args) {
        logger.info(`Submitting transaction: ${functionName} by ${identityLabel}`);
        const { gateway, contract } = await this.getContract(identityLabel);
        
        try {
            const resultBuffer = await contract.submitTransaction(functionName, ...args);
            
            return { 
                txId: `tx-${Date.now()}`,
                payload: resultBuffer.toString() 
            };
        } finally {
            gateway.disconnect();
        }
    }

    async evaluateTransaction(identityLabel, functionName, ...args) {
        logger.info(`Evaluating transaction: ${functionName} by ${identityLabel}`);
        const { gateway, contract } = await this.getContract(identityLabel);
        
        try {
            const resultBuffer = await contract.evaluateTransaction(functionName, ...args);
            return resultBuffer.toString();
        } finally {
            gateway.disconnect();
        }
    }
}

module.exports = new FabricService();