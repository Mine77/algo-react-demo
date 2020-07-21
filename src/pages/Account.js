import React, { Component } from 'react';
import NavFrame from '../components/NavFrame';
import {
    Container,
    Row,
    Col,
    Jumbotron,
    Button,
    Form,
    Label,
    Input,
    FormGroup,
} from 'reactstrap';
const algosdk = require('algosdk');


class Account extends Component {
    constructor(props) {
        super(props);
        this.state = { keys: '', mnemonic: '' };
        // This binding is necessary to make `this` work in the callback
        this.generateWallet = this.generateWallet.bind(this);
    }
    generateWallet() {
        var keys = algosdk.generateAccount();
        var mnemonic = algosdk.secretKeyToMnemonic(keys.sk);
        this.setState({ keys: keys.addr, mnemonic: mnemonic });
    }
    render() {
        return (
            <div>
                <NavFrame></NavFrame>
                <Jumbotron>
                    <Container>
                        <Row>
                            <Form>
                                <Col>
                                    <Button color="primary" onClick={this.generateWallet}>
                                        Generate Account
                                </Button>
                                </Col>
                                <Col>
                                    <FormGroup>
                                        <Label for="Address">Address</Label>
                                        <Input style={{ width: "700px" }} name="address" id="address" value={this.state.keys} />
                                    </FormGroup>
                                </Col>
                                <Col>
                                    <FormGroup>
                                        <Label for="Mnemonic">Mnemonic</Label>
                                        <Input style={{ width: "400px", height: "150px" }} type="textarea" name="mnemonic" id="mnemonic" value={this.state.mnemonic} />
                                    </FormGroup>
                                </Col>
                            </Form>
                            
                        </Row>


                    </Container>
                </Jumbotron>
            </div>
        );
    }
}

export default Account;
