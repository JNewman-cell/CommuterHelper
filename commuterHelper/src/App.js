import React from 'react';
import Signup from "./components/Signup"
import { Container } from "react-bootstrap"
import { AuthProvider } from './contexts/AuthContext';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useSignInWithGoogle } from 'react-firebase-hooks/auth';
import CommutePage from './CommutePage';
import IndexPage from './IndexPage';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import ForgotPassword from './components/ForgotPassword';
import UpdateProfile from './components/UpdateProfile';
import PrivateRoute from './components/PrivateRoute';
import SignedInRoute from './components/SignedInRoute';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <div className="App">
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<IndexPage />} />
            <PrivateRoute path="/commute" element={<CommutePage />} />
            <SignedInRoute path="/signup" element={<Signup />} />
            <SignedInRoute path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <PrivateRoute path='/dashboard' element={<Dashboard/>}/>
            <PrivateRoute path="/update-profile" element={<UpdateProfile />} />
          </Routes>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
