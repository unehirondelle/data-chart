import React from 'react';
import {Navbar, Nav} from "react-bootstrap";

const Header = () => {
    return (
        <Navbar bg='dark' variant='dark' expand='lg'>
            <Navbar.Brand href="#home">Dashboard</Navbar.Brand>
        </Navbar>
    );
}
export default Header;
