import React, { Component } from 'react';
import NavFrame from '../components/NavFrame';
import {
    Container,
    Row,
    Jumbotron,
    Button,
    Form,
    Label,
    Input,
    FormGroup,
    FormText,
    Col
} from 'reactstrap';

const algosdk = require('algosdk');
const utility = require('../utility/utility');

class Asset extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            showResult: false,
            assetId: 0
        };
        // This binding is necessary to make `this` work in the callback
        this.createAsset = this.createAsset.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    createAsset(mnemonic, defaultFrozen, decimals, totalIssuance, unitName, assetName, assetUrl, manager, reserve, freeze, clawback) {
        var p = new Promise(function (resolve, reject) {
            const server = 'https://testnet-algorand.api.purestake.io/ps1';
            const port = '';
            const token = {
                'X-API-Key': 'q6SxddUqMjGfyRwofxRp69DS98gsfmf2bCv8H9qd'
            }
            const algodclient = new algosdk.Algod(token, server, port);

            var account = algosdk.mnemonicToSecretKey(mnemonic);
            let addr = account.addr;
            if (defaultFrozen === "Yes")
                defaultFrozen = true;
            else
                defaultFrozen = false;
            decimals = parseInt(decimals);
            totalIssuance = parseInt(totalIssuance);
            let assetMetadataHash = "16efaa3924a6fd9d3a4824799a4ac65d"; // Optional hash commitment of some sort relating to the asset. 32 character length.
            utility.getChangingParms(algodclient).then((cp) => {
                let note = undefined; // arbitrary data to be stored in the transaction; here, none is stored
                // signing and sending "txn" allows "addr" to create an asset
                let txn = algosdk.makeAssetCreateTxn(addr, cp.fee, cp.firstRound, cp.lastRound, note,
                    cp.genHash, cp.genID, totalIssuance, decimals, defaultFrozen, manager, reserve, freeze,
                    clawback, unitName, assetName, assetUrl, assetMetadataHash);
                let rawSignedTxn = txn.signTxn(account.sk);
                algodclient.sendRawTransaction(rawSignedTxn).then((tx) => {
                    console.log("Transaction : " + tx.txId);
                    let assetID = null;
                    utility.waitForConfirmation(algodclient, tx.txId).then((msg) => {
                        console.log(msg);
                        algodclient.pendingTransactionInformation(tx.txId).then((ptx) => {
                            assetID = ptx.txresults.createdasset;
                            resolve(assetID);
                        }).catch(console.log)
                    })
                }).catch(console.log)
            }).catch(console.log);
        })
        return p;
    }
    handleSubmit(event) {
        event.preventDefault();
        this.setState({
            isLoading: true
        })
        this.createAsset(
            event.target.accountMnemonic.value,
            event.target.defaultFrozen.value,
            event.target.decimals.value,
            event.target.totalIssuance.value,
            event.target.unitName.value,
            event.target.assetName.value,
            event.target.assetUrl.name,
            event.target.manager.value,
            event.target.reserve.value,
            event.target.freeze.value,
            event.target.clawback.value
        ).then((assetId) => {
            this.setState({
                isLoading: false,
                showResult: true,
                assetId: assetId
            })
            console.log("Asset ID:" + assetId);
        })
    }

    render() {
        return (
            <div>
                <NavFrame></NavFrame>
                <Jumbotron>
                    <Container>
                        <Row style={{ width: "500px" }}>
                            <Form onSubmit={this.handleSubmit}>
                                <FormGroup>
                                    <Label>Account Mnemonic</Label>
                                    <Input style={{ height: "120px" }} type="textarea" name="accountMnemonic" defaultValue="bench outdoor conduct easily pony normal memory boat tiger together catch toward submit web stomach insane other list clap grain photo excess crush absorb illness" />
                                    <FormText color="muted">The account for sending the transaction.</FormText>
                                </FormGroup>
                                <FormGroup>
                                    <Label >Default Frozen</Label>
                                    <Input type="select" name="defaultFrozen" defaultValue="No">
                                        <option>Yes</option>
                                        <option>No</option>
                                    </Input>
                                    <FormText color="muted">Whether user accounts will need to be unfrozen before transacting.</FormText>
                                </FormGroup>
                                <FormGroup>
                                    <Label>Decimals</Label>
                                    <Input type="text" pattern="[0-9]*" name="decimals" defaultValue="2" />
                                    <FormText color="muted">Integer number of decimals for asset unit calculation.</FormText>
                                </FormGroup>
                                <FormGroup>
                                    <Label>Total Issuance</Label>
                                    <Input type="text" pattern="[0-9]*" name="totalIssuance" defaultValue="1000" />
                                    <FormText color="muted">Total number of this asset available for circulation.</FormText>
                                </FormGroup>
                                <FormGroup>
                                    <Label>Asset Name</Label>
                                    <Input type="text" name="assetName" defaultValue="Tether USD" />
                                    <FormText color="muted">Friendly name of the asset.</FormText>
                                </FormGroup>
                                <FormGroup>
                                    <Label>Unit Name</Label>
                                    <Input type="text" name="unitName" defaultValue="USDT" />
                                    <FormText color="muted">Used to display asset units to user.</FormText>
                                </FormGroup>
                                <FormGroup>
                                    <Label>Asset URL</Label>
                                    <Input type="text" name="assetUrl" defaultValue="https://tether.co" />
                                    <FormText color="muted">Optional string pointing to a URL relating to the asset.</FormText>
                                </FormGroup>
                                <FormGroup>
                                    <Label>Manager</Label>
                                    <Input type="text" name="manager" defaultValue="2YI264DKCDYQX5XMVFAQYXBV3PRJATRBNUN2UKPYJGK6KWNRF6XYUVPHQA" />
                                    <FormText color="muted">Specified address can change reserve, freeze, clawback, and manager.</FormText>
                                </FormGroup>
                                <FormGroup>
                                    <Label>Reserve</Label>
                                    <Input type="text" name="reserve" defaultValue="2YI264DKCDYQX5XMVFAQYXBV3PRJATRBNUN2UKPYJGK6KWNRF6XYUVPHQA" />
                                    <FormText color="muted">Specified address is consnameered the asset reserve (it has no special privileges, this is only informational).</FormText>
                                </FormGroup>
                                <FormGroup>
                                    <Label>Freeze</Label>
                                    <Input type="text" name="freeze" defaultValue="2YI264DKCDYQX5XMVFAQYXBV3PRJATRBNUN2UKPYJGK6KWNRF6XYUVPHQA" />
                                    <FormText color="muted">Specified address can freeze or unfreeze user asset holdings.</FormText>
                                </FormGroup>
                                <FormGroup>
                                    <Label>Clawback</Label>
                                    <Input type="text" name="clawback" defaultValue="2YI264DKCDYQX5XMVFAQYXBV3PRJATRBNUN2UKPYJGK6KWNRF6XYUVPHQA" />
                                    <FormText color="muted">Specified address can revoke user asset holdings and send them to other addresses.</FormText>
                                </FormGroup>
                                <Button
                                    color={this.state.isLoading ? "secondary" : "primary"}
                                    disabled={this.state.isLoading}
                                    type="submit"
                                >
                                    {this.state.isLoading ? "Creating..." : "Create Asset"}
                                </Button>
                            </Form>
                            {this.state.showResult ? <p>Created Asset ID: {this.state.assetId}</p> : null}
                        </Row>
                    </Container>
                </Jumbotron>
            </div>
        );
    }
}

export default Asset;
