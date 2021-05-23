// import algosdk
const algosdk = require('algosdk');

// API server address and API token
const server = 'https://testnet-algorand.api.purestake.io/ps2';
const port = '';
const token = {
    'X-API-Key': 'q6SxddUqMjGfyRwofxRp69DS98gsfmf2bCv8H9qd'
}


// instantiate the algorand client
const algodclient = new algosdk.Algodv2(token, server, port);

// // import the limit order contract template
// const limitTemplate = require("algosdk/src/logicTemplates/limitorder");


// Utility function to wait for tx confirmaiton
function waitForConfirmation(algodclient, txId) {
    var p = new Promise(function (resolve, reject) {
        console.log("Waiting transaction: " + txId + " to be confirmed...");
        var counter = 1000;
        let interval = setInterval(() => {
            if (--counter === 0) reject("Confirmation Timeout");
            algodclient.pendingTransactionInformation(txId).do().then((pendingInfo) => {
                if (pendingInfo !== undefined) {
                    let confirmedRound = pendingInfo["confirmed-round"];
                    if (confirmedRound !== null && confirmedRound > 0) {
                        clearInterval(interval);
                        resolve("Transaction confirmed in round " + confirmedRound);
                    }
                }
            }).catch(reject);
        }, 2000);
    });
    return p;
}

// Function for generating wallet
function generateWallet() {
    var account = algosdk.generateAccount();
    var mnemonic = algosdk.secretKeyToMnemonic(account.sk);
    return { account, mnemonic }
}

// Function for sending payment transaction
function sendPaymentTransaction(mnemonic, to, amount) {
    var p = new Promise(function (resolve) {
        let account = algosdk.mnemonicToSecretKey(mnemonic);
        // use closeRemainderTo paramerter when you want to close an account
        let closeRemainderTo = undefined;
        // use note parameter when you want to attach a string to the transaction
        let note = undefined;
        algodclient.getTransactionParams().do().then((params) => {
            let txn = algosdk.makePaymentTxnWithSuggestedParams(account.addr, to, amount, closeRemainderTo, note, params);
            // sign the transaction
            var signedTxn = algosdk.signTransaction(txn, account.sk);
            algodclient.sendRawTransaction(signedTxn.blob).do().then((tx) => {
                waitForConfirmation(algodclient, tx.txId)
                    .then(resolve)
                    .catch(console.log);
            }).catch(console.log);
        }).catch(console.log);
    })
    return p;
}

// Function for sending an asset creation transaction
function createAsset(mnemonic, defaultFrozen, decimals, totalIssuance, unitName, assetName, assetUrl, manager, reserve, freeze, clawback) {
    var p = new Promise(function (resolve, reject) {
        let account = algosdk.mnemonicToSecretKey(mnemonic);
        // get chain parameters for sending transactions
        algodclient.getTransactionParams().do().then((params) => {
            // use note parameter when you want to attach a string to the transaction
            let note = undefined;
            let assetMetadataHash = undefined;
            // construct the asset creation transaction 
            let txn = algosdk.makeAssetCreateTxnWithSuggestedParams(account.addr, note, totalIssuance, decimals, defaultFrozen,
                manager, reserve, freeze, clawback, unitName, assetName, assetUrl, assetMetadataHash, params);
            var signedTxn = algosdk.signTransaction(txn, account.sk);
            algodclient.sendRawTransaction(signedTxn.blob).do().then((tx) => {
                waitForConfirmation(algodclient, tx.txId).then((msg) => {
                    console.log(msg);
                    algodclient.pendingTransactionInformation(tx.txId).do().then((ptx) => {
                        // get the asset ID
                        let assetId = ptx["asset-index"];
                        resolve(assetId);
                    }).catch(reject);
                }).catch(console.log);
        }).catch(console.log);
    }).catch(reject);
})
    return p;
}

