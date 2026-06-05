
const FabricCAServices = require('fabric-ca-client');
const { Wallets } = require('fabric-network');
const fs = require('fs');
const path = require('path');

async function main() {
    try {
        const ccpPath = path.resolve(__dirname, 'config', 'connection-org1.json');
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        const caInfo = ccp.certificateAuthorities['ca.org1.example.com'];
        const caTLSCACerts = caInfo.tlsCACerts.pem;
        const ca = new FabricCAServices(caInfo.url, { trustedRoots: caTLSCACerts, verify: false }, caInfo.caName);

        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        const adminIdentity = await wallet.get('admin');
        if (adminIdentity) {
            console.log('An identity for the admin user "admin" already exists in the wallet');
        } else {
            console.log('Enrolling admin user "admin"...');
            const enrollment = await ca.enroll({ enrollmentID: 'admin', enrollmentSecret: 'adminpw' });
            const x509Identity = {
                credentials: {
                    certificate: enrollment.certificate,
                    privateKey: enrollment.key.toBytes(),
                },
                mspId: 'Org1MSP',
                type: 'X.509',
            };
            await wallet.put('admin', x509Identity);
            console.log('Successfully enrolled admin user "admin" and imported it into the wallet');
        }

        
        const userId = 'doctor_01';
        const userIdentity = await wallet.get(userId);
        if (userIdentity) {
            console.log(`An identity for the user "${userId}" already exists in the wallet`);
            return;
        }

        const adminUser = await wallet.getProviderRegistry().getProvider(adminIdentity ? 'admin' : 'admin').getUserContext(adminIdentity || await wallet.get('admin'), 'admin');

        console.log(`Registering user "${userId}"...`);
        const secret = await ca.register({
            affiliation: 'org1.department1',
            enrollmentID: userId,
            role: 'client'
        }, adminUser);

        console.log(`Enrolling user "${userId}"...`);
        const enrollment = await ca.enroll({
            enrollmentID: userId,
            enrollmentSecret: secret
        });
        const x509UserIdentity = {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes(),
            },
            mspId: 'Org1MSP',
            type: 'X.509',
        };
        await wallet.put(userId, x509UserIdentity);
        console.log(`Successfully enrolled user "${userId}" and imported it into the wallet`);

    } catch (error) {
        console.error(`Failed to enroll user: ${error}`);
        process.exit(1);
    }
}

main();