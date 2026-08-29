import {
  Alert,
  Button,
  Carousel,
  Container,
  Form,
  Spinner
} from "react-bootstrap";

import {
  useContext,
  useEffect,
  useState
} from "react";

import {
  useNavigate,
  useRouter
} from "@tanstack/react-router";

import {
  GoogleLoginButton
} from "react-social-login-buttons";

import TopNavBar
  from "../../component/TopNavBar.tsx";

import {
  signInWithEmailAndPassword,
  signInWithGoogle
} from "../../../authService/firebaseAuthService.ts";

import {
  LoginUserContext
} from "../../../context/LoginUserContext.tsx";

import "./LoginPage.css";


export default function LoginPage() {

  const router =
      useRouter();


  const navigate =
      useNavigate({
        from: "/login/"
      });


  const loginUser =
      useContext(LoginUserContext);


  const [isLogining, setIsLogining] =
      useState(false);


  const [isLoginFailed, setIsLoginFailed] =
      useState(false);


  // =========================
  // Email / password login
  // =========================

  const handleEmailAndPasswordLogin =
      async (
          event: React.SubmitEvent<HTMLFormElement>
      ) => {

        event.preventDefault();


        // Disable the form while Firebase is processing
        // the authentication request.
        setIsLogining(true);

        setIsLoginFailed(false);


        const target =
            event.target as typeof event.target & {
              email: {
                value: string
              };
              password: {
                value: string
              };
            };


        const email =
            target.email.value;


        const password =
            target.password.value;


        // Authentication is handled by Firebase.
        // The frontend receives only a success/failure result here.
        const loginResult =
            await signInWithEmailAndPassword(
                email,
                password
            );


        if (loginResult) {

          // Return the user to the previous page after
          // a successful email/password login.
          router.history.back();

        } else {

          // Keep the user on the login page and show
          // a friendly validation message.
          setIsLoginFailed(true);

          setIsLogining(false);
        }
      };


  // =========================
  // Google login
  // =========================

  const handleGoogleSignIn =
      () => {

        // Firebase opens the Google account selection popup
        // and updates the global authentication state on success.
        void signInWithGoogle();
      };


  // =========================
  // Authentication redirect
  // =========================

  useEffect(() => {

    // If an authenticated user reaches the login page,
    // redirect them back to the homepage.
    if (loginUser) {

      void navigate({
        to: "/"
      });
    }

  }, [
    loginUser,
    navigate
  ]);


  return (
      <>
        <TopNavBar
            showSearch={false}
            showFavorite={false}
        />


        <main className="login-page">

          <Container className="login-page-container">

            <div className="login-layout">


              {/* Decorative branding panel.
                  The carousel images do not contain required page content. */}
              <section className="login-brand-panel">

                <Carousel
                    fade
                    controls={false}
                    indicators={false}
                    interval={6000}
                    pause={false}
                    className="login-background-carousel"
                >

                  <Carousel.Item>

                    <img
                        src="https://project-image-bucket-2026.s3.ap-southeast-1.amazonaws.com/LoginBackground1.png"
                        alt=""
                        className="login-background-image"
                    />

                  </Carousel.Item>


                  <Carousel.Item>

                    <img
                        src="https://project-image-bucket-2026.s3.ap-southeast-1.amazonaws.com/LoginBackground2.png"
                        alt=""
                        className="login-background-image"
                    />

                  </Carousel.Item>


                  <Carousel.Item>

                    <img
                        src="https://project-image-bucket-2026.s3.ap-southeast-1.amazonaws.com/LoginBackground3.png"
                        alt=""
                        className="login-background-image"
                    />

                  </Carousel.Item>

                </Carousel>


                <div className="login-brand-overlay"/>


                <div className="login-brand-content">

                  <div className="login-brand-label">
                    FRANKIE'S GROCERY
                  </div>


                  <h1>
                    Fresh groceries.
                    <br/>
                    Simple shopping.
                  </h1>


                  <p>
                    精選優質食材，讓日常購物變得更簡單。
                  </p>


                  <div className="login-brand-features">

                    <div>
                      <span>✓</span>
                      精選新鮮食材
                    </div>


                    <div>
                      <span>✓</span>
                      簡單快捷網上購物
                    </div>


                    <div>
                      <span>✓</span>
                      滿 HK$500 免費送貨
                    </div>

                  </div>

                </div>

              </section>


              {/* Authentication form */}
              <section className="login-form-section">

                <div className="login-form-container">

                  <div className="login-form-heading">

                    <div className="login-welcome-label">
                      Welcome back
                    </div>


                    <h2>
                      登入你的帳戶
                    </h2>


                    <p>
                      登入後可以管理購物車及收藏商品。
                    </p>

                  </div>


                  {
                      isLoginFailed && (

                          <Alert
                              variant="danger"
                              className="login-error-alert"
                          >
                            Email 或密碼不正確，請再試一次。
                          </Alert>

                      )
                  }


                  <Form
                      onSubmit={
                        handleEmailAndPasswordLogin
                      }
                  >

                    <Form.Group
                        className="mb-3"
                        controlId="formBasicEmail"
                    >

                      <Form.Label>
                        Email
                      </Form.Label>


                      <Form.Control
                          type="email"
                          name="email"
                          placeholder="name@example.com"
                          autoComplete="email"
                          disabled={isLogining}
                          required
                      />

                    </Form.Group>


                    <Form.Group
                        className="mb-4"
                        controlId="formBasicPassword"
                    >

                      <Form.Label>
                        Password
                      </Form.Label>


                      <Form.Control
                          type="password"
                          name="password"
                          placeholder="輸入密碼"
                          autoComplete="current-password"
                          disabled={isLogining}
                          required
                      />

                    </Form.Group>


                    <Button
                        type="submit"
                        className="login-submit-button"
                        disabled={isLogining}
                    >

                      {
                        isLogining
                            ? (
                                <>
                                  <Spinner
                                      animation="border"
                                      size="sm"
                                      className="me-2"
                                  />

                                  登入中...
                                </>
                            )
                            : "Login"
                      }

                    </Button>

                  </Form>


                  <div className="login-divider">

                    <span>
                      或使用
                    </span>

                  </div>


                  <div className="login-google-wrapper">

                    <GoogleLoginButton
                        onClick={
                          handleGoogleSignIn
                        }
                    />

                  </div>


                  <div className="login-security-text">
                    安全登入由 Firebase Authentication 提供
                  </div>

                </div>

              </section>

            </div>

          </Container>

        </main>
      </>
  );
}