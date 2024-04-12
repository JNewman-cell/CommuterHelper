import React, { useRef, useState } from "react"
import { Container, Form, Button, Card, Alert } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import { Link, useNavigate } from "react-router-dom"

export default function Signup() {
  const emailRef = useRef()
  const passwordRef = useRef()
  const passwordConfirmRef = useRef()
  const { signup } = useAuth()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()

    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError("Passwords do not match")
    }

    try {
      setError("")
      setLoading(true)
      await signup(emailRef.current.value, passwordRef.current.value)
      navigate("/")
    } catch {
      console.log(error)
      setError("Failed to create an account")
    }

    setLoading(false)
  }

  return (
    <Container className="d-flex align-items-center justify-content-center bg-secondary" style={{ minHeight: "100vh", minWidth: "100%" }}>
      <div className="w-100" style={{ maxWidth: "500px" }}>
        <Card>
          <Card.Body>
            <h2 className="text-center mb-5">Sign Up</h2>
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
              <Form.Group id="password-confirm" className="w-100 mt-4">
                <Form.Label>Password Confirmation</Form.Label>
                <Form.Control type="password" ref={passwordConfirmRef} required />
              </Form.Group>
              <Button
                disabled={loading}
                className="w-100 mt-4"
                type="submit"
                style={{ boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)" }} // Adding drop shadow
              >
                Sign Up
              </Button>
            </Form>
            <div className="w-100 text-center mt-4">
              Already have an account? <Link to="/login">Log In</Link>
            </div>
          </Card.Body>
        </Card>
        
      </div>
    </Container>
  )
}
