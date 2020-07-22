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

class TransactionAlgo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            showResult: false,
            txId: 0,
            showError: false,
            errMsg: ""
        };
        // This binding is necessary to make `this` work in the callback
        this.handleSubmitAlgo = this.handleSubmitAlgo.bind(this);
    }

    handleSubmitAlgo(event) {
        event.preventDefault();
        this.setState({
            isLoading: true
        })
        algo.sendPaymentTransaction(
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
                                Send ALGO Transaction
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

export default TransactionAlgo;

