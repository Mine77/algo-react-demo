// import algosdk
const algosdk = require('algosdk');

// API server address and API token
const server = 'https://testnet-algorand.api.purestake.io/ps1';
const port = '';
const token = {
    'X-API-Key': 'q6SxddUqMjGfyRwofxRp69DS98gsfmf2bCv8H9qd'
}

// instantiate the algorand client
const algodclient = new algosdk.Algod(token, server, port);

// import the limit order contract template
const limitTemplate = require("algosdk/src/logicTemplates/limitorder");

// Utility function to update params from blockchain
function getChainParams(algodclient) {
    var p = new Promise(function (resolve, reject) {
        // Structure for changing blockchain params
        var cp = {
            fee: 0,
            firstRound: 0,
            lastRound: 0,
            genID: "",
            genHash: ""
        }
        algodclient.getTransactionParams().then((params) => {
            cp.firstRound = params.lastRound;
            cp.lastRound = cp.firstRound + parseInt(1000);
            cp.genID = params.genesisID;
            cp.genHash = params.genesishashb64;
            cp.fee=params.fee;
            resolve(cp);
        }).catch((res) => { reject(res) });
    })
    return p;
}

// Utility function to wait for tx confirmaiton
function waitForConfirmation(algodclient, txId) {
    var p = new Promise(function (resolve, reject) {
        console.log("Waiting for confirmation...");
        var counter = 1000;
        let interval = setInterval(() => {
            if (--counter === 0) reject("Confirmation Timeout");
            algodclient.pendingTransactionInformation(txId).then((pendingInfo) => {
                if (pendingInfo.round !== null && pendingInfo.round > 0) {
                    clearInterval(interval);
                    resolve("Transaction " + pendingInfo.tx + " confirmed in round " + pendingInfo.round);
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
    var p = new Promise(function (resolve, reject) {
        // recover the account from mnemonic
        var account = algosdk.mnemonicToSecretKey(mnemonic);
        // get chain parameters for sending transactions
        getChainParams(algodclient).then((cp) => {
            // construct the transaction
            var txn = {
                "to": to,
                "fee": cp.fee,
                "amount": parseInt(amount),
                "firstRound": cp.firstRound,
                "lastRound": cp.lastRound,
                "genesisID": cp.genID,
                "genesisHash": cp.genHash,
                "closeRemainderTo": undefined,
                "note": undefined
            };
            // sign the transaction
            var signedTxn = algosdk.signTransaction(txn, account.sk);
            // submit the transaction
            algodclient.sendRawTransaction(signedTxn.blob).then((tx) => {
                // wait for transaction to be confirmed
                waitForConfirmation(algodclient, tx.txId).then((msg) => {
                    console.log(msg);
                    // retrieve the transaction information
                    algodclient.pendingTransactionInformation(tx.txId).then((ptx) => {
                        // return the transaction ID
                        resolve(ptx.tx);
                    }).catch(reject);
                }).catch(reject);
            }).catch(reject);
        }).catch(reject);
    })
    return p;
}

// Function for sending an asset creation transaction
function createAsset(mnemonic, defaultFrozen, decimals, totalIssuance, unitName, assetName, assetUrl, manager, reserve, freeze, clawback) {
    var p = new Promise(function (resolve, reject) {
        // recover the account from mnemonic
        var account = algosdk.mnemonicToSecretKey(mnemonic);
        // get the address
        let addr = account.addr;
        // Whether user accounts will need to be unfrozen before transacting.
        if (defaultFrozen === "Yes")
            defaultFrozen = true;
        else
            defaultFrozen = false;
        // Integer number of decimals for asset unit calculation.
        decimals = parseInt(decimals);
        // Total number of this asset available for circulation.
        totalIssuance = parseInt(totalIssuance);
        // Optional hash commitment of some sort relating to the asset. 32 character length.
        let assetMetadataHash = "16efaa3924a6fd9d3a4824799a4ac65d";
        // get chain parameters for sending transactions
        getChainParams(algodclient).then((cp) => {
            // arbitrary data to be stored in the transaction; here, none is stored
            // signing and sending "txn" allows "addr" to create an asset
            let note = undefined;
            // construct the asset creation transaction 
            let txn = algosdk.makeAssetCreateTxn(addr, cp.fee, cp.firstRound, cp.lastRound, note,
                cp.genHash, cp.genID, totalIssuance, decimals, defaultFrozen, manager, reserve, freeze,
                clawback, unitName, assetName, assetUrl, assetMetadataHash);
            // sign the transaction
            let rawSignedTxn = txn.signTxn(account.sk);
            // submit the transaction to the network
            algodclient.sendRawTransaction(rawSignedTxn).then((tx) => {
                // wait for transaction to be confirmed
                waitForConfirmation(algodclient, tx.txId).then((msg) => {
                    console.log(msg);
                    // retrieve the transaction information
                    algodclient.pendingTransactionInformation(tx.txId).then((ptx) => {
                        // return the asset ID
                        resolve(ptx.txresults.createdasset);
                    }).catch(reject);
                }).catch(reject);
            }).catch(reject);
        }).catch(reject);
    })
    return p;
}

// function for sending asset transactions
function sendAssetTransaction(mnemonic, to, assetID, amount) {
    var p = new Promise(function (resolve, reject) {
        // recover the account from mnemonic
        var account = algosdk.mnemonicToSecretKey(mnemonic);
        // get chain parameters for sending transactions
        getChainParams(algodclient).then((cp) => {
            // The ID of the asset to send.
            assetID = parseInt(assetID);
            // arbitrary data to be stored in the transaction; here, none is stored
            // signing and sending "txn" allows "addr" to create an asset
            let note = undefined;
            // sender of the asset
            let sender = account.addr;
            // receiver of the asset
            let recipient = to;
            // We set revocationTarget to undefined as 
            // This is not a clawback operation
            let revocationTarget = undefined;
            // CloseReaminerTo is set to undefined as
            // we are not closing out an asset
            let closeRemainderTo = undefined;
            // amount of assets to send
            amount = parseInt(amount);
            // construct the asset transfer transaction
            let opttxn = algosdk.makeAssetTransferTxn(sender, recipient, closeRemainderTo, revocationTarget,
                cp.fee, amount, cp.firstRound, cp.lastRound, note, cp.genHash, cp.genID, assetID);
            // sign the transaction
            var rawSignedTxn = opttxn.signTxn(account.sk);
            // submit the transaction to the network
            algodclient.sendRawTransaction(rawSignedTxn).then((tx) => {
                // wait for transaction to be confirmed
                waitForConfirmation(algodclient, tx.txId).then((msg) => {
                    console.log(msg);
                    // retrieve the transaction information
                    algodclient.pendingTransactionInformation(tx.txId).then((ptx) => {
                        // return the transaction ID
                        resolve(ptx.tx);
                    }).catch(reject);
                }).catch(reject);
            }).catch(reject);
        }).catch(reject);;
    })
    return p;
}

// Function for creating a limit order contract
function createLimitOrder(mnemonic, assetID, assetAmount, algoAmount, minTrade) {
    // recover the account from mnemonic
    var account = algosdk.mnemonicToSecretKey(mnemonic);
    // Owner is the owner of the contract    
    let owner = account.addr;

    // Inputs
    // Limit contract should be two receivers in an
    // ratn/ratd ratio of assetid to microalgos
    // ratn is the number of assets
    // ratd is the number of microAlgos
    let ratn = parseInt(assetAmount);
    let ratd = parseInt(algoAmount);
    // assetID is the asset id number
    // of the asset to be traded
    // This must be created by asset owner
    assetID = parseInt(assetID);
    // At what round the contract expires
    // The ower can retreive leftover funds after this round
    let expiryRound = 5000000;
    // The minimum number of microAlgos that may be spent
    // out of this contract as part of a trade
    minTrade = parseInt(minTrade);
    // protect the account so its not drained
    // with an excessive fee
    let maxFee = 2000;

    // Instaniate the template
    let contract = new limitTemplate.LimitOrder(owner, assetID, ratn, ratd, expiryRound, minTrade, maxFee);

    return contract;
}

function sendLimitOrderSwapAssetsTx(mnemonic, assetAmount, algoAmount, contract) {
    var p = new Promise((resolve, reject) => {
        // recover the account from mnemonic
        var account = algosdk.mnemonicToSecretKey(mnemonic);

        // Get the relevant params from the algod for the network
        getChainParams(algodclient).then((params) => {
            // The assetAmount and microAlgoAmounts are what is wanting to be 
            // be traded
            assetAmount = parseInt(assetAmount);
            let microAlgoAmount = parseInt(algoAmount);
            // The secrete key is the spending key of the asset owner not the microAlgo owner
            let secretKey = account.sk;
            // get the program code 
            let program = contract.getProgram();
            console.log(program)
            // construct the transaction
            let txnBytes = limitTemplate.getSwapAssetsTransaction(program, assetAmount,
                microAlgoAmount, secretKey, params.fee, params.firstRound, params.lastRound, params.genHash);
            // Submit the transaction
            algodclient.sendRawTransaction(txnBytes).then((tx) => {
                // wait for transaction to be confirmed 
                waitForConfirmation(algodclient, tx.txId).then((msg) => {
                    // retrieve the transaction information
                    algodclient.pendingTransactionInformation(tx.txId).then((ptx) => {
                        // return the transaction ID
                        resolve(ptx.tx);
                    }).catch(reject);
                }).catch(reject);
            }).catch(reject);
        }).catch(reject);
    })
    return p;
}

module.exports = {
    getChainParams,
    waitForConfirmation,
    generateWallet,
    createAsset,
    sendPaymentTransaction,
    sendAssetTransaction,
    createLimitOrder,
    sendLimitOrderSwapAssetsTx
}