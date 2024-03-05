import React, { useState, useRef, useEffect } from "react";
import "./SuperAdminStudentManagement.css";
import Webcam from "react-webcam";
import { Carousel, Dropdown, Button } from "react-bootstrap";
import AWS from "aws-sdk";
import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";
import https from "../../https";
import { setStudents } from "../../Redux/students";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

function SuperAdminStudentManagement() {
  //NEW STUDENT USE STATES
  const [faithID, setFaithID] = useState("");
  const [lastname, setLastname] = useState("");
  const [firstname, setFirstname] = useState("");
  const [course, setCourse] = useState("");
  const [yrSection, setYrSection] = useState("");

  //UPDATE STUDENT USE STATES
  const [updateFaithID, setUpdateFaithID] = useState("");
  const [updateLastname, setUpdateLastname] = useState("");
  const [updateFirstname, setUpdateFirstname] = useState("");
  const [updateCourse, setUpdateCourse] = useState("");
  const [updateYrSection, setUpdateYrSection] = useState("");

  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const dispatch = useDispatch();
  const students = useSelector((state) => state.student.students);

  const webcamRef = useRef(null);
  const updateWebcamRef = useRef(null);
  const [webcams, setWebcams] = useState([]);
  const [selectedWebcam, setSelectedWebcam] = useState("");
  const [updatedSelectedWebcam, setUpdatedSelectedWebcam] = useState("");
  const [isWebcamActive, setIsWebcamActive] = useState(false);

  const [screenshots, setScreenshots] = useState([]);
  const [updatedScreenshots, setUpdatedScreenshots] = useState([]);
  const [updateImageUrls, setUpdateImageUrls] = useState([]);

  //UseEffect for loading Students every time it changes
  useEffect(() => {}, [students]);

  //Function for fetching Students
  const fetchStudents = () => {
    https
      .get("students", {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("Token")}`,
        },
      })
      .then((result) => {
        dispatch(setStudents(result.data));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  //UseEffect for starting the function when loading the page
  useEffect(() => {
    fetchStudents();
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
      console.log(updatedScreenshots);
    }
  };

  const clearScreenshots = () => {
    setScreenshots([]);
  };

  const clearUpdatedScreenshots = () => {
    setUpdatedScreenshots([]);
  };

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
      Key: `${faithID}/${index + 1}.jpg`, // Use the index to generate sequential names
      Body: base64Data,
      ContentType: "image/jpeg",
    };

    s3.upload(params, (err, data) => {
      if (err) {
        console.error("Error uploading screenshot to S3:", err);
      } else {
        const studentImageUrl = {
          faith_id: faithID,
          std_folder_url: `${faithID}/`,
          std_folder_img_url: `${index + 1}.jpg`,
        };
        console.log(studentImageUrl);
        https
          .post("student_images", studentImageUrl, {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("Token")}`,
            },
          })
          .then((result) => {
            //console.log(result.data.message);
          })
          .catch((error) => {
            console.error(error);
          });

        console.log(
          `Screenshot ${index + 1} uploaded successfully:`,
          data.Location
        );
      }
    });
  };

  const fetchStudentImages = async (student_faith_id) => {
    // Implement your logic to fetch image URLs from the S3 bucket
    https
      .post("student_img_url", student_faith_id, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("Token")}`,
        },
      })
      .then((result) => {
        console.log(result);

        const params = {
          Bucket: process.env.REACT_APP_AWS_BUCKET_NAME,
          Key: `${student_faith_id}/1.jpg`,
        };

        s3.getObject(params, (err, data) => {
          if (err) {
            console.error("Error fetching screenshot to S3:", err);
          } else {
            setUpdateImageUrls(URL.createObjectURL(new Blob([data.Body])));
          }
        });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleStudentSubmit = (e) => {
    e.preventDefault();

    const studentData = {
      faith_id: faithID,
      std_lname: lastname,
      std_fname: firstname,
      std_course: course,
      std_yrSection: yrSection,
    };

    https
      .post("students", studentData, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("Token")}`,
        },
      })
      .then((result) => {
        fetchStudents();
        toast.success(result.data.message);
        screenshots.forEach((screenshot, index) =>
          uploadToS3(screenshot, index)
        );
        // Reset screenshots state after uploading
        setScreenshots([]);

        setFaithID("");
        setLastname("");
        setFirstname("");
        setCourse("");
        setYrSection("");
      })
      .catch((error) => {
        setError(true);
        console.log(error.response.data.message);
        setErrorMessage(error.response.data.message);
        console.log(error.response.data.message);
        toast.error(error.response.data.message);
      });
    // screenshots.forEach((screenshot, index) => uploadToS3(screenshot, index));
    // // Reset screenshots state after uploading
    // setScreenshots([]);
  };

  const handleUpdateStudentSubmit = (e) => {
    e.preventDefault();
  };

  const handleStudentUpdate = async (
    student_faith_id,
    student_lname,
    student_fname,
    student_course,
    student_yrSection
  ) => {
    const imageUrls = await fetchStudentImages(student_faith_id);
    setUpdateFaithID(student_faith_id);
    setUpdateLastname(student_lname);
    setUpdateFirstname(student_fname);
    setUpdateCourse(student_course);
    setUpdateYrSection(student_yrSection);
    setUpdateImageUrls(imageUrls);
  };

  const handleStudentDeactivate = () => {};

  const handleStudentActivate = () => {};

  const clearStudentUpdate = () => {
    setUpdateFaithID("");
    setUpdateLastname("");
    setUpdateFirstname("");
    setUpdateCourse("");
    setUpdateYrSection("");
  };

  return (
    <div className="base_bg w-100 p-5">
      <h1 className="my-4">
        {sessionStorage.getItem("Firstname")}'s Student Management Page
      </h1>
      <div className="shadow upper_bg rounded container-fluid w-100 p-3 px-5">
        <div className="table-responsive">
          <div className="w-100 d-flex justify-content-between align-items-center my-3">
            <div className="w-100 d-flex">
              <h2 className="">List of Students</h2>
              <form
                className="d-flex w-50 searchbar-form mx-5"
                onSubmit={handleSearchBar}
              >
                <div className="w-100">
                  <div className="input-group">
                    <input
                      className="form-control"
                      type="search"
                      placeholder="Search Student..."
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

            <div className=" w-30 d-flex justify-content-end">
              <button
                type="button"
                data-bs-toggle="modal"
                data-bs-target="#staticBackdrop"
                className="btn btn-primary btn-sm"
                onClick={() => setIsWebcamActive(true)}
              >
                Add Student
              </button>
            </div>
          </div>

          <table className="table table-striped table-hover table-bordered border-secondary table-secondary align-middle">
            <thead className="table-light">
              <tr>
                <th>FAITH ID</th>
                <th>LAST NAME</th>
                <th>FIRST NAME</th>
                <th>COURSE</th>
                <th>YR & SECTION</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody className="table-group-divider">
              {students.length > 0 ? (
                students.map((student, index) => (
                  <tr className="table-light" key={index}>
                    <td className="p-2">{student.faith_id}</td>
                    <td className="p-2">{student.std_lname}</td>
                    <td className="p-2">{student.std_fname}</td>
                    <td className="p-2">{student.std_course}</td>
                    <td className="p-2">{student.std_yrSection}</td>
                    <td className="p-2">
                      <button
                        type="button"
                        data-bs-toggle="modal"
                        data-bs-target="#staticBackdrop1"
                        className="btn btn-primary"
                        onClick={() => {
                          handleStudentUpdate(
                            student.faith_id,
                            student.std_lname,
                            student.std_fname,
                            student.std_course,
                            student.std_yrSection
                          );
                          setIsWebcamActive(!isWebcamActive);
                        }}
                      >
                        Update
                      </button>
                      {student.std_status == "Active" ? (
                        <button
                          type="button"
                          data-bs-toggle="modal"
                          data-bs-target="#staticBackdrop2"
                          className="btn btn-danger"
                          onClick={handleStudentDeactivate()}
                        >
                          Deactivate
                        </button>
                      ) : (
                        <button
                          type="button"
                          data-bs-toggle="modal"
                          data-bs-target="#staticBackdrop3"
                          className="btn btn-success"
                          onClick={handleStudentActivate()}
                        >
                          Activate
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
      {/* START OF MODAL FOR ADDING NEW STUDENT */}
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
                <b>CREATE NEW STUDENT</b>
              </h1>
            </div>

            <form onSubmit={(e) => handleStudentSubmit(e)}>
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
                        STUDENT INFORMATION
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
                    {/* Start of Student ID */}
                    <div className="">
                      <div className="md-6 mb-4">
                        <div className="inputBox1 w-100">
                          <input
                            type="text"
                            id="faithID"
                            value={faithID}
                            onChange={(e) => {
                              setFaithID(e.target.value);
                              setError(false);
                            }}
                            pattern="S20.*"
                            title="Enter a FAITH Student ID! Ex: S20****"
                            maxLength="11"
                            required
                          />
                          <span className="">FAITH ID</span>
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
                    {/* Start of Course */}
                    <div className="">
                      <div className="md-6 mb-4">
                        <div className="inputBox1 w-100">
                          <input
                            type="text"
                            id="course"
                            value={course}
                            onChange={(e) => {
                              setCourse(e.target.value);
                            }}
                            required
                          />
                          <span className="">Course</span>
                        </div>
                      </div>
                    </div>
                    {/* End of Course */}
                    {/* Start of Yr & Section */}
                    <div className="">
                      <div className="md-6 mb-4">
                        <div className="inputBox1 w-100">
                          <input
                            type="text"
                            id="yrSection"
                            value={yrSection}
                            onChange={(e) => {
                              setYrSection(e.target.value);
                            }}
                            required
                          />
                          <span className="">Yr & Section</span>
                        </div>
                      </div>
                    </div>
                    {/* End of Yr & Secton */}

                    {/* START OF SCREENSHOT AND ADD BUTTON  */}
                    <div className="d-flex flex-column align-items-center">
                      <div style={{ maxWidth: "640px", margin: "auto" }}>
                        <div className="d-flex flex-column justify-content-center">
                          <select
                            value={selectedWebcam}
                            onChange={(e) => setSelectedWebcam(e.target.value)}
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
                                ref={webcamRef}
                                screenshotFormat="image/jpeg"
                                videoConstraints={{ deviceId: selectedWebcam }}
                              />
                              <Button
                                className="my-2"
                                onClick={() => captureScreenshot()}
                              >
                                Take Screenshot
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
                              Clear Screenshots
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
                <button type="submit" className="btn btn-success mb-1">
                  SAVE
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* START OF UPDATE STUDENT MODAL */}
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
                <b>UPDATE STUDENT</b>
              </h1>
            </div>

            <form onSubmit={(e) => handleUpdateStudentSubmit(e)}>
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
                        STUDENT INFORMATION
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
                    {/* Start of Student ID */}
                    <div className="">
                      <div className="md-6 mb-4">
                        <div className="inputBox1 w-100">
                          <input
                            type="text"
                            id="updateFaithID"
                            value={updateFaithID}
                            onChange={(e) => {
                              setUpdateFaithID(e.target.value);
                              setError(false);
                            }}
                            pattern="S20.*"
                            title="Enter a FAITH Student ID! Ex: S20****"
                            maxLength="11"
                            required
                          />
                          <span className="">FAITH ID</span>
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
                    {/* Start of Course */}
                    <div className="">
                      <div className="md-6 mb-4">
                        <div className="inputBox1 w-100">
                          <input
                            type="text"
                            id="updateCourse"
                            value={updateCourse}
                            onChange={(e) => {
                              setUpdateCourse(e.target.value);
                            }}
                            required
                          />
                          <span className="">Course</span>
                        </div>
                      </div>
                    </div>
                    {/* End of Course */}
                    {/* Start of Yr & Section */}
                    <div className="">
                      <div className="md-6 mb-4">
                        <div className="inputBox1 w-100">
                          <input
                            type="text"
                            id="updateYrSection"
                            value={updateYrSection}
                            onChange={(e) => {
                              setUpdateYrSection(e.target.value);
                            }}
                            required
                          />
                          <span className="">Yr & Section</span>
                        </div>
                      </div>
                    </div>
                    {/* End of Yr & Secton */}

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
                                Take Screenshot
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
                              Clear Screenshots
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <img src={updateImageUrls} alt="S3 Image" />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                  onClick={() => {
                    clearStudentUpdate();
                    setIsWebcamActive(!isWebcamActive);
                  }}
                >
                  CANCEL
                </button>
                <button type="submit" className="btn btn-success mb-1">
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

export default SuperAdminStudentManagement;
