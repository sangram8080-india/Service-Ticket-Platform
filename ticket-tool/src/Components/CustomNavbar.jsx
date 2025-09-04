// src/Components/CustomNavbar.js
import React from "react";
import { Navbar, Nav, Container, Button, Dropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaChevronDown } from "react-icons/fa";
import "../Styles/CustomNavbar.css";

const CustomNavbar = () => {
  return (
    <Navbar expand="lg" sticky="top" bg="light" className="shadow-sm custom-navbar py-2">
      <Container fluid className="px-4">
        {/* Logo */}
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center logo-brand fw-bold">
          <span className="logo-icon me-2 animate-pop">🎟️</span>
          <span className="brand-text">ServiceHub</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="navbar-content" />

        <Navbar.Collapse id="navbar-content">
          {/* Left Navigation */}
          <Nav className="me-auto align-items-center gap-3">
            <Nav.Link as={Link} to="/" className="nav-link-custom">Home</Nav.Link>
            <Nav.Link as={Link} to="/about" className="nav-link-custom">About</Nav.Link>
            <Nav.Link as={Link} to="/services" className="nav-link-custom">Services</Nav.Link>
            
            {/* Tickets Dropdown */}
            <Dropdown>
              <Dropdown.Toggle variant="link" className="nav-link-custom dropdown-toggle-no-arrow">
                Tickets <FaChevronDown size={10} style={{ marginLeft: 4 }} />
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item as={Link} to="/tickets/high">High Priority</Dropdown.Item>
                <Dropdown.Item as={Link} to="/tickets/medium">Medium Priority</Dropdown.Item>
                <Dropdown.Item as={Link} to="/tickets/low">Low Priority</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Nav>

          {/* Right Side Actions */}
          <Nav className="align-items-center gap-3">
            <Button as={Link} to="/contact" className="demo-btn px-4">Contact Us</Button>
            <Nav.Link as={Link} to="/login" className="nav-link-custom">Login</Nav.Link>
            <Nav.Link as={Link} to="/register" className="nav-link-custom">Sign Up</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;
