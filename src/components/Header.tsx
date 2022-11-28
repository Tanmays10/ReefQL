import logo from "./assets/logo.png";
import { Link } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";

export default function Header() {
  return (
    <Navbar bg="dark" variant="dark">
      <Container>
        <Navbar.Brand href="#home">
          <Nav className="me-auto">
            <Nav.Link active as={Link} to="/"  >
              <img
                alt="ReefQL"
                src={logo}
                width="30"
                height="30"
                className="d-inline-block align-top"
              />{" "}
              ReefQL
            </Nav.Link>
            <Nav.Link  as={Link} to="/dashboard" >Dashboard</Nav.Link>
          </Nav>
        </Navbar.Brand>
      </Container>
    </Navbar>
  );
}
