import {
  Button,
  Container,
  Form,
  Navbar,
  Spinner
} from "react-bootstrap";

import {
  Link
} from "@tanstack/react-router";

import {
  useContext,
  useState
} from "react";

import {
  FontAwesomeIcon
} from "@fortawesome/react-fontawesome";

import {
  faCartShopping,
  faMagnifyingGlass
} from "@fortawesome/free-solid-svg-icons";

import {
  CartContext
} from "../../context/CartContext.tsx";

import {
  LoginUserContext
} from "../../context/LoginUserContext.tsx";

import {
  signOut
} from "../../authService/firebaseAuthService.ts";

import "./TopNavBar.css";


interface Props {
  searchKeyword?: string;
  onSearch?: (
      keyword: string
  ) => void;
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

  const loginUser =
      useContext(LoginUserContext);


  const cartContext =
      useContext(CartContext);


  const [isLoggingOut, setIsLoggingOut] =
      useState(false);


  // The cart count is shared globally through CartContext
  // so the navbar stays synchronized across different pages.
  const cartItemCount =
      cartContext?.cartItemCount ?? 0;


  // =========================
  // Logout
  // =========================

  const handleLogout =
      async () => {

        try {

          setIsLoggingOut(true);


          // Keep the loading state visible briefly for UAT/demo feedback.
          // This delay can be removed before production if immediate
          // logout behavior is preferred.
          await new Promise(
              (resolve) =>
                  setTimeout(
                      resolve,
                      600
                  )
          );


          // Firebase sign-out triggers the global authentication
          // observer, which updates LoginUserContext automatically.
          await signOut();

        } finally {

          setIsLoggingOut(false);
        }
      };


  // =========================
  // Authentication actions
  // =========================

  const renderLoginContainer =
      () => {

        // Authenticated user
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
                    aria-label={
                      `購物車，共 ${cartItemCount} 件商品`
                    }
                    title="購物車"
                >

                  <div className="grocery-cart-icon-wrapper">

                    <FontAwesomeIcon
                        icon={faCartShopping}
                    />


                    {
                        cartItemCount > 0 && (

                            <span className="grocery-cart-badge">

                            {
                              // Prevent a very large quantity from
                              // overflowing the small navbar badge.
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
                      void handleLogout();
                    }}
                    disabled={isLoggingOut}
                >

                  {
                    isLoggingOut
                        ? (
                            <>
                              <Spinner
                                  animation="border"
                                  size="sm"
                                  className="me-2"
                              />

                              正在登出...
                            </>
                        )
                        : "Logout"
                  }

                </Button>

              </div>
          );
        }


        // Firebase has finished checking authentication
        // and confirmed that no user is logged in.
        if (loginUser === null) {

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
                    aria-label={
                      `購物車，共 ${cartItemCount} 件商品`
                    }
                    title="購物車"
                >

                  <div className="grocery-cart-icon-wrapper">

                    <FontAwesomeIcon
                        icon={faCartShopping}
                    />


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
        }


        // undefined means Firebase authentication state
        // is still being initialized.
        return (
            <Spinner
                animation="border"
                size="sm"
                variant="light"
            />
        );
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


            <Navbar.Collapse
                id="grocery-navbar-collapse"
            >

              {
                // Some workflow pages such as Cart, Checkout and Login
                // intentionally hide the product search bar.
                  showSearch && (

                      <Form
                          className="grocery-search-form mx-lg-4 my-3 my-lg-0"
                          onSubmit={(event) => {

                            // Search is controlled through React state,
                            // so the form should not reload the page.
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

                                // Pass the raw keyword to ProductListingPage,
                                // where the 300 ms debounce is handled.
                                onSearch(
                                    event.target.value
                                );
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