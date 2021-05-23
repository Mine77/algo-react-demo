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

const algo = require("../utility/algo")

class Asset extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            showResult: false,
            assetId: 0,
            showError: false,
            errMsg: ""
        };
        // This binding is necessary to make `this` work in the callback
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();
        this.setState({
            isLoading: true
        })
        let defaultFrozen = false;
        if (event.target.defaultFrozen.value === "yes") {
            defaultFrozen = true;
        }
        algo.createAsset(
            event.target.accountMnemonic.value,
            defaultFrozen,
            Number(event.target.decimals.value),
            Number(event.target.totalIssuance.value),
            event.target.unitName.value,
            event.target.assetName.value,
            event.target.assetUrl.value,
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
                        <Col>
                            <h2>
                                Create Asset
                            </h2>
                            <Form onSubmit={this.handleSubmit} style={{ width: "650px" }}>
                                <FormGroup>
                                    <Label>Account Mnemonic</Label>
                                    <Input style={{ height: "100px" }} type="textarea" name="accountMnemonic" defaultValue="bench outdoor conduct easily pony normal memory boat tiger together catch toward submit web stomach insane other list clap grain photo excess crush absorb illness" />
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
                                    <Input type="text" pattern="[0-9]*" name="totalIssuance" defaultValue="100000" />
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
                            <Container>
                                {this.state.showResult ? <p>Asset ID: <a href={"https://testnet.algoexplorer.io/asset/" + this.state.assetId} target="_blank" rel="noopener noreferrer">{this.state.assetId}</a></p> : null}
                                {this.state.showError ? this.state.errMsg : null}
                            </Container>
                        </Col>
                    </Container>
                </Jumbotron>
            </div>
        );
    }
}

export default Asset;
