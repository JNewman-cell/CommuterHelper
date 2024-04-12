import React, { useState } from "react";
import { Container, Card, Button, Alert } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";

function Dashboard() {
  const [error, setError] = useState("");
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    setError("");

    try {
      await logout();
      navigate("/");
    } catch {
      setError("Failed to log out");
    }
  }

  // Check if the authentication provider is not Google
  const isGoogleProvider = currentUser.providerData.some(
    (provider) => provider.providerId === "google.com"
  );
  const showUpdateProfileButton = !isGoogleProvider;

  return (
    <Container
      className="d-flex align-items-center justify-content-center bg-secondary"
      style={{ minHeight: "100vh", minWidth: "100%" }}
    >
      <div className="w-100" style={{ maxWidth: "500px" }}>
        <Card>
          <Card.Body>
            <h2 className="text-center mb-4">Profile</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <div className="w-100 mt-4">
              <strong>Email:</strong> {currentUser.email}
            </div>
            <div>
              {/* Conditional rendering of the Update Profile button */}
              {showUpdateProfileButton && (
                <Link to="/update-profile" className="btn btn-primary w-100 mt-4">
                  Update Profile
                </Link>
              )}
            </div>
            <Button variant="warning" onClick={handleLogout} className="w-100 mt-4" style={{ boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)" }}>
              Log Out
            </Button>
          </Card.Body>
        </Card>
      </div>
    </Container>
  );
}
export default Dashboard;
