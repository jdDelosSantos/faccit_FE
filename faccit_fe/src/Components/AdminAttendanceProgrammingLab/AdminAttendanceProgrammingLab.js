import React, { useState, useRef, useEffect } from "react";
import "../AdminAttendanceProgrammingLab/AdminAttendanceProgrammingLab.css";
import { jwtDecode } from "jwt-decode";
import Webcam from "react-webcam";
import AWS from "aws-sdk";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import https from "../../https";
import * as faceapi from "@vladmandic/face-api";

function AdminAttendanceProgrammingLab() {
  const navigate = useNavigate();
  const webcamRef = useRef(null);

  const [studentId, setStudentId] = useState("");
  const [name, setName] = useState("");
  const [course, setCourse] = useState("");

  const [className, setClassName] = useState("");
  const [timeIn, setTimeIn] = useState("");
  const [status, setStatus] = useState("");

  const [tokenFirstname, setTokenFirstname] = useState("");
  const [component, setComponent] = useState(false);
  const [imageDataUrls, setImageDataUrls] = useState([]);
  const [videoInputDevices, setVideoInputDevices] = useState([]);
  const [selectedVideoInputDevice, setSelectedVideoInputDevice] =
    useState(null);
  const [webcamStatus, setWebcamStatus] = useState("");
  let previousLabel = null;
  let courseYrSection;

  const s3 = new AWS.S3({
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
    region: process.env.REACT_APP_AWS_REGION,
  });

  const goBackToLogin = () => {
    sessionStorage.clear();
    navigate("/");
  };

  const fetchDataFromSQLDatabase = async () => {
    setWebcamStatus("Fetching Image Urls from Database...");
    try {
      https
        .get("all_images")
        .then((result) => {
          setImageDataUrls(result.data);
          setWebcamStatus("Successfully fetched Image Urls from Database!");
        })
        .catch((error) => {
          console.error(error);
        });
    } catch (error) {
      console.error(error);
    }
  };

  const getVideoInputDevices = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoInputDevices = devices.filter(
        (device) => device.kind === "videoinput"
      );
      setVideoInputDevices(videoInputDevices);
    } catch (error) {
      console.error("Error accessing media devices:", error);
    }
  };

  const handleVideoOnPlay = async () => {
    const confidenceThreshold = 0.37;
    setWebcamStatus("Getting Face Descriptors...");
    const labeledFaceDescriptors = await getLabeledFaceDescriptionsFromDatabase(
      imageDataUrls
    );
    const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors);
    setWebcamStatus("Face Recognition is running successfully!");
    const interval = setInterval(async () => {
      if (webcamRef.current && webcamRef.current.video) {
        const detection = await faceapi
          .detectSingleFace(
            webcamRef.current.video,
            new faceapi.SsdMobilenetv1Options()
          )
          .withFaceLandmarks()
          .withFaceDescriptor();

        if (detection) {
          const bestMatch = faceMatcher.findBestMatch(detection.descriptor);
          if (bestMatch._distance <= confidenceThreshold) {
            const currentLabel = bestMatch.label;
            if (currentLabel !== previousLabel) {
              const currentDate = new Date();

              const time = currentDate.toTimeString().slice(0, 8);
              const day = currentDate.getDay();

              const weekdays = [
                "Sunday",
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
              ];

              const dayOfWeek = weekdays[day];

              const dataToBeSent = {
                id: currentLabel,
                day: dayOfWeek,
                time: time,
                laboratory: "lab_programming",
              };

              if (dayOfWeek) {
                try {
                  https
                    .post("attendance", dataToBeSent)
                    .then(function (response) {
                      const responseData = response.data.message;

                      if (responseData.status === "Present") {
                        toast.success(
                          `${responseData.name} is Present for ${responseData.class_name}!`,
                          { duration: 7000 }
                        );
                        setStudentId(responseData.id);
                        setName(responseData.name);
                        setCourse(responseData.courseYrSection);
                        setClassName(responseData.class_name);
                        setTimeIn(responseData.time_in);
                        setStatus(responseData.status);
                      } else if (
                        responseData.status === "Successfully opened class!"
                      ) {
                        toast.success(
                          `${responseData.name} successfully opened ${responseData.class_name} for attendance!`,
                          { duration: 7000 }
                        );
                        setStudentId(responseData.id);
                        setName(responseData.name);
                        setCourse("");
                        setClassName(responseData.class_name);
                        setTimeIn(responseData.time_in);
                        setStatus(responseData.status);
                      } else if (responseData.status === "Late") {
                        toast.success(
                          `${responseData.name} is ${responseData.status} for ${responseData.class_name}!`,
                          { duration: 7000 }
                        );
                        setStudentId(responseData.id);
                        setName(responseData.name);
                        setCourse(responseData.courseYrSection);
                        setClassName(responseData.class_name);
                        setTimeIn(responseData.time_in);
                        setStatus(responseData.status);
                      } else if (
                        responseData ===
                        "No class schedule found for the given day and/or laboratory!"
                      ) {
                        setStatus(
                          `No class schedule found for ${dayOfWeek} at Programming Laboratory`
                        );
                      } else if (
                        (responseData.id !== null &&
                          responseData.name !== null &&
                          responseData.courseYrSection !== null &&
                          responseData.class_name !== null &&
                          (responseData.time_in !== null) &
                            (responseData.status !== null)) ||
                        responseData.status === "Already Present"
                      ) {
                        setStudentId(responseData.id);
                        setName(responseData.name);
                        setCourse(responseData.courseYrSection);
                        setClassName(responseData.class_name);
                        setTimeIn(responseData.time_in);
                        setStatus(responseData.status);
                      }
                    })
                    .catch(function (error) {
                      console.error(error);
                    });
                } catch (error) {
                  console.error(error);
                }
              }
            }
            previousLabel = currentLabel;
          }
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  };

  useEffect(() => {
    if (imageDataUrls.length > 0) {
      handleVideoOnPlay();
    }
  }, [imageDataUrls]);

  const getLabeledFaceDescriptionsFromDatabase = async (imageDataUrls) => {
    return Promise.all(
      imageDataUrls.map(async (img) => {
        const label = img.faith_id;
        const descriptions = [];

        const params = {
          Bucket: process.env.REACT_APP_AWS_BUCKET_NAME,
          Key: `${img.std_folder_url}${img.std_folder_img_url}`,
        };

        const data = await s3.getObject(params).promise();

        const imageBlob = new Blob([data.Body], { type: "image/jpeg" });
        const image = await faceapi.bufferToImage(imageBlob);
        const detections = await faceapi
          .detectSingleFace(image)
          .withFaceLandmarks()
          .withFaceDescriptor();
        if (detections) {
          descriptions.push(detections.descriptor);
          return new faceapi.LabeledFaceDescriptors(label, descriptions);
        } else {
          return null;
        }
      })
    );
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
          setWebcamStatus("Loading Models...");
          const loadModels = async () => {
            const MODEL_URL = process.env.PUBLIC_URL + "/models";
            await Promise.all([
              faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
              faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
              faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
            ]);
            setWebcamStatus("Loaded Models Successfully!");
            fetchDataFromSQLDatabase();
            getVideoInputDevices();
          };
          loadModels();
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
          <b>{tokenFirstname}'S ATTENDANCE PROGRAMMING LAB PAGE</b>
        </h1>
        <h4 className="">WEBCAM ATTENDANCE</h4>

        <div className="shadow upper_bg rounded container-fluid w-100 p-5 d-flex justify-content-center">
          <div className="w-50 shadow rounded p-3 bg-light d-flex flex-column justify-content-center align-items-center">
            <select
              value={selectedVideoInputDevice?.deviceId || ""}
              onChange={(e) => {
                const selectedDevice = videoInputDevices.find(
                  (device) => device.deviceId === e.target.value
                );
                setSelectedVideoInputDevice(selectedDevice);
              }}
            >
              <option value="">Select a Webcam Device</option>
              {videoInputDevices.map((device) => (
                <option key={device.deviceId} value={device.deviceId}>
                  {device.label}
                </option>
              ))}
            </select>
            <Webcam
              ref={webcamRef}
              width={640}
              height={480}
              videoConstraints={{
                deviceId: selectedVideoInputDevice?.deviceId,
              }}
            />
            <h3>WEBCAM STATUS</h3>
            {webcamStatus !== "Face Recognition is running successfully!" ? (
              <h5 className="text-warning">{webcamStatus}</h5>
            ) : (
              <h5 className="text-success">{webcamStatus}</h5>
            )}
          </div>
          <div className="mx-4"></div>
          <div className="w-50 rounded shadow bg-light p-3 d-flex flex-column justify-content-start align-items-center">
            <h2>ATTENDANCE INFORMATION</h2>
            <div className="inputBox3 w-100">
              <input
                className=""
                type="text"
                disabled
                defaultValue={studentId || ""}
                style={{ fontSize: "1.2rem" }}
              />
              <span>FAITH ID</span>
            </div>
            <div className="inputBox3 w-100">
              <input
                className=""
                type="text"
                disabled
                defaultValue={name || ""}
                style={{ fontSize: "1.2rem" }}
              />
              <span>Student Name</span>
            </div>

            <div className="inputBox3 w-100">
              <input
                className=""
                type="text"
                disabled
                defaultValue={course || ""}
                style={{ fontSize: "1.2rem" }}
              />
              <span>Course, Year & Section</span>
            </div>
            <div className="inputBox3 w-100">
              <input
                className=""
                type="text"
                disabled
                defaultValue={className || ""}
                style={{ fontSize: "1.2rem" }}
              />
              <span>Class</span>
            </div>
            <div className="inputBox3 w-100">
              <input
                className=""
                type="time"
                defaultValue={timeIn || ""}
                style={{ fontSize: "1.2rem" }}
              />
              <span>Time In</span>
            </div>
            <div className="inputBox3 w-100">
              <input
                className=""
                type="text"
                defaultValue={status || ""}
                style={{
                  color:
                    status === "Absent"
                      ? "red"
                      : status === "Present"
                      ? "green"
                      : status === "Late"
                      ? "orange"
                      : status === "Successfully opened class!"
                      ? "green"
                      : "red",
                  fontSize: "1.2rem",
                }}
                disabled
              />
              <span>Attendance Status</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AdminAttendanceProgrammingLab;
