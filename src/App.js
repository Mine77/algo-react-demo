import React, { Component } from 'react';
import NavFrame from './components/NavFrame';

import {
  Container,
  Row,
  Col,
  Jumbotron,
  Button
} from 'reactstrap';

class App extends Component {
  render() {
    return (
      <div>
        <NavFrame></NavFrame>
        <Jumbotron>
          <Container>
            <Row>
              <Col>
                <h1>Welcome to Algorand React Demo</h1>
                <p>
                  <Button
                    tag="a"
                    color="success"
                    size="large"
                    href="/account"
                  >
                    Start with Creating an Account
                                    </Button>
                </p>
              </Col>
            </Row>
          </Container>
        </Jumbotron>
      </div>
    );
  }
}

export default App;
