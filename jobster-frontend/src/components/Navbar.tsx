import { Navbar, Nav, Container, NavItem } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUsernameFromJwt } from '../utils/GetJwtUsername';
import { getRoleFromJwt } from '../utils/GetJwtRole';

export default function JobsterNavbar() {
  const { isLoggedIn, roles, logout } = useAuth();

  return (
    <Navbar bg="light" expand="lg" className="shadow-sm">
      <Container>
        {roles?.includes("ROLE_EMPLOYER") ? (
          <>
            <Navbar.Brand as={Link} to="/">Jobster for employers</Navbar.Brand>
          </>
        ) : (
          <>
            <Navbar.Brand as={Link} to="/">Jobster</Navbar.Brand>
          </>
        )}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {isLoggedIn && roles?.includes("ROLE_JOB_SEEKER") && (
              <>
                <NavItem as={Link} to="/" className="nav-link">
                  Job Posts
                </NavItem>
                <NavItem as={Link} to="/my-applications" className="nav-link">
                  My Applications
                </NavItem>
                <NavItem as={Link} to="profile" className="nav-link">
                  Profile
                </NavItem>
            </>
            )}
            {isLoggedIn && roles?.includes("ROLE_EMPLOYER") && (
              <>
                <NavItem as={Link} to="/create-post" className="nav-link">
                  Create Job Post
                </NavItem>
                <NavItem as={Link} to="/my-posts" className="nav-link">
                  My Job Posts
                </NavItem>
                <NavItem as={Link} to="profile" className="nav-link">
                  Profile
                </NavItem>
            </>
            )}
            <Nav className="d-flex align-items-center ms-auto">
            {isLoggedIn ? (
              <>
                <span className="me-2">
                  {getUsernameFromJwt()} ({getRoleFromJwt()})
                </span>
                <Nav.Link as="button" className="btn btn-link" onClick={logout}>
                  Logout
                </Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login" className="btn btn-link">
                  Log in
                </Nav.Link>
                <Nav.Link as={Link} to="/register" className="btn btn-link">
                  Register
                </Nav.Link>
              </>
            )}
          </Nav>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
