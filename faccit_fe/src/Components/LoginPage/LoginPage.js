import React, { useEffect, useState } from "react";
import "./LoginPage.css";
import { useNavigate } from "react-router-dom";
// import { setAdmins } from "../../redux/admins.js";
// import { setSuperAdmins } from "../../redux/superAdmins.js";
// import { useDispatch, useSelector } from "react-redux";
// import http from "../../https.js";
// import toast from "react-hot-toast";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("SuperAdminStudentManagement");
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
