import React, { useEffect, useRef, useState } from "react";

function TestingEsp() {
  const wsRef = useRef(null);
  const [base64Image, setBase64Image] = useState("");

  useEffect(() => {
    // Replace the URL with the IP address of your ESP32 device
    const ws = new WebSocket("ws://192.168.1.100:81");

    wsRef.current = ws;

    ws.onopen = () => {
      console.log("WebSocket connection established");
    };

    ws.onmessage = (event) => {
      // Handle incoming messages from the WebSocket server
      const base64Image = event.data;
      // Do something with the base64-encoded image data, e.g., display it
      console.log("Received image:", base64Image);
      setBase64Image(base64Image);
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      // Clean up the WebSocket connection when the component unmounts
      ws.close();
    };
  }, []);

  return (
    <div>
      <img src={`data:image/jpeg;base64,${base64Image}`} alt="Camera Feed" />
    </div>
  );
}
export default TestingEsp;
