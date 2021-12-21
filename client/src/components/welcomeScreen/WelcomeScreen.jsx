import React from "react";
import { Link } from "react-router-dom";
import "./welcomeScreen.css";

function WelcomeScreen() {
  return (
    <div className="gallery__welcomeScreen-container">
      <h1>
        Welcome to <span>theGALLERY</span>
      </h1>
      <h6>Every photo has a place to be belonged.</h6>
      <Link to="/signin">Join us</Link>
    </div>
  );
}

export default WelcomeScreen;
