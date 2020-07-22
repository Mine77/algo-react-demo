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

const algo = require('../utility/algo');



class LimitOrder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showTable: false,
            rows: [{}],
            isTxLoading: false,
            showResult: false,
            txId: "",
            showError: false,
            errMsg: ""
        };
        // This binding is necessary to make `this` work in the callback
        this.handleSubmitCreateOrder = this.handleSubmitCreateOrder.bind(this);
        this.handleSubmitTakeOrder = this.handleSubmitTakeOrder.bind(this);
    }

    handleSubmitCreateOrder(event) {
        event.preventDefault();
        let contract = algo.createLimitOrder(
            event.target.accountMnemonic.value,
            event.target.assetID.value,
            event.target.assetAmount.value,
            event.target.algoAmount.value,
            event.target.minTrade.value
        )
        var row = {
            aseetID: event.target.assetID.value,
            algoAmount: event.target.algoAmount.value,
            assetAmount: event.target.assetAmount.value,
            contractAddress: contract.getAddress(),
            contract: contract
        }
        var rows = this.state.rows;
        if (!this.state.showTable)
            rows = [row];
        else
            rows.push(row);
        this.setState({
            showTable: true,
            rows: rows
        });
    }

    handleSubmitTakeOrder(event) {
        event.preventDefault();
        this.setState({
            isTxLoading: true
        })
        algo.sendLimitOrderSwapAssetsTx(
            event.target.accountMnemonic.value,
            event.target.assetAmount.value,
            event.target.algoAmount.value,
            this.state.rows[event.target.orderID.value].contract
        ).then((txId) => {
            this.setState({
                isTxLoading: false,
                showResult: true,
                txId: txId
            })
        }).catch((errMsg) => {
            this.setState({
                isTxLoading: false,
                showError: true,
                errMsg: "Error:" + errMsg
            })
        });
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
                                                <Input type="text" pattern="[0-9]*" name="minTrade" defaultValue="9999" />
                                                <FormText color="muted">Minimium number of microALGOs that may be traded.</FormText>
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <FormGroup>
                                                <Label>Asset Amount</Label>
                                                <Input type="text" pattern="[0-9]*" name="assetAmount" defaultValue="100" />
                                                <FormText color="muted">Number of assets for the order.</FormText>
                                            </FormGroup>
                                        </Col>
                                        <Col>
                                            <FormGroup>
                                                <Label>ALGO Amount</Label>
                                                <Input type="text" pattern="[0-9]*" name="algoAmount" defaultValue="10000" />
                                                <FormText color="muted">Number of microALGOs for the order.</FormText>
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                    <Button
                                        color="primary"
                                        type="submit"
                                    >
                                        Create Order
                                    </Button>
                                </Form>
                            </Col>
                            <Col sm="2"></Col>
                            <Col sm="5">
                                <h2>
                                    Take Order
                            </h2>
                                <Form onSubmit={this.handleSubmitTakeOrder} style={{ width: "450px" }}>
                                    <FormGroup>
                                        <Label>Account Mnemonic</Label>
                                        <Input style={{ height: "100px" }} type="textarea" name="accountMnemonic" defaultValue="road pigeon recipe process tube voyage syrup favorite near harvest upset survey baby maze all hamster peace define human foil hurdle sponsor panda absorb lamp" />
                                        <FormText color="muted">The account for sending the transaction.</FormText>
                                    </FormGroup>
                                    <FormGroup>
                                        <Label>Order ID</Label>
                                        <Input type="text" pattern="[0-9]*" name="orderID" defaultValue="0" />
                                        <FormText color="muted">ID of the order to take.</FormText>
                                    </FormGroup>
                                    <Row>
                                        <Col>
                                            <FormGroup>
                                                <Label>Asset Amount</Label>
                                                <Input type="text" pattern="[0-9]*" name="assetAmount" defaultValue="100" />
                                                <FormText color="muted">Number of assets for the order.</FormText>
                                            </FormGroup>
                                        </Col>
                                        <Col>
                                            <FormGroup>
                                                <Label>ALGO Amount</Label>
                                                <Input type="text" pattern="[0-9]*" name="algoAmount" defaultValue="10000" />
                                                <FormText color="muted">Number of microALGOs for the order.</FormText>
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                    <Button
                                        color={this.state.isTxLoading ? "secondary" : "primary"}
                                        disabled={this.state.isTxLoading}
                                        type="submit"
                                    >
                                        {this.state.isTxLoading ? "Sending Transaction..." : "Send Transaction"}
                                    </Button>
                                </Form>
                                <Container>
                                    {this.state.showResult ? <p>Transaction ID: <a href={"https://testnet.algoexplorer.io/tx/" + this.state.txId} target="_blank" rel="noopener noreferrer">{this.state.txId}</a></p> : null}
                                    {this.state.showError ? this.state.errMsg : null}
                                </Container>
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
                                    <th>Order ID</th>
                                    <th>Asset ID</th>
                                    <th>microALGOs Amount</th>
                                    <th>Asset Amount</th>
                                    <th>Contract Address</th>
                                </tr>
                            </thead>
                            {
                                this.state.showTable ?
                                    <tbody>
                                        {this.state.rows.map((r, i) => (
                                            <tr key={i}>
                                                <th>{i}</th>
                                                <td>{r.aseetID}</td>
                                                <td>{r.algoAmount}</td>
                                                <td>{r.assetAmount}</td>
                                                <td>{r.contractAddress}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    : null
                            }

                        </Table>
                    </Container>
                </Jumbotron>

            </div>
        );
    }
}

export default LimitOrder;