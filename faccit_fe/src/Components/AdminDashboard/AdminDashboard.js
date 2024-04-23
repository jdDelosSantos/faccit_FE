import React, { useState, useRef, useEffect } from "react";
import "../AdminDashboard/AdminDashboard.css";
import { jwtDecode } from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import https from "../../https";

function AdminDashboard() {
  const [tokenFirstname, setTokenFirstname] = useState("");
  const [component, setComponent] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const sessionToken = sessionStorage.getItem("Token");
  const decoded = jwtDecode(sessionToken);
  const tokenId = decoded.prof_id;

  const [classCount, setClassCount] = useState([]);
  const [classCountPL, setClassCountPL] = useState([]);
  const [classCountML, setClassCountML] = useState([]);

  const navigate = useNavigate();

  //Function for fetching Classes
  const fetchProfClasses = () => {
    https
      .get(`prof_all_classes/${tokenId}`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("Token")}`,
        },
      })
      .then((result) => {
        setClassCount(result.data.class_count);
      })
      .catch((error) => {
        if (error.response.data.message != "Unauthenticated.") {
          setError(true);
          console.log(error.response.data.message);
          setErrorMessage(error.response.data.message);
          toast.error(error.response.data.message, { duration: 7000 });
        } else {
          console.log(error.response.data.message);
          goBackToLogin();
        }
      });
  };

  const fetchProfClassesInPL = () => {
    https
      .get(`prof_all_classes_pl/${tokenId}`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("Token")}`,
        },
      })
      .then((result) => {
        setClassCountPL(result.data.class_count);
      })
      .catch((error) => {
        if (error.response.data.message != "Unauthenticated.") {
          setError(true);
          console.log(error.response.data.message);
          setErrorMessage(error.response.data.message);
          toast.error(error.response.data.message, { duration: 7000 });
        } else {
          console.log(error.response.data.message);
          goBackToLogin();
        }
      });
  };

  const fetchProfClassesInML = () => {
    https
      .get(`prof_all_classes_ml/${tokenId}`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("Token")}`,
        },
      })
      .then((result) => {
        setClassCountML(result.data.class_count);
      })
      .catch((error) => {
        if (error.response.data.message != "Unauthenticated.") {
          setError(true);
          console.log(error.response.data.message);
          setErrorMessage(error.response.data.message);
          toast.error(error.response.data.message, { duration: 7000 });
        } else {
          console.log(error.response.data.message);
          goBackToLogin();
        }
      });
  };

  useEffect(() => {
    fetchProfClasses();
    fetchProfClassesInPL();
    fetchProfClassesInML();
  }, []);

  const goBackToLogin = () => {
    sessionStorage.clear();
    navigate("/");
  };

  useEffect(() => {
    const sessionToken = sessionStorage.getItem("Token");
    // Check if token exists and is not empty
    if (sessionToken && sessionToken.length > 0) {
      try {
        const decodedToken = jwtDecode(sessionToken);
        // Use the decoded token for role checks
        if (decodedToken.role !== "admin") {
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
      sessionStorage.clear(); // console.warn("No token found in session storage");
      navigate("/");
    }
  }, [navigate]);

  if (component == false) {
    return;
  } else {
    return (
      <div className="base_bg w-100 p-4">
        <h1 className="my-1">
          <b>{tokenFirstname}'S DASHBOARD</b>
        </h1>

        <div className="shadow upper_bg rounded container-fluid w-100 p-4 d-flex flex-column">
          <div className="border container-fluid w-100 d-flex justify-content-md-between mb-2">
            <div className="bg-primary rounded w-25 p-3">
              <h3 className="text-white">CURRENT # OF CLASSES</h3>
              <span className="text-white fs-4">{classCount}</span>
            </div>
            <div className="bg-secondary rounded w-25 p-3">
              <h3 className="text-white">CURRENT # OF CLASSES LOADED IN PL</h3>
              <span className="text-white fs-4">{classCountPL}</span>
            </div>
            <div className="bg-success rounded w-25 p-3">
              <h3 className="text-white">CURRENT # OF CLASSES LOADED IN ML</h3>
              <span className="text-white fs-4">{classCountML}</span>
            </div>
          </div>
          <div className="container-fluid w-100 mt-5 d-flex"></div>
        </div>
      </div>
    );
  }
}

export default AdminDashboard;
