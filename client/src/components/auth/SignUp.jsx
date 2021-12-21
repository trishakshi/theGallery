import React, { useState, useContext } from "react";
import UserContext from "../../context/UserContext";
import { Link, useNavigate } from "react-router-dom";
import "./auth.css";
import axios from "axios";
import { Alert, Snackbar } from "@mui/material";
import domain from "../../util/domain";

function SignUp() {
  const [Email, setEmail] = useState("");
  const [Name, setName] = useState("");
  const [Password, setPassword] = useState("");
  const [PasswordVerify, setPasswordVerify] = useState("");
  const [ErrorMessage, setErrorMessage] = useState("");
  const [state, setState] = React.useState({
    open: false,
    vertical: "top",
    horizontal: "center",
  });

  const { getUser } = useContext(UserContext);
  let navigate = useNavigate();

  let { vertical, horizontal, open } = state;

  function handleClick(newState) {
    setState({ open: true, ...newState });
  }

  function handleClose() {
    setState({ ...state, open: false });
  }

  async function signup(e) {
    e.preventDefault();

    const data = {
      email: Email,
      name: Name,
      password: Password,
      passwordVerify: PasswordVerify,
    };

    try {
      await axios.post(`${domain}/auth/register`, data);
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
        <h1>Sign Up</h1>
        <input
          type="text"
          placeholder="Email Address"
          value={Email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="text"
          placeholder="Name"
          value={Name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={Password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Verify Password"
          value={PasswordVerify}
          onChange={(e) => setPasswordVerify(e.target.value)}
        />
        <button onClick={signup}>Sign Up</button>
        <Link to="/signin">Already have an account? Sign In</Link>
      </form>
    </div>
  );
}

export default SignUp;
