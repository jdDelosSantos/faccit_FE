import React, { useEffect, useState } from "react";

function TESTING() {
  const [text, setText] = useState("");
  const webSocket = new WebSocket("ws://192.168.1.123:81");

  useEffect(() => {
    webSocket.onmessage = (event) => {
      // Decode base64 string to image
      // const imageSrc = "data:image/jpeg;base64," + event.data;
      setText(event.data);
    };

    return () => {
      webSocket.close();
    };
  }, []);

  return (
    <div>
      <h1>Hello {text}</h1>
    </div>
  );
}

export default TESTING;
