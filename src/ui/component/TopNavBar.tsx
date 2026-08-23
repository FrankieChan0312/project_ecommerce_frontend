import {Button, Container, Navbar, Spinner} from "react-bootstrap";
import {Link} from "@tanstack/react-router";
import {LoginUserContext} from "../../context/LoginUserContext.tsx";
import {useContext} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCartShopping} from "@fortawesome/free-solid-svg-icons";
import {signOut} from "../../authService/firebaseAuthService.ts";

export default function TopNavBar() {
  const loginUser = useContext(LoginUserContext)
  const renderLoginContainer = () => {
    if (loginUser) {
      return (
          <>
            {
              <div className="text-white">
                {loginUser.email}
              </div>
            }
            <Link to={"/shoppingcart"}>
              <Button>
                <FontAwesomeIcon icon={faCartShopping} flip/>
              </Button>
            </Link>
            <Button variant="danger"
                    onClick={() => {
                      void signOut()
                    }}
            >
              Logout
            </Button>
          </>
      )
    } else if (loginUser === null) {
      return (
          <Link
              to="/login"
          >

            <Button variant="primary">
              Login
            </Button>
          </Link>
      )
    } else {
      return (
          <Spinner color="light"/>
      )
    }
  }

  return (
      <Navbar bg="dark" data-bs-theme="dark">
        <Container>

          <Link to="/" style={{textDecoration: "none"}}>
            <Navbar.Brand>
              Frankie's Grocery
            </Navbar.Brand>
          </Link>

          <Navbar.Toggle/>
          <Navbar.Collapse className="justify-content-end">
            {
              renderLoginContainer()
            }
          </Navbar.Collapse>
        </Container>
      </Navbar>
  )
}