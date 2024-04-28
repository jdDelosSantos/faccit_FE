import React, { useState, useRef, useEffect } from "react";
import "../SuperAdminProfile/SuperAdminProfile.css";
import { jwtDecode } from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import https from "../../https";

function SuperAdminProfile() {
  const [tokenFirstname, setTokenFirstname] = useState("");
  const [component, setComponent] = useState(false);
  const navigate = useNavigate();

  const [profId, setProfId] = useState("");
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");

  const [updateProfId, setUpdateProfId] = useState("");
  const [updateLastName, setUpdateLastName] = useState("");
  const [updateFirstName, setUpdateFirstName] = useState("");
  const [updateEmail, setUpdateEmail] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [retypePassword, setRetypePassword] = useState("");

  const [seeCurrentPassword, setSeeCurrentPassword] = useState(false);
  const [seeNewPassword, setSeeNewPassword] = useState(false);
  const [seeRetypePassword, setSeeRetypePassword] = useState(false);

  const handleSeeCurrentPassword = (event) => {
    setSeeCurrentPassword(event.target.checked);
  };
  const handleSeeNewPassword = (event) => {
    setSeeNewPassword(event.target.checked);
  };
  const handleSeeRetypePassword = (event) => {
    setSeeRetypePassword(event.target.checked);
  };

  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const goBackToLogin = () => {
    sessionStorage.clear();
    navigate("/");
  };

  const sessionToken = sessionStorage.getItem("Token");
  let decoded;
  let tokenEmail;

  if (sessionToken) {
    decoded = jwtDecode(sessionToken);
    tokenEmail = decoded.email;
  } else {
    goBackToLogin();
  }

  const fetchUserInfo = () => {
    try {
      https
        .get(`super_admin_info/${tokenEmail}`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("Token")}`,
          },
        })
        .then((result) => {
          setLastName(result.data.user_lastname);
          setFirstName(result.data.user_firstname);
          setEmail(result.data.email);
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
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const handleProfUpdate = () => {
    setUpdateLastName(lastName);
    setUpdateFirstName(firstName);
    setUpdateEmail(email);
  };

  const handleProfPassUpdate = (e) => {
    e.preventDefault();

    const data = {
      password: currentPassword,
      new_password: newPassword,
      retyped_password: retypePassword,
    };

    try {
      https
        .post(`update_pass_super_admin/${tokenEmail}`, data, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("Token")}`,
          },
        })
        .then((result) => {
          toast.success(result.data.message, { duration: 7000 });
          clearPassModal();
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
    } catch (err) {
      console.error(err);
    }
  };

  const clearModal = () => {
    setUpdateLastName("");
    setUpdateFirstName("");
    setUpdateEmail("");
  };

  const clearPassModal = () => {
    setCurrentPassword("");
    setNewPassword("");
    setRetypePassword("");
    setSeeCurrentPassword(false);
    setSeeNewPassword(false);
    setSeeRetypePassword(false);
  };

  const handleProfUpdateSubmit = (e) => {
    e.preventDefault();

    if (updateLastName === "" || updateFirstName === "") {
      toast.error("Lastname/Firstname needs input!", { duration: 7000 });
    } else {
      try {
        const data = {
          user_firstname: updateFirstName,
          user_lastname: updateLastName,
        };

        https
          .put(`super_admin_info_update/${tokenEmail}`, data, {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("Token")}`,
            },
          })
          .then((result) => {
            toast.success(result.data.message, { duration: 7000 });
            fetchUserInfo();
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
      } catch (err) {
        console.error(err);
      }
    }
  };

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
      sessionStorage.clear(); // console.warn("No token found in session storage");
      navigate("/");
    }
  }, [navigate]);

  if (component == false) {
    return;
  } else {
    return (
      <div className="base_bg w-100 p-4">
        <div className="w-75 container-fluid ">
          <h1 className="w-75 my-1">
            <b>{tokenFirstname}'S PROFILE SETTINGS</b>
          </h1>
        </div>

        <div className="shadow upper_bg rounded container-fluid w-75 p-3 d-flex flex-column">
          <div className="container-fluid d-flex justify-content-end px-5">
            <button
              className="btn btn-secondary btn-sm search_btn mx-2"
              type="button"
              data-bs-toggle="modal"
              data-bs-target="#staticBackdrop1"
              // onClick={() => handleProfPassUpdate()}
            >
              <img
                src={require("../../Assets/images/password.png")}
                width="25"
                height="25"
                alt="update_user"
              />
            </button>
            <button
              className="btn btn-primary btn-sm search_btn"
              type="button"
              data-bs-toggle="modal"
              data-bs-target="#staticBackdrop"
              onClick={() => handleProfUpdate()}
            >
              <img
                src={require("../../Assets/images/update_user.png")}
                width="25"
                height="25"
                alt="update_user"
              />
            </button>
          </div>
          <div className="container-fluid w-100 d-flex flex-column justify-content-md-center align-items-center mb-5 mt-3">
            <div className="inputBox2 w-50 mx-2">
              <input
                type="text"
                id="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                className="form-control"
                disabled
              />
              <span>Email</span>
            </div>

            <div className="inputBox2 w-50 mx-2">
              <input
                type="text"
                id="lastName"
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value);
                }}
                className="form-control"
                disabled
              />
              <span>Last Name</span>
            </div>

            <div className="inputBox2 w-50 mx-2">
              <input
                type="text"
                id="firstName"
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value);
                }}
                className="form-control"
                disabled
              />
              <span>First Name</span>
            </div>
          </div>
        </div>

        {/* MODAL FOR UPDATING PROF */}
        <div
          className="modal fade"
          id="staticBackdrop"
          data-bs-backdrop="static"
          data-bs-keyboard="false"
          tabIndex="-1"
          aria-labelledby="staticBackdropLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="staticBackdropLabel">
                  UPDATE PROFILE
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <form onSubmit={(e) => handleProfUpdateSubmit(e)}>
                <div className="modal-body ">
                  <div className="row d-flex justify-content-center align-items-center h-100">
                    <img
                      src={require("../../Assets/images/faith-cover-1280x420.png")}
                      className="w-100 rounded-top"
                      style={{
                        TopLeftRadius: ".3rem",
                        TopRightRadius: ".3rem",
                      }}
                      alt="cover"
                    />

                    <div className="card-body p-4 p-md-5">
                      {error == true ? (
                        <div className="d-flex justify-content-center">
                          <p className="text-danger fs-4">{errorMessage}</p>
                        </div>
                      ) : (
                        ""
                      )}

                      <div className="inputBox2 w-100">
                        <input
                          type="text"
                          id="updateEmail"
                          value={email || updateEmail || ""}
                          onChange={(e) => {
                            setUpdateEmail(e.target.value);
                          }}
                          className="form-control"
                          disabled
                        />
                        <span>Email</span>
                      </div>

                      <div className="inputBox3 w-100">
                        <input
                          type="text"
                          id="updateLastName"
                          value={updateLastName || ""}
                          onChange={(e) => {
                            setUpdateLastName(e.target.value);
                          }}
                          className="form-control"
                        />
                        <span>Last Name</span>
                      </div>

                      <div className="inputBox3 w-100">
                        <input
                          type="text"
                          id="updateFirstName"
                          value={updateFirstName || ""}
                          onChange={(e) => {
                            setUpdateFirstName(e.target.value);
                          }}
                          className="form-control"
                        />
                        <span>First Name</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                    onClick={clearModal}
                  >
                    CLOSE
                  </button>
                  <button
                    type="submit"
                    className="btn btn-success"
                    data-bs-dismiss="modal"
                  >
                    UPDATE
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* MODAL FOR UPDATING PASS */}
        <div
          className="modal fade"
          id="staticBackdrop1"
          data-bs-backdrop="static"
          data-bs-keyboard="false"
          tabIndex="-1"
          aria-labelledby="staticBackdropLabel1"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="staticBackdropLabel1">
                  UPDATE PASSWORD
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <form onSubmit={(e) => handleProfPassUpdate(e)}>
                <div className="modal-body ">
                  <div className="row d-flex justify-content-center align-items-center h-100">
                    <img
                      src={require("../../Assets/images/faith-cover-1280x420.png")}
                      className="w-100 rounded-top"
                      style={{
                        TopLeftRadius: ".3rem",
                        TopRightRadius: ".3rem",
                      }}
                      alt="cover"
                    />

                    <div className="card-body p-4 p-md-5">
                      {error == true ? (
                        <div className="d-flex justify-content-center">
                          <p className="text-danger fs-4">{errorMessage}</p>
                        </div>
                      ) : (
                        ""
                      )}
                      <div className="inputBox1 w-100 ">
                        <input
                          type={seeCurrentPassword ? "text" : "password"}
                          id="currentPassword"
                          value={currentPassword || ""}
                          onChange={(e) => {
                            setCurrentPassword(e.target.value);
                          }}
                          className="form-control"
                          required
                        />
                        <span>Current Password</span>
                      </div>

                      <div className="w-100 d-flex flex-row align-items-center">
                        <input
                          type="checkbox"
                          checked={seeCurrentPassword} // Set checkbox checked state
                          onChange={handleSeeCurrentPassword}
                        />
                        <p className="p-class mx-2 text-dark">
                          Show Current Password
                        </p>
                      </div>

                      <div className="inputBox1 w-100 mt-4">
                        <input
                          type={seeNewPassword ? "text" : "password"}
                          id="newPassword"
                          value={newPassword || ""}
                          onChange={(e) => {
                            setNewPassword(e.target.value);
                          }}
                          className="form-control"
                          required
                        />
                        <span>New Password</span>
                      </div>

                      <div className="w-100 d-flex flex-row align-items-center">
                        <input
                          type="checkbox"
                          checked={seeNewPassword} // Set checkbox checked state
                          onChange={handleSeeNewPassword}
                        />
                        <p className="p-class mx-2 text-dark">
                          Show New Password
                        </p>
                      </div>

                      <div className="inputBox1 w-100 mt-4">
                        <input
                          type={seeRetypePassword ? "text" : "password"}
                          id="retypePassword"
                          value={retypePassword || ""}
                          onChange={(e) => {
                            setRetypePassword(e.target.value);
                          }}
                          className="form-control"
                          required
                        />
                        <span>Retype Password</span>
                      </div>

                      <div className="w-100 d-flex flex-row align-items-center">
                        <input
                          type="checkbox"
                          checked={seeRetypePassword} // Set checkbox checked state
                          onChange={handleSeeRetypePassword}
                        />
                        <p className="p-class mx-2 text-dark">
                          Show Retyped Password
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                    onClick={clearPassModal}
                  >
                    CLOSE
                  </button>
                  <button
                    type="submit"
                    className="btn btn-success"
                    data-bs-dismiss="modal"
                  >
                    UPDATE
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default SuperAdminProfile;
