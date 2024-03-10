import React, { useState, useRef, useEffect } from "react";
import "../SuperAdminCollegeManagement/SuperAdminCollegeManagement.css";
import { setColleges } from "../../Redux/colleges";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import https from "../../https";

function SuperAdminCollegeManagement() {
  //NEW COLLEGE USE STATES
  const [collegeName, setCollegeName] = useState("");
  const [collegeDescription, setCollegeDescription] = useState("");

  //UPDATE COLLEGE USE STATES
  const [updateCollegeName, setUpdateCollegeName] = useState("");
  const [updateCollegeDescription, setUpdateCollegeDescription] = useState("");

  const colleges = useSelector((state) => state.college.colleges);
  console.log(colleges);
  const NametoUpperCase = sessionStorage.getItem("Firstname").toUpperCase();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  //Function for fetching colleges
  const fetchColleges = () => {
    https
      .get("colleges", {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("Token")}`,
        },
      })
      .then((result) => {
        dispatch(setColleges(result.data));
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
    fetchColleges();
  }, []);

  const handleCollegeSearchBar = (e) => {
    e.preventDefault();
    // Implement search functionality if needed
  };

  //FUNCTION FOR ADDING A COLLEGE
  const handleCollegeSubmit = (e) => {
    e.preventDefault();

    const collegeData = {
      college_name: collegeName,
      college_description: collegeDescription,
    };

    https
      .post("colleges", collegeData, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("Token")}`,
        },
      })
      .then((result) => {
        fetchColleges();
        toast.success(result.data.message, { duration: 7000 });

        setCollegeName("");
        setCollegeDescription("");
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

  //FUNCTION FOR PUTTING SELECTED COLLEGE TO UPDATE FIELDS
  const handleCollegeUpdate = (college_name, college_description) => {
    setUpdateCollegeName(college_name);
    setUpdateCollegeDescription(college_description);
  };

  //FUNCTION FOR ADDING UPDATING A COLLEGE
  const handleUpdateCollegeSubmit = (e) => {
    e.preventDefault();
  };

  const handleCollegeDeactivate = () => {};

  const handleCollegeActivate = () => {};

  const clearCollege = () => {
    setCollegeName("");
    setCollegeDescription("");
  };

  const clearUpdateCollege = () => {
    setUpdateCollegeName("");
    setUpdateCollegeDescription("");
  };

  const goBackToLogin = () => {
    sessionStorage.clear();
    navigate("/");
  };

  return (
    <div className="base_bg w-100 p-5">
      <h1 className="my-4">
        <b>{NametoUpperCase}'S COLLEGE MANAGEMENT PAGE</b>
      </h1>
      <h4 className="">LIST OF COLLEGES</h4>
      <div className="shadow upper_bg rounded container-fluid w-100 p-3 px-5">
        <div className="table-responsive">
          <div className="w-100 d-flex justify-content-between align-items-center my-3">
            <div className="w-100 d-flex">
              <form
                className="d-flex w-75 searchbar-form"
                onSubmit={handleCollegeSearchBar}
              >
                <div className="w-100">
                  <div className="input-group">
                    <input
                      className="form-control"
                      type="search"
                      placeholder="Search College..."
                      aria-label="Search"
                    />
                    <button
                      className="fa-solid fa-magnifying-glass searchbtn"
                      type="submit"
                      style={{ color: "#ffffff" }}
                    ></button>
                  </div>
                </div>
              </form>
            </div>

            <div className="w-25 d-flex justify-content-end">
              <button
                type="button"
                data-bs-toggle="modal"
                data-bs-target="#staticBackdrop4"
                className="btn btn-primary btn-sm"
              >
                ADD COLLEGE
              </button>
            </div>
          </div>

          <table className="table table-striped table-hover table-bordered border-secondary table-secondary align-middle">
            <thead className="table-light">
              <tr>
                <th>COLLEGE NAME</th>
                <th>COLLEGE DESCRIPTION</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody className="table-group-divider">
              {colleges.length > 0 ? (
                colleges.map((college, index) => (
                  <tr className="table-light" key={index}>
                    <td className="p-2">{college.college_name}</td>
                    <td className="p-2">{college.college_description}</td>
                    <td className="p-2">
                      <button
                        type="button"
                        data-bs-toggle="modal"
                        data-bs-target="#staticBackdrop5"
                        className="btn btn-primary"
                        onClick={() => {
                          handleCollegeUpdate(
                            college.college_name,
                            college.college_description
                          );
                        }}
                      >
                        UPDATE
                      </button>
                      {college.college_status == "Active" ? (
                        <button
                          type="button"
                          data-bs-toggle="modal"
                          data-bs-target="#staticBackdrop6"
                          className="btn btn-danger mx-3"
                          onClick={handleCollegeDeactivate()}
                        >
                          DEACTIVATE
                        </button>
                      ) : (
                        <button
                          type="button"
                          data-bs-toggle="modal"
                          data-bs-target="#staticBackdrop7"
                          className="btn btn-success mx-3"
                          onClick={handleCollegeActivate()}
                        >
                          REACTIVATE
                        </button>
                      )}
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
        </div>
      </div>

      {/* START OF MODAL FOR ADDING  COLLEGE*/}
      <div
        className="modal fade"
        id="staticBackdrop4"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex="-1"
        aria-labelledby="staticBackdropLabel4"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="staticBackdropLabel4">
                <b>CREATE COLLEGE</b>
              </h1>
            </div>

            <form onSubmit={(e) => handleCollegeSubmit(e)}>
              <div className="modal-body">
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
                    <div className="container d-flex justify-content-center">
                      <h1 className="fontfam fw-bolder mb-4 pb-2 pb-md-0 mb-md-5 px-md-2 text-justify">
                        COLLEGE INFORMATION
                      </h1>
                    </div>
                    {error == true ? (
                      <div className="d-flex justify-content-center">
                        <p className="text-danger fs-4">{errorMessage}</p>
                      </div>
                    ) : (
                      ""
                    )}
                    <h1></h1>
                    {/* Start of College Name */}
                    <div className="">
                      <div className="md-6 mb-4">
                        <div className="inputBox1 w-100">
                          <input
                            type="text"
                            id="collegeName"
                            value={collegeName}
                            onChange={(e) => {
                              setCollegeName(e.target.value);
                              setError(false);
                            }}
                            maxLength="4"
                            required
                          />
                          <span className="">College Name</span>
                        </div>
                      </div>
                    </div>

                    {/* Start of College Description */}
                    <div className="">
                      <div className="md-6 mb-4">
                        <div className="inputBox1 w-100">
                          <input
                            type="text"
                            id="collegeDescription"
                            value={collegeDescription}
                            onChange={(e) => {
                              setCollegeDescription(e.target.value);
                            }}
                            required
                          />
                          <span className="">College Description</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                  onClick={() => {
                    clearCollege();
                  }}
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="btn btn-success mb-1"
                  data-bs-dismiss="modal"
                >
                  ADD COLLEGE
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* END OF MODAL FOR ADDING COLLEGE */}

      {/* START OF MODAL FOR UPDATING COLLEGE */}
      <div
        className="modal fade"
        id="staticBackdrop5"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex="-1"
        aria-labelledby="staticBackdropLabel5"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="staticBackdropLabel5">
                <b>UPDATE COLLEGE</b>
              </h1>
            </div>

            <form onSubmit={(e) => handleUpdateCollegeSubmit(e)}>
              <div className="modal-body">
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
                    <div className="container d-flex justify-content-center">
                      <h1 className="fontfam fw-bolder mb-4 pb-2 pb-md-0 mb-md-5 px-md-2 text-justify">
                        COLLEGE INFORMATION
                      </h1>
                    </div>
                    {error == true ? (
                      <div className="d-flex justify-content-center">
                        <p className="text-danger fs-4">{errorMessage}</p>
                      </div>
                    ) : (
                      ""
                    )}
                    <h1></h1>

                    {/* Start of College Name*/}
                    <div className="">
                      <div className="md-6 mb-4">
                        <div className="inputBox1 w-100">
                          <input
                            type="text"
                            id="updateCollegeName"
                            value={updateCollegeName}
                            onChange={(e) => {
                              setUpdateCollegeName(e.target.value);
                            }}
                            required
                          />
                          <span className="">College Name</span>
                        </div>
                      </div>
                    </div>

                    {/* Start of College Description */}
                    <div className="">
                      <div className="md-6 mb-4">
                        <div className="inputBox1 w-100">
                          <input
                            type="text"
                            id="updateCollegeDescription"
                            value={updateCollegeDescription}
                            onChange={(e) => {
                              setUpdateCollegeDescription(e.target.value);
                            }}
                            required
                          />
                          <span className="">College Description</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                  onClick={() => {
                    clearUpdateCollege();
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
      {/* END OF MODAL FOR UPDATING Coolege */}
    </div>
  );
}

export default SuperAdminCollegeManagement;
