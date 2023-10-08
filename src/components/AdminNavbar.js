import { Container, NavLink, Navbar } from "react-bootstrap";

const AdminNavbar = () => {
  return ( 
    <>
      <Navbar className="nav-background" expand="lg" text="light">
        <Container>
          <Navbar.Brand className="brand">GSD</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <NavLink style={{ color: "white", marginRight: "10px" }} href="/admin/dashboard/">Home</NavLink>
            <NavLink style={{ color: "white", marginRight: "10px" }} href="/admin/addlocation/">Location</NavLink>
          </Navbar.Collapse>
          <Navbar.Collapse className="justify-content-end">
            <NavLink style={{ color: "white", marginRight: "10px" }} href="/">Signout</NavLink>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
   );
}
 
export default AdminNavbar;