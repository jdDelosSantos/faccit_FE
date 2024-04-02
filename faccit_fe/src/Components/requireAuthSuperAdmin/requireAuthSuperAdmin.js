import React, { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function requireAuthSuperAdmin(Component) {
  return function AuthGuard({ navigate }) {
    const navigate = useNavigate();
    useEffect(() => {
      const sessionToken = sessionStorage.getItem("Token");
      // Check if token exists and is not empty
      if (sessionToken && sessionToken.length > 0) {
        try {
          const decodedToken = jwtDecode(sessionToken);
          // Use the decoded token for role checks
          if (decodedToken.role !== "super_admin") {
            sessionStorage.clear();
            navigate("/");
          } else {
            setTokenFirstname(decodedToken.user_firstname.toUpperCase());
            setComponent(true);
          }
        } catch (error) {
          console.error("Error decoding token:", error);
          // Handle the decoding error (e.g., redirect to login)
          sessionStorage.clear();
          navigate("/");
        }
      } else {
        console.warn("No token found in session storage");
        navigate("/");
      }
    }, [navigate]);
    return <Component />;
  };
}
