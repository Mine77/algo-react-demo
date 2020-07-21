// Structure for changing blockchain params
const chainParams = {
    fee: 0,
    firstRound: 0,
    lastRound: 0,
    genID: "",
    genHash: ""
}

// Utility function to update params from blockchain
var getChangingParms = (algodclient) => {
    var p = new Promise(function (resolve, reject) {
        var cp = chainParams;
        algodclient.getTransactionParams().then((params) => {
            cp.firstRound = params.lastRound;
            cp.lastRound = cp.firstRound + parseInt(1000);
            cp.genID = params.genesisID;
            cp.genHash = params.genesishashb64;
            algodclient.suggestedFee().then((sfee) => {
                cp.fee = sfee.fee;
                resolve(cp);
            }).catch(console.log)
        }).catch(console.log)
    })
    return p;
}

// Utility function to wait for tx confirmaiton
const waitForConfirmation = (algodclient, txId) => {
    var p = new Promise(function (resolve, reject) {
        console.log("Waiting for confirmation...")
        let interval = setInterval(() => {
            algodclient.pendingTransactionInformation(txId).then((pendingInfo) => {
                if (pendingInfo.round !== null && pendingInfo.round > 0) {
                    clearInterval(interval);
                    resolve("Transaction " + pendingInfo.tx + " confirmed in round " + pendingInfo.round);
                }
            }).catch(console.log);
        }, 2000);
        
    });
    return p;
}

module.exports={
    getChangingParms,
    waitForConfirmation
}