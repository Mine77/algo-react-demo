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
} from 'reactstrap';

const algo = require('../utility/algo')


class Account extends Component {
    constructor(props) {
        super(props);
        this.state = { address: '', mnemonic: '' };
        // This binding is necessary to make `this` work in the callback
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        var wallet = algo.generateWallet();
        this.setState({
            address: wallet.account.addr,
            mnemonic: wallet.mnemonic
        })
    }

    render() {
        return (
            <div>
                <NavFrame></NavFrame>
                <Jumbotron>
                    <Container>
                        <Col>
                            <h2>
                                Create Account
                            </h2>
                            <Form>
                                <FormGroup>
                                    <Label for="Address">Address</Label>
                                    <Input style={{ width: "700px" }} name="address" id="address" defaultValue={this.state.address} />
                                </FormGroup>

                                <FormGroup>
                                    <Label for="Mnemonic">Mnemonic</Label>
                                    <Input style={{ width: "400px", height: "150px" }} type="textarea" name="mnemonic" id="mnemonic" defaultValue={this.state.mnemonic} />
                                </FormGroup>
                                <Button color="primary" onClick={this.handleClick}>
                                    Generate Account
                                </Button>
                            </Form>

                        </Col>


                    </Container>
                </Jumbotron>
            </div>
        );
    }
}

export default Account;
