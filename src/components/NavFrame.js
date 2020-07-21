import React, { Component } from 'react';


import {
  Navbar,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle
} from 'reactstrap';

class NavFrame extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dropdownOpen: false,
    };
    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({ dropdownOpen: !this.state.dropdownOpen });
  }

  render() {
    return (
      <div>
        <Navbar color="inverse" light expand="md">
          <NavbarBrand href="/">Algorand React Demo</NavbarBrand>
          <Nav className="ml-auto" navbar>
            <NavItem>
              <NavLink href="/account">Create Account</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="https://bank.testnet.algorand.network/" target="_blank" rel="noopener noreferrer">Fund Account</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/asset">Create Asset</NavLink>
            </NavItem>
            <Dropdown nav isOpen={this.state.dropdownOpen} toggle={this.toggle}>
              <DropdownToggle nav caret>
                Send Transaction
          </DropdownToggle>
              <DropdownMenu>
                <DropdownItem href="/transaction-algo">Algo Payment Transaction</DropdownItem>
                <DropdownItem href="/transaction-optin">Opt-In Transaction</DropdownItem>
                <DropdownItem href="/transaction-asa">ASA Transaction</DropdownItem>
              </DropdownMenu>
            </Dropdown>
            <NavItem>
              <NavLink href="/orders">Limit Order</NavLink>
            </NavItem>
          </Nav>
        </Navbar>
      </div>
    );
  }
}

export default NavFrame;
