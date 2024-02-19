import React, { useState, useRef } from "react";
import "./SuperAdminStudentManagement.css";
import Webcam from "react-webcam";
import { Carousel, Dropdown, Button } from "react-bootstrap";
import AWS from "aws-sdk";
import { accessKeyId, bucket, region, secretAccessKey } from "../../key";

function SuperAdminStudentManagement() {
  const [faithID, setFaithID] = useState("");
  const [lastname, setLastname] = useState("");
  const [firstname, setFirstname] = useState("");
  const [course, setCourse] = useState("");
  const [yrSection, setYrSection] = useState("");

  const webcamRef = useRef(null);
  const [screenshots, setScreenshots] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState("");

  const handleSelectDevice = (deviceId) => {
    setSelectedDeviceId(deviceId);
  };

  const handleSearchBar = (e) => {
    e.preventDefault();
    // Implement search functionality if needed
  };

  const capture = () => {
    // Check if the number of screenshots is less than 3
    if (screenshots.length < 3) {
      const newScreenshot = webcamRef.current.getScreenshot();
      setScreenshots([...screenshots, newScreenshot]);
      console.log(screenshots);
    }
  };

  const clearScreenshots = () => {
    setScreenshots([]);
  };

  const { Buffer } = AWS.util;

  const s3 = new AWS.S3({
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
    region: region,
  });

  const uploadToS3 = (screenshotData, index) => {
    const base64Data = new Buffer.from(
      screenshotData.replace(/^data:image\/\w+;base64,/, ""),
      "base64"
    );

    const folderName = `${faithID}/`;
    const params = {
      Bucket: bucket,
      Key: `${folderName}${index + 1}.jpg`, // Use the index to generate sequential names
      Body: base64Data,
      ContentType: "image/jpeg",
    };

    s3.upload(params, (err, data) => {
      if (err) {
        console.error("Error uploading screenshot to S3:", err);
      } else {
        console.log(
          `Screenshot ${index + 1} uploaded successfully:`,
          data.Location
        );
      }
    });
  };

  const handleStudentSubmit = (e) => {
    e.preventDefault();

    screenshots.forEach((screenshot, index) => uploadToS3(screenshot, index));
    // Reset screenshots state after uploading
    setScreenshots([]);
  };

  const clark = "Clark";

  return (
    <div className="base_bg w-100 p-5">
      <h1 className="my-4">{clark}'s Student Management Page</h1>
      <div className="upper_bg rounded container-fluid w-100 p-3 px-5">
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
              <tr className="table-light">
                <td scope="row">S2019112158</td>
                <td>Delos Santos</td>
                <td>John Daniel</td>
                <td>BSIT</td>
                <td>4A</td>
              </tr>
              <tr key="loading-row">
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
                            }}
                            pattern="S20.*"
                            title="Please Enter a FAITH Student ID!"
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
                          <Dropdown>
                            <Dropdown.Toggle
                              variant="dark"
                              id="dropdown-basic"
                              className="my-2"
                            >
                              Select Webcam
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                              <Dropdown.Item
                                onClick={() => handleSelectDevice("")}
                              >
                                Default
                              </Dropdown.Item>

                              {/* Add more dropdown items for each webcam */}
                            </Dropdown.Menu>
                          </Dropdown>
                          <Webcam
                            audio={false}
                            ref={webcamRef}
                            screenshotFormat="image/jpeg"
                            videoConstraints={{ deviceId: selectedDeviceId }}
                          />
                          <Button className="my-2" onClick={capture}>
                            Take Screenshot
                          </Button>
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
                              onClick={clearScreenshots}
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
    </div>
  );
}

export default SuperAdminStudentManagement;
