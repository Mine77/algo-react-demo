import React, { Component } from 'react';
import NavFrame from '../components/NavFrame';
import {
    Container,
    Col,
    Jumbotron,
    Button,
    Form,
    Label,
    Input,
    FormGroup,
    FormText
} from 'reactstrap';

const algosdk = require('algosdk');
const utility = require('../utility/utility');

class TransactionOptIn extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            showResult: false,
            txId: 0
        };
        // This binding is necessary to make `this` work in the callback
        this.sendPaymentTransaction = this.sendPaymentTransaction.bind(this);
        this.handleSubmitAlgo = this.handleSubmitAlgo.bind(this);
    }

    sendPaymentTransaction(mnemonic,to,amount) {
        var p = new Promise(function (resolve, reject) {
            const algodclient = utility.algodclient;

            var account = algosdk.mnemonicToSecretKey(mnemonic);
            
            utility.getChangingParms(algodclient).then((cp) => {
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
                var signedTxn = algosdk.signTransaction(txn, account.sk);
                console.log(signedTxn);
                algodclient.sendRawTransaction(signedTxn.blob).then((tx) => {
                    console.log(tx);
                    console.log("Transaction : " + tx.txId);
                    utility.waitForConfirmation(algodclient, tx.txId).then((msg) => {
                        console.log(msg);
                        algodclient.pendingTransactionInformation(tx.txId).then((ptx) => {
                            resolve(tx.txId);
                        }).catch(console.log)
                    })
                }).catch(console.log)
            }).catch(console.log);
        })
        return p;
    }

    handleSubmitAlgo(event) {
        event.preventDefault();
        this.setState({
            isLoading: true
        })
        this.sendPaymentTransaction(
            event.target.accountMnemonic.value,
            event.target.toAddress.value,
            event.target.amount.value
        ).then((txId) => {
            this.setState({
                isLoading: false,
                showResult: true,
                txId: txId
            })
            console.log("Transaction ID:" + txId);
        }).catch(console.log);
    }

    render() {
        return (
            <div>
                <NavFrame></NavFrame>
                <Jumbotron>
                    <Container>
                        <Col>
                            <h2>
                                Send Opt-In Transaction
                            </h2>
                            <Form onSubmit={this.handleSubmitAlgo} style={{ width: "650px" }}>
                                <FormGroup>
                                    <Label>Account Mnemonic</Label>
                                    <Input style={{ height: "100px" }} type="textarea" name="accountMnemonic" defaultValue="bench outdoor conduct easily pony normal memory boat tiger together catch toward submit web stomach insane other list clap grain photo excess crush absorb illness" />
                                    <FormText color="muted">The account for sending the transaction.</FormText>
                                </FormGroup>
                                <FormGroup>
                                    <Label>To Address</Label>
                                    <Input type="text" name="toAddress" defaultValue="B7K3C7ZOG5JMVMDZRUZ6HWWZYCXYBPNZADAP3MLTZE5MUA56DK4SU762M4" />
                                    <FormText color="muted">Send ALGOs to this address.</FormText>
                                </FormGroup>
                                <FormGroup>
                                    <Label>Amount</Label>
                                    <Input type="text" pattern="[0-9]*" name="amount" defaultValue="1234567" />
                                    <FormText color="muted">Amount of microALGOs to send.</FormText>
                                </FormGroup>
                                <Button
                                    color={this.state.isLoading ? "secondary" : "primary"}
                                    disabled={this.state.isLoading}
                                    type="submit"
                                >
                                    {this.state.isLoading ? "Creating..." : "Send Transaction"}
                                </Button>
                            </Form>
                            {this.state.showResult ? <p>Transaction ID: <a href={"https://testnet.algoexplorer.io/tx/"+this.state.txId} target="_blank" rel="noopener noreferrer">{this.state.txId}</a></p> : null}
                        </Col>
                    </Container>
                </Jumbotron>
            </div>
        );
    }
}

export default TransactionOptIn;

