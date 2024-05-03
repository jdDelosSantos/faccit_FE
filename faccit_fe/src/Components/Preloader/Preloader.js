import React, { useEffect } from "react";
import { preLoaderAnim } from "../Animations";
import "../Preloader/Preloader.css";

const Preloader = ({ value1, value2 }) => {
  useEffect(() => {
    preLoaderAnim();
  }, []);

  return (
    <div className="preloader">
      <div className="texts-container">
        <img
          src={require("../../Assets/images/Neuron_transparent_250px_red.png")}
          width="250"
          height="250"
          alt="update_user"
          className="image"
        />
      </div>
      <div className="texts-container ">
        <h1 className="h1_size size_down">WELCOME TO FACCIT</h1>
      </div>
      <div className="texts-container my-3">
        <h1 className="h1_size">
          {value1} {value2}
        </h1>
      </div>
    </div>
  );
};
export default Preloader;
