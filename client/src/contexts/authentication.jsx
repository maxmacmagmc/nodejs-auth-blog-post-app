import React, { useState } from "react";

const AuthContext = React.createContext();

function AuthProvider(props) {
  const [state, setState] = useState({
    loading: null,
    error: null,
    user: null,
  });

  const login = async ({username, password}) => {
    try {
      const response = await fetch("http://localhost:4000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        console.log("Login successful", data.token);
        // Save token to LocalStorage or somewhere safe
        localStorage.setItem("token", data.token);
      } else {
        console.error("Login failed:", data.message);
      }
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  const register = async (username, password, firstName, lastName) => {
    try {
      const response = await fetch("http://localhost:4000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
          firstName,
          lastName,
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        console.log("User registered successfully:", data.message);
      } else {
        console.error("Registration failed:", data.message);
      }
    } catch (error) {
      console.error("Error registering:", error);
    }
  };
  

  const logout = () => {
    // Remove JWT token from localStorage
    localStorage.removeItem("token");
    console.log("Logged out successfully");
  };
  

  const isAuthenticated = Boolean(localStorage.getItem("token"));

  return (
    <AuthContext.Provider
      value={{ state, login, logout, register, isAuthenticated }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}

// this is a hook that consume AuthContext
const useAuth = () => React.useContext(AuthContext);

export { AuthProvider, useAuth };
