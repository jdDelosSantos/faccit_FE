import React, { useState, useRef, useEffect } from "react";
import "./SuperAdminProfessorManagement.css";
import Webcam from "react-webcam";
import { Carousel, Dropdown, Button } from "react-bootstrap";
import AWS from "aws-sdk";
import https from "../../https";
// import { setProfessors } from "../../Redux/professors";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";

function SuperAdminProfessorManagement() {
  //NEW PROFESSOR USE STATES
  const [lastname, setLastname] = useState("");
  const [firstname, setFirstname] = useState("");
  const [profID, setProfID] = useState("");
  const [email, setEmail] = useState("");

  //UPDATE PROFESSOR USE STATES
  const [updateLastname, setUpdateLastname] = useState("");
  const [updateFirstname, setUpdateFirstname] = useState("");
  const [updateProfID, setUpdateProfID] = useState("");
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

  //REACT-PAGINATION
  const [professors, setProfessors] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = professors.slice(startIndex, endIndex);

  // const reduxProfessors = useSelector((state) => state.professor.professors);

  //UseEffect for loading Students and Courses every time it changes
  useEffect(() => {}, [professors]);

  const NametoUpperCase = sessionStorage.getItem("Firstname").toUpperCase();

  //Function for fetching Students
  const fetchProfessors = () => {
    https
      .get("professors", {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("Token")}`,
        },
      })
      .then((result) => {
        // dispatch(setProfessors(result.data));
        // console.log(result.data);
        setProfessors(result.data);
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

  //UseEffect for starting the function when loading the page
  useEffect(() => {
    fetchProfessors();
  }, []);

  useEffect(() => {
    const getWebcams = async () => {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(
        (device) => device.kind === "videoinput"
      );
      setWebcams(videoDevices);
      setSelectedWebcam(videoDevices[0]?.deviceId);
      setUpdatedSelectedWebcam(videoDevices[0]?.deviceId); // Select the first webcam by default
    };

    getWebcams();
  }, []);

  const handleSearchBar = (e) => {
    e.preventDefault();
    // Implement search functionality if needed
  };

  const captureScreenshot = () => {
    // Check if the number of screenshots is less than 3
    if (screenshots.length < 3) {
      const newScreenshot = webcamRef.current.getScreenshot();
      setScreenshots([...screenshots, newScreenshot]);
      console.log(screenshots);
    }
  };

  const captureUpdatedScreenshot = () => {
    // Check if the number of screenshots is less than 3
    if (updatedScreenshots.length < 3) {
      const updatedScreenshot = updateWebcamRef.current.getScreenshot();
      setUpdatedScreenshots([...updatedScreenshots, updatedScreenshot]);
    }
  };

  const clearScreenshots = () => {
    setScreenshots([]);
  };

  const clearUpdatedScreenshots = () => {
    setUpdatedScreenshots([]);
  };

  //SECTION FOR AWS S3 FUNCTIONS
  const { Buffer } = AWS.util;

  const s3 = new AWS.S3({
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
    region: process.env.REACT_APP_AWS_REGION,
  });

  //FUNCTION FOR UPLOADING IMAGE TO AWS AND IMAGE URL TO MYSQL
  const uploadToS3 = (screenshotData, index) => {
    const base64Data = new Buffer.from(
      screenshotData.replace(/^data:image\/\w+;base64,/, ""),
      "base64"
    );

    const params = {
      Bucket: process.env.REACT_APP_AWS_BUCKET_NAME,
      Key: `${profID}/${index + 1}.jpg`, // Use the index to generate sequential names
      Body: base64Data,
      ContentType: "image/jpeg",
    };

    s3.upload(params, (err, data) => {
      if (err) {
        console.error("Error uploading screenshot to S3:", err);
      } else {
        const profImageUrl = {
          prof_id: profID,
          std_folder_url: `${profID}/`,
          std_folder_img_url: `${index + 1}.jpg`,
        };
        console.log(profImageUrl);
        https
          .post("prof_images", profImageUrl, {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("Token")}`,
            },
          })
          .then((result) => {
            //console.log(result.data.message);
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

        console.log(
          `Screenshot ${index + 1} uploaded successfully:`,
          data.Location
        );
      }
    });
  };

  const updateImagesInS3 = (updateScreenshotData, index) => {
    const base64Data = new Buffer.from(
      updateScreenshotData.replace(/^data:image\/\w+;base64,/, ""),
      "base64"
    );

    const params = {
      Bucket: process.env.REACT_APP_AWS_BUCKET_NAME,
      Key: `${updateProfID}/${index + 1}.jpg`, // Use the index to generate sequential names
      Body: base64Data,
      ContentType: "image/jpeg",
    };

    s3.upload(params, (err, data) => {
      if (err) {
        console.error("Error uploading screenshot to S3:", err);
      } else {
        const professorImageUrl = {
          prof_id: updateProfID,
          std_folder_url: `${updateProfID}/`,
          std_folder_img_url: `${index + 1}.jpg`,
        };

        https
          .put(`professor_images/${updateProfID}`, professorImageUrl, {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("Token")}`,
            },
          })
          .then((result) => {
            //console.log(result.data.message);
            fetchProfessors();
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
        console.log(`Screenshot ${index + 1} uploaded successfully:`);
      }
    });
  };

  const fetchProfessorImages = (prof_id) => {
    const professorImages = {
      prof_id: prof_id,
    };
    // Implement your logic to fetch image URLs from the S3 bucket
    https
      .post("prof_img_url", professorImages, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("Token")}`,
        },
      })
      .then((result) => {
        console.log(result.data);
        result.data.forEach((imageData) => {
          const params = {
            Bucket: process.env.REACT_APP_AWS_BUCKET_NAME,
            Key: `${prof_id}/${imageData.std_folder_img_url}`,
          };

          s3.getObject(params, (err, data) => {
            if (err) {
              console.error("Error fetching screenshot to S3:", err);
            } else {
              const imageUrl = URL.createObjectURL(new Blob([data.Body]));
              setUpdateImageUrls((prevUrls) => [...prevUrls, imageUrl]);
            }
          });
        });
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

  //FUNCTION FOR ADDING A STUDENT
  const handleProfessorSubmit = (e) => {
    e.preventDefault();

    const professorData = {
      email: email,
      user_lastname: lastname,
      user_firstname: firstname,
      prof_id: profID,
    };

    https
      .post("professors", professorData, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("Token")}`,
        },
      })
      .then((result) => {
        fetchProfessors();
        toast.success(result.data.message, { duration: 7000 });
        screenshots.forEach((screenshot, index) =>
          uploadToS3(screenshot, index)
        );
        // Reset screenshots state after uploading
        setScreenshots([]);

        setEmail("");
        setLastname("");
        setFirstname("");
        setProfID("");
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

  //FUNCTION FOR PUTTING SELECTED PROFESSOR TO UPDATE FIELDS
  const handleProfessorUpdate = async (
    email,
    user_lastname,
    user_firstname,
    prof_id
  ) => {
    fetchProfessorImages(prof_id);

    setUpdateEmail(email);
    setUpdateLastname(user_lastname);
    setUpdateFirstname(user_firstname);
    setUpdateProfID(prof_id);
  };

  //FUNCTION FOR UPDATING A PROFESSOR
  const handleUpdateProfessorSubmit = (e) => {
    e.preventDefault();
    const updateProfessorData = {
      prof_id: updateProfID,
      user_lastname: updateLastname,
      user_firstname: updateFirstname,
    };

    console.log(updateProfessorData);

    https
      .put(`update_professors/${updateProfID}`, updateProfessorData, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("Token")}`,
        },
      })
      .then((result) => {
        fetchProfessors();
        toast.success(result.data.message, { duration: 7000 });
        updatedScreenshots.forEach((updatedScreenshot, index) =>
          updateImagesInS3(updatedScreenshot, index)
        );
        // Reset screenshots state after uploading
        setUpdatedScreenshots([]);

        setUpdateEmail("");
        setUpdateLastname("");
        setUpdateFirstname("");
        setUpdateProfID("");
        clearProfessorUpdate();
        setIsWebcamActive(false);
        setUpdateImageUrls([]);
      })
      .catch((error) => {
        console.log(error);
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

  const handleProfessorDeactivate = (prof_id) => {
    const profData = {
      user_status: "Disabled",
    };

    https
      .put(`prof_deactivate/${prof_id}`, profData, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("Token")}`,
        },
      })
      .then((result) => {
        toast.error(result.data.message, { duration: 7000 });
        fetchProfessors();
      });
  };

  const handleProfessorActivate = (prof_id) => {
    const profData = {
      user_status: "Active",
    };

    https
      .put(`prof_activate/${prof_id}`, profData, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("Token")}`,
        },
      })
      .then((result) => {
        toast.success(result.data.message, { duration: 7000 });
        fetchProfessors();
      });
  };

  const clearProfessorUpdate = () => {
    setUpdateEmail("");
    setUpdateLastname("");
    setUpdateFirstname("");
    setUpdateProfID("");
    setUpdatedScreenshots([]);
  };

  const goBackToLogin = () => {
    sessionStorage.clear();
    navigate("/");
  };

  return (
    <div className="base_bg w-100 p-4">
      <h1 className="my-1">
        <b>{NametoUpperCase}'S PROFESSOR MANAGEMENT PAGE</b>
      </h1>
      <h4 className="">LIST OF PROFESSORS</h4>
      <div className="shadow upper_bg rounded container-fluid w-100 p-3 px-5">
        <div className="table-responsive">
          <div className="w-100 d-flex justify-content-between align-items-center my-3">
            <div className="w-100 d-flex">
              <form
                className="d-flex w-75 searchbar-form"
                onSubmit={handleSearchBar}
              >
                <div className="w-100">
                  <div className="input-group">
                    <input
                      className="form-control"
                      type="search"
                      placeholder="Search Professor..."
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
                data-bs-target="#staticBackdrop"
                className="btn btn-primary btn-sm"
                onClick={() => {
                  setIsWebcamActive(true);
                }}
              >
                ADD PROFESSOR
              </button>
            </div>
          </div>

          <table className="table table-hover table-bordered border-secondary table-secondary align-middle">
            <thead className="table-light">
              <tr>
                <th>PROFESSOR ID</th>
                <th>EMAIL</th>
                <th>LAST NAME</th>
                <th>FIRST NAME</th>
                <th>IMAGE STATUS</th>
                <th>PROFESSOR STATUS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody className="table-group-divider">
              {currentItems.length > 0 ? (
                currentItems.map((professor, index) => (
                  <tr className="table-light" key={index}>
                    <td className="p-2">{professor.prof_id}</td>
                    <td className="p-2">{professor.email}</td>
                    <td className="p-2">{professor.user_lastname}</td>
                    <td className="p-2">{professor.user_firstname}</td>
                    <td className="p-3">
                      {(() => {
                        switch (true) {
                          case professor.professor_images_count === 0:
                            return (
                              <img
                                className="table_img"
                                src="https://img.icons8.com/ios-filled/50/FA5252/cancel.png"
                                alt="cancel"
                              />
                            );
                          case professor.professor_images_count < 3 &&
                            professor.professor_images_count !== 0:
                            return (
                              <img
                                className="table_img"
                                src="https://img.icons8.com/ios-filled/50/FAB005/medium-risk.png"
                                alt="medium-risk"
                              />
                            );
                          case professor.professor_images_count === 3:
                            return (
                              <img
                                className="table_img"
                                src="https://img.icons8.com/ios-filled/50/40C057/ok--v1.png"
                                alt="ok--v1"
                              />
                            );
                          default:
                            return null;
                        }
                      })()}
                    </td>
                    <td className="p-2">
                      {professor.user_status === "Active" ? (
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
                          handleProfessorUpdate(
                            professor.email,
                            professor.user_lastname,
                            professor.user_firstname,
                            professor.prof_id
                          );
                          setIsWebcamActive(!isWebcamActive);
                        }}
                      >
                        UPDATE
                      </button>
                      {professor.user_status == "Active" ? (
                        <button
                          type="button"
                          // data-bs-toggle="modal"
                          // data-bs-target="#staticBackdrop2"
                          className="btn btn-danger mx-3"
                          onClick={() =>
                            handleProfessorDeactivate(professor.prof_id)
                          }
                        >
                          DEACTIVATE
                        </button>
                      ) : (
                        <button
                          type="button"
                          // data-bs-toggle="modal"
                          // data-bs-target="#staticBackdrop3"
                          className="btn btn-success mx-3"
                          onClick={() =>
                            handleProfessorActivate(professor.prof_id)
                          }
                        >
                          REACTIVATE
                        </button>
                      )}
                      <button
                        type="button"
                        data-bs-toggle="modal"
                        data-bs-target="#staticBackdrop4"
                        className="btn btn-warning"
                      >
                        RESET PASSWORD
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
              pageCount={Math.ceil(professors.length / itemsPerPage)}
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

      {/* START OF MODAL FOR ADDING NEW PROFESSOR */}
      <div
        className="modal fade"
        id="staticBackdrop"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex="-1"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="staticBackdropLabel">
                <b>CREATE NEW PROFESSOR</b>
              </h1>
            </div>

            <form onSubmit={(e) => handleProfessorSubmit(e)}>
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
                        PROFESSOR INFORMATION
                      </h1>
                    </div>
                    {error == true ? (
                      <div className="d-flex justify-content-center">
                        <p className="text-danger fs-4">{errorMessage}</p>
                      </div>
                    ) : (
                      ""
                    )}
                    {/* Start of Prof ID */}
                    <div className="">
                      <div className="md-6 mb-4">
                        <div className="inputBox1 w-100">
                          <input
                            type="text"
                            id="profID"
                            value={profID}
                            onChange={(e) => {
                              setProfID(e.target.value);
                              setError(false);
                            }}
                            required
                          />
                          <span className="">Professor ID</span>
                        </div>
                      </div>
                    </div>
                    {/* End of Prof Email */}

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

                    {/* START OF SCREENSHOT AND ADD BUTTON  */}
                    <div className="d-flex flex-column align-items-center">
                      <div style={{ maxWidth: "640px", margin: "auto" }}>
                        <div className="d-flex flex-column justify-content-center">
                          <select
                            value={selectedWebcam}
                            onChange={(e) => setSelectedWebcam(e.target.value)}
                          >
                            <option>SELECT WEBCAM</option>
                            {webcams.map((webcam) => (
                              <option
                                key={webcam.deviceId}
                                value={webcam.deviceId}
                              >
                                {webcam.label ||
                                  `Webcam ${webcams.indexOf(webcam) + 1}`}
                              </option>
                            ))}
                          </select>

                          {isWebcamActive && (
                            <>
                              <Webcam
                                audio={false}
                                ref={webcamRef}
                                screenshotFormat="image/jpeg"
                                videoConstraints={{ deviceId: selectedWebcam }}
                              />
                              <Button
                                className="my-2"
                                onClick={() => captureScreenshot()}
                              >
                                TAKE SCREENSHOT
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {screenshots.length > 0 && (
                      <div>
                        <hr />
                        <div
                          className="mt-3"
                          style={{ maxWidth: "640px", margin: "auto" }}
                        >
                          <div className="d-flex flex-column justify-content-center">
                            <Carousel>
                              {screenshots.map((screenshot, index) => (
                                <Carousel.Item key={index}>
                                  <img
                                    src={screenshot}
                                    alt={`Screenshot ${index}`}
                                    className="d-block w-100"
                                  />
                                </Carousel.Item>
                              ))}
                            </Carousel>
                            <Button
                              onClick={() => clearScreenshots()}
                              className="mt-3 btn btn-danger"
                            >
                              CLEAR SCREENSHOTS
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                  onClick={() => setIsWebcamActive(false)}
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="btn btn-success mb-1"
                  data-bs-dismiss="modal"
                >
                  ADD PROFESSOR
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* START OF UPDATE PROFESSOR MODAL */}
      <div
        className="modal fade"
        id="staticBackdrop1"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex="-1"
        aria-labelledby="staticBackdropLabel1"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="staticBackdropLabel1">
                <b>UPDATE PROFESSOR</b>
              </h1>
            </div>

            <form onSubmit={(e) => handleUpdateProfessorSubmit(e)}>
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
                        PROFESSOR INFORMATION
                      </h1>
                    </div>
                    {error == true ? (
                      <div className="d-flex justify-content-center">
                        <p className="text-danger fs-4">{errorMessage}</p>
                      </div>
                    ) : (
                      ""
                    )}
                    {/* Start of Prof ID */}
                    <div className="">
                      <div className="md-6 mb-4">
                        <div className="inputBox2 w-100">
                          <input
                            type="text"
                            id="updateProfID"
                            value={updateProfID}
                            onChange={(e) => {
                              setUpdateProfID(e.target.value);
                              setError(false);
                            }}
                            required
                            disabled
                          />
                          <span className="">Professor ID</span>
                        </div>
                      </div>
                    </div>
                    {/* End of Prof Email */}

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
                            }}
                            required
                          />
                          <span className="">First Name</span>
                        </div>
                      </div>
                    </div>
                    {/* End of Firstname */}

                    <hr />
                    <h3>CURRENT IMAGES</h3>
                    <Carousel>
                      {updateImageUrls.map((updateImageUrl, index) => (
                        <Carousel.Item key={index}>
                          <img
                            src={updateImageUrl}
                            alt={`Screenshot ${index}`}
                            className="d-block w-100"
                          />
                        </Carousel.Item>
                      ))}
                    </Carousel>

                    <hr />
                    <h3>TAKE NEW IMAGES</h3>
                    {/* START OF SCREENSHOT AND ADD BUTTON  */}
                    <div className="d-flex flex-column align-items-center">
                      <div style={{ maxWidth: "640px", margin: "auto" }}>
                        <div className="d-flex flex-column justify-content-center">
                          <select
                            value={updatedSelectedWebcam}
                            onChange={(e) =>
                              setUpdatedSelectedWebcam(e.target.value)
                            }
                          >
                            <option>Select Webcam</option>
                            {webcams.map((webcam) => (
                              <option
                                key={webcam.deviceId}
                                value={webcam.deviceId}
                              >
                                {webcam.label ||
                                  `Webcam ${webcams.indexOf(webcam) + 1}`}
                              </option>
                            ))}
                          </select>
                          {isWebcamActive && (
                            <>
                              <Webcam
                                audio={false}
                                ref={updateWebcamRef}
                                screenshotFormat="image/jpeg"
                                videoConstraints={{
                                  deviceId: updatedSelectedWebcam,
                                }}
                              />
                              <Button
                                className="my-2"
                                onClick={() => captureUpdatedScreenshot()}
                              >
                                TAKE SCREENSHOT
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {updatedScreenshots.length > 0 && (
                      <div>
                        <hr />
                        <div
                          className="mt-3"
                          style={{ maxWidth: "640px", margin: "auto" }}
                        >
                          <div className="d-flex flex-column justify-content-center">
                            <Carousel>
                              {updatedScreenshots.map(
                                (updatedScreenshot, index) => (
                                  <Carousel.Item key={index}>
                                    <img
                                      src={updatedScreenshot}
                                      alt={`Screenshot ${index}`}
                                      className="d-block w-100"
                                    />
                                  </Carousel.Item>
                                )
                              )}
                            </Carousel>
                            <Button
                              onClick={() => clearUpdatedScreenshots()}
                              className="mt-3 btn btn-danger"
                            >
                              CLEAR SCREENSHOTS
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                  onClick={() => {
                    setUpdateImageUrls([]);
                    clearProfessorUpdate();
                    setIsWebcamActive(false);
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
    </div>
  );
}

export default SuperAdminProfessorManagement;
