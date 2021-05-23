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

const algo = require('../utility/algo');

class TransactionASA extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            showResult: false,
            txId: 0
        };
        // This binding is necessary to make `this` work in the callback
        this.handleSubmitASA = this.handleSubmitASA.bind(this);
    }

    handleSubmitASA(event) {
        event.preventDefault();
        this.setState({
            isLoading: true
        })
        algo.sendAssetTransaction(
            event.target.accountMnemonic.value,
            event.target.toAddress.value,
            Number(event.target.assetID.value),
            Number(event.target.amount.value)
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
                                Send ASA Transaction
                            </h2>
                            <h5><small>To Opt-In for an asset, send an ASA transaction to the address itself with an amount of 0.</small></h5>
                            <Form onSubmit={this.handleSubmitASA} style={{ width: "650px" }}>
                                <FormGroup>
                                    <Label>Account Mnemonic</Label>
                                    <Input style={{ height: "100px" }} type="textarea" name="accountMnemonic" defaultValue="road pigeon recipe process tube voyage syrup favorite near harvest upset survey baby maze all hamster peace define human foil hurdle sponsor panda absorb lamp" />
                                    <FormText color="muted">The account for sending the transaction.</FormText>
                                </FormGroup>
                                <FormGroup>
                                    <Label>To Address</Label>
                                    <Input type="text" name="toAddress" defaultValue="B7K3C7ZOG5JMVMDZRUZ6HWWZYCXYBPNZADAP3MLTZE5MUA56DK4SU762M4" />
                                    <FormText color="muted">Send assets to this address.</FormText>
                                </FormGroup>
                                <FormGroup>
                                    <Label>Asset ID</Label>
                                    <Input type="text" pattern="[0-9]*" name="assetID" defaultValue="10842753" />
                                    <FormText color="muted">The ID of the asset to send.</FormText>
                                </FormGroup>
                                <FormGroup>
                                    <Label>Amount</Label>
                                    <Input type="text" pattern="[0-9]*" name="amount" defaultValue="0" />
                                    <FormText color="muted">Amount of assets to send.</FormText>
                                </FormGroup>
                                <Button
                                    color={this.state.isLoading ? "secondary" : "primary"}
                                    disabled={this.state.isLoading}
                                    type="submit"
                                >
                                    {this.state.isLoading ? "Sending..." : "Send Transaction"}
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

export default TransactionASA;