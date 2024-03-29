import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Offcanvas from 'react-bootstrap/Offcanvas';
import './css/site.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faBars, faKey, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

function AdminNavbar() {
  const [showOffcanvas, setShowOffcanvas] = useState(false);

  const userFullName = localStorage.getItem("userFullName");

  const handleToggleOffcanvas = () => {
    setShowOffcanvas((prev) => !prev);
  };

  return (
    <Navbar className="navbar-dark bg-dark">
      <Container fluid>
        <Button variant="outline-light" onClick={handleToggleOffcanvas}>
          <FontAwesomeIcon icon={faBars} size='lg' />
        </Button>

        <Navbar.Brand href="/gsd">GSD Support Ticket System</Navbar.Brand>
        <Offcanvas
          className="custom-offcanvas"
          show={showOffcanvas}
          onHide={() => setShowOffcanvas(false)}
          placement="start"
        >

          <Offcanvas.Header closeButton={false} className='mt-1'>
            <Navbar.Brand><h5>{userFullName}</h5></Navbar.Brand>
            <div className="custom-close-button" onClick={() => setShowOffcanvas(false)}>
              <Button variant='outline-light'><FontAwesomeIcon icon={faArrowLeft} size='lg' /> </Button>
            </div>
          </Offcanvas.Header>

          <Offcanvas.Body className='mt-4'>
            <Nav className="justify-content-end flex-grow-1 pe-3">
              <Nav.Link href="/gsd">Home</Nav.Link>
            </Nav>

            <Container className='offCanvas-footer'>
              <NavDropdown title="Account" drop='up'>
                <NavDropdown.Item href="/gsd/account/password"><FontAwesomeIcon icon={faKey} /> Change Password</NavDropdown.Item>
                <NavDropdown.Item href="/gsd" onClick={handleSignout}><FontAwesomeIcon icon={faSignOutAlt} /> Signout</NavDropdown.Item>
              </NavDropdown>
            </Container>
          </Offcanvas.Body>

        </Offcanvas>
      </Container>
    </Navbar>
  );
}

export default AdminNavbar;

export function handleSignout(){
  localStorage.setItem("userId", "");
  localStorage.setItem("userLevel", "");
  localStorage.setItem("isLoggedIn", "");
  localStorage.setItem("facultyLoggedIn", "");
  localStorage.setItem("facCode", "");
  localStorage.setItem("userCommentId", "");
  localStorage.setItem("userFullName", "");
  localStorage.setItem("personnelLoggedIn", "");
  localStorage.setItem("selectedStatus", "0");
  localStorage.setItem("adminLoggedIn", "");
}
