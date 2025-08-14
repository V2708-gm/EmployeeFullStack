// src/App.js
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from "./components/Login";
import Register from "./components/Register";
import EmployeeManagement from "./components/EmployeeManagement";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    // Check if token exists and is valid
    const token = localStorage.getItem("token");
    if (token) {
      // You might want to add token validation here
      setIsLoggedIn(true);
    }
    setIsCheckingAuth(false);
  }, []);

  if (isCheckingAuth) {
    return <div>Loading...</div>; // Or a proper loading spinner
  }

  if (!isLoggedIn) {
    return (
      <>
        {showRegister ? (
          <Register 
            switchToLogin={() => setShowRegister(false)}
            onRegisterSuccess={() => setIsLoggedIn(true)}
          />
        ) : (
          <Login
            onLogin={() => setIsLoggedIn(true)}
            switchToRegister={() => setShowRegister(true)}
          />
        )}
        <ToastContainer
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </>
    );
  }

  return (
    <Router>
      <EmployeeManagement setIsLoggedIn={setIsLoggedIn} />
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </Router>
  );
}

export default App;