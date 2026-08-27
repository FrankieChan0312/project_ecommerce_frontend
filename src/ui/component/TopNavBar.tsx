import {
  Button,
  Container,
  Form,
  Navbar,
  Spinner
} from "react-bootstrap";

import {Link} from "@tanstack/react-router";
import {useContext} from "react";
import {CartContext} from "../../context/CartContext.tsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
  faCartShopping,
  faMagnifyingGlass
} from "@fortawesome/free-solid-svg-icons";

import {LoginUserContext} from "../../context/LoginUserContext.tsx";
import {signOut} from "../../authService/firebaseAuthService.ts";

import "./TopNavBar.css";

interface Props {
  searchKeyword?: string;
  onSearch?: (keyword: string) => void;
  showSearch?: boolean;
  showFavorite?: boolean;
}

export default function TopNavBar({
                                    searchKeyword = "",
                                    onSearch = () => {
                                    },
                                    showSearch = true,
                                    showFavorite = true
                                  }: Props) {

  const loginUser = useContext(LoginUserContext);
  const cartContext = useContext(CartContext);

  const cartItemCount =
      cartContext?.cartItemCount ?? 0;

  const renderLoginContainer = () => {

    if (loginUser) {

      return (
          <div className="grocery-navbar-actions">

            <div className="grocery-user-email d-none d-xl-block">
              {loginUser.email}
            </div>

            {
                showFavorite && (
                    <Link
                        to="/favorites"
                        className="grocery-icon-button"
                        aria-label="我的最愛"
                        title="我的最愛"
                    >
                      ♡
                    </Link>
                )
            }

            <Link
                to="/shoppingcart"
                className="grocery-icon-button"
                aria-label={`購物車，共 ${cartItemCount} 件商品`}
                title="購物車"
            >
              <div className="grocery-cart-icon-wrapper">

                <FontAwesomeIcon icon={faCartShopping}/>

                {
                    cartItemCount > 0 && (
                        <span className="grocery-cart-badge">
            {
              cartItemCount > 99
                  ? "99+"
                  : cartItemCount
            }
          </span>
                    )
                }

              </div>
            </Link>
            <Button
                className="grocery-logout-button"
                onClick={() => {
                  void signOut();
                }}
            >
              Logout
            </Button>

          </div>
      );

    } else if (loginUser === null) {

      return (
          <div className="grocery-navbar-actions">

            {
                showFavorite && (
                    <Link
                        to="/favorites"
                        className="grocery-icon-button"
                        aria-label="我的最愛"
                        title="我的最愛"
                    >
                      ♡
                    </Link>
                )
            }

            <Link
                to="/shoppingcart"
                className="grocery-icon-button"
                aria-label={`購物車，共 ${cartItemCount} 件商品`}
                title="購物車"
            >
              <div className="grocery-cart-icon-wrapper">

                <FontAwesomeIcon icon={faCartShopping}/>

                {
                    cartItemCount > 0 && (
                        <span className="grocery-cart-badge">
            {
              cartItemCount > 99
                  ? "99+"
                  : cartItemCount
            }
          </span>
                    )
                }

              </div>
            </Link>
            <Link
                to="/login"
                className="grocery-login-link"
            >
              Login
            </Link>
          </div>
      );

    } else {

      return (
          <Spinner
              animation="border"
              size="sm"
              variant="light"
          />
      );
    }
  };


  return (
      <>

        <div className="grocery-promo-bar">
          滿 HK$500 免費送貨
        </div>


        <Navbar
            expand="lg"
            className="grocery-navbar"
        >

          <Container>

            <Link
                to="/"
                className="text-decoration-none"
            >
              <Navbar.Brand className="grocery-brand">
                Frankie's Grocery
              </Navbar.Brand>
            </Link>


            <Navbar.Toggle
                aria-controls="grocery-navbar-collapse"
            />


            <Navbar.Collapse id="grocery-navbar-collapse">

              {
                  showSearch && (
                      <Form
                          className="grocery-search-form mx-lg-4 my-3 my-lg-0"
                          onSubmit={(event) => {
                            event.preventDefault();
                          }}
                      >
                        <div className="grocery-search-wrapper">

                          <FontAwesomeIcon
                              icon={faMagnifyingGlass}
                              className="grocery-search-icon"
                          />

                          <Form.Control
                              type="search"
                              placeholder="搜尋商品，例如：牛扒、三文魚、咖啡..."
                              aria-label="搜尋商品"
                              className="grocery-search-input"
                              value={searchKeyword}
                              onChange={(event) => {
                                onSearch(event.target.value);
                              }}
                          />

                        </div>
                      </Form>
                  )
              }


              <div className="ms-lg-auto">
                {renderLoginContainer()}
              </div>

            </Navbar.Collapse>

          </Container>

        </Navbar>

      </>
  );
}