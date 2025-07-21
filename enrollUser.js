// enrollUser.js
const FabricCAServices = require('fabric-ca-client');
const { Wallets, X509WalletMixin } = require('fabric-network');
const path = require('path');
const fs = require('fs');

const enrollUser = async () => {
  try {
    // Load the network configuration
     const ccpPath = path.resolve('G:/fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/connection-org1.json');
    const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
    // Create a new CA client
    const caInfo = ccp.certificateAuthorities['ca.org1.example.com'];
    const caTLSCACerts = caInfo.tlsCACerts.pem;
    const ca = new FabricCAServices(caInfo.url, { trustedRoots: caTLSCACerts, verify: false }, caInfo.caName);

    // Create a new file system wallet
    const walletPath = path.join(__dirname, 'wallet');
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    // Check if the user already exists
    const userExists = await wallet.get('appUser');
    if (userExists) {
      console.log('✅ appUser already exists in the wallet');
      return;
    }

    // Check if admin exists in the wallet
    const adminIdentity = await wallet.get('admin');
    if (!adminIdentity) {
      console.log('❌ Admin identity not found in the wallet. Run enrollAdmin.js first.');
      return;
    }

    // Build a user object for authenticating with the CA
    const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
    const adminUser = await provider.getUserContext(adminIdentity, 'admin');

    // Register and enroll the user
    const secret = await ca.register({
      affiliation: 'org1.department1',
      enrollmentID: 'appUser',
      role: 'client'
    }, adminUser);
    const enrollment = await ca.enroll({
      enrollmentID: 'appUser',
      enrollmentSecret: secret
    });

    const x509Identity = {
      credentials: {
        certificate: enrollment.certificate,
        privateKey: enrollment.key.toBytes()
      },
      mspId: 'Org1MSP',
      type: 'X.509'
    };
    await wallet.put('appUser', x509Identity);
    console.log('✅ Successfully registered and enrolled appUser and imported into the wallet');
  } catch (error) {
    console.error('❌ Failed to enroll user:', error);
  }
};

enrollUser();
