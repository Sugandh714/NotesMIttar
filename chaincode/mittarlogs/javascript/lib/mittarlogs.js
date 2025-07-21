'use strict';

const { Contract } = require('fabric-contract-api');

class MittarLogsContract extends Contract {

    async initLedger(ctx) {
        console.info('Blockchain ledger initialized');
    }

    // Log a single action with all possible fields (some may be empty)
    async logAction(
        ctx,
        sessionID,
        sessionUsername,
        action,
        timestamp,
        fileID,
        gridID,
        fileStatus,
        contributorUsername,
        contributorStatus
    ) {
        const actionKey = `${sessionID}_${timestamp}_${action}`;

        const logEntry = {
            sessionID,
            sessionUsername,
            action,
            timestamp,
            fileID: fileID || "",
            gridID: gridID || "",
            fileStatus: fileStatus || "",
            contributorUsername: contributorUsername || "",
            contributorStatus: contributorStatus || ""
        };

        await ctx.stub.putState(actionKey, Buffer.from(JSON.stringify(logEntry)));
        return `Action '${action}' logged with key: ${actionKey}`;
    }

    // Get all logs in the ledger (for debugging/admin)
    async getAllActions(ctx) {
        const iterator = await ctx.stub.getStateByRange('', '');
        const allResults = [];

        while (true) {
            const res = await iterator.next();
            if (res.value && res.value.value.toString()) {
                const record = JSON.parse(res.value.value.toString('utf8'));
                allResults.push(record);
            }
            if (res.done) {
                await iterator.close();
                break;
            }
        }

        return JSON.stringify(allResults);
    }

    // Get logs from one specific session
    async getActionsBySessionID(ctx, sessionID) {
        const iterator = await ctx.stub.getStateByRange('', '');
        const sessionLogs = [];

        while (true) {
            const res = await iterator.next();
            if (res.value && res.value.value.toString()) {
                const record = JSON.parse(res.value.value.toString('utf8'));
                if (record.sessionID === sessionID) {
                    sessionLogs.push(record);
                }
            }
            if (res.done) {
                await iterator.close();
                break;
            }
        }

        return JSON.stringify(sessionLogs);
    }

    // Get all unique session IDs (admin use)
    async getAllSessionIDs(ctx) {
        const iterator = await ctx.stub.getStateByRange('', '');
        const sessionSet = new Set();

        while (true) {
            const res = await iterator.next();
            if (res.value && res.value.value.toString()) {
                const record = JSON.parse(res.value.value.toString('utf8'));
                if (record.sessionID) {
                    sessionSet.add(record.sessionID);
                }
            }
            if (res.done) {
                await iterator.close();
                break;
            }
        }

        return JSON.stringify([...sessionSet]);
    }
}

module.exports = MittarLogsContract;
