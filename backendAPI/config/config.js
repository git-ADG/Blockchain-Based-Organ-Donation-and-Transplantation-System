require('dotenv').config();

module.exports = {
    env: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 3000,
    mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/organ-donation-db',
    jwtSecret: process.env.JWT_SECRET || 'super-secret-thesis-key-change-me',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
    
    org1ConnectionProfilePath: process.env.CONNECTION_PROFILE_PATH || 'connection-org1.json',
    channelName: process.env.CHANNEL_NAME || 'mychannel',
    chaincodeName: process.env.CHAINCODE_NAME || 'organ-donation-chaincode',
    mspId: process.env.MSP_ID || 'Org1MSP',
    asLocalhost: process.env.AS_LOCALHOST !== 'false'
};