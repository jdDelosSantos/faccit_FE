import React, { useState, useRef, useEffect } from "react";
import "./SuperAdminAdminManagementPage.css";
import Webcam from "react-webcam";
import { Carousel, Dropdown, Button } from "react-bootstrap";
import AWS from "aws-sdk";
import https from "../../https";
// import { setProfessors } from "../../Redux/professors";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import { jwtDecode } from "jwt-decode";

function SuperAdminAdminManagementPage() {
  //NEW PROFESSOR USE STATES
  const [lastname, setLastname] = useState("");
  const [firstname, setFirstname] = useState("");
  const [email, setEmail] = useState("");

  //UPDATE PROFESSOR USE STATES
  const [updateLastname, setUpdateLastname] = useState("");
  const [updateFirstname, setUpdateFirstname] = useState("");
  const [updateAdminId, setUpdateAdminId] = useState("");
  const [updateEmail, setUpdateEmail] = useState("");

  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  //WEBCAM REF FOR ADD AND UPDATE STUDENT MODAL
  const webcamRef = useRef(null);
  const updateWebcamRef = useRef(null);

  //THE AVAILABLE WEBCAMS FOR ADD AND UPDATE STUDENT MODAL
  const [webcams, setWebcams] = useState([]);

  //THE SELECTED WEBCAM FOR ADD AND UPDATE STUDENT MODAL
  const [selectedWebcam, setSelectedWebcam] = useState("");
  const [updatedSelectedWebcam, setUpdatedSelectedWebcam] = useState("");

  //TO SET WEBCAM ON AND OFF WHEN OPENING A MODAL
  const [isWebcamActive, setIsWebcamActive] = useState(false);

  //THE ARRAY WHERE SCREENSHOTS ARE INSERTED INTO FOR DISPLAY FOR ADD AND UPDATE STUDENT MODAL
  const [screenshots, setScreenshots] = useState([]);
  const [updatedScreenshots, setUpdatedScreenshots] = useState([]);

  //THE ARRAY FOR UPDATE STUDENT MODAL FOR DISPLAYING IMAGES FROM AWS S3
  const [updateImageUrls, setUpdateImageUrls] = useState([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  //SEARCHTERM FOR SEARCH BAR
  const [searchTerm, setSearchTerm] = useState("");

  //REACT-PAGINATION
  const [admins, setAdmins] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const filteredSortedData = [...admins].filter((item) => {
    const searchTerms = searchTerm.toLowerCase().split(" ");
    const matchingColumns = [
      "user_lastname",
      "user_firstname",
      "email",
      "user_status",
    ];

    return searchTerms.every((term) => {
      return matchingColumns.some((column) => {
        const regex = new RegExp(term, "i");
        return regex.test(item[column].toLowerCase());
      });
    });
  });

  const currentItems = filteredSortedData.slice(startIndex, endIndex);

  //UseEffect for loading Students and Courses every time it changes
  useEffect(() => {}, [admins]);

  //Function for fetching Students
  const fetchAdmins = () => {
    https
      .get("admins", {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("Token")}`,
        },
      })
      .then((result) => {
        setAdmins(result.data);
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

  //UseEffect for starting the function when loading the page
  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleSearchBar = (e) => {
    e.preventDefault();
    // Implement search functionality if needed
  };

  //FUNCTION FOR ADDING AN ADMIN
  const handleAdminSubmit = (e) => {
    e.preventDefault();

    const adminData = {
      email: email,
      user_lastname: lastname,
      user_firstname: firstname,
    };

    https
      .post("admins", adminData, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("Token")}`,
        },
      })
      .then((result) => {
        fetchAdmins();
        toast.success(result.data.message, { duration: 7000 });
        setEmail("");
        setLastname("");
        setFirstname("");
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

  //FUNCTION FOR PUTTING SELECTED PROFESSOR TO UPDATE FIELDS
  const handleAdminUpdate = async (
    email,
    user_lastname,
    user_firstname,
    id
  ) => {
    setUpdateEmail(email);
    setUpdateLastname(user_lastname);
    setUpdateFirstname(user_firstname);
    setUpdateAdminId(id);
  };

  //FUNCTION FOR UPDATING A PROFESSOR
  const handleUpdateAdminSubmit = (e) => {
    e.preventDefault();

    const updateAdminData = {
      user_lastname: updateLastname,
      user_firstname: updateFirstname,
    };

    https
      .put(`update_admin/${updateAdminId}`, updateAdminData, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("Token")}`,
        },
      })
      .then((result) => {
        fetchAdmins();
        toast.success(result.data.message, { duration: 7000 });
        clearAdminUpdate();
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

  const handleAdminDeactivate = (id) => {
    const adminData = {
      user_status: "Disabled",
    };

    https
      .put(`admin_deactivate/${id}`, adminData, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("Token")}`,
        },
      })
      .then((result) => {
        toast.error(result.data.message, { duration: 7000 });
        fetchAdmins();
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

  const handleAdminActivate = (id) => {
    const adminData = {
      user_status: "Active",
    };

    https
      .put(`admin_activate/${id}`, adminData, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("Token")}`,
        },
      })
      .then((result) => {
        toast.success(result.data.message, { duration: 7000 });
        fetchAdmins();
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

  const [adminId, setAdminId] = useState("");

  const handleResetPass = (id) => {
    setAdminId(id);
  };

  const handleResetAdminPass = (e) => {
    e.preventDefault();

    const data = {
      data: "hello",
    };
    try {
      https
        .put(`reset_admin_pass/${adminId}`, data, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("Token")}`,
          },
        })
        .then((result) => {
          toast.success(result.data.message, { duration: 7000 });
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
    } catch (error) {
      console.error(error);
    }
  };

  const clearAdminUpdate = () => {
    setUpdateEmail("");
    setUpdateLastname("");
    setUpdateFirstname("");
    setUpdateAdminId("");
  };

  const goBackToLogin = () => {
    sessionStorage.clear();
    navigate("/");
  };

  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!file) {
      setMessage("Please select a CSV file.");
      return;
    }

    const formData = new FormData();
    formData.append("csv_file", file);

    try {
      https
        .post("bulk_insert_admin", formData, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("Token")}`,
            "Content-Type": "multipart/form-data",
          },
        })
        .then((result) => {
          toast.success(result.data.message, { duration: 7000 });
          fetchAdmins();
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
    } catch (error) {
      setMessage("Error occurred during bulk insert.");
      toast.error(error, { duration: 7000 });
      console.error(error);
    }
  };

  const [tokenFirstname, setTokenFirstname] = useState("");
  const [component, setComponent] = useState(false);

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
        <h1 className="my-1">
          <b>{tokenFirstname}'S ADMIN MANAGEMENT PAGE</b>
        </h1>
        <h4 className="">LIST OF ADMINS</h4>
        <div className="shadow upper_bg rounded container-fluid w-100 p-3 px-5">
          <div className="table-responsive">
            <div className="w-100 d-flex justify-content-between align-items-center my-3">
              <div className="w-100 d-flex">
                <div className="w-75">
                  <div className="input-group">
                    <input
                      className="form-control"
                      type="search"
                      placeholder="Search Admin..."
                      aria-label="Search"
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="w-25 d-flex justify-content-end">
                <button
                  type="button"
                  data-bs-toggle="modal"
                  data-bs-target="#staticBackdrop2"
                  className="btn btn-secondary btn-sm mx-2"
                >
                  <img
                    src={require("../../Assets/images/bulk.png")}
                    width="25"
                    height="25"
                    style={{
                      TopLeftRadius: ".3rem",
                      TopRightRadius: ".3rem",
                    }}
                    alt="add_user"
                  />
                </button>
                <button
                  type="button"
                  data-bs-toggle="modal"
                  data-bs-target="#staticBackdrop"
                  className="btn btn-primary btn-sm"
                  onClick={() => {
                    setIsWebcamActive(true);
                  }}
                >
                  <img
                    src={require("../../Assets/images/add_user.png")}
                    width="25"
                    height="25"
                    style={{
                      TopLeftRadius: ".3rem",
                      TopRightRadius: ".3rem",
                    }}
                    alt="add_user"
                  />
                </button>
              </div>
            </div>

            <table className="table table-hover table-bordered border-secondary table-secondary align-middle">
              <thead className="table-light">
                <tr>
                  <th>EMAIL</th>
                  <th>ADMIN NAME</th>
                  <th>STATUS</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody className="table-group-divider">
                {currentItems.length > 0 ? (
                  currentItems.map((admin, index) => (
                    <tr className="table-light" key={index}>
                      <td className="p-2">{admin.email}</td>
                      <td className="p-2">
                        {admin.user_lastname}, {admin.user_firstname}
                      </td>
                      <td className="p-2">
                        {admin.user_status === "Active" ? (
                          <span style={{ color: "green" }}>ACTIVE</span>
                        ) : (
                          <span style={{ color: "red" }}>DISABLED</span>
                        )}
                      </td>
                      <td className="p-2">
                        <button
                          type="button"
                          data-bs-toggle="modal"
                          data-bs-target="#staticBackdrop1"
                          className="btn btn-sm btn-primary"
                          onClick={() => {
                            handleAdminUpdate(
                              admin.email,
                              admin.user_lastname,
                              admin.user_firstname,
                              admin.id
                            );
                          }}
                        >
                          <img
                            src={require("../../Assets/images/update_user.png")}
                            width="25"
                            height="25"
                            style={{
                              TopLeftRadius: ".3rem",
                              TopRightRadius: ".3rem",
                            }}
                            alt="update_user"
                          />
                        </button>
                        {admin.user_status == "Active" ? (
                          <button
                            type="button"
                            className="btn btn-danger btn-sm mx-2"
                            onClick={() => handleAdminDeactivate(admin.id)}
                          >
                            <img
                              src={require("../../Assets/images/lock_user.png")}
                              width="25"
                              height="25"
                              style={{
                                TopLeftRadius: ".3rem",
                                TopRightRadius: ".3rem",
                              }}
                              alt="lock_user"
                            />
                          </button>
                        ) : (
                          <button
                            type="button"
                            // data-bs-toggle="modal"
                            // data-bs-target="#staticBackdrop3"
                            className="btn btn-success btn-sm mx-2"
                            onClick={() => handleAdminActivate(admin.id)}
                          >
                            <img
                              src={require("../../Assets/images/check_user.png")}
                              width="25"
                              height="25"
                              style={{
                                TopLeftRadius: ".3rem",
                                TopRightRadius: ".3rem",
                              }}
                              alt="check_user"
                            />
                          </button>
                        )}
                        <button
                          type="button"
                          data-bs-toggle="modal"
                          data-bs-target="#staticBackdrop4"
                          className="btn btn-sm btn-warning"
                          onClick={() => handleResetPass(admin.id)}
                        >
                          <img
                            src={require("../../Assets/images/reset_user.png")}
                            width="25"
                            height="25"
                            style={{
                              TopLeftRadius: ".3rem",
                              TopRightRadius: ".3rem",
                            }}
                            alt="reset_user"
                          />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="table-light" key="loading-row">
                    <td colSpan="8" className="text-center">
                      <div className="loadcontainer">
                        <div className="loadingspinner">
                          <div id="square1"></div>
                          <div id="square2"></div>
                          <div id="square3"></div>
                          <div id="square4"></div>
                          <div id="square5"></div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <div className="d-flex flex-row">
              <ReactPaginate
                nextLabel="Next >"
                onPageChange={(event) => setCurrentPage(event.selected)}
                pageRangeDisplayed={3}
                marginPagesDisplayed={2}
                pageCount={Math.ceil(admins.length / itemsPerPage)}
                previousLabel="< Previous"
                pageClassName="page-item"
                pageLinkClassName="page-link"
                previousClassName="page-item"
                previousLinkClassName="page-link"
                nextClassName="page-item"
                nextLinkClassName="page-link"
                breakLabel="..."
                breakClassName="page-item"
                breakLinkClassName="page-link"
                containerClassName="pagination"
                activeClassName="active"
                renderOnZeroPageCount={null}
              />
            </div>
          </div>
        </div>

        {/* START OF MODAL FOR ADDING NEW ADMIN */}
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
                <h1 className="modal-title fs-5" id="staticBackdropLabel">
                  <b>CREATE NEW ADMIN</b>
                </h1>
              </div>

              <form onSubmit={(e) => handleAdminSubmit(e)}>
                <div className="modal-body">
                  <div className="row d-flex justify-content-center align-items-center h-100">
                    <img
                      src={require("../../Assets/images/faith-1280x420.png")}
                      className="w-100 rounded-top"
                      style={{
                        TopLeftRadius: ".3rem",
                        TopRightRadius: ".3rem",
                      }}
                      alt="cover"
                    />

                    <div className="card-body p-4 p-md-5">
                      <div className="container d-flex justify-content-center">
                        <h1 className="fontfam fw-bolder mb-4 pb-2 pb-md-0 mb-md-5 px-md-2 text-justify">
                          ADMIN INFORMATION
                        </h1>
                      </div>
                      {error == true ? (
                        <div className="d-flex justify-content-center">
                          <p className="text-danger fs-4">{errorMessage}</p>
                        </div>
                      ) : (
                        ""
                      )}

                      {/* Start of Faith Email */}
                      <div className="">
                        <div className="md-6 mb-4">
                          <div className="inputBox1 w-100">
                            <input
                              type="email"
                              id="email"
                              value={email}
                              onChange={(e) => {
                                setEmail(e.target.value);
                                setError(false);
                              }}
                              // pattern="S20.*"
                              // title="Enter a FAITH Student ID! Ex: S20****"
                              // maxLength="11"
                              required
                            />
                            <span className="">FAITH Email</span>
                          </div>
                        </div>
                      </div>
                      {/* End of Faith Email */}

                      {/* Start of Lastname */}
                      <div className="">
                        <div className="md-6 mb-4">
                          <div className="inputBox1 w-100">
                            <input
                              type="text"
                              id="lastname"
                              value={lastname}
                              onChange={(e) => {
                                setLastname(e.target.value);
                              }}
                              required
                            />
                            <span className="">Last Name</span>
                          </div>
                        </div>
                      </div>
                      {/* End of Lastname */}
                      {/* Start of Firstname */}
                      <div className="">
                        <div className="md-6 mb-4">
                          <div className="inputBox1 w-100">
                            <input
                              type="text"
                              id="firstname"
                              value={firstname}
                              onChange={(e) => {
                                setFirstname(e.target.value);
                              }}
                              required
                            />
                            <span className="">First Name</span>
                          </div>
                        </div>
                      </div>
                      {/* End of Firstname */}
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                  >
                    CANCEL
                  </button>
                  <button
                    type="submit"
                    className="btn btn-success mb-1"
                    data-bs-dismiss="modal"
                  >
                    ADD ADMIN
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* START OF UPDATE ADMIN MODAL */}
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
                <h1 className="modal-title fs-5" id="staticBackdropLabel1">
                  <b>UPDATE ADMIN</b>
                </h1>
              </div>

              <form onSubmit={(e) => handleUpdateAdminSubmit(e)}>
                <div className="modal-body">
                  <div className="row d-flex justify-content-center align-items-center h-100">
                    <img
                      src={require("../../Assets/images/faith-1280x420.png")}
                      className="w-100 rounded-top"
                      style={{
                        TopLeftRadius: ".3rem",
                        TopRightRadius: ".3rem",
                      }}
                      alt="cover"
                    />

                    <div className="card-body p-4 p-md-5">
                      <div className="container d-flex justify-content-center">
                        <h1 className="fontfam fw-bolder mb-4 pb-2 pb-md-0 mb-md-5 px-md-2 text-justify">
                          ADMIN INFORMATION
                        </h1>
                      </div>
                      {error == true ? (
                        <div className="d-flex justify-content-center">
                          <p className="text-danger fs-4">{errorMessage}</p>
                        </div>
                      ) : (
                        ""
                      )}

                      {/* Start of Faith Email*/}
                      <div className="">
                        <div className="md-6 mb-4">
                          <div className="inputBox2 w-100">
                            <input
                              type="email"
                              id="updateEmail"
                              value={updateEmail}
                              onChange={(e) => {
                                setUpdateEmail(e.target.value);
                                setError(false);
                              }}
                              required
                              disabled
                            />
                            <span className="">FAITH Email</span>
                          </div>
                        </div>
                      </div>
                      {/* End of Student ID */}
                      {/* Start of Lastname */}
                      <div className="">
                        <div className="md-6 mb-4">
                          <div className="inputBox1 w-100">
                            <input
                              type="text"
                              id="updateLastname"
                              value={updateLastname}
                              onChange={(e) => {
                                setUpdateLastname(e.target.value);
                                setError(false);
                              }}
                              required
                            />
                            <span className="">Last Name</span>
                          </div>
                        </div>
                      </div>
                      {/* End of Lastname */}
                      {/* Start of Firstname */}
                      <div className="">
                        <div className="md-6 mb-4">
                          <div className="inputBox1 w-100">
                            <input
                              type="text"
                              id="updateFirstname"
                              value={updateFirstname}
                              onChange={(e) => {
                                setUpdateFirstname(e.target.value);
                                setError(false);
                              }}
                              required
                            />
                            <span className="">First Name</span>
                          </div>
                        </div>
                      </div>
                      {/* End of Firstname */}
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                    onClick={() => {
                      clearAdminUpdate();
                    }}
                  >
                    CANCEL
                  </button>
                  <button
                    type="submit"
                    className="btn btn-success mb-1"
                    data-bs-dismiss="modal"
                  >
                    SAVE CHANGES
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* START OF RESET ADMIN PASS MODAL */}
        <div
          className="modal fade"
          id="staticBackdrop4"
          data-bs-backdrop="static"
          data-bs-keyboard="false"
          tabIndex="-1"
          aria-labelledby="staticBackdropLabel4"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-md">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="staticBackdropLabel4">
                  <b>RESET ADMIN PASSWORD</b>
                </h1>
              </div>

              <form onSubmit={(e) => handleResetAdminPass(e)}>
                <div className="modal-body">
                  <h4>Are you sure you want to reset password to default?</h4>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                  >
                    CANCEL
                  </button>
                  <button
                    type="submit"
                    className="btn btn-success mb-1"
                    data-bs-dismiss="modal"
                  >
                    PROCEED
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* MODAL FOR BULK INSERT */}
        <div
          className="modal fade"
          id="staticBackdrop2"
          data-bs-backdrop="static"
          data-bs-keyboard="false"
          tabIndex="-1"
          aria-labelledby="staticBackdropLabel2"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="staticBackdropLabel2">
                  BULK INSERT ADMINS
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                  />
                  <button type="submit" data-bs-dismiss="modal">
                    Upload CSV
                  </button>
                </form>
                {message && <p className="mt-2 text-center">{message}</p>}
                <p>
                  <i>Note: CSV File needed</i>
                </p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  CANCEL
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* MODAL FOR BULK INSERT END */}
      </div>
    );
  }
}

export default SuperAdminAdminManagementPage;
