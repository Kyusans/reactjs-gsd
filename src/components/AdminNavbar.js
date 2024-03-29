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
import AddPersonnel from './AddPersonnel';
import { handleSignout } from './NavBar';
import AdminAddClient from './AdminAddClient';
import AddEquipmentModal from './AdminAddEquipment';
import AddDepartment from './AddDepartment';

function AdminNavbar() {
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [showAddPersonnel, setShowAddPersonnel] = useState(false);
  const hideAddPersonnel = () => { setShowAddPersonnel(false); };
  const openAddPersonnel = () => { setShowAddPersonnel(true); };

  const [showAddClient, setShowAddClient] = useState(false);
  const hideAddClient = () => { setShowAddClient(false); };
  const openAddClient = () => { setShowAddClient(true); };

  const [showAddEquipment, setShowAddEquipment] = useState(false);
  const hideAddEquipment = () => { setShowAddEquipment(false); };
  const openAddEquipment = () => { setShowAddEquipment(true); };

  const [showAddDepartment, setShowAddDepartment] = useState(false);
  const hideAddDepartment = () => { setShowAddDepartment(false); };
  const openAddDepartment = () => { setShowAddDepartment(true); };

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

        <Navbar.Brand href="/gsd/admin/dashboard/">GSD Support Ticket System</Navbar.Brand>
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
              <Nav.Link href="/gsd/admin/dashboard/">Home</Nav.Link>
              <Nav.Link href="/gsd/report/">Report</Nav.Link>
              <Nav.Link onClick={openAddPersonnel}>Add Personnel</Nav.Link>
              <Nav.Link onClick={openAddClient}>Add Client</Nav.Link>
              <Nav.Link onClick={openAddEquipment}>Add Equipment</Nav.Link>
              <Nav.Link onClick={openAddDepartment}>Add Department</Nav.Link>
              <Nav.Link href="/gsd/admin/addlocation/">Add Location</Nav.Link>
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
      <AddPersonnel show={showAddPersonnel} onHide={hideAddPersonnel} />
      <AdminAddClient show={showAddClient} onHide={hideAddClient} />
      <AddEquipmentModal show={showAddEquipment} onHide={hideAddEquipment} />
      <AddDepartment show={showAddDepartment} onHide={hideAddDepartment} />
    </Navbar>
  );
}

export default AdminNavbar;