// function for sending asset transactions
function sendAssetTransaction(mnemonic, to, assetId, amount) {
    var p = new Promise(function (resolve) {
        let account = algosdk.mnemonicToSecretKey(mnemonic);
        // use closeRemainderTo paramerter when you want to close an account
        let closeRemainderTo = undefined;
        // use note parameter when you want to attach a string to the transaction
        let note = undefined;
        // use revocationTarget when you want to clawback assets
        let revocationTarget = undefined;
        algodclient.getTransactionParams().do().then((params) => {
            let txn = algosdk.makeAssetTransferTxnWithSuggestedParams(account.addr, to, closeRemainderTo, revocationTarget,
                amount, note, assetId, params);       
            // sign the transaction
            var signedTxn = algosdk.signTransaction(txn, account.sk);
            algodclient.sendRawTransaction(signedTxn.blob).do().then((tx) => {
                waitForConfirmation(algodclient, tx.txId)
                    .then(resolve)
                    .catch(console.log);
            }).catch(console.log);
        }).catch(console.log);
    })
    return p;
}

// // Function for creating a limit order contract
// function createLimitOrder(mnemonic, assetID, assetAmount, algoAmount, minTrade) {
//     // recover the account from mnemonic
//     var account = algosdk.mnemonicToSecretKey(mnemonic);
//     // Owner is the owner of the contract    
//     let owner = account.addr;

//     // Inputs
//     // Limit contract should be two receivers in an
//     // ratn/ratd ratio of assetid to microalgos
//     // ratn is the number of assets
//     // ratd is the number of microAlgos
//     let ratn = parseInt(assetAmount);
//     let ratd = parseInt(algoAmount);
//     // assetID is the asset id number
//     // of the asset to be traded
//     // This must be created by asset owner
//     assetID = parseInt(assetID);
//     // At what round the contract expires
//     // The ower can retreive leftover funds after this round
//     let expiryRound = 5000000;
//     // The minimum number of microAlgos that may be spent
//     // out of this contract as part of a trade
//     minTrade = parseInt(minTrade);
//     // protect the account so its not drained
//     // with an excessive fee
//     let maxFee = 2000;

//     // Instaniate the template
//     let contract = new limitTemplate.LimitOrder(owner, assetID, ratn, ratd, expiryRound, minTrade, maxFee);

//     return contract;
// }

// function sendLimitOrderSwapAssetsTx(mnemonic, assetAmount, algoAmount, contract) {
//     var p = new Promise((resolve, reject) => {
//         // recover the account from mnemonic
//         var account = algosdk.mnemonicToSecretKey(mnemonic);

//         // Get the relevant params from the algod for the network
//         getChainParams(algodclient).then((params) => {
//             // The assetAmount and microAlgoAmounts are what is wanting to be 
//             // be traded
//             assetAmount = parseInt(assetAmount);
//             let microAlgoAmount = parseInt(algoAmount);
//             // The secrete key is the spending key of the asset owner not the microAlgo owner
//             let secretKey = account.sk;
//             // get the program code 
//             let program = contract.getProgram();
//             console.log(program)
//             // construct the transaction
//             let txnBytes = limitTemplate.getSwapAssetsTransaction(program, assetAmount,
//                 microAlgoAmount, secretKey, params.fee, params.firstRound, params.lastRound, params.genHash);
//             // Submit the transaction
//             algodclient.sendRawTransaction(txnBytes).then((tx) => {
//                 // wait for transaction to be confirmed 
//                 waitForConfirmation(algodclient, tx.txId).then((msg) => {
//                     // retrieve the transaction information
//                     algodclient.pendingTransactionInformation(tx.txId).then((ptx) => {
//                         // return the transaction ID
//                         resolve(ptx.tx);
//                     }).catch(reject);
//                 }).catch(reject);
//             }).catch(reject);
//         }).catch(reject);
//     })
//     return p;
// }

module.exports = {
    waitForConfirmation,
    generateWallet,
    createAsset,
    sendPaymentTransaction,
    sendAssetTransaction,
    // createLimitOrder,
    // sendLimitOrderSwapAssetsTx
}