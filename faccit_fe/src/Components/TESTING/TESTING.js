import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import socketIO from "socket.io-client";

function TESTING() {
  const webcamRef = useRef(null);
  const socketRef = useRef();
  const [intervalId, setIntervalId] = useState(null);

  useEffect(() => {
    socketRef.current = socketIO.connect("http://localhost:3002");

    const sendFrame = () => {
      const imageSrc = webcamRef.current.getScreenshot();
      socketRef.current.emit("frame", imageSrc);
    };

    const intervalId = setInterval(sendFrame, 2000); // Send a frame every 1 second (1000 milliseconds)
    setIntervalId(intervalId);

    return () => {
      clearInterval(intervalId);
      socketRef.current.disconnect();
    };
  }, []);

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
