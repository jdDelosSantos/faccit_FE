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

          setErrorMessage(error.response.data.message);
          toast.error(error.response.data.message, { duration: 7000 });
        } else {
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

          setErrorMessage(error.response.data.message);
          toast.error(error.response.data.message, { duration: 7000 });
        } else {
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

          setErrorMessage(error.response.data.message);
          toast.error(error.response.data.message, { duration: 7000 });
        } else {
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

        <div className="shadow upper_bg rounded container-fluid w-100 p-5 d-flex flex-column">
          <div className="container-fluid w-100 d-flex justify-content-md-between mb-2 mt-3">
            <div className="bg-light rounded w-25 p-4 shadow">
              <h3 className="text-dark">
                <b>CURRENT # OF CLASSES</b>
              </h3>
              <span className="text-dark fs-4">{classCount}</span>
            </div>
            <div className="bg-light rounded w-25 p-4 shadow">
              <h3 className="text-dark">
                <b>CURRENT # OF CLASSES LOADED IN PL</b>
              </h3>
              <span className="text-dark fs-4">{classCountPL}</span>
            </div>
            <div className="bg-light rounded w-25 p-4 shadow">
              <h3 className="text-dark">
                <b>CURRENT # OF CLASSES LOADED IN ML</b>
              </h3>
              <span className="text-dark fs-4">{classCountML}</span>
            </div>
          </div>
          <div className="container-fluid w-100 mt-5 d-flex">
            <div className="border container-fluid d-flex justify-content-between mb-3">
              <a
                href="/admin/labs/programming-lab"
                className="bg-primary rounded w-25 p-4 mx-2"
              >
                <img
                  src={require("../../Assets/images/pl.png")}
                  className="dashboard_img mx-1"
                  alt="list"
                />
                <span className="text-white mx-1">Programming Lab</span>
              </a>

              <a
                href="/admin/labs/multimedia-lab"
                className="bg-secondary rounded w-25 p-4 mx-2"
              >
                <img
                  src={require("../../Assets/images/ml.png")}
                  className="dashboard_img mx-1"
                  alt="list"
                />
                <span className="text-white mx-1">Multimedia Lab</span>
              </a>

              <a
                href="/admin/managements/attendances/students"
                className="bg-success rounded w-25 p-4 mx-2"
              >
                <img
                  src={require("../../Assets/images/dashboard_attendance.png")}
                  className="dashboard_img mx-1"
                  alt="list"
                />
                <span className="text-white mx-1">Student Attendances</span>
              </a>

              <a
                href="/admin/managements/classes"
                className="bg-info rounded w-25 p-4 mx-2"
              >
                <img
                  src={require("../../Assets/images/classes.png")}
                  className="dashboard_img mx-1"
                  alt="list"
                />
                <span className="text-white mx-1">Your Classes</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AdminDashboard;
