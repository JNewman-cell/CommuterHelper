import React, { useRef, useState } from "react"
import { Form, Button, Card, Alert, Container } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import { Link } from "react-router-dom"

function ForgotPassword() {
  const emailRef = useRef()
  const { resetPassword } = useAuth()
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()

    try {
      setMessage("")
      setError("")
      setLoading(true)
      await resetPassword(emailRef.current.value)
      setMessage("Check your inbox for further instructions")
    } catch {
      setError("Failed to reset password")
    }

    setLoading(false)
  }

  return (
    <Container
      className="d-flex align-items-center justify-content-center bg-secondary"
      style={{ minHeight: "100vh", minWidth: "100%" }}
    >
      <div className="w-100" style={{ maxWidth: "500px" }}>
        <Card>
          <Card.Body>
            <h2 className="text-center mb-4">Password Reset</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            {message && <Alert variant="success">{message}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group id="email" className="w-100 mt-4">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" ref={emailRef} required />
              </Form.Group>
              <div className="mb-3"></div>{/* Add space between the last Form.Group and the button */}
              <Button disabled={loading} className="w-100 mt-4" type="submit" style={{ boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)" }}>
                Reset Password
              </Button>
            </Form>
            <div className="w-100 text-center mt-4">
              <Link to="/login">Login</Link>
            </div>
            <div className="w-100 text-center mt-3">
              Need an account? <Link to="/signup">Sign Up</Link>
            </div>
          </Card.Body>
        </Card>
        
      </div>
    </Container>
  )
}
export default ForgotPassword;