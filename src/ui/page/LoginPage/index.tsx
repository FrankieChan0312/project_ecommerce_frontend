import TopNavBar from "../../component/TopNavBar.tsx";
import {Alert, Button, Container, Form} from "react-bootstrap";
import {signInWithEmailAndPassword, signInWithGoogle} from "../../../authService/firebaseAuthService.ts";
import {useContext, useEffect, useState} from "react";
import {useNavigate, useRouter} from "@tanstack/react-router";
import {LoginUserContext} from "../../../context/LoginUserContext.tsx";
import {GoogleLoginButton} from "react-social-login-buttons";

export default function LoginPage() {
  const router = useRouter();
  const navigate = useNavigate({from:"/login/"});
  const loginUser = useContext(LoginUserContext)

  const [isLogining, setIsLogining] = useState(false);
  const [isLoginFailed, setIsLoginFailed] = useState(false);

  const handleEmailAndPasswordLogin = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLogining(true);

    const target = event.target as typeof event.target & {
      email: { value: string };
      password: { value: string };
    };
    const email = target.email.value; // typechecks!
    const password = target.password.value; // typechecks!
    const loginResult = await signInWithEmailAndPassword(email, password);
    if (loginResult) {
      router.history.back();
    } else {
      setIsLoginFailed(true);
      setIsLogining(false);

      console.log(loginResult);
    }
  }

  const handleGoogleSignIn= ()=>{
    void signInWithGoogle()
  }

  useEffect(() => {
    if(loginUser){
      void navigate({to:"/"});
    }
  },[loginUser]);
  return (
      <>
        <TopNavBar/>
        <Container>
          <Form onSubmit={handleEmailAndPasswordLogin}>
            {
              isLoginFailed &&
              <Alert variant="danger">
                Invalid email or password!
              </Alert>
            }

            < Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" placeholder="Enter email" name="email"/>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password" name="password"/>
            </Form.Group>

            <Button variant="primary" type="submit" className={"w-100"} disabled={isLogining}>
              Login
            </Button>
          </Form>
          <GoogleLoginButton onClick={handleGoogleSignIn}/>
        </Container>
      </>
  )
}