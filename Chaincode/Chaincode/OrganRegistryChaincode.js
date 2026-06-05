'use strict';

const { Contract, Context } = require('fabric-contract-api');
const ClientIdentity = require('fabric-shim/lib/clientidentity');

class OrganRegistryContext extends Context {
    constructor() {
        super();
    }

    getOrgId() {
        const clientIdentity = new ClientIdentity(this.stub);
        return clientIdentity.getMSPID();
    }
}

class OrganRegistryChaincode extends Contract {

    constructor() {
        super('OrganRegistryChaincode');
    }

    createContext() {
        return new OrganRegistryContext();
    }

    async InitLedger(ctx) {
        console.info('============= START : Init Ledger ===========');
        const patients = [
            { id: 'D001', org: 'HospitalA_MSP', dataHash: 'hash-A-1234', status: 'Active', type: 'Donor', bloodType: 'A+' },
            { id: 'R001', org: 'HospitalA_MSP', dataHash: 'hash-A-5678', status: 'Waiting', type: 'Recipient', bloodType: 'A+' },
            { id: 'D002', org: 'HospitalB_MSP', dataHash: 'hash-B-9012', status: 'Deceased', type: 'Donor', bloodType: 'O-' },
        ];

        for (const patient of patients) {
            await ctx.stub.putState(patient.id, Buffer.from(JSON.stringify(patient)));
            console.info(`Patient ${patient.id} initialized by ${patient.org}`);
        }
        console.info('============= END : Init Ledger ===========');
    }

    async CreateDonor(ctx, id, bloodType, dataHash) {
        const orgId = ctx.getOrgId();

        if (orgId.includes('Auditor')) {
            throw new Error(`ACCESS DENIED: ${orgId} cannot create records.`);
        }

        const exists = await this.AssetExists(ctx, id);
        if (exists) {
            throw new Error(`The asset ${id} already exists`);
        }

        const donor = {
            id: id,
            org: orgId,             
            dataHash: dataHash,     
            type: 'Donor',
            status: 'Available',
            bloodType: bloodType,
            timestamp: new Date().toISOString(),
            createdBy: ctx.stub.getCreator().getId() 
        };

        await ctx.stub.putState(id, Buffer.from(JSON.stringify(donor)));
        return JSON.stringify(donor);
    }

    async CreateRecipient(ctx, id, bloodType, dataHash) {
        const orgId = ctx.getOrgId();

        if (orgId.includes('Auditor')) {
            throw new Error(`ACCESS DENIED: ${orgId} cannot create records.`);
        }

        const exists = await this.AssetExists(ctx, id);
        if (exists) {
            throw new Error(`The asset ${id} already exists`);
        }

        const recipient = {
            id: id,
            org: orgId,             
            dataHash: dataHash,     
            type: 'Recipient',
            status: 'Waiting',
            bloodType: bloodType,
            timestamp: new Date().toISOString(),
            createdBy: ctx.stub.getCreator().getId() 
        };

        await ctx.stub.putState(id, Buffer.from(JSON.stringify(recipient)));
        return JSON.stringify(recipient);
    }

    async LogAllocation(ctx, donorID, recipientID) {
        const orgId = ctx.getOrgId();

        if (!orgId.includes('Auditor_MSP') && !orgId.includes('Coordinator')) {
        }

        const donorJSON = await ctx.stub.getState(donorID);
        const recipientJSON = await ctx.stub.getState(recipientID);

        if (!donorJSON || donorJSON.length === 0) {
            throw new Error(`Donor ${donorID} not found.`);
        }
        if (!recipientJSON || recipientJSON.length === 0) {
            throw new Error(`Recipient ${recipientID} not found.`);
        }

        const donor = JSON.parse(donorJSON.toString());
        const recipient = JSON.parse(recipientJSON.toString());

        if (donor.status !== 'Deceased' && donor.status !== 'Available' && donor.status !== 'Active') {
            throw new Error(`Allocation failed: Donor ${donorID} status is '${donor.status}'.`);
        }
        if (recipient.status !== 'Waiting') {
            throw new Error(`Allocation failed: Recipient ${recipientID} status is not 'Waiting'.`);
        }

        donor.status = `ALLOCATED to ${recipientID}`;
        recipient.status = `ALLOCATED from ${donorID}`;
        recipient.allocatedDate = new Date().toISOString();
        donor.allocatedDate = new Date().toISOString();

        await ctx.stub.putState(donorID, Buffer.from(JSON.stringify(donor)));
        await ctx.stub.putState(recipientID, Buffer.from(JSON.stringify(recipient)));

        return JSON.stringify({
            message: `Allocation decision successfully logged.`,
            donorID: donorID,
            recipientID: recipientID,
            loggedBy: orgId,
            txId: ctx.stub.getTxID()
        });
    }

    async ReadAsset(ctx, id) {
        const assetJSON = await ctx.stub.getState(id);
        if (!assetJSON || assetJSON.length === 0) {
            throw new Error(`Asset ${id} does not exist`);
        }
        return assetJSON.toString();
    }

    
    async GetAllAssets(ctx) {
        const allResults = [];
        const iterator = await ctx.stub.getStateByRange('', '');
        let result = await iterator.next();
        
        while (!result.done) {
            const strValue = Buffer.from(result.value.value.toString()).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            allResults.push(record);
            result = await iterator.next();
        }
        return JSON.stringify(allResults);
    }

    async GetAssetHistory(ctx, assetID) {
        const orgId = ctx.getOrgId();
        let resultsIterator = await ctx.stub.getHistoryForKey(assetID);
        let results = [];
        let current = await resultsIterator.next();

        while (!current.done) {
            const res = current.value;
            const txTime = new Date(res.timestamp.seconds.low * 1000).toISOString();

            results.push({
                TxId: res.txId,
                Value: JSON.parse(res.value.toString('utf8')), 
                Timestamp: txTime,
                IsDelete: res.is_delete, 
                LoggedByMSP: orgId
            });
            current = await resultsIterator.next();
        }

        await resultsIterator.close();
        return JSON.stringify(results);
    }

    async AssetExists(ctx, id) {
        const assetJSON = await ctx.stub.getState(id);
        return assetJSON && assetJSON.length > 0;
    }
}

module.exports = OrganRegistryChaincode;