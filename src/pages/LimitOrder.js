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
    FormText,
    Row,
    Table
} from 'reactstrap';

const algosdk = require('algosdk');
const limitTemplate = require("algosdk/src/logicTemplates/limitorder");

class LimitOrder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rows: [{ 
                aseetID: "", 
                algoAmount: "",
                assetAmount: "",
                contractAddress: "",
                program: ""
            }]
        };
        // This binding is necessary to make `this` work in the callback
        this.createOrder = this.createOrder.bind(this);
        this.handleSubmitCreateOrder = this.handleSubmitCreateOrder.bind(this);
    }

    createOrder(mnemonic, assetID, assetAmount, algoAmount, minTrade) {

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

    handleSubmitCreateOrder(event) {
        event.preventDefault();
        let contract = this.createOrder(
            event.target.accountMnemonic.value,
            event.target.assetID.value,
            event.target.assetAmount.value,
            event.target.algoAmount.value,
            event.target.minTrade.value
        )
        var rows = this.state.rows;
        rows.push({ 
            aseetID: event.target.assetID.value, 
            algoAmount: event.target.algoAmount.value,
            assetAmount: event.target.assetAmount.value,
            contractAddress: contract.getAddress(),
            program: contract
        })
        this.setState({rows:rows});
    }

    render() {
        return (
            <div>
                <NavFrame></NavFrame>
                <Jumbotron>
                    <Container>
                        <Row>
                            <Col sm="5">
                                <h2>
                                    Create Order
                            </h2>
                                <Form onSubmit={this.handleSubmitCreateOrder} style={{ width: "450px" }}>
                                    <FormGroup>
                                        <Label>Account Mnemonic</Label>
                                        <Input style={{ height: "100px" }} type="textarea" name="accountMnemonic" defaultValue="bench outdoor conduct easily pony normal memory boat tiger together catch toward submit web stomach insane other list clap grain photo excess crush absorb illness" />
                                        <FormText color="muted">The account for sending the transaction.</FormText>
                                    </FormGroup>
                                    <Row>
                                        <Col>
                                            <FormGroup>
                                                <Label>Asset ID</Label>
                                                <Input type="text" pattern="[0-9]*" name="assetID" defaultValue="10842753" />
                                                <FormText color="muted">Number of assets for the order.</FormText>
                                            </FormGroup>
                                        </Col>
                                        <Col>
                                            <FormGroup>
                                                <Label>Minimium Trade Amount</Label>
                                                <Input type="text" pattern="[0-9]*" name="minTrade" defaultValue="10000" />
                                                <FormText color="muted">Minimium number of microALGOs that may be traded.</FormText>
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <FormGroup>
                                                <Label>Asset Amount</Label>
                                                <Input type="text" pattern="[0-9]*" name="assetAmount" defaultValue="1000" />
                                                <FormText color="muted">Number of assets for the order.</FormText>
                                            </FormGroup>
                                        </Col>
                                        <Col>
                                            <FormGroup>
                                                <Label>ALGO Amount</Label>
                                                <Input type="text" pattern="[0-9]*" name="algoAmount" defaultValue="10000000" />
                                                <FormText color="muted">Number of microALGOs for the order.</FormText>
                                            </FormGroup>
                                        </Col>
                                    </Row>

                                    <Button
                                        color={this.state.isLoading ? "secondary" : "primary"}
                                        disabled={this.state.isLoading}
                                        type="submit"
                                    >
                                        {this.state.isLoading ? "Creating..." : "Create Order"}
                                    </Button>
                                </Form>
                                {this.state.showResult ? <p>Asset ID: <a href={"https://testnet.algoexplorer.io/asset/" + this.state.assetId} target="_blank" rel="noopener noreferrer">{this.state.assetId}</a></p> : null}
                            </Col>
                            <Col sm="2"></Col>
                            <Col sm="5">
                                <h2>
                                    Take Order
                            </h2>
                                <Form onSubmit={this.handleSubmit} style={{ width: "450px" }}>
                                    <FormGroup>
                                        <Label>Account Mnemonic</Label>
                                        <Input style={{ height: "100px" }} type="textarea" name="accountMnemonic" defaultValue="road pigeon recipe process tube voyage syrup favorite near harvest upset survey baby maze all hamster peace define human foil hurdle sponsor panda absorb lamp" />
                                        <FormText color="muted">The account for sending the transaction.</FormText>
                                    </FormGroup>
                                    <FormGroup>
                                        <Label>Asset ID</Label>
                                        <Input type="text" pattern="[0-9]*" name="assetID" defaultValue="10842753" />
                                        <FormText color="muted">Number of assets for the order.</FormText>
                                    </FormGroup>
                                    <FormGroup>
                                        <Label>Program Code</Label>
                                        <Input style={{ height: "100px" }} type="textarea" name="program" />contract
                                    </FormGroup>
                                    <Row>
                                        <Col>
                                            <FormGroup>
                                                <Label>Asset Amount</Label>
                                                <Input type="text" pattern="[0-9]*" name="assetAmount" defaultValue="10000" />
                                                <FormText color="muted">Number of assets for the order.</FormText>
                                            </FormGroup>
                                        </Col>
                                        <Col>
                                            <FormGroup>
                                                <Label>ALGO Amount</Label>
                                                <Input type="text" pattern="[0-9]*" name="algoAmount" defaultValue="10" />
                                                <FormText color="muted">Number of microALGOs for the order.</FormText>
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                    <Button
                                        color={this.state.isLoading ? "secondary" : "primary"}
                                        disabled={this.state.isLoading}
                                        type="submit"
                                    >
                                        {this.state.isLoading ? "Creating..." : "Send Transaction"}
                                    </Button>
                                </Form>
                                {this.state.showResult ? <p>Asset ID: <a href={"https://testnet.algoexplorer.io/asset/" + this.state.assetId} target="_blank" rel="noopener noreferrer">{this.state.assetId}</a></p> : null}
                            </Col>
                        </Row>
                    </Container>
                </Jumbotron>
                <Jumbotron>
                    <Container>

                        <h2>Orderbook</h2>
                        <Table>
                            <thead>
                                <tr>
                                    <th>Asset ID</th>
                                    <th>microALGOs Amount</th>
                                    <th>Asset Amount</th>
                                    <th>Contract Address</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.rows.map((r) => (
                                    <tr key={r.aseetID}>
                                        <th>{r.aseetID}</th>
                                        <td>{r.algoAmount}</td>
                                        <td>{r.assetAmount}</td>
                                        <td>{r.contractAddress}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Container>
                </Jumbotron>

            </div>
        );
    }
}

export default LimitOrder;
