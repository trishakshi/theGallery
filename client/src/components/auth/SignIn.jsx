import { Alert, Snackbar } from "@mui/material";
import axios from "axios";
import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import UserContext from "../../context/UserContext";
import domain from "../../util/domain";
import "./auth.css";

function SignIn() {
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [ErrorMessage, setErrorMessage] = useState("");
  const [state, setState] = React.useState({
    open: false,
    vertical: "top",
    horizontal: "center",
  });

  const { getUser } = useContext(UserContext);
  const navigate = useNavigate();

  let { vertical, horizontal, open } = state;

  function handleClick(newState) {
    setState({ open: true, ...newState });
  }

  function handleClose() {
    setState({ ...state, open: false });
  }

  async function signin(e) {
    e.preventDefault();

    const data = {
      email: Email,
      password: Password,
    };

    try {
      await axios.post(`${domain}/auth/login`, data);
      getUser();
      navigate("/");
    } catch (err) {
      if (err.response) {
        if (err.response.data.err) {
          setErrorMessage(err.response.data.err);
        }
      }

      handleClick({
        vertical: "top",
        horizontal: "center",
      });
    }
  }

  return (
    <div className="gallery__auth-container">
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={open}
        onClose={handleClose}
        key={vertical + horizontal}
        autoHideDuration={1000}
      >
        <Alert onClose={handleClose} severity="error" variant="filled">
          {ErrorMessage}
        </Alert>
      </Snackbar>
      <form action="" className="gallery__auth-container__form">
        <h1>Sign In</h1>
        <input
          type="text"
          placeholder="Email Address"
          value={Email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={Password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={signin}>Sign In</button>
        <Link to="/signup">Don't have an account? Sign Up</Link>
      </form>
    </div>
  );
}

export default SignIn;
