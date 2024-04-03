import React, { useState, useEffect, useRef } from "react";
import Webcam from "react-webcam";

function TESTING() {
  const webcamRef = useRef(null);
  const [imageData, setImageData] = useState(null);

  useEffect(() => {
    const capture = async () => {
      const screenshot = await webcamRef.current.getScreenshot();
      setImageData(screenshot);

      // Send image data to NodeJS server using WebSocket
      const ws = new WebSocket("ws://localhost:8090"); // Replace with your server URL
      ws.onopen = () => {
        ws.send(screenshot);
      };

      ws.onerror = (error) => {
        console.error("WebSocket connection error:", error);
        // Handle connection error (e.g., display message, retry connection)
      };
    };

    const interval = setInterval(capture, 2000); // Capture every 10 seconds

    return () => clearInterval(interval);
  }, [webcamRef]);

  return (
    <div>
      <Webcam
        audio={false}
        height={480}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width={640}
      />
    </div>
  );
}

export default TESTING;

// import React, { useEffect, useRef, useState } from "react";
// import Webcam from "react-webcam";

// function TESTING() {
//   const webcamRef = useRef(null);
//   const socketRef = useRef();
//   const [intervalId, setIntervalId] = useState(null);

//   useEffect(() => {
//     socketRef.current = socketIO.connect("http://localhost:3002");

//     const sendFrame = () => {
//       const imageSrc = webcamRef.current.getScreenshot();
//       socketRef.current.emit("frame", imageSrc);
//     };

//     const intervalId = setInterval(sendFrame, 2000); // Send a frame every 1 second (1000 milliseconds)
//     setIntervalId(intervalId);

//     return () => {
//       clearInterval(intervalId);
//       socketRef.current.disconnect();
//     };
//   }, []);

//   return (
//     <div>
//       <Webcam
//         audio={false}
//         height={480}
//         ref={webcamRef}
//         screenshotFormat="image/jpeg"
//         width={640}
//       />
//     </div>
//   );
// }

// export default TESTING;
