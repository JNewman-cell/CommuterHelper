import React, { useEffect, useRef, useState } from "react"
import { Container, Form, Button, Card, Alert } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import { auth } from "../firebase"
import { fetchSignInMethodsForEmail } from "firebase/auth"
import { Link, useNavigate  } from "react-router-dom"
import GoogleButton from 'react-google-button';

function Login() {
  const emailRef = useRef()
  const passwordRef = useRef()
  const { login, loginWithGoogle } = useAuth()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { currentUser } = useAuth();
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()

    try {
      setError("");
      setLoading(true);
    
      // Check if the email is associated with any existing accounts
      const methods = await fetchSignInMethodsForEmail(auth, emailRef.current.value);
    
      // If the email is associated with Google, show an appropriate error
      if (methods.includes("google.com")) {
        setError("This email is associated with a Google account. Please log in using Google.");
      } else {
        // If not, proceed with regular login
        await login(emailRef.current.value, passwordRef.current.value);
        navigate("/commute");
      }
    } catch (error) {
      console.error("Login Error:", error);
    
      if (error.code === "auth/user-not-found") {
        setError("User not found. Please check your email and try again.");
      } else if (error.code === "auth/wrong-password") {
        setError("Invalid password. Please try again.");
      } else {
        setError("Failed to log in. Please try again later.");
      }
    } finally {
      setLoading(false);
    }    
  }    

  async function handleGoogleSignIn() {
    try {
      setError("");
      setLoading(true);
      await loginWithGoogle();
      navigate("/commute");
    } catch (error) {
      setError("Failed to log in with Google");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container className="d-flex align-items-center justify-content-center bg-secondary" style={{ minHeight: "100vh", minWidth: "100%" }}>
      <div className="w-100" style={{ maxWidth: "500px" }}>
        <Card>
          <Card.Body>
            <h2 className="text-center mb-4">Log In</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group id="email" className="w-100 mt-4">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" ref={emailRef} required />
              </Form.Group>
              <Form.Group id="password" className="w-100 mt-4">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" ref={passwordRef} required />
              </Form.Group>
              <Button
                disabled={loading}
                className="w-100 mt-4"
                type="submit"
                style={{ boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)" }} // Adding drop shadow
              >
                Log In
              </Button>
            </Form>
            <div className="w-100 text-center mt-4">
              <Link to="/forgot-password">Forgot Password?</Link>
            </div>
            <div className="w-100 text-center mt-3">
              <p className="mb-0">Or</p>
            </div>
            <div className="w-100 text-center mt-3">
              <GoogleButton
                variant="outline-primary"
                disabled={loading}
                onClick={handleGoogleSignIn}
                className="w-100"
              >
                Log In with Google
              </GoogleButton>
            </div>
            <div className="w-100 text-center mt-4">
              Don't have an account? <Link to="/signup">Sign up here</Link>
            </div>
          </Card.Body>
        </Card>
        
      </div>
    </Container>
  )
}
export default Login;