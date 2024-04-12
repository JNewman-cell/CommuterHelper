import React from "react";
import { Route, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function SignedInRoute({ children, ...rest }) {
  const { currentUser } = useAuth();

  return (
    <Route
      {...rest}
      element={currentUser ? children : <Navigate to="/" replace />}
    />
  );
}

export default SignedInRoute;
