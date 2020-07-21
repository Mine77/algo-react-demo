import React, { Component } from 'react';


import {
  Navbar,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
} from 'reactstrap';

class NavFrame extends Component {
  render() {
    return (
        <div>
          <Navbar color="inverse" light expand="md">
            <NavbarBrand href="/">Algorand Limit Order React Demo</NavbarBrand>
            <Nav className="ml-auto" navbar>
              <NavItem>
                <NavLink href="/account">Create Account</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="https://bank.testnet.algorand.network/" target="_blank">Fund Account</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="/asset">Create Asset</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="/transaction">Send Transaction</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="/orders">Orders</NavLink>
              </NavItem>
            </Nav>
          </Navbar>
        </div>
    );
  }
}

export default NavFrame;
