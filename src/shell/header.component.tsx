import React from "react";
import { Link, useHistory } from "react-router-dom";
import { Navbar, Nav, Container, NavItem } from "react-bootstrap";
import { useAppContext } from "../context/app.context";
import { ActionType } from "../context/app.reducer";
import { Auth } from "aws-amplify";

export default function Header() {
  const history = useHistory();
  const { state, dispatch } = useAppContext();
  const { isAuthenticated } = state;

  async function handleLogout() {
    await Auth.signOut();

    dispatch && dispatch({ type: ActionType.SIGN_OUT });
    history.push("/login");
  }

  return (
    <Navbar collapseOnSelect expand="lg">
      <Container>
        <Navbar.Brand>
          <Link to="/">Serverless Note App</Link>
        </Navbar.Brand>
      </Container>
      <Navbar.Toggle />
      <Navbar.Collapse>
        {isAuthenticated ? (
          <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
        ) : (
          <Nav>
            <Nav.Link href="/signup">Signup</Nav.Link>
            <Nav.Link eventKey={2} href="/login">
              Login
            </Nav.Link>
          </Nav>
        )}
      </Navbar.Collapse>
    </Navbar>
  );
}
