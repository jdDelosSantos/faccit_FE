import React, { useState, useRef, useEffect } from "react";
import "./SuperAdminStudentManagement.css";
import Webcam from "react-webcam";
import { Carousel, Dropdown, Button } from "react-bootstrap";
import AWS from "aws-sdk";
import https from "../../https";
import { setStudents } from "../../Redux/students";
import { setCourses } from "../../Redux/courses";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import { jwtDecode } from "jwt-decode";

function SuperAdminStudentManagement() {
  //NEW STUDENT USE STATES
  const [faithID, setFaithID] = useState("");
  const [lastname, setLastname] = useState("");
  const [firstname, setFirstname] = useState("");
  const [course, setCourse] = useState("");
  const [level, setLevel] = useState("");
  const [section, setSection] = useState("");

  //UPDATE STUDENT USE STATES
  const [updateFaithID, setUpdateFaithID] = useState("");
  const [updateLastname, setUpdateLastname] = useState("");
  const [updateFirstname, setUpdateFirstname] = useState("");
  const [updateCourse, setUpdateCourse] = useState("");
  const [updateLevel, setUpdateLevel] = useState("");
  const [updateSection, setUpdateSection] = useState("");

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

  //SEARCHTERM FOR SEARCH BAR
  const [searchTerm, setSearchTerm] = useState("");

  //REACT-PAGINATION
  const [students, setStudents] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(7);
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const filteredSortedData = [...students]
    .filter((item) => {
      const searchTerms = searchTerm.toLowerCase().split(" ");
      const matchingColumns = [
        "faith_id",
        "std_lname",
        "std_fname",
        "std_course",
        "std_level",
        "std_section",
        "std_status",
      ];
      return searchTerms.every((term) => {
        return matchingColumns.some((column) => {
          const regex = new RegExp(term, "i");
          return regex.test(item[column].toLowerCase());
        });
      });
    })
    .sort((a, b) => {
      // Sort by course
      const courseComparison = a.std_course.localeCompare(b.std_course);
      if (courseComparison !== 0) {
        return courseComparison;
      }

      // Sort by level
      const levelComparison = parseInt(a.std_level) - parseInt(b.std_level);
      if (levelComparison !== 0) {
        return levelComparison;
      }

      // Sort by section
      const sectionComparison = a.std_section.localeCompare(b.std_section);
      if (sectionComparison !== 0) {
        return sectionComparison;
      }

      // Sort by last name
      return a.std_lname.localeCompare(b.std_lname);
    });

  const currentItems = filteredSortedData.slice(startIndex, endIndex);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const reduxStudents = useSelector((state) => state.student.students);
  const courses = useSelector((state) => state.course.courses);

  //UseEffect for loading Students and Courses every time it changes
  useEffect(() => {}, [courses]);

  //Function for fetching Students
  const fetchStudents = () => {
    https
      .get("students", {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("Token")}`,
        },
      })
      .then((result) => {
        // dispatch(setStudents(result.data));
        setStudents(result.data);
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

  const fetchCourses = () => {
    https
      .get("courses", {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("Token")}`,
        },
      })
      .then((result) => {
        dispatch(setCourses(result.data));
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
    fetchStudents();
    fetchCourses();
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
        https
          .post("student_images", studentImageUrl, {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("Token")}`,
            },
          })
          .then((result) => {
            fetchStudents();
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
      Key: `${updateFaithID}/${index + 1}.jpg`, // Use the index to generate sequential names
      Body: base64Data,
      ContentType: "image/jpeg",
    };

    s3.upload(params, (err, data) => {
      if (err) {
        console.error("Error uploading screenshot to S3:", err);
      } else {
        const studentImageUrl = {
          faith_id: updateFaithID,
          std_folder_url: `${updateFaithID}/`,
          std_folder_img_url: `${index + 1}.jpg`,
        };

        https
          .put(`student_images/${updateFaithID}`, studentImageUrl, {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("Token")}`,
            },
          })
          .then((result) => {
            fetchStudents();
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
      }
    });
  };

  const fetchStudentImages = (student_faith_id) => {
    const studentImages = {
      faith_id: student_faith_id,
    };
    // Implement your logic to fetch image URLs from the S3 bucket
    https
      .post("student_img_url", studentImages, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("Token")}`,
        },
      })
      .then((result) => {
        result.data.forEach((imageData) => {
          const params = {
            Bucket: process.env.REACT_APP_AWS_BUCKET_NAME,
            Key: `${student_faith_id}/${imageData.std_folder_img_url}`,
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
          setErrorMessage(error.response.data.message);
          toast.error(error.response.data.message, { duration: 7000 });
        } else {
          goBackToLogin();
        }
      });
  };

  //FUNCTION FOR ADDING A STUDENT
  const handleStudentSubmit = (e) => {
    e.preventDefault();

    const studentData = {
      faith_id: faithID,
      std_lname: lastname,
      std_fname: firstname,
      std_course: course,
      std_level: level,
      std_section: section,
    };

    https
      .post("students", studentData, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("Token")}`,
        },
      })
      .then((result) => {
        fetchStudents();
        toast.success(result.data.message, { duration: 7000 });
        screenshots.forEach((screenshot, index) =>
          uploadToS3(screenshot, index)
        );
        // Reset screenshots state after uploading
        setScreenshots([]);

        setFaithID("");
        setLastname("");
        setFirstname("");
        setCourse("");
        setLevel("");
        setSection("");
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

  //FUNCTION FOR PUTTING SELECTED STUDENT TO UPDATE FIELDS
  const handleStudentUpdate = async (
    student_faith_id,
    student_lname,
    student_fname,
    student_course,
    student_level,
    student_section
  ) => {
    fetchStudentImages(student_faith_id);

    setUpdateFaithID(student_faith_id);
    setUpdateLastname(student_lname);
    setUpdateFirstname(student_fname);
    setUpdateCourse(student_course);
    setUpdateLevel(student_level);
    setUpdateSection(student_section);
  };

  //FUNCTION FOR UPDATING A STUDENT
  const handleUpdateStudentSubmit = (e) => {
    e.preventDefault();
    const updateStudentData = {
      faith_id: updateFaithID,
      std_lname: updateLastname,
      std_fname: updateFirstname,
      std_course: updateCourse,
      std_level: updateLevel,
      std_section: updateSection,
    };

    https
      .put(`update_students/${updateFaithID}`, updateStudentData, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("Token")}`,
        },
      })
      .then((result) => {
        fetchStudents();
        toast.success(result.data.message, { duration: 7000 });
        updatedScreenshots.forEach((updatedScreenshot, index) =>
          updateImagesInS3(updatedScreenshot, index)
        );
        // Reset screenshots state after uploading
        setUpdatedScreenshots([]);

        setUpdateFaithID("");
        setLastname("");
        setUpdateFirstname("");
        setUpdateCourse("");
        setUpdateLevel("");
        setUpdateSection("");
        clearStudentUpdate();
        setIsWebcamActive(false);
        setUpdateImageUrls([]);
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

  const handleStudentDeactivate = (faith_id) => {
    const studentData = {
      std_status: "Disabled",
    };

    https
      .put(`student_deactivate/${faith_id}`, studentData, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("Token")}`,
        },
      })
      .then((result) => {
        toast.error(result.data.message, { duration: 7000 });
        fetchStudents();
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

  const handleStudentActivate = (faith_id) => {
    const studentData = {
      std_status: "Active",
    };

    https
      .put(`student_activate/${faith_id}`, studentData, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("Token")}`,
        },
      })
      .then((result) => {
        toast.success(result.data.message, { duration: 7000 });
        fetchStudents();
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

  const clearStudentUpdate = () => {
    setUpdateFaithID("");
    setUpdateLastname("");
    setUpdateFirstname("");
    setUpdateCourse("");
    setUpdateLevel("");
    setUpdateSection("");
    setUpdatedScreenshots([]);
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
        .post("bulk_insert", formData, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("Token")}`,
            "Content-Type": "multipart/form-data",
          },
        })
        .then((result) => {
          toast.success(result.data.message, { duration: 7000 });
          fetchStudents();
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
      // console.warn("No token found in session storage");
      sessionStorage.clear();
      navigate("/");
    }
  }, [navigate]);

  if (component == false) {
    return;
  } else {
    return (
      <div className="base_bg w-100 p-4">
        <h1 className="my-1">
          <b>{tokenFirstname}'S STUDENT MANAGEMENT PAGE</b>
        </h1>
        <h4 className="">LIST OF STUDENTS</h4>
        <div className="shadow upper_bg rounded container-fluid w-100 p-3 px-5">
          <div className="table-responsive">
            <div className="w-100 d-flex justify-content-between align-items-center my-3">
              <div className="w-100 d-flex">
                <div className="w-75">
                  <div className="input-group">
                    <input
                      className="form-control"
                      type="search"
                      placeholder="Search Student..."
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

            <table className="table table-striped table-hover table-bordered border-secondary table-secondary align-middle">
              <thead className="table-light">
                <tr>
                  <th>FAITH ID</th>
                  <th>STUDENT NAME</th>
                  <th>COURSE, YEAR & SECTION</th>
                  <th>IMAGE STATUS</th>
                  <th>STUDENT STATUS</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody className="table-group-divider">
                {currentItems.length > 0 ? (
                  currentItems.map((student, index) => (
                    <tr className="table-light" key={index}>
                      <td className="p-2">{student.faith_id}</td>
                      <td className="p-2">
                        {student.std_lname}, {student.std_fname}
                      </td>
                      <td className="p-2">
                        {student.std_course}-{student.std_level}
                        {student.std_section}
                      </td>

                      <td className="p-3">
                        {(() => {
                          switch (true) {
                            case student.student_images_count === 0:
                              return (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  x="0px"
                                  y="0px"
                                  width="30"
                                  height="30"
                                  viewBox="0 0 50 50"
                                  style={{ fill: "#FA5252" }}
                                >
                                  <path d="M25,2C12.319,2,2,12.319,2,25s10.319,23,23,23s23-10.319,23-23S37.681,2,25,2z M33.71,32.29c0.39,0.39,0.39,1.03,0,1.42	C33.51,33.9,33.26,34,33,34s-0.51-0.1-0.71-0.29L25,26.42l-7.29,7.29C17.51,33.9,17.26,34,17,34s-0.51-0.1-0.71-0.29	c-0.39-0.39-0.39-1.03,0-1.42L23.58,25l-7.29-7.29c-0.39-0.39-0.39-1.03,0-1.42c0.39-0.39,1.03-0.39,1.42,0L25,23.58l7.29-7.29	c0.39-0.39,1.03-0.39,1.42,0c0.39,0.39,0.39,1.03,0,1.42L26.42,25L33.71,32.29z"></path>
                                </svg>
                              );
                            case student.student_images_count < 3 &&
                              student.student_images_count !== 0:
                              return (
                                <svg
                                  width="33"
                                  height="33"
                                  viewBox="0 0 1024 1024"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="#e1bd3d"
                                  stroke="#e1bd3d"
                                >
                                  <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                                  <g
                                    id="SVGRepo_tracerCarrier"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  ></g>
                                  <g id="SVGRepo_iconCarrier">
                                    <path
                                      fill="#f5ca2e"
                                      d="M512 64a448 448 0 1 1 0 896 448 448 0 0 1 0-896zm0 192a58.432 58.432 0 0 0-58.24 63.744l23.36 256.384a35.072 35.072 0 0 0 69.76 0l23.296-256.384A58.432 58.432 0 0 0 512 256zm0 512a51.2 51.2 0 1 0 0-102.4 51.2 51.2 0 0 0 0 102.4z"
                                    ></path>
                                  </g>
                                </svg>
                              );
                            case student.student_images_count === 3:
                              return (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  x="0px"
                                  y="0px"
                                  width="30"
                                  height="30"
                                  viewBox="0 0 50 50"
                                  style={{ fill: "#40C057" }}
                                >
                                  <path d="M25,2C12.318,2,2,12.318,2,25c0,12.683,10.318,23,23,23c12.683,0,23-10.317,23-23C48,12.318,37.683,2,25,2z M35.827,16.562	L24.316,33.525l-8.997-8.349c-0.405-0.375-0.429-1.008-0.053-1.413c0.375-0.406,1.009-0.428,1.413-0.053l7.29,6.764l10.203-15.036	c0.311-0.457,0.933-0.575,1.389-0.266C36.019,15.482,36.138,16.104,35.827,16.562z"></path>
                                </svg>
                              );
                            default:
                              return null;
                          }
                        })()}
                      </td>
                      <td className="p-2">
                        {student.std_status === "Active" ? (
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
                            handleStudentUpdate(
                              student.faith_id,
                              student.std_lname,
                              student.std_fname,
                              student.std_course,
                              student.std_level,
                              student.std_section
                            );
                            setIsWebcamActive(!isWebcamActive);
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
                        {student.std_status == "Active" ? (
                          <button
                            type="button"
                            className="btn btn-sm btn-danger mx-2"
                            onClick={() => {
                              handleStudentDeactivate(student.faith_id);
                            }}
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
                            className="btn btn-success btn-sm mx-2"
                            onClick={() => {
                              handleStudentActivate(student.faith_id);
                            }}
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
                pageCount={Math.ceil(students.length / itemsPerPage)}
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
          <div className="modal-dialog modal-lg">
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
                            <select
                              className="form-select form-select-md mb-3"
                              aria-label=".form-select-md example"
                              onChange={(e) => {
                                setCourse(e.target.value);
                              }}
                              id="course"
                              value={course || ""}
                              required
                            >
                              <option value="" disabled>
                                Select a Course
                              </option>
                              {courses.length > 0
                                ? courses
                                    .filter(
                                      (course) =>
                                        course.course_status === "Active"
                                    )
                                    .map((course) => (
                                      <option
                                        key={course.id}
                                        value={course.course_name}
                                      >
                                        {course.course_name}
                                      </option>
                                    ))
                                : ""}
                            </select>
                          </div>
                        </div>
                      </div>
                      {/* End of Course */}

                      {/* Start of Level/Year */}
                      <div className="">
                        <div className="md-6 mb-4">
                          <div className="inputBox1 w-100">
                            <select
                              className="form-select form-select-md mb-3"
                              aria-label=".form-select-md example"
                              onChange={(e) => {
                                setLevel(e.target.value);
                              }}
                              id="level"
                              value={level || ""}
                              required
                            >
                              <option value="" disabled>
                                Select a Level/Year
                              </option>
                              <option value="1">1</option>
                              <option value="2">2</option>
                              <option value="3">3</option>
                              <option value="4">4</option>
                              <option value="5">5</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Start of Section */}
                      <div className="">
                        <div className="md-6 mb-4">
                          <div className="inputBox1 w-100">
                            <select
                              className="form-select form-select-md mb-3"
                              aria-label=".form-select-md example"
                              onChange={(e) => {
                                setSection(e.target.value);
                              }}
                              id="section"
                              value={section || ""}
                              required
                            >
                              <option value="" disabled>
                                Select a Section
                              </option>
                              <option value="A">A</option>
                              <option value="B">B</option>
                              <option value="C">C</option>
                              <option value="D">D</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* START OF SCREENSHOT AND ADD BUTTON  */}
                      <div className="d-flex flex-column align-items-center">
                        <div style={{ maxWidth: "640px", margin: "auto" }}>
                          <div className="d-flex flex-column justify-content-center">
                            <select
                              value={selectedWebcam}
                              onChange={(e) =>
                                setSelectedWebcam(e.target.value)
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
                                  ref={webcamRef}
                                  screenshotFormat="image/jpeg"
                                  videoConstraints={{
                                    deviceId: selectedWebcam,
                                  }}
                                />
                                <Button
                                  className="my-2"
                                  onClick={() => captureScreenshot()}
                                >
                                  TAKE A SCREENSHOT
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
                    ADD STUDENT
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
          <div className="modal-dialog modal-lg">
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
                          <div className="inputBox2 w-100">
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
                              disabled
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
                          <div className="inputBox3 w-100">
                            <select
                              className="form-select form-select-md mb-3"
                              aria-label=".form-select-md example"
                              onChange={(e) => {
                                setUpdateCourse(e.target.value);
                              }}
                              id="updateCourse"
                              value={updateCourse || ""}
                              required
                            >
                              <option value="" disabled>
                                Select a Course
                              </option>
                              {courses.length > 0
                                ? courses
                                    .filter(
                                      (course) =>
                                        course.course_status === "Active"
                                    )
                                    .map((course) => (
                                      <option
                                        key={course.id}
                                        value={course.course_name}
                                      >
                                        {course.course_name}
                                      </option>
                                    ))
                                : ""}
                            </select>
                            <span>Course</span>
                          </div>
                        </div>
                      </div>
                      {/* End of Course */}

                      {/* Start of Level/Year */}
                      <div className="">
                        <div className="md-6 mb-4">
                          <div className="inputBox3 w-100">
                            <select
                              className="form-select form-select-md mb-3"
                              aria-label=".form-select-md example"
                              onChange={(e) => {
                                setUpdateLevel(e.target.value);
                              }}
                              id="updateLevel"
                              value={updateLevel || ""}
                              required
                            >
                              <option value="" disabled>
                                Select a Level/Year
                              </option>
                              <option value="1">1</option>
                              <option value="2">2</option>
                              <option value="3">3</option>
                              <option value="4">4</option>
                              <option value="5">5</option>
                            </select>
                            <span>Level/Year</span>
                          </div>
                        </div>
                      </div>

                      {/* Start of Section */}
                      <div className="">
                        <div className="md-6 mb-4">
                          <div className="inputBox3 w-100">
                            <select
                              className="form-select form-select-md mb-3"
                              aria-label=".form-select-md example"
                              onChange={(e) => {
                                setUpdateSection(e.target.value);
                              }}
                              id="updateSection"
                              value={updateSection || ""}
                              required
                            >
                              <option value="" disabled>
                                Select a Section
                              </option>
                              <option value="A">A</option>
                              <option value="B">B</option>
                              <option value="C">C</option>
                              <option value="D">D</option>
                            </select>
                            <span>Section</span>
                          </div>
                        </div>
                      </div>
                      <hr />
                      <h3>Current Images</h3>
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
                      <h3>Take New Images</h3>
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
                                  TAKE A SCREENSHOT
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
                      clearStudentUpdate();
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
                  BULK INSERT STUDENTS
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
                  <button type="submit">Upload CSV</button>
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

export default SuperAdminStudentManagement;
