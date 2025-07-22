const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const fs = require('fs');

const ccpPath = path.resolve('G:/fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/connection-org1.json');
const walletPath = path.join(__dirname,'..', 'wallet'); // Path to your Fabric wallet
const channelName = 'mychannel';
const chaincodeName = 'mittarlogs';

async function connectToNetwork() {
    const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    const gateway = new Gateway();
    await gateway.connect(ccp, {
        wallet,
        identity: 'appUser', // Replace with the enrolled user identity
        discovery: { enabled: true, asLocalhost: true }
    });

    const network = await gateway.getNetwork(channelName);
    const contract = network.getContract(chaincodeName);

const peers = network.getChannel().getEndorsers();
// console.log('Connected peers:', peers.map(p => p.name));

    return { gateway, contract };
}

// 🔁 Invoke a transaction (write)
async function logAction(data) {
  const {
    sessionID,
    sessionUsername,
    action,
    timestamp,
    fileID = '',
    gridID = '',
    fileStatus = '',
    contributorUsername = '',
    contributorStatus = ''
  } = data;

  const { gateway, contract } = await connectToNetwork();
  try {
    await contract.submitTransaction(
      'logAction',
      String(sessionID || ''),
      String(sessionUsername || ''),
      String(action || ''),
      String(timestamp || ''),
      String(fileID || ''),
      String(gridID || ''),
      String(fileStatus || ''),
      String(contributorUsername || ''),
      String(contributorStatus || '')
    );
    console.log('✅ Action logged on chain.');
    return { success: true, message: 'Action logged successfully' };
  } catch (error) {
    console.error('❌ Failed to log action:', error);
    return { success: false, error: error.message };
  } finally {
    gateway.disconnect();
  }
}


// 🔎 Query all session logs
async function getSessionLogs(sessionID) {
    const { gateway, contract } = await connectToNetwork();
    try {
        const result = await contract.evaluateTransaction('getActionsBySessionID', sessionID);
        return JSON.parse(result.toString());
    } catch (error) {
        console.error('❌ Failed to get session logs:', error);
        throw error;
    } finally {
        gateway.disconnect();
    }
}

// 🔎 Query all session IDs
async function getAllSessionIDs() {
  const { gateway, contract } = await connectToNetwork();
  try {
    const result = await contract.evaluateTransaction('getAllActions');
    const allActions = JSON.parse(result.toString());

    const sessionMap = {};

    for (const action of allActions) {
      const sessionID = action.sessionID;
      if (!sessionMap[sessionID]) {
        sessionMap[sessionID] = {
          sessionID,
          sessionUsername: action.sessionUsername || 'unknown',
          timestamp: action.timestamp
        };
      }
    }

    return Object.values(sessionMap);
  } catch (error) {
    console.error('❌ Failed to get session IDs:', error);
    throw error;
  } finally {
    gateway.disconnect();
  }
}


// 🔎 Optional: Get all logs
async function getAllActions() {
    const { gateway, contract } = await connectToNetwork();
    try {
        const result = await contract.evaluateTransaction('getAllActions');
        return JSON.parse(result.toString());
    } catch (error) {
        console.error('❌ Failed to get all actions:', error);
        throw error;
    } finally {
        gateway.disconnect();
    }
}

module.exports = {
    logAction,
    getSessionLogs,
    getAllSessionIDs,
    getAllActions
};

