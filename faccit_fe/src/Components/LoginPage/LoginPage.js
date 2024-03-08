import React, { useEffect, useState } from "react";
import "./LoginPage.css";
import { useNavigate } from "react-router-dom";
import https from "../../https";
// import { setAdmins } from "../../redux/admins.js";
// import { setSuperAdmins } from "../../redux/superAdmins.js";
// import { useDispatch, useSelector } from "react-redux";
// import http from "../../https.js";
// import toast from "react-hot-toast";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import toast from "react-hot-toast";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = () => {
    const attemptLogin = {
      email: email,
      password: password,
    };

    https
      .post("login", attemptLogin)
      .then((result) => {
        const decodedToken = jwtDecode(result.data);
        sessionStorage.setItem("Surname", decodedToken.surname);
        sessionStorage.setItem("Firstname", decodedToken.firstname);
        // sessionStorage.setItem("Role", decodedToken.role);
        sessionStorage.setItem("Token", result.data);
        redirectToDashboard(decodedToken.role);
      })
      .catch((err) => {
        toast.error(err.response.data.error);
      });
  };

  const redirectToDashboard = (role) => {
    if (role === "super_admin") {
      navigate("dashboard");
    } else {
      navigate("SubjectManagement");
    }
  };

  return (
    <>
      <section className="login p-5 d-flex justify-content-center align-items-center">
        <div className="w-50 rounded  d-flex main-container">
          <div className="d-flex w-50 flex-column  rounded-start justify-content-center align-items-center left-side left-container">
            <img
              src={require("../../Assets/images/Neuron_transparent.png")}
              className="left-img"
            />
            <h2 className="left-h2">FACCIT</h2>
          </div>
          <div className="w-50 right-container container-fluid">
            <form
              action=""
              className="formbody d-flex justify-content-center align-items-center flex-column"
            >
              <div className="inputBox w-100">
                <input
                  type="text"
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  required
                />
                <span>Email</span>
              </div>
              <div className="inputBox w-100 my-3">
                <input
                  type="password"
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  required
                />
                <span>Password</span>
              </div>
              <button
                type="button"
                className="border btn-submit btn btn-outline-light text-dark px-5 py-3 w-100"
                onClick={() => handleLogin()}
              >
                SIGN IN
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}

export default LoginPage;
